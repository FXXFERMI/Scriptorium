import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
  await applyCors(req, res);
if (req.method === "GET") {
    const { page = 1, limit = 10 } = req.query as {cid?: string, title?: string, language?: string, tags?: string, code?: string, uid?: string, page?: string, limit?: string};


    
    try {
      const pageNumber = Number(page) > 0 ? Number(page) : 1;
      const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;
    
      // Retrieve unique titles
      const codeTemplates = await prisma.codeTemplate.findMany({
        skip,
        take: itemsPerPage,
        distinct: ['title'], // Ensure unique titles
        select: { title: true }, // Only fetch the title field
      });

      const uniqueTitles = await prisma.codeTemplate.findMany({
        distinct: ['title'], // Ensures unique titles
        select: { title: true }, // Fetch only the title field
      });
      
      const totalTemplates = uniqueTitles.length; // Count the unique titles

      return res.status(200).json({codeTemplates, totalTemplates});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
