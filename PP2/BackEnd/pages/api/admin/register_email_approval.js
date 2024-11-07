import prisma from '../../../utils/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import applyCors from '../../../utils/cors';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Store the admin registration request in the database
    await prisma.adminRegistrationRequest.create({
      data: {
        email,
        password: hashedPassword,
        token: confirmationToken,
      },
    });

    // Send a confirmation email to the manager
    const confirmationUrl = `${process.env.BASE_URL}/api/admin/register_final_process?token=${confirmationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MANAGER_EMAIL,
      subject: 'Admin Approval Required',
      html: `<p>A new admin registration request has been received.</p>
             <p>Email: ${email}</p>
             <p><a href="${confirmationUrl}">Click here to approve</a></p>`,
    });

    res.status(200).json({ message: 'Confirmation email sent to manager for approval' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error registering admin', errorMessage: error.message });
  }
}
