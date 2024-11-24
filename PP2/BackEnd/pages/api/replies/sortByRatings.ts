import prisma from "../../../utils/prisma";
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);

    if (req.method === 'GET') {
        const { commentId, page = 1, limit = 10 } = req.query as {commentId: string, page: string, limit: string};

        if (!commentId) {
            res.status(405).json({ error: "Please provide commentId" });
        }

        try {

            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;

            const replies = await prisma.reply.findMany({
                where: { commentId: Number(commentId) },
                include: {
                    owner: true, 
                    replier: {
                        include: {
                            profile: {
                                select: {
                                    avatar: true, // Select the avatar URL
                                },
                            }, 
                        
                        }, 
                    },
                    ratings: true,
                },
            });

            const filteredReplies = replies.map((reply) => {

                const upvotes = reply.ratings.filter(rating => rating.upvote).length;
                const downvotes = reply.ratings.filter(rating => rating.downvote).length;
                const score = upvotes - downvotes;

                return {
                    ...reply,
                    score,
                    upvotes,
                    downvotes,
                };
            })

            const finalFilterdList = filteredReplies.sort((a, b) => b.score - a.score);

            const repliesWithVotes = finalFilterdList.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

            console.log(repliesWithVotes)
            return res.status(200).json(repliesWithVotes);

        }
        catch (error) {
            res.status(500).json({ error: "Failed to filter replies" });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }

} 
