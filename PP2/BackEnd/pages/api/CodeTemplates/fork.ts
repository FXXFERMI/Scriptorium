import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import prisma from "../../../utils/prisma";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method === "POST") {
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
        return res.status(403).json({ message: "Forbidden: Only users can save templates" });
      }
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // If authenticated, proceed to save the modified template as a new fork
    const { cid } = req.body as {cid: string};

    // Validate required fields
    if (!cid) {
      return res.status(400).json({ error: "cid is required" });
    }

    try {
      // find original template
      const codeTemplate = await prisma.codeTemplate.findUnique({
        where: { cid: Number(cid) },
      });

      if (!codeTemplate) {
        return res.status(404).json({ error: "Code Template not found" });
      }

      const newTemplate = await prisma.codeTemplate.create({
        data: {
          title: codeTemplate.title,
          explanation: codeTemplate.explanation,
          language: codeTemplate.language,
          tags: codeTemplate.tags,
          code: codeTemplate.code,
          user: {
            connect: { uid: Number(user.uid) },
          },
          isForked: true, // Mark this template as a fork
          ogTemplate: {
            connect: { cid: Number(cid) },
          }, // Reference the original template
        },
      });

      return res.status(201).json({
        message: "Template saved as a fork!",
        template: newTemplate,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
