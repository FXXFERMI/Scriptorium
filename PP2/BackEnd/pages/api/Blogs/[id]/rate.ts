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
        // Retrieve and verify the access token from cookies
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
            return res.status(403).json({ message: 'Forbidden: Only users can rate comments' });
        }

        const { upvote, downvote } = req.body;

        // Check if the blog exists
        const existingBlog = await prisma.blog.findUnique({
            where: { bid: parseInt(id, 10) },
        });

        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        let rating = await prisma.rating.findUnique({
            where: {
                uid_bid: {
                    uid: uid,
                    bid: parseInt(id, 10)
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
                    bid: parseInt(id, 10),
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