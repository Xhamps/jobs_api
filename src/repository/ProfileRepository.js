const BaseRepository = require('./BaseRepository');

class ProfileRepository extends BaseRepository {
  async getById(id, options = {}) {
    const {Profile, Contract, Job} = this.Models;
    return await Profile.findOne({ 
      where: { id },
      attributes: ['id', 'balance'],
      include: [
        {
          model: Contract, 
          as: 'Client',
          attributes: ['id'],
          include: [{
            model: Job,
            attributes: ['price', 'paid'],
          }]
        }
      ]
    }, options);
  }
}

module.exports = ProfileRepository;
