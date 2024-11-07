import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';


export default async function handler(req, res) {
  const { id } = req.query;

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

  } else if (req.method === 'PUT') {
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
