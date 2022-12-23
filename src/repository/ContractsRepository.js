const BaseRepository = require('./BaseRepository');

class ContractsRepository extends BaseRepository {
	async getContracts(id) {
    const {Contract} = this.Models;
    return await Contract.findOne({ where: this.filterUserAndContract({id}) });
	}
}

module.exports = ContractsRepository;
