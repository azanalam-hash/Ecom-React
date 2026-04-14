const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const db = require('../database');

const router = express.Router();

function generateToken(id) {
  // Use a secret from env, or a fallback for development
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
}

/**
 * POST /api/users/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    const database = db.getDb();
    const usersCollection = database.collection('users');

    // Check if user exists
    const userExists = await usersCollection.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      res.status(201).json({
        _id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(result.insertedId)
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during registration.", error: error.message });
  }
});

/**
 * POST /api/users/login
 * Authenticate a user & get token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const database = db.getDb();
    const usersCollection = database.collection('users');

    // Check for user email
    const user = await usersCollection.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login.", error: error.message });
  }
});

module.exports = router;
