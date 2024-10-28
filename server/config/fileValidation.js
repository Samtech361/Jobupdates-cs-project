const path = require('path');

/**
 * Validates file type against allowed MIME types
 * @param {string[]} allowedTypes Array of allowed MIME types
 */
const validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const mimeType = req.file.mimetype;
    if (!allowedTypes.includes(mimeType)) {
      // Delete the invalid file
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.warn('Error deleting invalid file:', error);
      }

      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Validates file size against maximum allowed size
 * @param {number} maxSize Maximum file size in bytes
 */
const validateFileSize = (maxSize) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (req.file.size > maxSize) {
      // Delete the oversized file
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.warn('Error deleting oversized file:', error);
      }

      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`
      });
    }

    next();
  };
};

module.exports = {
  validateFileType,
  validateFileSize
};