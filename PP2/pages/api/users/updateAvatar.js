import { verifyAccessToken } from '../../../utils/jwt';
import * as cookie from 'cookie';

import prisma from '../../../utils/prisma';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // const token = req.headers.authorization?.split(' ')[1];
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;

    console.log("token: ", token);
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    let user;
    try {
        user = verifyAccessToken(token);
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const uid = user.uid;
    const { avatar } = req.body;

    // Validate avatar URL
    if (!avatar) {
        return res.status(400).json({ message: 'Avatar URL is required' });
    }

    try {
        // Check if the profile exists for the given `uid`
        const existingProfile = await prisma.profile.findUnique({
            where: { uid },
        });

        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        // Update the avatar in the Profile model
        const updatedProfile = await prisma.profile.update({
            where: { uid },
            data: { avatar },
        });

        res.status(200).json({
            message: 'Profile photo updated successfully',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        res.status(500).json({ message: 'Error updating profile photo' });
    }
}
