const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET_REFRESH;

// Generate Access Token for User or Admin
function generateAccessToken({ uid, role }) {
  if (!uid || !role) {
    throw new Error("Missing uid or role for access token generation");
  }
  return jwt.sign(
    { uid, role }, // Payload with uid/aid and role
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1m' }
  );
}

// Generate Refresh Token for User or Admin
function generateRefreshToken({ uid, role }) {
  if (!uid || !role) {
    throw new Error("Missing uid or role for refresh token generation");
  }
  return jwt.sign(
    { uid, role }, // Payload with uid/aid and role
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify Access Token with error handling
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error("Access token verification failed:", error);
    throw error;
  }
}

// Verify Refresh Token with error handling
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    throw error;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
