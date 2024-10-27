const express = require('express')
const { login_user, registerUser, authenticateToken, refreshToken } = require('../Controllers/auth.controller');
const router = express.Router()

router.post('/login', login_user)
router.post('/register', registerUser)
// router.post('/refresh-token', authenticateToken,refreshToken)

module.exports = router;