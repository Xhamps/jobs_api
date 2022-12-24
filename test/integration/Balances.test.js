
const request = require('supertest');
const casual = require('casual');
const app = require('../../src/app');

const {Profile, Contract, Job} = app.get('models');

console.warn = jest.fn();

describe("Balances API: ", function() {
  const sizeJobs = 5;
  let client, contractor, newContract, jobs;

  beforeAll(async ()=> {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    client = await Profile.create({
        firstName: casual.first_name,
        lastName: casual.last_name,
        profession: casual.word,
        balance: casual.integer(from = 100, to = 5000),
        type: 'client'
      });
      
    contractor = await Profile.create({
        firstName: casual.first_name,
        lastName: casual.last_name,
        profession: casual.word,
        balance: casual.integer(from = 100, to = 5000),
        type: 'contractor'
      });

    newContract = await Contract.create({
        terms: casual.word,
        status: casual.random_element(['new','in_progress','terminated']),
        ClientId: client.id,
        ContractorId: contractor.id
      });
    jobs = await Promise.all(Array(sizeJobs).fill(null).map(() => {
      return Job.create({
        description: casual.description,
        price: casual.integer(from = 10, to = 300),
        ContractId: newContract.id,
      });
    }));
  });

  describe("GET - /balances/deposit/:profileId, ", function() {
    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .post(`/balances/deposit/${contractor.id}`)
        .expect(401);
    });

    it("should return error if not found a profile", async function() {
      const response = await request(app)
        .post(`/balances/deposit/${contractor.id + 1000}`)
        .set('profile_id', client.id)
        .expect(409);

      expect(response.body).toEqual('Profile not found.');
    });

    it("should return deposit less than 25% his total of jobs to pay", async function() {
      const totalPrice = jobs.reduce((acc, {price}) => acc + price, 0);
      const amount = totalPrice * 0.24;
      const newBalance = client.balance + amount
      await request(app)
        .post(`/balances/deposit/${client.id}`)
        .send({amount: totalPrice * 0.24})
        .set('profile_id', client.id)
        .expect(200);

      const newCliente = await Profile.findByPk(client.id)      
      expect(newCliente.balance).toEqual(newBalance);
    });

    it("should return error deposit more than 25% his total of jobs to pay", async function() {
      const totalPrice = jobs.reduce((acc, {price}) => acc + price, 0);
      const response = await request(app)
        .post(`/balances/deposit/${contractor.id}`)
        .send({amount: totalPrice * 0.255})
        .set('profile_id', client.id)
        .expect(409);

      expect(response.body).toEqual('Client try deposit more than 25% his total of jobs to pay');
    });
  });
});
