const express = require('express');
const {getProfile} = require('../middleware/getProfile');
const ContractsRepository = require('../repository/ContractsRepository.js');

const router = express.Router();

/**
 * Should return the contract only if it belongs to the profile calling.
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
*/
router.get('/contracts', getProfile, async (req, res) =>{
  const contractsRepository = new ContractsRepository(req.app.get('models'), req.profile.id);
  const contract = await contractsRepository.getAllContractsNonTerminated();
  if(!contract) return res.status(404).end();
  res.json(contract);
})

module.exports = router;
