
const request = require('supertest');
const casual = require('casual');
const app = require('../../src/app');

const {Profile, Contract} = app.get('models');

describe("Contracts API: ", function() {
  let client, contractor, contract;

  beforeAll(async ()=> {
    await Profile.sync({ force: true });
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
  });

  describe("GET - /contracts/:id, ", function() {
    beforeAll(async() => {    
      await Contract.sync({ force: true });
    });

    beforeEach(async ()=> {
      contract = await Contract.create({
        terms: casual.word,
        status: casual.random_element(['new','in_progress','terminated']),
        ClientId: client.id,
        ContractorId: contractor.id
      });
    });

    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .get(`/contracts/${contract.id}`)
        .expect(401);
    });

    it("should return the contract selected", async function() {
      const response = await request(app)
        .get(`/contracts/${contract.id}`)
        .set('profile_id', client.id)
        .expect(200);

      expect(response.body.id).toEqual(contract.id);
      expect(response.body.firstName).toEqual(contract.firstName);
      expect(response.body.lastName).toEqual(contract.lastName);
      expect(response.body.profession).toEqual(contract.profession);
      expect(response.body.balance).toEqual(contract.balance);
      expect(response.body.type).toEqual(contract.type);
    });

    it("should return erro when contract does not exists", async function() {
      await request(app)
        .get(`/contracts/${contract.id * 10000}`)
        .set('profile_id', client.id)
        .expect(404);
    });
  });

  describe("GET - /contracts, ", function() {
    beforeEach(async() => {
      await Contract.sync({ force: true });
    });

    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .get(`/contracts`)
        .expect(401);
    });

    it("should return all contracts not terminated", async function() {
      const sizeContracts = 5;
      const allContracts = await Promise.all(Array(sizeContracts).fill(null).map(() => {
        return Contract.create({
          terms: casual.word,
          status: casual.random_element(['new','in_progress','terminated']),
          ClientId: client.id,
          ContractorId: contractor.id
        });
      }));

      const response = await request(app)
        .get(`/contracts`)
        .set('profile_id', client.id)
        .expect(200);

      const numContractsNotTerminated = allContracts.filter(({ status })=> status != 'terminated').length
      expect(response.body.length).toEqual(numContractsNotTerminated);
    });

    it("should return empty array if all contracts are terminated", async function() {
      const sizeContracts = 5;
      await Promise.all(Array(sizeContracts).fill(null).map(() => {
        return Contract.create({
          terms: casual.word,
          status: 'terminated',
          ClientId: client.id,
          ContractorId: contractor.id
        });
      }));

      const response = await request(app)
        .get(`/contracts`)
        .set('profile_id', client.id)
        .expect(200);

      expect(response.body.length).toEqual(0);
    });
  });
})
