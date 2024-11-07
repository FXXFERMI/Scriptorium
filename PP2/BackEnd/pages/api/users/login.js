const bcrypt = require('bcrypt');
import prisma from '../../../utils/prisma';
import applyCors from '../../../utils/cors';

const { generateAccessToken, generateRefreshToken } = require('../../../utils/jwt');
const cookie = require('cookie');

export default async function handler(req, res) {

  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    // console.log("Login test0")
    const accessToken = generateAccessToken({ uid: user.uid, role: "USER" });
    const refreshToken = generateRefreshToken({ uid: user.uid, role: "USER" });

    // console.log("Login test2")
    // Set both access and refresh tokens in cookies
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
      })
    ]);

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
