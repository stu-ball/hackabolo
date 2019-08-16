/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
process.env.NODE_ENV = 'test';
const server = require('../server');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
var expect = require('chai').expect;

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

const adminUser = {
    username: 'admin',
    password: process.env.ROOTPW
};

const bolo = {
    district: 'All',
    subject: 'Test subject',
    details: '<html><body>Test bolo body</body></html>',
    category: ['Test bolo type']
};

const updatedbolo = {
    subject: 'Changed',
};

var currentbolo = {};

var id_token;
var objId;

describe('bolo tests', function () {

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
                id_token = res.body.id_token;
                done();
            });
    });

    it('it should create a bolo', function (done) {
        chai.request(server)
            .post('/api/v1/bolos')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(bolo)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.subject.should.equal(bolo.subject);
                objId = res.body._id;
                done();
            });
    });

    it('it should list all bolos', function (done) {
        chai.request(server)
            .get('/api/v1/bolos')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(bolo)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
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
                id_token = res.body.id_token;
                done();
            });
    });

    it('it should approve a bolo', function (done) {
        chai.request(server)
            .patch('/api/v1/bolos/' + objId + '/approve')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(bolo)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.approvedBy.should.be.an('string');
                done();
            });
    });

    it('it should read a bolo', function (done) {
        chai.request(server)
            .get('/api/v1/bolos/' + objId)
            .set('Authorization', `Bearer ${ id_token }`)
            .send(bolo)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.subject.should.equal(bolo.subject);
                currentbolo = res.body;
                done();
            });
    });

    it('it should update a bolo', function (done) {
        currentbolo.subject = updatedbolo.subject;
        chai.request(server)
            .patch('/api/v1/bolos/' + objId + '/update')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(currentbolo)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('it should read the updated bolo', function (done) {
        chai.request(server)
            .get('/api/v1/bolos/' + objId)
            .set('Authorization', `Bearer ${ id_token }`)
            .send(bolo)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.subject.should.equal(updatedbolo.subject);
                done();
            });
    });

    it('it should disable a bolo', function (done) {
        chai.request(server)
            .delete('/api/v1/bolos/' + objId + '/disable')
            .set('Authorization', `Bearer ${ id_token }`)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('it should NOT delete a bolo', function (done) {
        chai.request(server)
            .delete('/api/v1/bolos/' + objId + '/delete')
            .set('Authorization', `Bearer ${ id_token }`)
            .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
    });

    it('it should login a Admin user', function (done) {
        chai.request(server)
            .post('/api/v1/authentication/login')
            .send({
                username: adminUser.username,
                password: adminUser.password
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.user.username.should.equal(adminUser.username);
                id_token = res.body.id_token;
                done();
            });
    });

    it('it should delete a bolo', function (done) {
        chai.request(server)
            .delete('/api/v1/bolos/' + objId + '/delete')
            .set('Authorization', `Bearer ${ id_token }`)
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            });
    });
});