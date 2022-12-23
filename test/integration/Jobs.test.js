
const request = require('supertest');
const casual = require('casual');
const app = require('../../src/app');

const {Profile, Contract, Job} = app.get('models');

console.warn = jest.fn();

describe("Jobs API: ", function() {
  let client, contractor, newContract;

  beforeAll(async ()=> {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });

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
  });

  describe("GET - /jobs/unpaid, ", function() {
    const sizeJobs = 5;
    let jobs;
    beforeEach(async() => {    
      await Job.sync({ force: true });
      jobs = await Promise.all(Array(sizeJobs).fill(null).map(() => {
        const data = {
          description: casual.description,
          price: casual.integer(from = 10, to = 3000),
          ContractId: newContract.id,
        };

        if(Math.random() > 0.4) {
          data.paid = true;
          data.paymentDate = casual.moment
        }

        return Job.create(data);
      }));
    });

    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .get('/jobs/unpaid')
        .expect(401);
    });

    it("should return the job unpaid list", async function() {
      newContract.status = 'in_progress';
      await newContract.save();

      const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', client.id)
        .expect(200);

      const numJobsUnpaid = jobs.filter(({ paid })=> !paid).length;
      expect(response.body.length).toEqual(numJobsUnpaid);
    });

    it("should not return jobs of contracts that are not in progress", async function() {
      newContract.status = 'terminated';
      await newContract.save();

      const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', client.id)
        .expect(200);

      expect(response.body.length).toEqual(0);
    });
  });

  describe("POST - /jobs/:id/pay, ", function() {
    const sizeJobs = 5;
    let job;
    beforeEach(async() => {    
      await Job.sync({ force: true });
      
      job = await Job.create({
        description: casual.description,
        price: client.balance,
        ContractId: newContract.id,
      });
    });

    it("should return erro 401 when not authenticated", async function() {
      await request(app)
        .post(`/jobs/${job.id}/pay`)
        .expect(401);
    });

    it("should do the payment of job", async function() {
      const newBalanceContractor = contractor.balance + job.price;
      await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set('profile_id', client.id)
        .expect(200);

      const newContractor = await Profile.findByPk(contractor.id);
      expect(newContractor.balance).toEqual(newBalanceContractor);

      const newClient = await Profile.findByPk(client.id);
      expect(newClient.balance).toEqual(0);

      const newJob = await Job.findByPk(job.id)      
      expect(newJob.paid).toEqual(true);
      expect(newJob.paymentDate).not.toBeNull();
    });

    it("should return error if contractor not have balance", async function() {
      contractor.balance += 10000
      await contractor.save()

      const response = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set('profile_id', client.id)
        .expect(409);

      expect(response.body).toEqual('Client don\'t have balance to pay');
    });

    it("should return error if not found a job", async function() {
      const response = await request(app)
        .post(`/jobs/${job.id + 1000}/pay`)
        .set('profile_id', client.id)
        .expect(409);

      expect(response.body).toEqual('Job not found.');
    });

    it("should return error if was job paid", async function() {
      job.paid = true;
      job.paymentDate = casual.moment;
      await job.save();

      const response = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set('profile_id', client.id)
        .expect(409);

      expect(response.body).toEqual('Job was paid');
    });

  });
})
