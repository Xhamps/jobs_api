const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ContractsRepository = require('../repository/ContractsRepository.js');

const router = express.Router();

/**
 * Should return the contract only if it belongs to the profile calling.
 * 
 * @swagger
 *
 * /contracts/{id}:
 *    get:
 *      summary: Get a contract by id
 *      tags: 
 *        - contracts
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
 *          description: Numeric ID of the contract to get
 *      responses:
 *        '200':
 *          description: Successful operation
 *        '401':
 *          description: Unauthorized
 *        '404':
 *          description: Contract not found.
 * 
 */
router.get('/contracts/:id', getProfile, async (req, res) =>{
  const contractsRepository = new ContractsRepository(req.app.get('models'), req.profile.id);
  const contract = await contractsRepository.getContracts(req.params.id);
  if(!contract) return res.status(404).end();
  res.json(contract);
});


/**
 * Returns a list of contracts belonging to a user (client or contractor),
 * the list should only contain non terminated contracts.
 * 
 * @swagger
 *
 * /contracts:
 *    get:
 *      summary: Get all contract of the user logged
 *      tags: 
 *        - contracts
 *      parameters:
 *        - in: header
 *          name: profile_id
 *          schema:
 *            type: integer
 *          required: true
 *          desciprion: Numberic ID of the logged user
 *      responses:
 *        '200':
 *          description: Successful operation
  *        '401':
 *          description: Unauthorized
 *        '404':
 *          description: Contract not found.
 * 
 */
router.get('/contracts', getProfile, async (req, res) =>{
  const contractsRepository = new ContractsRepository(req.app.get('models'), req.profile.id);
  const contract = await contractsRepository.getAllContractsNonTerminated();
  if(!contract) return res.status(404).end();
  res.json(contract);
})

module.exports = router;
