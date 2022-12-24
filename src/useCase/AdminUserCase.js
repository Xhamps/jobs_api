const {parseStartDate, parseEndDate} = require('../utils/date');

class AdminBestProfession {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(start, end) {
    const parsedStartDate = parseStartDate(start);
    const parsedEndDate = parseEndDate(end);
    return await this.profileRepository.getBestProfession(parsedStartDate, parsedEndDate);
  }
}

class AdminBestClients {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(start, end, limit = 2) {
    const parsedStartDate = parseStartDate(start);
    const parsedEndDate = parseEndDate(end);
    return await this.profileRepository.getBestClient(parsedStartDate, parsedEndDate, limit);
  }
}

module.exports = { AdminBestProfession, AdminBestClients };
