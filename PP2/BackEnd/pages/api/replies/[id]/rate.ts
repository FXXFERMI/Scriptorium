import prisma from '../../../../utils/prisma';
import { verifyAccessToken } from '../../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS
    await applyCors(req, res);

    const { id } = req.query as {id: string};

    // Ensure the request is a POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Verify the token from the cookies
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is required' });
        }

        // Verify the access token and decode user information
        const decodedToken = verifyAccessToken(token);
        const uid = decodedToken.uid;

        // Check that the user exists and has the USER role
        const user = await prisma.user.findUnique({
            where: { uid },
        });

        if (!user) {
            return res.status(403).json({ message: 'Forbidden: Only users can rate replies' });
        }

        const { upvote, downvote } = req.body;

        // Check if the reply exists
        const existingReply = await prisma.reply.findUnique({
            where: { replyId: parseInt(id, 10) },
        });

        if (!existingReply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Check if a rating for this user and reply already exists
        let rating = await prisma.rating.findUnique({
            where: {
                uid_replyId: {
                    uid: uid,
                    replyId: parseInt(id, 10),
                },
            },
        });

        if (rating) {
            // Update existing rating
            rating = await prisma.rating.update({
                where: { rateId: rating.rateId },
                data: { upvote, downvote },
            });
        } else {
            // Create a new rating if it doesn't exist
            rating = await prisma.rating.create({
                data: {
                    upvote,
                    downvote,
                    uid,
                    replyId: parseInt(id, 10),
                },
            });
        }

        res.status(200).json({ message: 'Rating updated successfully', rating });
    } catch (error) {
        //console.error("Error updating rating:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        res.status(500).json({ error: error.message });
    }
}
