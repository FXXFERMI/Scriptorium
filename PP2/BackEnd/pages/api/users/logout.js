// import cookie from 'cookie';
const cookie = require('cookie');
import applyCors from '../../../utils/cors';

export default async function handler(req, res) {
  // Apply CORS
  await applyCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Clear the access token and refresh token cookies by setting them with a maxAge of -1
    // console.log('Clearing access and refresh tokens');
    console.log('Cookie:', cookie);
    res.setHeader('Set-Cookie', [
      cookie.serialize('accessToken', '', {
        httpOnly: false,
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

    // Send success response
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out user', errorMessage: error.message });
  }
}
