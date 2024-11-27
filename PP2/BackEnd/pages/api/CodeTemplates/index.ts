import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
interface Filters {
  cid?: number;
  title?: { contains: string };
  AND?: Array<{
    tags?: {
      some: {
        name: { contains: string }; // This will check for each tag specifically
      };
    };
  }>;
  code?: { contains: string };
  language?: { contains: string };
  uid?: number;
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);


  // POST: Create a new code template
  if (req.method === "POST") {
    const { title, explanation, language, tags, code } = req.body as { title: string, explanation: string, language: string, tags: string[], code: string };


    // Validate required fields
    if (!title || !tags || !code || !language) {
      return res.status(400).json({ error: "title, tags, language, and code are required" });
    }


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
        return res.status(403).json({ message: "Forbidden: Only users can create templates" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }


    // Process tags and ensure uniqueness
    const uniqueTagsArray: string[] = Array.from(new Set(tags));


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
      const newTagNames = uniqueTagsArray.filter(tag => !existingTagNames.includes(tag.toLowerCase()));


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


     const codeTemplate = await prisma.codeTemplate.create({
       data: {
         title,
         explanation,
         language,
         tags: {
           connect: tagsId.map((id) => ({ tagId: id })),
         },
         code,
         user: {
           connect: { uid: Number(user.uid) },
         },
       },
     });

     


      return res.status(201).json({ codeTemplate, cid: codeTemplate.cid });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }


    // GET: Retrieve code templates
  } else if (req.method === "GET") {
    const { cid, title, language, tags, code, uid, page = 1, limit = 10 } = req.query as { cid?: string, title?: string, language?: string, tags?: string, code?: string, uid?: string, page?: string, limit?: string };






   // Set up query filters
   const filters: Filters = {};
   if (cid) {
     filters.cid = Number(cid);
   }
   if (title) {
     filters.title = { contains: title };
   }
   if (language) {
     filters.language = { contains: language };
   }
   if (code) {
     filters.code = { contains: code };
   }
   if (uid) {
     filters.uid = Number(uid);
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
          some: {
            name: {
              contains: tag.toLowerCase(),
            }
          }, // This will check for each tag
        },
      }))
    }




    try {
      const pageNumber = Number(page) > 0 ? Number(page) : 1;
      const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;



      // Retrieve code templates, with filters applied
      const codeTemplates = await prisma.codeTemplate.findMany({
        where: filters,
        skip,
        take: itemsPerPage,
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
          tags: true
        }
      });


      const totalTemplates = await prisma.codeTemplate.count({
        where: filters,
      });


      return res.status(200).json({
        codeTemplates,
        totalTemplates,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalTemplates / itemsPerPage)
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }


  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
