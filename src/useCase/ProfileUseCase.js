const { Transaction } = require("sequelize");
const { sequelize } = require("../model");

class ProfileUpdateBalance {
  constructor(sequelize, profileRepository) {
    this.sequelize = sequelize;
    this.profileRepository = profileRepository;
  }

  async execute(profileId, amount){
    const t = await sequelize.transaction();
    try {
      const options = { lock: Transaction.LOCK.UPDATE, transaction: t };
      const profile = await this.profileRepository.getById(profileId, options);
      if(!profile) throw new Error('Profile not found.');
      await profile.updateBalance(amount);
      await profile.save();
      await t.commit();
      return  { error: false };
    } catch (error) {
      await t.rollback();
      console.warn({ profileId: profileId, loggedUser: this.profileId, msg: error.message});
      return { error: true,  msg: error.message };
    }
  }
}

module.exports = { ProfileUpdateBalance };
