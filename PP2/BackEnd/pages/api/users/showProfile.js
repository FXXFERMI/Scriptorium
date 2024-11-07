// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 

import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';

import prisma from '../../../utils/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // const token = req.headers.authorization?.split(' ')[1];
  let token = null;
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }


  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
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

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}
