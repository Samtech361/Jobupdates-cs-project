const User = require('../models/users.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports.login_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data without password
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      jobTitle: user.jobTitle,
      resumeUrl: user.resumeUrl,
      avatar: user.avatar
    };

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// middleware to protect routes
module.exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    // The user will be available from the authenticateToken middleware
    const user = req.user;
    
    // Generate new token
    const token = generateToken(user);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        jobTitle: user.jobTitle,
        resumeUrl: user.resumeUrl,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to refresh token', error: error.message });
  }
};