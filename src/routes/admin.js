const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ProfileRepository = require('../repository/ProfileRepository.js');
const { AdminBestProfession, AdminBestClients } = require('../useCase/AdminUserCase');

const router = express.Router();

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that 
 * worked in the query time range.
 */
router.get('/admin/best-profession', getProfile, async (req, res) =>{
  const {start, end} = req.query;
  try {
    const profileRepository = new ProfileRepository(req.app.get('models'), req.profile.id);
    const adminBestProfession = new AdminBestProfession(profileRepository);
    const result = await adminBestProfession.execute(start, end);
    if(!result) return res.status(404).end();
    res.json(result);
  } catch(e) {
    res.status(400).end(e.message);
  }
});


/**
* Returns the clients the paid the most for jobs in the query time period. 
* Limit query parameter should be applied, default limit is 2.
* @returns profile[]
*/
router.get('/admin/best-clients', getProfile, async (req, res) =>{
  const {start, end, limit} = req.query;
  try {
    const profileRepository = new ProfileRepository(req.app.get('models'), req.profile.id);
    const adminBestClients = new AdminBestClients(profileRepository);
    const result = await adminBestClients.execute(start, end, limit);
    if(!result) return res.status(404).end();
    res.json(result);
  } catch(e) {
    console.log(e)
    res.status(400).end(e.message);
  }
})


module.exports = router;
