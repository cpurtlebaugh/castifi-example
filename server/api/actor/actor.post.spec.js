'use strict';

var should = require('should');
var app = require('../../app');
var Actor = require('./actor.model');
var profileComplete = require('./profile.complete.js');
var User = require('../user/user.model');
var request = require('supertest');
var server = request.agent('http://localhost:9000');
var token = null;

//0 percent actor
var actorOne = new Actor({
  email: 'test@test.com',
});

describe('POST /api/actors', function() {

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
            .expect(302)
            .end(function(err, res){
              token = res.body.token;
              done();
            })
          }
        );
      });
})

afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
 });

afterEach(function(done) {
    Actor.remove().exec().then(function() {
      done();
    });
 });

  it('should post an actor to the server', function(done) {
	  server
	    .post('/api/actors')
	    .set('Authorization', 'Bearer '  + token)
	    .send(actorOne)
	    .expect(201)
	    .end(function(err, res) { // .end handles the response
	        if (err) {
	        	console.log(err)
	            return done(err);
	        }

	        done();
	    })
  })

})