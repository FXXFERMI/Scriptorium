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
    title,
    description,
    tags,
    codeTemplateNames,
    page = 1,
    limit = 10,
  } = req.query as {bid?: string, title?: string, description?: string, tags?: string, uid?: string, codeTemplateNames?: string, page: string, limit: string};

  const filters: Filters = {};
  if (title) {
      filters.title = { contains: title };
  }
  if (description) {
      filters.description = { contains: description };
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
    


  try {
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * itemsPerPage;

    const blogs = await prisma.blog.findMany({
      where: filters,
      skip: skip,
      take: itemsPerPage,
      orderBy: {
        reports: { _count: "desc" },
      },
      include: {
        ratings: true,
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
        tags: true
      },
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
