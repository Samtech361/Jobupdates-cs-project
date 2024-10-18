const express = require('express')
const { login_user, registerUser } = require('../Controllers/auth.controller');
const router = express.Router()

router.post('/login', login_user)
router.post('/register', registerUser)

module.exports = router;