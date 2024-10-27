const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadAndScanResume } = require('../Controllers/resume.controller');

router.post('/profile/resume', upload.single('resume'), uploadAndScanResume);

module.exports = router;