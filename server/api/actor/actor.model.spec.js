'use strict';

var should = require('should');
var app = require('../../app');
var Actor = require('./actor.model');
var check = require('./profile.complete.js');

var actor = new Actor({
  email: 'test@test.com',
});

var actorWardrobe = new Actor({
  email: 'test@test.com',
  wardrobe: { tux: true},
  costumes: { doctor: true},
  clothingWomenSizes: { present: true}
});

var actorOverview = new Actor({
  email: 'test@test.com',
  legalFirstName: 'bob',
  legalLastName: 'barker',
  overEighteen: true,
  contact: {mainPhoneNum: '8009001600', fullAddress: '1523 N McCadden Pl, Los Angeles, CA, United States'},
  willing: {partialNudity: true},
  info: {movieQuote: 'hello', union: false, newActor: false, sagEligible: true}
});

var actorPhotos = new Actor({
  headShot: 'asdlfj.jpg',
  headToToe: 'adlkj.jpg',
  realLife: 'aasdjfk.jpg'
});

var actorAppearance = new Actor({
  appearance: {portrayAgeMin: 30, portrayAgeMax: 28, heightFeet: 6, heightInches: 2, weight: 140,
               bodyType: 'average', hairColor: 'brown', hairLength: 'short', complexion: 'fair'},
  ethnicLook: {asian: true},
  piercings: {present: false}
});

var actorProfileComplete = new Actor({
  email: 'test@test.com',
  legalFirstName: 'bob',
  legalLastName: 'barker',
  overEighteen: true,
  contact: {mainPhoneNum: '8009001600', fullAddress: '1523 N McCadden Pl, Los Angeles, CA, United States'},
  willing: {partialNudity: true},
  info: {movieQuote: 'hello', union: false, newActor: false, sagEligible: true},
  wardrobe: { tux: true},
  costumes: { doctor: true},
  clothingWomenSizes: { present: true},
  headShot: 'asdlfj.jpg',
  headToToe: 'adlkj.jpg',
  realLife: 'aasdjfk.jpg',
  appearance: {portrayAgeMin: 30, portrayAgeMax: 28, heightFeet: 6, heightInches: 2, weight: 140,
               bodyType: 'average', hairColor: 'brown', hairLength: 'short', complexion: 'fair'},
  ethnicLook: {asian: true},
  piercings: {present: false},
  tattoos: {present: false}
});


describe('Actor Model', function() {

  afterEach(function(done) {
    Actor.remove().exec().then(function() {
      done();
    });
  });

  describe('Validations', function() {
  	it('cellNum should fail without a valid 10-digit phone number', function(done){
       actor.contact.cellNum = '18002224444';
       actor.save(function(err){
         should.exist(err);
         done();
       })
    });

    it('mainNum should fail without a valid 10-digit phone number', function(done){
       actor.contact.mainPhoneNum = '800222444';
       actor.save(function(err){
         should.exist(err);
         done();
       })
    });

  });

  describe('Profile Completeness', function() {

    it('actor should return a 0 for profileComplete after saving', function(done){
       actor.save(function(err){});
       actor.profileMetrics.profileComplete.should.equal(0);
       done();
    });

    it('actorWardrobe should return a 25 for profileComplete after saving', function(done){
       actorWardrobe.profileMetrics.profileComplete = check.checkProfile(actorWardrobe)[3];
       actorWardrobe.save(function(err){});
       actorWardrobe.profileMetrics.profileComplete.should.equal(25);
       done();
    });


    it('actorOverview should return a 25 for profileComplete after saving', function(done){
      actorOverview.profileMetrics.profileComplete = check.checkProfile(actorOverview)[0];
      actorOverview.save(function(err){});
      actorOverview.profileMetrics.profileComplete.should.equal(25);
      done();
    });

    it('actorPhotos should return a 25 for profileComplete after saving', function(done){
      actorPhotos.profileMetrics.profileComplete = check.checkProfile(actorPhotos)[1];
      actorPhotos.save(function(err){});
      actorPhotos.profileMetrics.profileComplete.should.equal(25);
      done();
    });

    it('actorAppearance should return a 25 for profileComplete after saving', function(done){
      actorAppearance.profileMetrics.profileComplete = check.checkProfile(actorAppearance)[2];
      actorAppearance.save(function(err){});
      actorAppearance.profileMetrics.profileComplete.should.equal(25);
      done();
    });

    it('actorProfileComplete should return a 100 for profileComplete after saving', function(done){
      actorProfileComplete.profileMetrics.profileComplete = check.checkProfile(actorProfileComplete)[4];
      actorProfileComplete.save(function(err){});
      actorProfileComplete.profileMetrics.profileComplete.should.equal(100);
      done();
    });


  });


});
