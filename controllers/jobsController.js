const Job = require("../models/job");

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
