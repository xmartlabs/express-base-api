const app = require('../index').app;
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const chai = require('chai');
const request = require('supertest');
const utils = require('./utils');

const expect = chai.expect;

describe('Get Users', function () {
    describe('GET / users - Empty', function () {
        it('should get empty list of Users', function (done) {
            request(app)
                .get('/users')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.be.empty;
                    done();
                });

        });
    });


    describe('GET / users - TwoUsers', function () {
        it('should get list of users with two Users', async function () {
            let user = await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
            let secondUser = await utils.addUser('JohnDoe46', 'John2@Doe.com', 'fbIdJohn2');
            user = utils.serializeUsers(user);           
            secondUser = utils.serializeUsers(secondUser);
            request(app)
                .get('/users')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                    expect(res.body).to.deep.contain(user);
                    expect(res.body).to.deep.contain(secondUser);
                });
        });
    });
});
