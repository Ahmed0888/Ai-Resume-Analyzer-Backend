// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { addJob, listJobs, updateJob, deleteJob } = require("../controllers/jobsController");

// router.post("/", auth, addJob);
// router.get("/", auth, listJobs);
// router.put("/:id", auth, updateJob);
// router.delete("/:id", auth, deleteJob);

// module.exports = router;



const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const auth = require('../middleware/auth'); // Tumhara auth middleware

router.get('/', auth, jobsController.getJobs);
router.post('/', auth, jobsController.createJob);
router.put('/:id', auth, jobsController.updateJob);
router.delete('/:id', auth, jobsController.deleteJob);

module.exports = router;
