'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('./user.model');
var server = request.agent('http://localhost:9000');
var token = null;

describe('GET /api/users', function() {

  before(function(done){
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password'
      }, function() {
          server.post('/auth/local')
            .send({email:'test@test.com', password:'password', passwordConfirm: 'password'})
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

  describe('GET /api/users/me', function() {
  
    // it('should respond with JSON object for authenticated current user', function(done) {
    //   server.get('/api/users/me')
    //     .set('Authorization', 'Bearer '  + token)
    //     .expect(200)
    //     .expect('Content-Type', /json/)
    //     .end(function(err, res) {
    //       if (err) return done(err);
    //       res.body.should.be.instanceof(Object);
    //       done();
    //     });
    // });
  
    it('returns the email of the current user', function(done) {
      server.get('/api/users/me')
      .set('Authorization', 'Bearer '  + token)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body.email.should.equal('test@test.com')
      })
      .end(done)
    })

  });


});
