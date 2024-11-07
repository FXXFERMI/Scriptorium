import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';


export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify the token from the Authorization header for 'ADMIN' role
  // const token = req.headers.authorization?.split(" ")[1];
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  let user;
  try {
    user = verifyAccessToken(token);
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Only admins can view this data" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

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

  const filters = {};
  if (bid) {
    filters.bid = Number(bid);
  }
  if (title) {
    filters.title = { contains: title };
  }
  if (tags) {
    filters.tags = { contains: tags };
  }
  if (description) {
    filters.description = { contains: description };
  }
  if (uid) {
    filters.uid = Number(uid);
  }

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
      codeTemplateIdsArray = [Number(codeTemplateIds)]; // Handle single ID cases
    }
  }

  if (codeTemplateIdsArray && codeTemplateIdsArray.length > 0) {
    filters.codeTemplates = {
      some: {
        cid: { in: codeTemplateIdsArray },
      },
    };
  }

  try {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
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
      orderBy: {
        reports: { _count: "desc" },
      },
      include: {
        reports: true
      }
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
