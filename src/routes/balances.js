
const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ProfileRepository = require('../repository/ProfileRepository.js');
const { ProfileUpdateBalance } = require('../useCase/ProfileUseCase');

const router = express.Router();

/**
 * Deposits money into the the the balance of a client, a client can't deposit 
 * more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns empty
 */
router.post('/balances/deposit/:profileId', getProfile, async (req, res) =>{
  const profileRepository = new ProfileRepository(req.app.get('models'), req.profile.id);
  const profileUpdateBalance = new ProfileUpdateBalance(req.app.get('sequelize'), profileRepository);
  const result = await profileUpdateBalance.execute(req.params.profileId, req.body.amount);
  if(result.error) return res.status(409).json(result.msg);
  res.end();
})


module.exports = router;
