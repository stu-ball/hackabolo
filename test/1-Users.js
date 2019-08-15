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
    username: 'standardUser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user']
};

const badPasswordUser = {
    username: 'standardUser',
    password: 'password1',
    verifyPassword: 'password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user']
};

const boloCreatorUser = {
    username: 'boloCreatorUser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'boloCreator']
};

const boloApproverUser = {
    username: 'boloApproverUser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'boloApprover']
};

const broadcastCreatorUser = {
    username: 'broadcastCreatorUser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'broadcastCreator']
};

const broadcastApproverUser = {
    username: 'broadcastApproverUser',
    password: 'password1password1',
    verifyPassword: 'password1password1',
    email: 'standardUser@test.com',
    mobile: '040 123 4567',
    firstName: 'First Name',
    lastName: 'Last Name',
    roles: ['user', 'broadcastApprover']
};

// Remove test users
describe('Users', function () {

    it('it should create a standard user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/signup')
            .send(standardUser)
            .end(function (err, res) {
                res.should.have.status(201);
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

