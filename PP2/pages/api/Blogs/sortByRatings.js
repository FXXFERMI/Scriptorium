import prisma from "../../../utils/prisma";

export default async function handler(req, res) {
    
    if(req.method === 'GET'){

        const { page = 1, limit = 10} = req.query;

        try{

            const pageNumber = Number(page) > 0 ? Number(page) : 1;
            const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;

            const blogs = await prisma.blog.findMany({
                include: {
                ratings: true,
                },
            });

            const filteredBlogs = blogs.map((blog) => {

                const upvotes = blog.ratings.filter(rating => rating.upvote).length;
                const downvotes = blog.ratings.filter(rating => rating.downvote).length;
                const score = upvotes - downvotes;

                return {
                    ...blog,
                    score,
                };
            })

            const finalFilterdList = filteredBlogs.sort((a, b) => b.score - a.score);

            const blogsByPage = finalFilterdList.slice((pageNumber -1)*itemsPerPage, pageNumber*itemsPerPage);

            return res.status(200).json(blogsByPage);

        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }

} 
