// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 

import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';
import prisma from '../../../utils/prisma';

export default async function handler(req, res) {

  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // const token = req.headers.authorization?.split(' ')[1];
  let token = null;
  // console.log(req.headers.cookie)
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  let user;
  try {
    user = verifyAccessToken(token);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { uid: user.uid },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Determine the full URL for the avatar
    const avatarUrl = profile.avatar.startsWith('/uploads/')
      ? `${process.env.BASE_URL}/api/uploads${profile.avatar.replace('/uploads', '')}`
      : profile.avatar;

    res.status(200).json({
      ...profile,
      avatarUrl, // Send the complete avatar URL
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}
