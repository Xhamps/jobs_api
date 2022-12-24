const casual = require('casual');

const fectoryData = (Model, options) => {
  switch(Model.name) {
    case "Profile":
      return {
        firstName: casual.first_name,
        lastName: casual.last_name,
        profession: casual.word,
        balance:  casual.integer(from = options.balanceFrom || 100, to = options.balanceTo || 5000),
        type: casual.random_element(['client', 'contractor'])
      };
      break
    case "Contract":
      return {
        terms: casual.word,
        status: casual.random_element(['new','in_progress','terminated']),
        ClientId: null,
        ContractorId: null
      }
      break;
    case "Job":
      return {
        description: casual.description,
        price: casual.integer(from =  options.priceFrom || 10, to = options.priceTp || 300),
        paid: false,
        paymentDate: null,
        ContractId: null,
      }
  }
}

const makeFixture = async (Model, options = {}) => {
  const data = fectoryData(Model, options);

  Object.keys(data).map((key) => {
    if(options[key]) data[key] = options[key];
  })

  return  await Model.create(data)
}

const makeFixtures = async (Model, size = 1, options = {}) => {
  return await Promise.all(Array(size).fill(null).map(() => makeFixture(Model, options)));
}

module.exports = {
  makeFixture,
  makeFixtures
}
