const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    // GitHub user information
    username: {
      type: String,
      required: true,
      index: true,
    },
    
    // Profile snapshot at time of evaluation
    profile: {
      name: String,
      bio: String,
      followers: Number,
      following: Number,
      publicRepos: Number,
      company: String,
      blog: String,
      location: String,
      twitterUsername: String,
      createdAt: String,
      avatarUrl: String,
    },

    // Scoring breakdown
    scoring: {
      overall: {
        score: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        tier: String, // Beginner, Intermediate, Advanced, Expert
        percentile: Number,
      },
      portfolio: {
        score: Number,
        averageQuality: Number,
        consistency: Number,
        topReposAverage: Number,
      },
      profile: {
        score: Number,
        followers: Number,
        publicRepos: Number,
        accountAge: Number,
        presence: Number,
      },
      diversity: {
        score: Number,
        languageCount: Number,
        evenness: Number,
        specialization: Number,
      },
      summary: {
        strongestArea: String,
        weakestArea: String,
      },
    },

    // Repository data snapshot
    repos: [{
      name: String,
      stars: Number,
      forks: Number,
      language: String,
      topics: [String],
      hasLicense: Boolean,
      hasReadme: Boolean,
      url: String,
      description: String,
    }],

    // Language distribution
    languages: [{
      name: String,
      percent: String,
    }],

    // Top repositories
    topRepos: [{
      name: String,
      stars: Number,
      forks: Number,
      language: String,
      topics: [String],
      hasLicense: Boolean,
      hasReadme: Boolean,
      url: String,
      description: String,
    }],

    // Contribution heatmap data
    heatmapData: [{
      date: String,
      count: Number,
    }],

    // Metadata
    evaluatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { 
    timestamps: true 
  }
);

// Create compound index for finding recent reports per user
reportSchema.index({ username: 1, evaluatedAt: -1 });

module.exports = mongoose.model('Report', reportSchema);