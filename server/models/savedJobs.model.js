const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  jobData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't save the same job twice
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);