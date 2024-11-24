import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);
    
    const { id } = req.query as {id: string};

    if (req.method === 'PUT') {
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
                return res.status(403).json({ message: "Forbidden: Only users can edit comments" });
            }
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        const { content } = req.body;
        try {
            const comment = await prisma.comment.findUnique({
                where: { commentId: Number(id) },
            });

            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }

            if (user.uid !== comment.uid) {
                return res.status(403).json({
                    message: "You can't edit someone else's comment",
                });
            }

            const updatedComment = await prisma.comment.update({
                where: { commentId: Number(id) },
                data: { content },
            });
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(500).json({ error: 'Error updating comment' });
        }
    } else if (req.method === 'GET') {
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


            const comment = await prisma.comment.findUnique({
                where: {commentId: Number(id)},
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
                },
            });

            // Calculate upvotes and downvotes for each comment
            const upvotes = comment.ratings.filter(rating => rating.upvote === true).length;
            const downvotes = comment.ratings.filter(rating => rating.downvote === true).length;
            // Check if the logged-in user voted on this comment
            const userVote = comment.ratings.find(rating => rating.uid === user?.uid);
            const hasUpvoted = userVote?.upvote === true;
            const hasDownvoted = userVote?.downvote === true;


            res.status(200).json({...comment,
                upvotes,
                downvotes,
                hasUpvoted,
                hasDownvoted,});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
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
                return res.status(403).json({ message: "Forbidden: Only users can delete comments" });
            }
        } catch (error) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        try {
            const comment = await prisma.comment.findUnique({
                where: { commentId: Number(id) },
            });

            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }

            if (user.uid !== comment.uid) {
                return res.status(403).json({
                    message: "You can't delete or edit someone else's comment",
                });
            }

            await prisma.comment.delete({
                where: { commentId: Number(id) },
            });
            res.status(200).json({ message: "comment deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting comment' });
        }
    } else {
        res.status(405).end();
    }
}
