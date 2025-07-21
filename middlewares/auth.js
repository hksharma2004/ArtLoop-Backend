const jwt = require('jsonwebtoken');
const { databases, DATABASE_ID, USERS_COLLECTION_ID } = require('../config/database');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('Authorization Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

module.exports = { generateToken, protect };