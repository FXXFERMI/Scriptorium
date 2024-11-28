import prisma from '../../../utils/prisma';
import applyCors from '../../../utils/cors';
import { NextApiRequest, NextApiResponse } from 'next';


const bcrypt = require('bcrypt');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password, firstName, lastName, phoneNumber } = req.body as {username: string, email: string, password: string, firstName: string, lastName: string, phoneNumber: string};

  // Validate that required fields are present
  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({
      message: 'Username, email, phone number, and password are required',
    });
  }

  try {
    // Check if the username or email already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user along with their profile
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile: {
          create: {
            email: email,
            firstName: firstName || "", // Default to empty string if firstName is not provided
            lastName: lastName || "", // Default to empty string if lastName is not provided
            avatar: '/avatars/avatar1.png', // Default to empty string if avatar is not provided
            phoneNumber: phoneNumber,
          },
        },
      },
      include: { profile: true },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    //console.error("Error details:", error);
    res.status(500).json({ message: error.message });
  }
}
