import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: "Method not allowed" });
    }
        
    const { ownerId, replierId, commentId, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (ownerId) {
        filters.ownerId = Number(ownerId);
    }
    if (replierId) {
        filters.replierId = Number(replierId);
    }
    if (commentId) {
        filters.commentId = Number(commentId);
    }

    // Extract the token from the Authorization header
    // const token = req.headers.authorization?.split(' ')[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    // Verify the access token and decode the user info
    const decodedToken = verifyAccessToken(token);
    const { role } = decodedToken;

    // Check if the user has the ADMIN role
    if (role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only admins can hide content' });
    }

    try {
        const pageNumber = Number(page) > 0 ? Number(page) : 1;
        const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const replies = await prisma.reply.findMany({
            where: filters,
            skip: skip,
            take: itemsPerPage,
            include: { reports: true }, // include related models
            orderBy: {
                reports: { _count: "desc" }, // Order by report count if `sortByReports` is true
            },
        });

        const totalReplies = await prisma.reply.count({
            where: filters,
        });

        res.status(200).json({
            replies,
            totalReplies,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalReplies / itemsPerPage),
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Invalid or expired token' });
          }
        res.status(500).json({ error: "Something went wrong." });
    }
    
}
