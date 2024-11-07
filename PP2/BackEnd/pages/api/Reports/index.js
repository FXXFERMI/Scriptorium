import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bid, commentId, replyId, explanation } = req.body;

    if (!bid && !commentId && !replyId) {
      return res.status(400).json({
        error: "Either bid or commentId or replyId are required",
      });
    }

    // Verify the token from the Authorization header for 'USER' role
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
        return res.status(403).json({ message: "Forbidden: Only users can create reports" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      if (bid && !commentId && !replyId) {
        const blog = await prisma.blog.findUnique({
            where: { bid: Number(bid) },
          });
    
          if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
          }

        // create a report for the provided blog
        const report = await prisma.report.create({
          data: {
            user: {
              connect: { uid: Number(user.uid) },
            },
            blog: { connect: { bid: Number(bid) } },
            explanation,
          },
        });
        res.status(201).json(report);
      } else if (!bid && commentId && !replyId) {
        const comment = await prisma.comment.findUnique({
            where: {commentId: Number(commentId) },
          });
    
          if (!comment) {
            return res.status(404).json({ error: "comment not found" });
          }
        // create a report for the provided comment
        const report = await prisma.report.create({
          data: {
            user: {
              connect: { uid: Number(user.uid) },
            },
            comment: { connect: { commentId: Number(commentId) } },
            explanation,
          },
        });
        res.status(201).json(report);
      } else if (!bid && !commentId && replyId) {
        const reply = await prisma.reply.findUnique({
            where: {replyId: Number(replyId)  },
          });
    
          if (!reply) {
            return res.status(404).json({ error: "reply not found" });
          }

        // create a report for the provided reply
        const report = await prisma.report.create({
          data: {
            user: {
              connect: { uid: Number(user.uid) },
            },
            reply: { connect: { replyId: Number(replyId) } },
            explanation,
          },
        });
        res.status(201).json(report);
      }
      else {
        return res.status(400).json({
          error: "You can't report a blog and comment and reply all at once.",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else if (req.method === "GET") {
    // Restrict access to admins only
    // const token = req.headers.authorization?.split(" ")[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    let user;
    try {
      user = verifyAccessToken(token);
      if (user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Only admins can view reports" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Fetch reports if the user has admin access
    const { reportId, uid, bid, commentId, replyId, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (reportId) {
      filters.reportId = Number(reportId);
    }
    if (uid) {
      filters.uid = Number(uid);
    }
    if (bid) {
      filters.bid = Number(bid);
    }
    if (commentId) {
      filters.commentId = Number(commentId);
    }
    if (replyId) {
      filters.replyId = Number(replyId);
    }


    try {
      const pageNumber = Number(page) > 0 ? Number(page) : 1;
      const itemsPerPage = Number(limit) > 0 ? Number(limit) : 10;
      const skip = (pageNumber - 1) * itemsPerPage;

      // Reports
      const reports = await prisma.report.findMany({
        where: filters,
        skip,
        take: itemsPerPage,
      });

      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
