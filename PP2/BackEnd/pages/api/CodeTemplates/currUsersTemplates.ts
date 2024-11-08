import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
interface Filters {
  cid?: number;
  title?: { contains: string };
  tags?: { contains: string };
  code?: { contains: string };
  language?: { contains: string };
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
        return res.status(403).json({ message: "Forbidden: Only users can access their templates" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const { id, title, language, tags, code, page = 1, limit = 10 } = req.query as {id?: string, title?: string, language?: string, tags?: string, code?: string, page?: string, limit?: string};

    // Set up query filters
    const filters: Filters = {};
    if (id) {
      filters.cid = Number(id);
    }
    if (title) {
      filters.title = { contains: title };
    }
    if (tags) {
      filters.tags = { contains: tags };
    }
    if (code) {
      filters.code = { contains: code };
    }
    if (language) {
      filters.language = { contains: language };
    }

    // Filter by the current user ID
    filters.uid = user.uid;

    try {
      const pageNumber = Number(page) > 0 ? Number(page) : 1;
      const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      // Retrieve all of the current user's code templates
      const codeTemplates = await prisma.codeTemplate.findMany({
        where: filters,
        skip: skip,
        take: itemsPerPage,
      });
      return res.status(200).json(codeTemplates);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
