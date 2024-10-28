const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadAndScanResume, getResumeAnalysis } = require('../Controllers/resume.controller');
const auth = require('../config/auth');
const { validateFileType, validateFileSize } = require('../config/fileValidation');

/**
 * Resume Upload and Analysis Routes
 * 
 * POST /profile/resume - Upload and analyze a new resume
 * GET /profile/resume - Get current resume analysis
 * DELETE /profile/resume - Delete current resume
 */

// Custom error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB'
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field name for file upload. Use "resume"'
    });
  }
  next(err);
};

// Upload and analyze resume
router.post('/profile/resume',
  auth, // Authentication middleware
  upload.single('resume'), // Multer file upload
  handleMulterError, // Handle multer-specific errors
  validateFileType(['application/pdf', 
                   'application/msword', 
                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  validateFileSize(5 * 1024 * 1024), // 5MB limit
  uploadAndScanResume
);

// Get current resume analysis
router.get('/profile/resume',
  auth,
  getResumeAnalysis
);

// Delete current resume
router.delete('/profile/resume',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // If there's a stored resume file, delete it
      if (user.resumeUrl) {
        try {
          await fs.unlink(path.join(process.cwd(), user.resumeUrl));
        } catch (error) {
          console.warn('Error deleting resume file:', error);
        }
      }

      // Clear resume data from user profile
      user.resumeAnalysis = null;
      user.resumeText = null;
      user.resumeUrl = null;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Resume deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete resume',
        error: error.message
      });
    }
  }
);

module.exports = router;