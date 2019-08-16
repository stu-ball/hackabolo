/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
const server = require('../server');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
var expect = require('chai').expect;

const standardUser = {
    username: 'standarduser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user']
};

const badPasswordUser = {
    username: 'standarduser',
    password: 'password1',
    verifyPassword: 'password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user']
};

const boloCreatorUser = {
    username: 'bolocreatoruser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'boloCreator']
};

const boloApproverUser = {
    username: 'boloapproveruser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'boloApprover']
};

const broadcastCreatorUser = {
    username: 'broadcastcreatoruser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'broadcastCreator']
};

const broadcastApproverUser = {
    username: 'broadcastapproveruser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'broadcastApprover']
};

// Create test users
describe('Test Create Users', function () {

    it('it should create a standard user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(standardUser)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.username.should.equal('standarduser');
                res.body.should.be.an('object');
                done();
            });
    });

    it('it should create an bolo creator user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(boloCreatorUser)
            .end(function (err, res) {
                res.should.have.status(201);
                done();
            });
    });

    it('it should create an bolo approval user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(boloApproverUser)
            .end(function (err, res) {
                res.should.have.status(201);
                done();
            });
    });

    it('it should create an broadcast creator user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(broadcastCreatorUser)
            .end(function (err, res) {
                res.should.have.status(201);
                done();
            });
    });

    it('it should create an broadcast approval user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(broadcastApproverUser)
            .end(function (err, res) {
                res.should.have.status(201);
                done();
            });
    });

    it('it should FAIL creating a user with a short password', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(badPasswordUser)
            .end(function (err, res) {
                res.should.have.status(400);
                done();
            });
    });
});

// Create test users
describe('Login Test Users', function () {

    it('it should login a standard user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: standardUser.username, 
                password: standardUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(standardUser.username);
                done();
            });
    });

    it('it should login a boloCreatorUser user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: boloCreatorUser.username,
                password: boloCreatorUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(boloCreatorUser.username);
                done();
            });
    });

    it('it should login a boloApproverUser user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: boloApproverUser.username,
                password: boloApproverUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(boloApproverUser.username);
                done();
            });
    });

    it('it should login a broadcastCreatorUser user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: broadcastCreatorUser.username,
                password: broadcastCreatorUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(broadcastCreatorUser.username);
                done();
            });
    });

    it('it should login a broadcastApproverUser user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: broadcastApproverUser.username,
                password: broadcastApproverUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(broadcastApproverUser.username);
                done();
            });
    });

    it('it should NOT login a user with the wrong password', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: standardUser.username,
                password: badPasswordUser.password
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});