import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from 'next';

interface Filters {
  bid?: number;
  title?: { contains: string };
  AND?: Array<{
    tags?: {
      some: {
        name: {contains: string}; // This will check for each tag specifically
      };
    };
  }>;
  uid?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method === "GET") {
    // Verify the token from the Authorization header
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
        return res.status(403).json({ message: "Forbidden: Only users can access their blogs" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const { id, title, tags, page = 1, limit = 10 } = req.query as {id?: string, title?: string, tags?: string, page?: string, limit?: string};

    // Set up query filters
    const filters: Filters = {};
    if (id) {
      filters.bid = Number(id);
    }
    if (title) {
      filters.title = { contains: title };
    }
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

    // Filter by the current user ID
    filters.uid = user.uid;

    try {
      const pageNumber = Number(page) > 0 ? Number(page) : 1;
      const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      // Retrieve all of the current user's blogs
      const blogs = await prisma.blog.findMany({
        where: filters,
        skip: skip,
        take: itemsPerPage,
        include: {tags: true}
      });
      return res.status(200).json(blogs);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
