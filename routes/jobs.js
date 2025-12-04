// const express = require('express');
// const router = express.Router();
// const jobsController = require('../controllers/jobsController');
// const auth = require('../middleware/auth'); // Tumhara auth middleware


// router.post('/', jobsController.createJobAdmin); // Admin access
// router.get('/',  jobsController.getJobs);
// router.post('/', jobsController.createJob);
// router.put('/:id',  jobsController.updateJob);
// router.delete('/:id',  jobsController.deleteJob);

const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// ✅ ALL PUBLIC ROUTES - NO AUTH REQUIRED!
router.get('/', jobsController.getJobsAdmin);           // GET /api/jobs
router.post('/', jobsController.createJobAdmin);        // POST /api/jobs
router.put('/:id', jobsController.updateJobAdmin);      // PUT /api/jobs/:id  
router.delete('/:id', jobsController.deleteJobAdmin);   // DELETE /api/jobs/:id

module.exports = router;

