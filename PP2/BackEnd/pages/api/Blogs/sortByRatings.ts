import prisma from "../../../utils/prisma";
import applyCors from '../../../utils/cors';
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';

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


export default async function handler(req, res) {
    // Apply CORS
    await applyCors(req, res);
    

    if (req.method === 'GET') {

        const {title,
            description,
            tags, codeTemplateNames, page = 1, limit = 10 } = req.query as {title?: string, description?: string, tags?: string, codeTemplateNames?: string, page?: string, limit?: string};

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
        
        try {

            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;

            const blogs = await prisma.blog.findMany({
                where: filters,
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

            const filteredBlogs = blogs.map((blog) => {

                const upvotes = blog.ratings.filter(rating => rating.upvote).length;
                const downvotes = blog.ratings.filter(rating => rating.downvote).length;
                const score = upvotes - downvotes;

                return {
                    ...blog,
                    score,
                };
            })

            const finalFilterdList = filteredBlogs.sort((a, b) => b.score - a.score);

            const blogsByPage = finalFilterdList.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

            return res.status(200).json(blogsByPage);

        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }

} 
