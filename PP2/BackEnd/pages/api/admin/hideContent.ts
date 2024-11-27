import prisma from '../../../utils/prisma';
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const { contentId, type } = req.body;
    if (!contentId || !['blog', 'comment', 'reply'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type or ID' });
    }

    const data = { Hidden: true };

    if (type === 'blog') {
      // Hide blog content

      const existingBlog = await prisma.blog.findUnique({
        where: { bid: parseInt(contentId, 10) },
      });

      if (!existingBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      const result = await prisma.blog.update({
        where: { bid: Number(contentId) },
        data,
      });
      res.status(200).json({ message: 'Blog content marked as hidden', result });
    } else if (type === 'comment') {
      // Hide comment content

      const existingComment = await prisma.comment.findUnique({
        where: { commentId: parseInt(contentId, 10) },
      });

      if (!existingComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      const result = await prisma.comment.update({
        where: { commentId: Number(contentId) },
        data,
      });
      res.status(200).json({ message: 'Comment content marked as hidden', result });
    } else {

      const existingReply = await prisma.reply.findUnique({
        where: { replyId: parseInt(contentId, 10) },
      });

      if (!existingReply) {
        return res.status(404).json({ message: 'Reply not found' });
      }
      // Hide blog content
      const result = await prisma.reply.update({
        where: { replyId: Number(contentId) },
        data,
      });
      res.status(200).json({ message: 'Reply content marked as hidden', result });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // //console.error("Error hiding content:", error);
    res.status(500).json({ error: error.message });
  }
}