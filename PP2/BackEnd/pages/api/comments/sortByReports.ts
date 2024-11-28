import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';

interface Filters {
    bid?: number;
    uid?: number;
    commentId?: number;
    Hidden?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Apply CORS
    await applyCors(req, res);
    
    if (req.method !== 'GET') {
        res.status(405).json({ error: "Method not allowed" });
    }

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

    // Extract the token from the Authorization header
    // const token = req.headers.authorization?.split(' ')[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    let user;
    try {
      user = verifyAccessToken(token);
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Only admins can access their blogs" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // // Verify the access token and decode the user info
    // const decodedToken = verifyAccessToken(token);
    // const { role } = decodedToken;

    // // Check if the user has the ADMIN role
    // if (role !== 'ADMIN') {
    //     return res.status(403).json({ error: 'Forbidden: Only admins can hide content' });
    // }


    filters.Hidden = false
    try {
        const pageNumber = Number(page) > 0 ? Number(page) : 1;
        const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const comments = await prisma.comment.findMany({
            // where: filters,
            where: { ...filters, blog: { Hidden: false, }, },
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
