const User = require('../models/users.models');

module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { username, jobTitle } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (jobTitle) user.jobTitle = jobTitle;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports.updateResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resumeUrl = req.file.path; // Assuming you're using multer for file uploads
    user.recentActivity.unshift({
      action: 'Updated resume'
    });
    await user.save();
    res.json({ message: 'Resume updated', resumeUrl: user.resumeUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};