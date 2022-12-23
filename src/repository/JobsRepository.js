const BaseRepository = require('./BaseRepository');
const {Op} = require('sequelize');

class JobsRepository extends BaseRepository {
  async getAllJobs(where = {}, whereContract = {}) {
    const {Job, Contract} = this.Models;
    return await Job.findAll({ 
      where,
      include: [
        {
          model: Contract, 
          attributes: [],
          where: this.filterUserAndContract(whereContract)
        }
      ]
    })
  }

  async getAllJobsUnpaid() {
    return await this.getAllJobs({ paymentDate: { [Op.eq]: null } }, {status: "in_progress"});
  }

  async getById(id, options = {}) {
    const {Job, Contract, Profile} = this.Models;
    return await Job.findOne({ 
      where: {id},
      include: [
        {
          model: Contract, 
          where: this.filterUserAndContract(),
          include: [
            { model: Profile, as: 'Client', foreignKey:'ClientId' },
            { model: Profile, as: 'Contractor', foreignKey:'ContractorId' }
          ]
          
        }
      ],
    }, options);
  }
}

module.exports = JobsRepository;
