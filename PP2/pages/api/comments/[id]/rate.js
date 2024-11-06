import prisma from '../../../../utils/prisma';
import { verifyAccessToken } from '../../../../utils/jwt';
import * as cookie from 'cookie';


export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // const token = req.headers.authorization?.split(' ')[1];
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is required' });
        }

        const decodedToken = verifyAccessToken(token);
        const uid = decodedToken.uid;

        const user = await prisma.user.findUnique({
            where: { uid },
        });

        if (!user) {
            return res.status(403).json({ message: 'Forbidden: Only users can rate blogs' });
        }

        const { upvote, downvote } = req.body;

        // Check if the comment exists
        const existingComment = await prisma.comment.findUnique({
            where: { commentId: parseInt(id, 10) },
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if a rating for this user and commnent already exists
        let rating = await prisma.rating.findUnique({
            where: {
                uid_commentId: {
                    uid: uid,
                    commentId: parseInt(id, 10)
                },
            },
        });


        if (rating) {
            rating = await prisma.rating.update({
                where: { rateId: rating.rateId },
                data: { upvote, downvote },
            });
        } else {
            rating = await prisma.rating.create({
                data: {
                    upvote,
                    downvote,
                    uid,
                    commentId: parseInt(id, 10),
                },
            });
        }

        res.status(200).json({ message: 'Rating updated successfully', rating });
    } catch (error) {
        console.error("Error updating rating:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        res.status(500).json({ error: error.message });
    }
}
