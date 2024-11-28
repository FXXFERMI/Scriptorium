import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  const { id } = req.query as {id: string};

  if (req.method === 'DELETE') {
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
        return res.status(403).json({ message: "Forbidden: Only users can delete replies" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const reply = await prisma.reply.findUnique({
        where: { replyId: Number(id) },
      });

      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }

      if (user.uid !== reply.replierId) {
        return res.status(403).json({
          message: "You can't delete someone else's reply",
        });
      }

      await prisma.reply.delete({
        where: { replyId: Number(id) },
      });

      res.status(200).json({ message: 'Reply deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reply.' });
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

        const reply = await prisma.reply.findUnique({
            where: {replyId: Number(id)},
            include: {
              owner: true, 
              replier: {
                  include: {
                      profile: {
                          select: {
                              avatar: true, // Select the avatar URL
                          },
                      }, 
                  
                  }, 
              },
              ratings: true
          },
        });

        // Calculate upvotes and downvotes for each comment
        const upvotes = reply.ratings.filter(rating => rating.upvote === true).length;
        const downvotes = reply.ratings.filter(rating => rating.downvote === true).length;
        // Check if the logged-in user voted on this comment
        const userVote = reply.ratings.find(rating => rating.uid === user?.uid);
        const hasUpvoted = userVote?.upvote === true;
        const hasDownvoted = userVote?.downvote === true;


        res.status(200).json({...reply,
            upvotes,
            downvotes,
            hasUpvoted,
            hasDownvoted});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
else if (req.method === 'PUT') {
    const { newReplyContent } = req.body;

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
        return res.status(403).json({ message: "Forbidden: Only users can edit replies" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const reply = await prisma.reply.findUnique({
        where: { replyId: Number(id) },
      });

      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }

      if (user.uid !== reply.replierId) {
        return res.status(403).json({
          message: "You can't edit someone else's reply",
        });
      }

      const updatedReply = await prisma.reply.update({
        where: { replyId: Number(id) },
        data: { content: newReplyContent },
      });

      res.status(200).json({ message: 'Reply updated successfully.', updatedReply });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reply.' });
    }

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
