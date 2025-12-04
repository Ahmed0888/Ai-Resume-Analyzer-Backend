const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  originalText: { type: String },
  fileUrl: { type: String },
  fileKey: { type: String },
  aiImprovedText: { type: String },
  jobdescription: { type: String },
  aiScore: { type: Number },
  atsScore: { type: Number },
  matchPercentage: { type: Number },
  missingSkills: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);
