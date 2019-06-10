const app = require('../../../../index').app;
const chai = require('chai');
const request = require('supertest');

const expect = chai.expect;

// To see CORS settings refer to ./source/config/testing.json
describe('CORS', function () {
  it('should allow request with no origin set', async function() {
    const res = await new Promise((resolve, reject) => {
      request(app)
        .get('/ping')
        .end((err, res) => {
          resolve(res);
        });
    });

    expect(res.statusCode).to.equal(200);
  });

});
