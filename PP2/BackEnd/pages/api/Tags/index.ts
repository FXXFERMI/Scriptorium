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

    if (req.method === 'GET') {
        
        try {
            
            const tags = await prisma.tag.findMany();

            res.status(200).json(tags);
        } catch (error) {
            res.status(500).json({ error: "Something went wrong." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}