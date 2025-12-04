// const mongoose = require("mongoose");

// const jobSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   company: { type: String },
//   position: { type: String },
//   jobDescription: { type: String },
//   appliedDate: { type: Date },
//   status: { type: String, enum: ["Applied","Interviewing","Rejected","Offered"], default: "Applied" },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Job", jobSchema);

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ✅ STRING - NO ObjectId
    company: { type: String, required: true },
    position: { type: String, required: true },
    appliedDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Applied', 'Interviewing', 'Rejected', 'Offered'],
        default: 'Applied'
    },
    jobDescription: String,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
