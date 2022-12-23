const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const JobsRepository = require('../repository/JobsRepository.js');
const { JobPay } = require('../useCase/JobsUseCase');

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

/**
* Pay for a job, a client can only pay if his balance >= the amount to pay. 
* The amount should be moved from the client's balance to the contractor balance.
*/
router.post('/jobs/:id/pay', getProfile, async (req, res) =>{
  const jobsRepository = new JobsRepository(req.app.get('models'), req.profile.id);
  const jobPay = new JobPay(req.app.get('sequelize'), jobsRepository);
  const result = await jobPay.execute(req.params.id);
  if(result.error) return res.status(409).json(result.msg);
  res.end();
});

module.exports = router;
