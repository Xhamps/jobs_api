const BaseRepository = require('./BaseRepository');
const {Op} = require('sequelize');

class ContractsRepository extends BaseRepository {
	async getContracts(id) {
    const {Contract} = this.Models;
    return await Contract.findOne({ where: this.filterUserAndContract({id}) });
	}

  async getAllContracts(where = {}) {
    const {Contract} = this.Models;
    return await Contract.findAll({ where: this.filterUserAndContract(where)});
  }

  async getAllContractsNonTerminated() {
    return this.getAllContracts({ status: { [Op.ne]: "terminated" }});
  }
}

module.exports = ContractsRepository;
