import prisma from '../../../utils/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';
import applyCors from '../../../utils/cors';

// Configure multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads'), // Save files to this directory
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware to handle multer file uploads
const uploadMiddleware = upload.single('profilePhoto');

export const config = {
  api: {
    bodyParser: false, // Disable body parsing so multer can handle it
  },
};

export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Use multer middleware to handle file upload
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Verify the token
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }
    const decodedToken = verifyAccessToken(token);
    const { uid } = decodedToken;

    // Get the uploaded file path
    const profilePhotoPath = `/uploads/${req.file.filename}`;

    // Update the user's profile with the new profile photo path
    const updatedProfile = await prisma.profile.update({
      where: { uid },
      data: { avatar: profilePhotoPath }, // Use 'avatar' for the database field
    });

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      profilePhoto: updatedProfile.avatar, // Respond with profilePhoto for consistency
    });
  } catch (error) {
    //console.error("Error uploading profile photo:", error);
    res.status(500).json({ message: 'Error uploading profile photo' });
  }
}