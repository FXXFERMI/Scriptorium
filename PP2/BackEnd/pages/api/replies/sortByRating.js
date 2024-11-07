import prisma from "../../../utils/prisma";
import applyCors from '../../../utils/cors';


export default async function handler(req, res) {
    // Apply CORS
    await applyCors(req, res);

    if (req.method === 'GET') {
        const { commentId, page = 1, limit = 10 } = req.query;

        if (!commentId) {
            res.status(405).json({ error: "Please provide commentId" });
        }

        try {

            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;

            const replies = await prisma.reply.findMany({
                where: { commentId: Number(commentId) },
                include: {
                    ratings: true,
                },
            });

            const filteredReplies = replies.map((reply) => {

                const upvotes = reply.ratings.filter(rating => rating.upvote).length;
                const downvotes = reply.ratings.filter(rating => rating.downvote).length;
                const score = upvotes - downvotes;

                return {
                    ...reply,
                    score,
                };
            })

            const finalFilterdList = filteredReplies.sort((a, b) => b.score - a.score);

            const repliesByPage = finalFilterdList.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);

            return res.status(200).json(repliesByPage);

        }
        catch (error) {
            res.status(500).json({ error: "Failed to filter replies" });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }

} 
