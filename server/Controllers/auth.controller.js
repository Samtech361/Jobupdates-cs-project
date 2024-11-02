const User = require('../models/users.models');
const jwt = require('jsonwebtoken');


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_ACCESS_SECRET,
    { expiresIn: '24h' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ 
      username, 
      email, 
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user data and access token
    res.status(201).json({
      message: 'Registration successful',
      token: accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

module.exports.login_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate both tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      jobTitle: user.jobTitle,
      resumeUrl: user.resumeUrl,
      avatar: user.avatar
    };

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      token: accessToken,
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({
      message: 'Token refreshed successfully',
      token: accessToken,
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
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout function to clear refresh token
module.exports.logout = async (req, res) => {
  try {
    // Clear refresh token from cookie
    res.clearCookie('refreshToken');
    
    // If you want to invalidate the refresh token in the database
    const user = req.user;
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
};

module.exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
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