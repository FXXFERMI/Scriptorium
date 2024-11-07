import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: "Method not allowed" });
    }
        
    const { bid, uid, commentId, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (bid) {
        filters.bid = Number(bid);
    }
    if (uid) {
        filters.uid = Number(uid);
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

        const comments = await prisma.comment.findMany({
            where: filters,
            skip: skip,
            take: itemsPerPage,
            include: { reports: true }, // include related models
            orderBy: {
                reports: { _count: "desc" }, // Order by report count if `sortByReports` is true
            },
        });

        const totalComments = await prisma.comment.count({
            where: filters,
        });

        res.status(200).json({
            comments,
            totalComments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalComments / itemsPerPage),
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong." });
    }
    
}
