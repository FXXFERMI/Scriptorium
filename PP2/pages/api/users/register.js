import prisma from '../../../utils/prisma';

const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password, firstName, lastName, phoneNumber } = req.body;

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
    console.error("Error details:", error);
    res.status(500).json({ message: error.message });
  }
}
