import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';

interface Filters {
  bid?: number;
  title?: { contains: string};
  description?: { contains: string};
  uid?: number;
  AND?: Array<{
    tags?: {
      some: {
        name: {contains: string}; // This will check for each tag specifically
      };
    };
  }>;

  OR?: Array<{ Hidden?: boolean; uid?: number }>;
  Hidden?: boolean;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method === "POST") {
    // Parse request data
    const { title, description, tags, codeTemplateIds } = req.body as { title: string, description: string, tags: string, codeTemplateIds: number[]};

    // Validate required fields
    if (!title || !description || !tags) {
      return res.status(400).json({ error: "title, tags, and description are required" });
    }

    // Ensure codeTemplateIds is an array
    if (!Array.isArray(codeTemplateIds)) {
      return res.status(400).json({ error: "codeTemplateIds must be an array" });
    }

    // Verify JWT and ensure user is authenticated

    let token = null;
    if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      token = cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    let user;
    try {
      user = verifyAccessToken(token);
      if (user.role !== "USER") {
        return res.status(403).json({ message: "Only users can create blogs" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
    }

    // Convert tags to unique JSON array
    const tagsArray = JSON.parse(tags);
    const uniqueTagsArray: string[] = Array.from(new Set(tagsArray));


    // Create new blog post
    try {
      // Ensure all tags exist in the database
      const existingTags = await prisma.tag.findMany({
        where: {
          OR: uniqueTagsArray.map(tag => ({
            name: tag.toLowerCase(),
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
          OR: newTagNames.map(tag => ({
            name: tag.toLowerCase(),
          })), // Check for existing tags
        },

      });

      // Combine existing and newly created tags
      const allTags = [...existingTags, ...newTagsArray];

      const tagsId = allTags.map(tag => (tag.tagId))
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

      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          tags: {
            connect: tagsId.map((id) => ({ tagId: id })),
          },
          user: {
            connect: { uid: Number(user.uid) },
          },
          codeTemplates: {
            connect: codeTemplateIds.map((id) => ({ cid: id })),
          },
        },
      });
      return res.status(201).json(blog);
    } catch (error) {
      console.error("Error creating blog:", error);
      return res.status(500).json({ message: error.message });
    }

  } else if (req.method === "GET") {
    // Parse filtering and pagination parameters
    const {
      bid,
      title,
      description,
      tags,
      uid,
      codeTemplateNames,
      page,
      limit = 10,
    } = req.query  as { bid?: string, title?: string, description?: string, tags?: string, uid?: string, codeTemplateNames?: string, page: string, limit: string};

    // Build filters based on query parameters
    const filters: Filters = {};
    if (bid) filters.bid = Number(bid);
    if (title) filters.title = { contains: title };
    if (description) filters.description = { contains: description };
    if (uid) filters.uid = Number(uid);

    let tagsArray: string[];
    if (tags) {
      try {
        tagsArray = JSON.parse(tags);
      } catch {
        tagsArray = [tags]; // Handle cases where it's a single tag string
      }


      filters.AND = tagsArray.map(tag => ({
        tags: {
          some: { name: {contains: tag.toLowerCase(),
            } }, // This will check for each tag
        },
      }))
    }


    let codeTemplateNameArray;
    if (codeTemplateNames) {
      try {
        codeTemplateNameArray = JSON.parse(codeTemplateNames);
      } catch {
        codeTemplateNameArray = [codeTemplateNames];// Handle single ID cases
      }

      const codeTemplateFilter = codeTemplateNameArray.map(codeTemplateName =>({
        codeTemplates: {
          some: {title: codeTemplateName}
        }
      }) )

      if (filters.AND) {
        filters.AND = filters.AND.concat(codeTemplateFilter)
      } else {
        filters.AND = codeTemplateFilter
      }

    }



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

    // Set visibility filters based on user role
    if (user && user.role === "USER") {
      filters.OR = [
        { Hidden: false },
        { uid: user.uid }, // Show all blogs created by the user, including hidden ones
      ];
    } else {
      // For visitors, show only unhidden blogs
      filters.Hidden = false;
    }

    // Execute filtered and paginated query
    try {
      const pageNumber = Math.max(1, Number(page));
      const itemsPerPage = Math.max(1, Number(limit));
      const skip = (pageNumber - 1) * itemsPerPage;

      const blogs = await prisma.blog.findMany({
        where: filters,
        include: {
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
        skip: skip,
        take: itemsPerPage,
      });

      const totalBlogs = await prisma.blog.count({
        where: filters,
    });

    // Calculate upvotes and downvotes for each comment
    const blogsWithVotes = blogs.map(blog => {
        const upvotes = blog.ratings.filter(rating => rating.upvote === true).length;
        const downvotes = blog.ratings.filter(rating => rating.downvote === true).length;

        // Check if the logged-in user voted on this comment
        const userVote = blog.ratings.find(rating => rating.uid === user?.uid);
        const hasUpvoted = userVote?.upvote === true;
        const hasDownvoted = userVote?.downvote === true;
        return {
            ...blog,
            upvotes,
            downvotes,
            hasUpvoted,
            hasDownvoted,
        };
    });

      return res.status(200).json({blogs: blogsWithVotes,
        totalBlogs,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalBlogs / itemsPerPage),});
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
