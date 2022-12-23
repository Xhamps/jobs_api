const { Op } = require('sequelize');

class BaseRepository {
  Models;
  profileId;
  
  constructor (Models, profileId) {
    this.Models = Models;
    this.profileId = profileId;
	}

  filterUserAndContract(where) {
    return Object.assign({ 
      [Op.or]: [
        {ContractorId: this.profileId },
        {ClientId: this.profileId }
      ]
    }, where);
  }
}

module.exports = BaseRepository;