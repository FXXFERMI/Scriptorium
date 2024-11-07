import applyCors from '../../../utils/cors';

const cookie = require('cookie');

export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Clear the refresh token cookie for Admins
    res.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: -1, // Expire the cookie immediately
      }),
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: -1, // Expire the cookie immediately
      })
    ]);

    res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out admin' });
  }
}
