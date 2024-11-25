import prisma from "../../../utils/prisma";
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import { verifyAccessToken } from "../../../utils/jwt";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);

    if (req.method === 'GET') {
        const { commentId, page = 1, limit = 10 } = req.query as {commentId: string, page: string, limit: string};

        if (!commentId) {
            res.status(405).json({ error: "Please provide commentId" });
        }

        try {

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

                // Check if the logged-in user voted on this comment
                const userVote = reply.ratings.find(rating => rating.uid === user?.uid);
                const hasUpvoted = userVote?.upvote === true;
                const hasDownvoted = userVote?.downvote === true;


                return {
                    ...reply,
                    score,
                    upvotes,
                    downvotes,
                    hasUpvoted,
                    hasDownvoted
                };
            })

            const finalFilterdList = filteredReplies.sort((a, b) => b.score - a.score);

            const repliesWithVotes = finalFilterdList.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

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
