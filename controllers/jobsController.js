// // const Job = require("../models/job");

// // const addJob = async (req, res) => {
// //   try {
// //     const data = req.body;
// //     const job = await Job.create({ ...data, userId: req.user.id });
// //     res.json({ success: true, job });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // const listJobs = async (req, res) => {
// //   try {
// //     const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 });
// //     res.json({ success: true, jobs });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // const updateJob = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     const job = await Job.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
// //     res.json({ success: true, job });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // const deleteJob = async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     await Job.deleteOne({ _id: id, userId: req.user.id });
// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // module.exports = { addJob, listJobs, updateJob, deleteJob };



// const Job = require("../models/job");

// exports.addJob = async (req, res) => {
//   try {
//     const job = await Job.create({ ...req.body, userId: req.user.id });
//     res.status(201).json({ success: true, job });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.listJobs = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10 } = req.query;
//     const filter = { userId: req.user.id };
//     if (status) filter.status = status;

//     const jobs = await Job.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .lean();

//     const total = await Job.countDocuments(filter);
    
//     // Stats for dashboard
//     const stats = await Job.aggregate([
//       { $match: filter },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     res.json({ 
//       success: true, 
//       jobs, 
//       stats: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
//       pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.updateJob = async (req, res) => {
//   try {
//     const job = await Job.findOneAndUpdate(
//       { _id: req.params.id, userId: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }
    
//     res.json({ success: true, job });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.deleteJob = async (req, res) => {
//   try {
//     const result = await Job.deleteOne({ _id: req.params.id, userId: req.user.id });
    
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }
    
//     res.json({ success: true, message: "Job deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// const Job = require('../models/Job');

// // ✅ ADMIN CREATE (No Auth)
// exports.createJobAdmin = async (req, res) => {
//     try {
//         const userId = req.body.userId || `admin-${Date.now()}`;
//         const job = new Job({ ...req.body, userId });
//         await job.save();
//         res.status(201).json({ success: true, job });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

// // ✅ ADMIN GET ALL (No Auth + Filter)
// exports.getJobsAdmin = async (req, res) => {
//     try {
//         const { status } = req.query;
//         const filter = status && status !== 'all' ? { status } : {};
//         const jobs = await Job.find(filter).sort({ createdAt: -1 }).select('-__v');
//         const stats = await Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
//         res.json({ 
//             success: true, 
//             jobs, 
//             stats: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}) 
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

// // ✅ USER CREATE (Auth Required)
// exports.createJob = async (req, res) => {
//     try {
//         const jobData = { ...req.body, userId: req.user.id };
//         const job = await Job.create(jobData);
//         res.status(201).json({ success: true, job });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

// // ✅ USER GET MY JOBS (Auth Required)
// exports.getJobs = async (req, res) => {
//     try {
//         const { status } = req.query;
//         const filter = { userId: req.user.id };
//         if (status && status !== 'all') filter.status = status;
        
//         const jobs = await Job.find(filter).sort({ createdAt: -1 }).select('-__v');
//         const stats = await Job.aggregate([
//             { $match: filter },
//             { $group: { _id: "$status", count: { $sum: 1 } } }
//         ]);
        
//         res.json({ 
//             success: true, 
//             jobs, 
//             stats: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };

// // ✅ USER UPDATE (Auth Required)
// exports.updateJob = async (req, res) => {
//     try {
//         const job = await Job.findOneAndUpdate(
//             { _id: req.params.id, userId: req.user.id },
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
//         res.json({ success: true, job });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

// // ✅ USER DELETE (Auth Required)
// exports.deleteJob = async (req, res) => {
//     try {
//         const result = await Job.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//         if (!result) return res.status(404).json({ success: false, message: 'Job not found' });
//         res.json({ success: true, message: 'Job deleted' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };
const Job = require("../models/Job");

// INLINE getUserId - Extract from headers or fallback
const getUserId = (req) =>
  req.headers["x-user-id"] || req.query.userId || "public-user";

exports.createJobAdmin = async (req, res) => {
  try {
    const userId = getUserId(req);
    const jobData = { ...req.body, userId };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getJobsAdmin = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { status } = req.query;
    const filter = { userId };
    if (status && status !== "all") filter.status = status;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).select("-__v");
    const stats = await Job.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      jobs,
      stats: stats.reduce(
        (acc, s) => ({ ...acc, [s._id || "Unknown"]: s.count }),
        {}
      ),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateJobAdmin = async (req, res) => {
  try {
    const userId = getUserId(req);
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteJobAdmin = async (req, res) => {
  try {
    const userId = getUserId(req);
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
