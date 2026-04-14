const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const db = require('../database');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Use the same secret as in userRoutes
      const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
      
      // Verify token
      const decoded = jwt.verify(token, secret);

      // Get user from the token payload
      const database = db.getDb();
      const usersCollection = database.collection('users');
      
      // Find the user but exclude the password from the fetched data
      const user = await usersCollection.findOne(
        { _id: new ObjectId(decoded.id) }, 
        { projection: { password: 0 } }
      );

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
