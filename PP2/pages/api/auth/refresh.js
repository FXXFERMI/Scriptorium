const { verifyRefreshToken, generateAccessToken } = require('../../../utils/jwt');
const cookie = require('cookie');
import prisma from '../../../utils/prisma';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Retrieve the refresh token from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const { uid, role } = decoded;

    // Log the uid and role to check their values
    // console.log("Decoded UID:", uid);
    // console.log("Decoded Role:", role);

    // Find user or admin in the database
    let userOrAdmin;
    if (role === 'USER') {
      userOrAdmin = await prisma.user.findUnique({ where: { uid } });
    } else if (role === 'ADMIN') {
      userOrAdmin = await prisma.systemAdmin.findUnique({ where: { aid: uid } });
    }

    if (!userOrAdmin) {
      return res.status(403).json({ message: 'Invalid refresh token, please login again' });
    }

    // Generate a new access token with the correct identifier based on role
    const newAccessToken = generateAccessToken(
      role === 'USER' ? { uid: userOrAdmin.uid, role } : { uid: userOrAdmin.aid, role }
    );

    // Set the new access token in cookies
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60, // Set expiration (e.g., 15 minutes)
      })
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}
