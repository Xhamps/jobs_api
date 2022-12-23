const { Transaction } = require("sequelize");

class JobPay {
  constructor(sequelize, jobsRepository) {
    this.sequelize = sequelize;
    this.jobsRepository = jobsRepository;
  }

  async execute(id) {
    const t = await this.sequelize.transaction();
    try {
      const options = { lock: Transaction.LOCK.UPDATE, transaction: t };
      const job = await this.jobsRepository.getById(id, options);
      if(!job) throw new Error('Job not found.');
      await job.pay();
      await job.Contract.Client.save();
      await job.Contract.Contractor.save();
      await job.save();
      await t.commit();
      return  { error: false };
    } catch (error) {
      await t.rollback();
      console.warn({ jobId: id, loggedUser: this.jobsRepository.profileId, msg: error.message });
      return { error: true,  msg: error.message };
    }
  }
}

module.exports = { JobPay };
