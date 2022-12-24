const { Op, col, fn, literal } = require('sequelize');
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

  async getBestProfession(start, end) {
    const {Profile, Contract, Job} = this.Models;
    return await Job.findOne({
      where: { 
        paymentDate: { [Op.between]: [start.toISOString(), end.toISOString()] }
      },
      attributes: [
        [col('Contract.Contractor.id'), 'id'], 
        [col('Contract.Contractor.firstName'), 'firstName'], 
        [col('Contract.Contractor.lastName'), 'lastName'], 
        [col('Contract.Contractor.profession'), 'profession'], 
        [col('Contract.Contractor.balance'), 'balance'], 
        [col('Contract.Contractor.type'), 'type'], 
        [col('Contract.Contractor.createdAt'), 'createdAt'], 
        [col('Contract.Contractor.updatedAt'), 'updatedAt'], 
      ],
      include: [{ 
        model: Contract,
        attributes: [],  
        include: [{ model: Profile, as: 'Contractor', attributes: [] }]
      }],
      group: [ 'Contract.Contractor.id' ],
      order: [ [fn('sum', col('Job.price')), 'DESC'] ]
    });
  }

  async getBestClient(start, end, limit) {
    const {Profile, Contract, Job} = this.Models;
    return await Job.findAll({
      where: { 
        paymentDate: { [Op.between]: [start.toISOString(), end.toISOString()] }
      },
      attributes: [
        [col('Contract.Client.id'), 'id'], 
        [literal("`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"), 'full_name'],
        [fn('sum', col('Job.price')), 'paid']
      ],
      include: [{ 
        model: Contract,
        attributes: [],  
        include: [{ model: Profile, as: 'Client', attributes: [] }]
      }],
      group: [ 'Contract.Client.id' ],
      order: [ ['paid', 'DESC'] ],
      limit
    });
  }
}

module.exports = ProfileRepository;
