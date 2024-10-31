// auth.routes.js
const express = require('express');
const { 
  login_user, 
  registerUser, 
  refreshToken,
  logout,
  authenticateToken 
} = require('../Controllers/auth.controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login_user);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

module.exports = router;