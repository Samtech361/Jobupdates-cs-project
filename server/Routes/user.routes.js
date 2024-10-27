const express = require('express');
const auth = require('../config/auth');
const userController = require('../Controllers/user.controller');

const router = express.Router();

router.get('/profile', auth, userController.getUserProfile);

module.exports = router;