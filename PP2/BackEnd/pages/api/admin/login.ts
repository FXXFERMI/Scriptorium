import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '../../../utils/prisma';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt';
import applyCors from '../../../utils/cors';

const cookie = require('cookie');

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body as { email: string; password: string };

  try {
    const admin = await prisma.systemAdmin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const accessToken = generateAccessToken({ uid: admin.aid, role: "ADMIN" });
    const refreshToken = generateRefreshToken({ uid: admin.aid, role: "ADMIN" });

    res.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60, // 15 minutes expiration for access token
      }),
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
      }),
    ]);

    console.log(cookie)

    res.status(200).json({ message: 'Admin login successful', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
