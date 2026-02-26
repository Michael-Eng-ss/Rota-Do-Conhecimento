const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '3099708496ef917af0b641323143ba7a';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { hashPassword, createToken, verifyToken };
