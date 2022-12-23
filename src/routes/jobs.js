const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const JobsRepository = require('../repository/JobsRepository.js');

const router = express.Router();

/**
 * Get all unpaid jobs for a user (***either*** a client or contractor), 
 * for ***active contracts only***.
 */
router.get('/jobs/unpaid', getProfile, async (req, res) =>{
  const jobsRepository = new JobsRepository(req.app.get('models'), req.profile.id);
  const jobs = await jobsRepository.getAllJobsUnpaid();
  if(!jobs) return res.status(404).end();
  res.json(jobs);
});

module.exports = router;
