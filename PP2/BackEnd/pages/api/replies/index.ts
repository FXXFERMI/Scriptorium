import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';

interface Filters {
    ownerId?: number;
    replierId?: number;
    commentId?: number;
    OR?: Array<{ Hidden: boolean } | { replierId: number }>;
    Hidden?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);

    if (req.method === 'POST') {
        const { commentId, content } = req.body as {commentId: string, content: string};

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
                return res.status(403).json({ message: "Forbidden: Only users can post replies" });
            }
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        try {
            const comment = await prisma.comment.findUnique({
                where: { commentId: Number(commentId) },
            });

            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }

            const CreateReply = await prisma.reply.create({
                data: {
                    comment: { connect: { commentId: Number(commentId) } },
                    owner: { connect: { uid: Number(comment.uid) } },
                    replier: { connect: { uid: Number(user.uid) } },
                    content,
                },
            });
            res.status(201).json(CreateReply);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {
        const { ownerId, replierId, commentId, page = 1, limit = 10 } = req.query as {ownerId?: string, replierId?: string, commentId?: string, page: string, limit: string};

        const filters: Filters = {};
        if (ownerId) {
            filters.ownerId = Number(ownerId);
        }
        if (replierId) {
            filters.replierId = Number(replierId);
        }
        if (commentId) {
            filters.commentId = Number(commentId);
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
                { replierId: user.uid }, // Show all replies created by the user, including hidden ones
            ];
        } else {
            // For visitors, show only unhidden replies
            filters.Hidden = false;
        }

        try {
            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
            const skip = (pageNumber - 1) * itemsPerPage;

            const replies = await prisma.reply.findMany({
                where: filters,
                skip,
                take: itemsPerPage,
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
                    ratings: true
                },
            });

            const totalReplies = await prisma.reply.count({
                where: filters,
            });

            // Calculate upvotes and downvotes for each comment
            const repliesWithVotes = replies.map(reply => {
                const upvotes = reply.ratings.filter(rating => rating.upvote === true).length;
                const downvotes = reply.ratings.filter(rating => rating.downvote === true).length;

                // Check if the logged-in user voted on this comment
                const userVote = reply.ratings.find(rating => rating.uid === user?.uid);
                const hasUpvoted = userVote?.upvote === true;
                const hasDownvoted = userVote?.downvote === true;
                return {
                    ...reply,
                    upvotes,
                    downvotes,
                    hasUpvoted,
                    hasDownvoted
                };
            });


            res.status(200).json({
                repliesWithVotes,
                totalReplies,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalReplies / itemsPerPage),
            });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}