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


// Remove test users
describe('Remove test users', function() {

    it('it should clean up all users', function (done) {
        chai.request(server)
            .delete('/api/v1/tests/rmUsers')
            .end(function (err, res) {
                res.should.have.status(204);
                res.body.should.be.empty;
                done();
            });
    });

});

// Create admintest user
describe('Create test users', function() {

    it('it should create an test users', function (done) {
        chai.request(server)
            .post('/api/v1/tests/createUsers')
            .end(function (err, res) {
                res.should.have.status(201);
                done();
            });
    });

});
