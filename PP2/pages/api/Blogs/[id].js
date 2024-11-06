import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';


export default async function handler(req, res) {
  const { id } = req.query;

  // PUT: Update blog
  if (req.method === "PUT") {
    const { title, description, tags, codeTemplateIds } = req.body;

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
        tags,
        ...(codeTemplateIds &&
          codeTemplateIds.length > 0 && {
          codeTemplates: {
            connect: codeTemplateIds.map((id) => ({ cid: id })),
          },
        }),
      };

      const updatedBlog = await prisma.blog.update({
        where: { bid: Number(id) },
        data: updatedData,
        include: {
          codeTemplates: true,
        },
      });

      return res.status(200).json(updatedBlog);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // GET: Retrieve a single blog
  } else if (req.method === "GET") {
    try {
      const blog = await prisma.blog.findUnique({
        where: { bid: Number(id) },
      });
      return res.status(200).json(blog);
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
