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

const adminUser = {
    username: 'admin',
    password: process.env.ROOTPW
};

const broadcast = {
    title: 'Test tile',
    subject: 'Test subject',
    content: '<html><body>Test Broadcast body</body></html>',
    type: 'Test Broadcast type'
};

const updatedBroadcast = {
    type: 'update'
};

var currentBroadcast = {};

var id_token;
var objId;

describe('Broadcast tests', function () {

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
                id_token = res.body.id_token;
                done();
            });
    });

    it('it should create a broadcast', function (done) {
        chai.request(server)
            .post('/api/v1/broadcasts')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(broadcast)
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.title.should.equal(broadcast.title);
                objId = res.body._id;
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
                id_token = res.body.id_token;
                done();
            });
    });

    it('it should approve a broadcast', function (done) {
        chai.request(server)
            .patch('/api/v1/broadcasts/'+objId+'/approve')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(broadcast)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.approvedBy.should.be.an('string');
                done();
            });
    });

    it('it should read a broadcast', function (done) {
        chai.request(server)
            .get('/api/v1/broadcasts/' + objId)
            .set('Authorization', `Bearer ${ id_token }`)
            .send(broadcast)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.type.should.equal(broadcast.type);
                currentBroadcast = res.body;
                done();
            });
    });

    it('it should update a broadcast', function (done) {
        currentBroadcast.type = updatedBroadcast.type;
        chai.request(server)
            .patch('/api/v1/broadcasts/' + objId + '/update')
            .set('Authorization', `Bearer ${ id_token }`)
            .send(currentBroadcast)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('it should read the updated broadcast', function (done) {
        chai.request(server)
            .get('/api/v1/broadcasts/' + objId)
            .set('Authorization', `Bearer ${ id_token }`)
            .send(broadcast)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.type.should.equal(updatedBroadcast.type);
                done();
            });
    });

    it('it should disable a broadcast', function (done) {
        chai.request(server)
            .delete('/api/v1/broadcasts/' + objId + '/disable')
            .set('Authorization', `Bearer ${ id_token }`)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('it should NOT delete a broadcast', function (done) {
        chai.request(server)
            .delete('/api/v1/broadcasts/' + objId + '/delete')
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

    it('it should delete a broadcast', function (done) {
        chai.request(server)
            .delete('/api/v1/broadcasts/' + objId + '/delete')
            .set('Authorization', `Bearer ${ id_token }`)
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            });
    });
});