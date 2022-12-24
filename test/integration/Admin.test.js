const request = require('supertest');
const app = require('../../src/app');
const { makeFixtures, makeFixture } = require('../fixture')

const {Profile, Contract, Job} = app.get('models');

console.warn = jest.fn();

describe("Admin API: ", function() {
  const sizeJobs = 5;
  let clients, contractors, contracts, jobs;

  beforeAll(async ()=> {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    clients = await makeFixtures(Profile, 5, {type: 'client'});
    contractors = await makeFixtures(Profile, 5, {type: 'contractor'});

    contracts  = await Promise.all([
      makeFixture(Contract, {ClientId: clients[0].id, ContractorId: contractors[0].id}),
      makeFixture(Contract, {ClientId: clients[1].id, ContractorId: contractors[1].id}),
      makeFixture(Contract, {ClientId: clients[2].id, ContractorId: contractors[2].id}),
      makeFixture(Contract, {ClientId: clients[3].id, ContractorId: contractors[3].id}),
      makeFixture(Contract, {ClientId: clients[4].id, ContractorId: contractors[3].id}),
    ])

    const paymentDate = (new Date()).toISOString()
    const jobs1 = await makeFixtures(Job, 10, {ContractId: contracts[0].id, paymentDate, pied:true, priceFrom: 10, priceTo: 100});
    const jobs2 = await makeFixtures(Job, 10, {ContractId: contracts[1].id, paymentDate, pied:true, priceFrom: 200, priceTo: 1000});
    const jobs3 = await makeFixtures(Job, 5, {ContractId: contracts[2].id, paymentDate, pied:true, priceFrom: 10, priceTo: 100});
    const jobs4 = await makeFixtures(Job, 5, {ContractId: contracts[3].id, paymentDate, pied:true, priceFrom: 10, priceTo: 100});
    const jobs5 = await makeFixtures(Job, 5, {ContractId: contracts[4].id, paymentDate, pied:true, priceFrom: 10, priceTo: 100});

    jobs = [jobs1, jobs2, jobs3, jobs4, jobs5];
  });

  describe("GET - /admin/best-profession, ", function() {
    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .get(`/admin/best-profession`)
        .expect(401);
    });

    it("should return the best profession", async function() {
      const start = new Date()
      const end = new Date();

      start.setMonth(start.getMonth() - 1)
      end.setMonth(end.getMonth() + 1)

      const result = await request(app)
        .get(`/admin/best-profession`)
        .set('profile_id', clients[0].id)
        .query({ 
          start: start.toISOString().split('T')[0], 
          end: end.toISOString().split('T')[0] 
        })
        .expect(200); 

      ['id', 'firstName', 'lastName', 'profession', 'balance', 'type'].map((key) => {
        expect(result.body[key]).toEqual(contractors[1][key])
      });
    });

    it("should return not pass date on params", async function() {
      const result = await request(app)
        .get(`/admin/best-profession`)
        .set('profile_id', clients[0].id)
        .expect(409); 
    });
  });

  describe("GET - /admin/best-clients, ", function() {
    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .get(`/admin/best-clients`)
        .expect(401);
    });

    it("should return the best profession with a limit of 3 registers", async function() {
      const start = new Date()
      const end = new Date();

      start.setMonth(start.getMonth() - 1)
      end.setMonth(end.getMonth() + 1)

      const result = await request(app)
        .get(`/admin/best-clients`)
        .set('profile_id', clients[0].id)
        .query({ 
          start: start.toISOString().split('T')[0], 
          end: end.toISOString().split('T')[0] 
        })
        .expect(200); 

      expect(result.body.length).toEqual(2)
      expect(result.body[0].id).toEqual(clients[1].id)
      expect(result.body[0].full_name).toEqual(clients[1].firstName + " " + clients[1].lastName)
      expect(result.body[0].paid).toEqual(jobs[1].reduce((acc, {price})=> acc + price, 0))
    });

    it("should return the best profession with a limit of 4 registers ", async function() {
      const start = new Date()
      const end = new Date();

      start.setMonth(start.getMonth() - 1)
      end.setMonth(end.getMonth() + 1)

      const result = await request(app)
        .get(`/admin/best-clients`)
        .set('profile_id', clients[0].id)
        .query({ 
          start: start.toISOString().split('T')[0], 
          end: end.toISOString().split('T')[0],
          limit: 4
        })
        .expect(200); 

      expect(result.body.length).toEqual(4)
      expect(result.body[0].id).toEqual(clients[1].id)
      expect(result.body[0].full_name).toEqual(clients[1].firstName + " " + clients[1].lastName)
      expect(result.body[0].paid).toEqual(jobs[1].reduce((acc, {price})=> acc + price, 0))
    });

    it("should return not pass date on params", async function() {
      const result = await request(app)
        .get(`/admin/best-clients`)
        .set('profile_id', clients[0].id)
        .expect(409); 
    });
  });
});
