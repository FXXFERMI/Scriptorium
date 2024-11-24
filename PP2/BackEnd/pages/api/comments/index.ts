import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';
interface Filters {
    bid?: number;
    uid?: number;
    commentId?: number;
    OR?: Array<{ Hidden: boolean } | { uid: number }>;
    Hidden?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);
    
    if (req.method === 'POST') {
        const { bid, content } = req.body as {bid: string, content: string};
        // Validate required fields
        if (!content) {
            return res.status(400).json({ error: "content is required" });
        }

        // Verify the token from the Authorization header
        // const token = req.headers.authorization?.split(" ")[1];
        let token = null;
        if (req.headers.cookie) {
            const cookies = cookie.parse(req.headers.cookie);
            token = cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication token is required" });
        }

        let user;
        try {
            user = verifyAccessToken(token);
            if (user.role !== "USER") {
                return res.status(403).json({ message: "Forbidden: Only users can post comments" });
            }
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        try {
            const blog = await prisma.blog.findUnique({
                where: { bid: Number(bid) },
                select: { Hidden: true }
            });

            if (!blog || blog.Hidden) {
                return res.status(403).json({ message: "Can't find blog" });
            }

            const createComment = await prisma.comment.create({
                data: {
                    user: {
                        connect: { uid: Number(user.uid) },
                    },
                    blog: {
                        connect: { bid: Number(bid) },
                    },
                    content,
                },
            });
            res.status(201).json(createComment);
        } catch (error) {
            res.status(500).json({ error: 'Error unable to create comment', errorMessage: error.message });
        }
    } else if (req.method === 'GET') {
        const { bid, uid, commentId, page = 1, limit = 10 } = req.query as {bid?: string, uid?: string, commentId?: string, page: string, limit: string};

        const filters: Filters = {};
        if (bid) {
            filters.bid = Number(bid);
        }
        if (uid) {
            filters.uid = Number(uid);
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
                { uid: user.uid }, // Show all comments created by the user, including hidden ones
            ];
        } else {
            // For visitors, show only unhidden comments
            filters.Hidden = false;
        }

        try {
            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
            const skip = (pageNumber - 1) * itemsPerPage;

            const comments = await prisma.comment.findMany({
                where: filters,
                skip: skip,
                take: itemsPerPage,
                include: { user: {
                    include: {
                        profile: {
                            select: {
                                avatar: true, // Select the avatar URL
                            },
                        }, 
                    }, 
                },
                ratings: true, 
                _count: {
                    select: {
                        replies: true, // Count the number of replies
                    },
                },},
                orderBy: { commentId: 'desc' },
            });

            const totalComments = await prisma.comment.count({
                where: filters,
            });

            // Calculate upvotes and downvotes for each comment
            const commentsWithVotes = comments.map(comment => {
                const upvotes = comment.ratings.filter(rating => rating.upvote === true).length;
                const downvotes = comment.ratings.filter(rating => rating.downvote === true).length;

                // Check if the logged-in user voted on this comment
                const userVote = comment.ratings.find(rating => rating.uid === user?.uid);
                const hasUpvoted = userVote?.upvote === true;
                const hasDownvoted = userVote?.downvote === true;
                return {
                    ...comment,
                    upvotes,
                    downvotes,
                    hasUpvoted,
                    hasDownvoted,
                };
            });


            res.status(200).json({
                comments: commentsWithVotes,
                totalComments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalComments / itemsPerPage),
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
