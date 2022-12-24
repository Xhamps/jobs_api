
const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ProfileRepository = require('../repository/ProfileRepository.js');
const { ProfileUpdateBalance } = require('../useCase/ProfileUseCase');

const router = express.Router();

/**
 * Deposits money into the the the balance of a client, a client can't deposit 
 * more than 25% his total of jobs to pay. (at the deposit moment)
 * 
 * @swagger
 *
 * /balances/deposit/{id}:
 *    post:
 *      summary: Do the deposit a amount to the user 
 *      tags: 
 *        - balances
 *      parameters:
 *        - in: header
 *          name: profile_id
 *          schema:
 *            type: integer
 *          required: true
 *          desciprion: Numberic ID of the logged user
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of the user to deposit an amount
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                amount:
 *                  type: integer
 *      responses:
 *        '200':
 *          description: Successful operation
 *        '401':
 *          description: Unauthorized
 *        '409':
 *          description: Operation conflict. Look at returned messages
 * 
 */
router.post('/balances/deposit/:profileId', getProfile, async (req, res) =>{
  const profileRepository = new ProfileRepository(req.app.get('models'), req.profile.id);
  const profileUpdateBalance = new ProfileUpdateBalance(req.app.get('sequelize'), profileRepository);
  const result = await profileUpdateBalance.execute(req.params.profileId, req.body.amount);
  if(result.error) return res.status(409).json(result.msg);
  res.end();
})


module.exports = router;
