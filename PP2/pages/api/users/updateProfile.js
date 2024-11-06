import prisma from '../../../utils/prisma';
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';


export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Parse the cookie header to get the token
  let token = null;
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.accessToken;
  }

  if (!token) {
    console.error("Access token is missing in cookies.");
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  let user;
  try {
    user = verifyAccessToken(token);
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  const { firstName, lastName, phoneNumber } = req.body;
  const uid = user.uid;

  try {
    const existingProfile = await prisma.profile.findUnique({
      where: { uid },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const updatedProfile = await prisma.profile.update({
      where: { uid },
      data: {
        firstName: firstName !== undefined ? firstName : existingProfile.firstName,
        lastName: lastName !== undefined ? lastName : existingProfile.lastName,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : existingProfile.phoneNumber,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Error updating profile' });
  }
}
