const express = require('express');
const { generateToken } = require('../middlewares/auth');

const { account, databases, ID, DATABASE_ID, USERS_COLLECTION_ID } = require('../config/database');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  try {
    const newUser = await account.create(ID.unique(), email, password, username);
    await databases.createDocument(
      DATABASE_ID, USERS_COLLECTION_ID, newUser.$id,
      { name: username, email: email, userId: newUser.$id, credits: 6 }
    );
    const token = generateToken(newUser.$id);
    res.status(201).json({
      token, remainingGenerations: 6
    });
  } catch (error) { 
    console.error("REGISTRATION FAILED:", error);
    res.status(400).json({ error: 'Registration failed.', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }
  try {

    const session = await account.createEmailSession(email, password);
    

    const user = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, session.userId);
    const token = generateToken(user.$id);
    

    res.json({
      _id: user.$id,
      username: user.name,
      email: user.email,
      token: token,
      remainingGenerations: user.credits,
    });
  } catch (error) {
    console.error("LOGIN FAILED:", error);
    res.status(401).json({ 
      success: false, 
      error: 'Login failed. Please check your credentials.',
      details: error.message 
    });
  }
});

module.exports = router;