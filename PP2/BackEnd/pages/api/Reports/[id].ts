import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  const { id } = req.query;

  if (req.method === "PUT") {
    /*
     * Edit report
     */
    const { explanation } = req.body as {explanation: string};

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
        return res.status(403).json({ message: "Forbidden: Only users can edit reports" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const report = await prisma.report.findUnique({
        where: { reportId: Number(id) },
      });

      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      if (user.uid !== report.uid) {
        return res.status(403).json({
          message: "You can't edit someone else's report",
        });
      }

      const updatedData = { explanation };

      const updatedReport = await prisma.report.update({
        where: { reportId: Number(id) },
        data: updatedData,
      });

      return res.status(200).json(updatedReport);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

  } else if (req.method === "GET") {
    try {
      const report = await prisma.report.findUnique({
        where: { reportId: Number(id) },
      });
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong." });
    }

  } else if (req.method === "DELETE") {
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
        return res.status(403).json({ message: "Forbidden: Only users can delete reports" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const report = await prisma.report.findUnique({
        where: { reportId: Number(id) },
      });

      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      if (user.uid !== report.uid) {
        return res.status(403).json({
          message: "You can't delete someone else's report",
        });
      }

      await prisma.report.delete({
        where: {
          reportId: Number(id),
        },
      });

      return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
