import prisma from "../../../utils/prisma";
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  const { id } = req.query as {id?: string};

  // PUT: Edit Code Template
  if (req.method === "PUT") {
    const { title, explanation, language, tags, code } = req.body;

    // Verify the user's access token
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
        return res.status(403).json({ message: "Forbidden: Only users can edit code templates" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { cid: Number(id) },
      });

      if (!codeTemplate) {
        return res.status(404).json({ error: "Code Template not found" });
      }

      if (codeTemplate.uid !== user.uid) {
        return res.status(403).json({
          message: "You can't edit someone else's code template",
        });
      }

      const updatedData = {
        title,
        explanation,
        tags,
        code,
        language,
      };

      const updatedCodeTemplate = await prisma.codeTemplate.update({
        where: { cid: Number(id) },
        data: updatedData,
      });

      return res.status(200).json(updatedCodeTemplate);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // GET: Retrieve a single code template
  } else if (req.method === "GET") {
    try {
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { cid: Number(id) },
        include: {
          blogs: true // see the list of blog posts that mention a code template 
        },
      });
      return res.status(200).json(codeTemplate);
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong." });
    }

    // DELETE: Delete Code Template
  } else if (req.method === "DELETE") {
    // Verify the user's access token
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
        return res.status(403).json({ message: "Forbidden: Only users can delete code templates" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    try {
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { cid: Number(id) },
      });

      if (!codeTemplate) {
        return res.status(404).json({ error: "Code Template not found" });
      }

      if (codeTemplate.uid !== user.uid) {
        return res.status(403).json({
          message: "You can't delete someone else's code template",
        });
      }

      await prisma.codeTemplate.delete({
        where: {
          cid: Number(id),
        },
      });

      return res.status(200).json({ message: "Code Template deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    // Method not allowed
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
