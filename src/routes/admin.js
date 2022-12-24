const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ProfileRepository = require('../repository/ProfileRepository.js');
const { AdminBestProfession, AdminBestClients } = require('../useCase/AdminUserCase');

const router = express.Router();

/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that 
 * worked in the query time range.
 * 
 * @swagger
 *
 * /admin/best-profession:
 *    get:
 *      summary: Retrive the best profession
 *      tags: 
 *        - admin
 *      parameters:
 *        - in: header
 *          name: profile_id
 *          schema:
 *            type: integer
 *          required: true
 *          desciprion: Numberic ID of the logged user
 *        - in: query
 *          name: start
 *          schema:
 *            type: string
 *          required: true
 *          description: "Send the start date with this format: YYYY-MM or YYYY-MM-DD"
 *        - in: query
 *          name: end
 *          schema:
 *            type: string
 *          required: true
 *          description: "Send the end date with this format: YYYY-MM or YYYY-MM-DD"
 *      responses:
 *        '200':
 *          description: Successful operation
 *        '401':
 *          description: Unauthorized
 *        '404':
 *          description: Profile not found
 *        '409':
 *          description: Operation conflict. Look at returned messages
 * 
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
    res.status(409).end(e.message);
  }
});


/**
 * Returns the clients the paid the most for jobs in the query time period. 
 * Limit query parameter should be applied, default limit is 2.
 * 
 * @swagger
 *
 * /admin/best-clients:
 *    get:
 *      summary: Retrive the list of best clients
 *      tags: 
 *        - admin
 *      parameters:
 *        - in: header
 *          name: profile_id
 *          schema:
 *            type: integer
 *          required: true
 *          desciprion: Numberic ID of the logged user
 *        - in: query
 *          name: start
 *          schema:
 *            type: string
 *          required: true
 *          description: "Send the start date with this format: YYYY-MM or YYYY-MM-DD"
 *        - in: query
 *          name: end
 *          schema:
 *            type: string
 *          required: true
 *          description: "Send the end date with this format: YYYY-MM or YYYY-MM-DD"
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: Maximum number of profile in the list. Value default is 2.
 *      responses:
 *        '200':
 *          description: Successful operation
 *        '401':
 *          description: Unauthorized
 *        '404':
 *          description: Profile not found
 *        '409':
 *          description: Operation conflict. Look at returned messages
 * 
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
    res.status(409).end(e.message);
  }
})


module.exports = router;
