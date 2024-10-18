const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadAndScanResume } = require('../controllers/resumeController');

router.post('/upload-resume', upload.single('resume'), uploadAndScanResume);

module.exports = router;