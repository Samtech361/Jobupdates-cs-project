const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 15,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  jobTitle: {
    type: String,
    default: ''
  },
  resumeUrl: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  recentActivity: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  refreshToken: {
    type: String,
    select: false
  },
  resumeAnalysis: {
    basicMetrics: {
      wordCount: Number,
      sentenceCount: Number,
      characterCount: Number,
      averageWordLength: Number
    },
    technicalSkills: {
      found: [String],
      frequency: mongoose.Schema.Types.Mixed
    },
    softSkills: {
      found: [String],
      frequency: mongoose.Schema.Types.Mixed
    },
    experience: {
      totalYears: Number,
      experiences: [{
        years: Number,
        context: String
      }]
    },
    education: {
      highestDegree: String,
      degrees: [String]
    },
    completenessScore: Number,
    processedText: String
  },
  resumeText: String
}, { timestamps: true });

// password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('user', userSchema);
module.exports = User;