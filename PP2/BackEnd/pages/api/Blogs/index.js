import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';

export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method === "POST") {
    // Parse request data
    const { title, description, tags, codeTemplateIds } = req.body;

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
    const uniqueTagsJson = JSON.stringify(Array.from(new Set(tagsArray)));

    // Create new blog post
    try {
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
          tags: uniqueTagsJson,
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
      codeTemplateIds,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filters based on query parameters
    const filters = {};
    if (bid) filters.bid = Number(bid);
    if (title) filters.title = { contains: title };
    if (tags) filters.tags = { contains: tags };
    if (description) filters.description = { contains: description };
    if (uid) filters.uid = Number(uid);

    let tagsArray;
    if (tags) {
      try {
        tagsArray = JSON.parse(tags);
      } catch {
        tagsArray = [tags]; // Handle cases where it's a single tag string
      }
    }

    let codeTemplateIdsArray;
    if (codeTemplateIds) {
      try {
        codeTemplateIdsArray = JSON.parse(codeTemplateIds).map(Number);
      } catch {
        codeTemplateIdsArray = [Number(codeTemplateIds)];// Handle single ID cases
      }
    }

    if (codeTemplateIdsArray && codeTemplateIdsArray.length > 0) {
      filters.codeTemplates = {
        some: {
          cid: { in: codeTemplateIdsArray },
        },
      };
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
        where: {
          ...filters,
          ...(tagsArray && tagsArray.length > 0 && {
            OR: tagsArray.map(tag => ({
              tags: { contains: tag }
            }))
          }),
        },
        skip: skip,
        take: itemsPerPage,
      });

      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
