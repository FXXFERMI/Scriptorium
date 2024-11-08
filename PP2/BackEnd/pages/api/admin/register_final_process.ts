import prisma from '../../../utils/prisma';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query as { token: string};

  try {
    // Find the registration request using the token
    const registrationRequest = await prisma.adminRegistrationRequest.findUnique({
      where: { token },
    });

    if (!registrationRequest) {
      return res.status(400).json({ error: 'Invalid or expired confirmation token' });
    }

    const { email, password } = registrationRequest;

    // Create the new admin in the SystemAdmin table
    const newAdmin = await prisma.systemAdmin.create({
      data: {
        email,
        password,
      },
    });

    // Delete the registration request after successful admin creation
    await prisma.adminRegistrationRequest.delete({
      where: { id: registrationRequest.id },
    });

    res.status(200).json({ message: 'Admin successfully registered', admin: newAdmin });
  } catch (error) {
    console.error('Error confirming admin registration:', error);
    res.status(500).json({ error: 'Failed to confirm admin registration' });
  }
}
