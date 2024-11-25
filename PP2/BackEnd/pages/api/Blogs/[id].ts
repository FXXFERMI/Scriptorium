import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);
  
  const { id } = req.query as {id: string};

  // PUT: Update blog
  if (req.method === "PUT") {
    const { title, description, tags, codeTemplateIds } = req.body as { title: string, description: string, tags: string, codeTemplateIds: number[]};

    // Verify the user's access token
    // const token = req.headers.authorization?.split(" ")[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    let user;
    try {
      user = verifyAccessToken(token);
      if (user.role !== "USER") {
        return res.status(403).json({ message: "Forbidden: Only users can edit blogs" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      // Convert tags to unique JSON array
      const uniqueTagsArray: string[] = Array.from(new Set(tags));
      // Ensure all tags exist in the database
      const existingTags = await prisma.tag.findMany({
        where: {
          OR: uniqueTagsArray.map(tag => ({
            name: {contains: tag.toLowerCase(),
                } 
          })), // Check for existing tags
        },
      });

      // Find tags that do not exist
      const existingTagNames = existingTags.map(tag => tag.name);
      const newTagNames = uniqueTagsArray.filter(tag => !existingTagNames.includes(tag));

      // Create new tags if needed
      await prisma.tag.createMany({
        data: newTagNames.map(tag => ({ name: tag })),
      });

      const newTagsArray = await prisma.tag.findMany({
        where: {
          name: { in: newTagNames }, // Check for existing tags
        },
      });

      // Combine existing and newly created tags
      const allTags = [...existingTags, ...newTagsArray];

      const tagsId = allTags.map(tag => (tag.tagId))

      const blog = await prisma.blog.findUnique({
        where: { bid: Number(id) },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (codeTemplateIds) {
        // Check if all code template IDs exist
        const existingCodeTemplates = await prisma.codeTemplate.findMany({
          where: {
            cid: { in: codeTemplateIds.map(Number) }, // Convert IDs to numbers if necessary
          },
        });

        // Check if the count of existing code templates matches the original IDs length
        if (existingCodeTemplates.length !== codeTemplateIds.length) {
          return res.status(404).json({ error: "One or more code templates do not exist" });
        }
      }

      if (blog.Hidden === true) {
        return res.status(400).json({
          error: "User cannot edit a blog that has been hidden/reported.",
        });
      }

      if (blog.uid !== user.uid) {
        return res.status(403).json({
          message: "You can't edit someone else's blog",
        });
      }

      const updatedData = {
        title,
        description,
        // Update tags: remove all current tags and set to new ones
        tags: {
          set: [], // Clear all existing tags
          ...(tagsId && tagsId.length ? {
            connect: tagsId.map((tag) => ({ tagId: tag })), // Connect new tags
          } : {}),
        },
        
        // Update codeTemplates: clear existing templates and connect new ones
        codeTemplates: {
          set: [], // Clear all existing codeTemplates
          ...(codeTemplateIds && codeTemplateIds.length ? {
            connect: codeTemplateIds.map((id) => ({ cid: id })), // Connect new templates
          } : {}),
        },
      };

      const updatedBlog = await prisma.blog.update({
        where: { bid: Number(id) },
        data: updatedData,
        include: {
          codeTemplates: true,
          tags: true
        },
      });

      return res.status(200).json(updatedBlog);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // GET: Retrieve a single blog
  } else if (req.method === "GET") {
    try {
      let token = null;
      if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        token = cookies.accessToken;
      }

      let user;
      try {
        if (token) {
          user = verifyAccessToken(token);
        }
      } catch (error) {
        user = null; // Visitor
      }

      const blog = await prisma.blog.findUnique({
        where: { bid: Number(id)}, include: {
          user: {
            include: {
                profile: {
                    select: {
                        avatar: true, // Select the avatar URL
                        firstName: true,
                        lastName: true,
                    },
                },
            }, 
          },
          tags: true,
          ratings: true
        },
      });

      // Count upvotes and downvotes
    const upvoteCount = await prisma.rating.count({
      where: {
        bid: Number(id),
        upvote: true,
      },
    });

    const downvoteCount = await prisma.rating.count({
      where: {
        bid: Number(id),
        downvote: true,
      },
    });

    // Check if the logged-in user voted on this comment
    const userVote = blog.ratings.find(rating => rating.uid === user?.uid);
    const hasUpvoted = userVote?.upvote === true;
    const hasDownvoted = userVote?.downvote === true;

    // Attach upvote and downvote counts to the blog response
    const blogWithVoteCounts = {
      ...blog,
      upvotes: upvoteCount,
      downvotes: downvoteCount,
      hasUpvoted,
      hasDownvoted
    };

      return res.status(200).json(blogWithVoteCounts);
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong." });
    }

    // DELETE: Delete blog
  } else if (req.method === "DELETE") {
    // Verify the user's access token
    // const token = req.headers.authorization?.split(" ")[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    let user;
    try {
      user = verifyAccessToken(token);
      if (user.role !== "USER") {
        return res.status(403).json({ message: "Forbidden: Only users can delete blogs" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const blog = await prisma.blog.findUnique({
        where: { bid: Number(id) },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      if (blog.uid !== user.uid) {
        return res.status(403).json({
          message: "You can't delete someone else's blog",
        });
      }

      await prisma.blog.delete({
        where: {
          bid: Number(id),
        },
      });

      return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // Method not allowed
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
