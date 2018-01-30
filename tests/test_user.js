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

            const res = await new Promise((resolve, reject) => {
                request(app)
                    .get('/users')
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        resolve(res);
                    });
            })
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            expect(res.body).to.deep.contain(user);
            expect(res.body).to.deep.contain(secondUser);
        });
    });
});

describe('Get User by Username', function () {
    describe('GET / users : usermane', function () {
        it('should get the user', async function () {
            const username = 'JohnDoe45';
            const user = await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');
            utils.getSecureUser(user);

            const res = await new Promise((resolve, reject) => {
                request(app)
                    .get(`/users/${username}`)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        resolve(res);
                    });
            })
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.deep.equal(user);
        });
    });

    describe('GET / users : usermane - Incorrect username', function () {
        it('should throw error because username is not provided', async function () {
            await utils.addUser('JohnDoe45', 'John@Doe.com', 'fbIdJohn');
            const res = await new Promise((resolve, reject) => {
                request(app)
                    .get('/users/a')
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        resolve(res);
                    });
            })
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body['message']).to.equal("User does not exist");
        });
    });
});

describe('Post User', function () {
    describe('POST / users', function () {
        it('should post the user', async function () {
            const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery');
            const username = 'JohnDoe45';
            await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

            const auth_token = await new Promise((resolve, reject) => {
                request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send({
                        'username': username,
                        'password': 'Password'
                    })
                    .end(function (err, res) {
                        resolve(res.body.auth_token);
                    });
            })

            const res = await new Promise((resolve, reject) => {
                request(app)
                    .post('/users')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${auth_token}`)
                    .send(userToAdd)
                    .end(function (err, res) {
                        resolve(res);
                    });
            })
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body['username']).to.equal('Maria');
            expect(res.body['email']).to.equal('Mery@Doe.com');
            expect(res.body['fbId']).to.equal('fbIdMery');
        });
    });

    describe('POST / users - Repeated Username', function () {
        it('should throw error because user has repeated Username', async function () {
            const userToAdd = utils.createUser('Maria', 'Mery@Doe.com', 'fbIdMery');
            const username = 'JohnDoe45';
            await utils.addUser(username, 'John@Doe.com', 'fbIdJohn');

            const auth_token = await new Promise((resolve, reject) => {
                request(app)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send({
                        'username': username,
                        'password': 'Password'
                    })
                    .end(function (err, res) {
                        resolve(res.body.auth_token);
                    });
            })

            await new Promise((resolve, reject) => {
                request(app)
                    .post('/users')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${auth_token}`)
                    .send(userToAdd)
                    .end(function (err, res) {
                        resolve(res);
                    });
            })

            const res = await new Promise((resolve, reject) => {
                request(app)
                    .post('/users')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${auth_token}`)
                    .send(userToAdd)
                    .end(function (err, res) {
                        resolve(res);
                    });
            });
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.be.an('object');
            expect(res.body['message']).to.equal('User with repeated credentials');
        });
    });

    //Repeated email
    //Repeated fbId
    //Unauthorized
    //Empty user to post or with no escential data



});

