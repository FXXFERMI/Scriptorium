import prisma from "../../../utils/prisma";
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);
    
    if (req.method === 'GET') {
        const { bid, page = 1, limit = 10 } = req.query as {bid: string, page: string, limit: string };

        if (!bid) {
            res.status(405).json({ error: "Please provide bid" });
        }

        try {

            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;

            const comments = await prisma.comment.findMany({
                where: { bid: parseInt(bid) },
                include: {
                    ratings: true,
                },
            });

            const filteredComments = comments.map((comment) => {

                const upvotes = comment.ratings.filter(rating => rating.upvote).length;
                const downvotes = comment.ratings.filter(rating => rating.downvote).length;
                const score = upvotes - downvotes;

                return {
                    ...comment,
                    score,
                };
            })

            const finalFilterdList = filteredComments.sort((a, b) => b.score - a.score);

            const commentsByPage = finalFilterdList.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

            return res.status(200).json(commentsByPage);

        }
        catch (error) {
            res.status(500).json({ error: "Failed to filter comments" });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }

} 
