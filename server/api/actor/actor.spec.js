'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Actor = require('./actor.model');
var server = request.agent('http://localhost:9000');
var token = null;

describe('GET /api/actors', function() {

  before(function(done){

    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        email: 'test@test.com',
        role: 'admin',
        password: 'password',
        passwordConfirm: 'password'
      }, function() {
          server.post('/auth/local')
            .send({email:'test@test.com', password: 'password', passwordConfirm: 'password'})
            .expect(200)
            .end(function(err, res){
              token = res.body.token;
              done();
            })
          }
        );
      });
    
    });


  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should respond with JSON array for authenticated admin user', function(done) {
    server.get('/api/actors')
      .set('Authorization', 'Bearer '  + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});






