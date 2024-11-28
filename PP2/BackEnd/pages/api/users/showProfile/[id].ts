// THIS CODE IS BASED ON CHAT GPT AND NOT OUR ORIGINAL THOUGHTS 
import applyCors from '../../../../utils/cors';
import prisma from '../../../../utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query as {id: string};

  try {
    const profile = await prisma.profile.findUnique({
      where: { uid: Number(id)},
      include: {
        user: {
          select: {
            username: true, // Fetch the username field from the User model
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Determine the full URL for the avatar
    const avatarUrl = profile.avatar.startsWith('/uploads/')
      ? `${process.env.BASE_URL}${profile.avatar}`
      : profile.avatar;

    res.status(200).json({
      ...profile,
      avatarUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
}
