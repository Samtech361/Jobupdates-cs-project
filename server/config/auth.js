const jwt = require('jsonwebtoken');
const User = require('../models/users.models');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Authentication Error',
        message: 'No Authorization header present' 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication Error',
        message: 'Token not found in Authorization header' 
      });
    }

    // Detailed token verification
    jwt.verify(token, JWT_ACCESS_SECRET, async (err, decoded) => {
      if (err) {
        // Specific error handling
        switch (err.name) {
          case 'TokenExpiredError':
            return res.status(401).json({ 
              error: 'Token Expired',
              message: 'Your session has expired. Please log in again.' 
            });
          
          case 'JsonWebTokenError':
            return res.status(401).json({ 
              error: 'Invalid Token',
              message: 'The token is invalid. Please log in again.',
              details: err.message
            });
          
          case 'NotBeforeError':
            return res.status(401).json({ 
              error: 'Token Not Active',
              message: 'The token is not yet active.' 
            });
          
          default:
            return res.status(401).json({ 
              error: 'Authentication Failed',
              message: 'Unable to authenticate the token.' 
            });
        }
      }

      // Find user and attach to request
      try {
        const user = await User.findById(decoded.id);
        
        if (!user) {
          return res.status(401).json({ 
            error: 'User Not Found',
            message: 'The user associated with this token no longer exists.' 
          });
        }

        req.user = user;
        next();
      } catch (findError) {
        return res.status(500).json({ 
          error: 'Server Error',
          message: 'Error finding user during authentication.' 
        });
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Server Error',
      message: 'An unexpected error occurred during authentication.' 
    });
  }
};



module.exports = auth;