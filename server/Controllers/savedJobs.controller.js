const SavedJob = require('../models/savedJobs.model');

const savedJobsController = {
  async saveJob(req, res) {
    try {
      const { jobData } = req.body;
      const userId = req.user.id;
      const jobId = jobData.id;

      const savedJob = await SavedJob.findOneAndUpdate(
        { userId, jobId },
        { jobData },
        { upsert: true, new: true }
      );

      res.status(200).json(savedJob);
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'Job already saved' });
      }
      res.status(500).json({ message: 'Error saving job', error: error.message });
    }
  },

  async unsaveJob(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      await SavedJob.findOneAndDelete({ userId, jobId });
      res.status(200).json({ message: 'Job removed from saved jobs' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing saved job', error: error.message });
    }
  },

  async getSavedJobs(req, res) {
    try {
      const userId = req.user.id;
      const savedJobs = await SavedJob.find({ userId })
        .sort({ savedAt: -1 })
        .lean();

      res.status(200).json(savedJobs.map(job => ({
        ...job.jobData,
        savedAt: job.savedAt
      })));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching saved jobs', error: error.message });
    }
  },

  async checkSavedStatus(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const savedJob = await SavedJob.findOne({ userId, jobId });
      res.status(200).json({ isSaved: !!savedJob });
    } catch (error) {
      res.status(500).json({ message: 'Error checking saved status', error: error.message });
    }
  }
};

module.exports = savedJobsController;