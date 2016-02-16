'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var check  = require('./profile.complete');

//need to add createdAt and updatedAt
//also createdBy

var ActorSchema = new Schema({
  name: String,
  legalFirstName: {type: String, lowercase: true},
  legalMiddleName: {type: String, lowercase: true},
  legalLastName: {type: String, lowercase: true},
  gender: String,
  dob: Date,
  overEighteen: Boolean,
  email: String,
  active: {type: Boolean, default: true},
  contact: {
            cellNum: {type: String,
              validate: {
                validator: function(cellNum){
                  return cellNum.length === 10;
                },
              message: 'cell number needs to be exactly 10 characters'
              }
            },

            mainPhoneNum: {type: String,
              validate: {
                validator: function(mainPhoneNum){
                  return mainPhoneNum.length === 10;
                },
              message: 'phone number needs to be exactly 10 characters'
              }
             },
            fullAddress: String,
            address: {type: String, lowercase: true},
            aptNum: Number,
            city: {type: String, lowercase: true},
            state: {type: String, lowercase: true},
            zipCode: Number,
            country: {type: String, lowercase: true},
           },

  ownedBy:    {type: mongoose.Schema.Types.ObjectId,
               ref: 'User'
              },

  // actor photos + video
          headShot: String,
          headToToe: String,
          realLife: String,
          video: String,
  // end actor photos + video

  info:       {unionFirstName: String, unionMiddleName: String,
               unionLastName: String,
               union: Boolean,
               sagEligible: Boolean,
               unionSameLegalName:Boolean,
               bio: String,
               newActor: Boolean,
               actingSince: Date,
               aboutMe: String,
               movieQuote: String
              },

// appearance //
  ethnicLook: {
                caucasian: Boolean, africanAmerican: Boolean,
                nativeAmerican: Boolean, pacificIslander: Boolean,
                asian: Boolean, easternIndian: Boolean,
                middleEastern: Boolean, hispanic: Boolean
               },

  appearance: {heightFeet: Number, heightInches:Number, weight: Number,
               portrayAgeMin: Number, portrayAgeMax: Number,
               nationality: String, bodyType: String, complexion: String,
               eyeColor: String, hairColor: String,
               hairStyle: String, hairLength: String,
               facialHairType: String, facialHairColor: String,
               facialHairPresent: Boolean, twins: Boolean,
               triplets: Boolean, pregnant: Boolean,
               pregnantDueDate: Date, smoker:Boolean
              },
          ageHigh: Number,
          ageLow: Number,

  piercings:  {present: Boolean, piercingCount: Number,
               ear:Boolean, nose:Boolean, eyebrow: Boolean,
               lip: Boolean, tongue: Boolean, navel:Boolean
              },

  tattoos:    {
               present: Boolean, tattooCountRange: String,
               forearm: Boolean, upperArm:Boolean, neck:Boolean,
               face: Boolean, chest: Boolean, stomach: Boolean,
               back: Boolean, hand: Boolean, leg: Boolean, foot: Boolean
              },

  willing:    {
                partialNudity: Boolean, fullNudity: Boolean,
                kissing: Boolean, kissingSameSex: Boolean,
                drag: Boolean, cutHair: Boolean, colorHair: Boolean,
                eatMeat: Boolean, travel: Boolean
              },

  amputee:    {
               present: Boolean, hand: Boolean, foot: Boolean,
               arm: Boolean, leg: Boolean, finger: Boolean
              },

  disabled:   {
              present:Boolean, blind: Boolean, mute: Boolean, deaf: Boolean,
              impairedHearing: Boolean, usesWheelChair: Boolean
              },

  clothingMenSizes: {
                      present: Boolean,
                      coatLength: String,
                      coatSize: String,
                      shirtNeck: String,
                      shirtSleeve: String,
                      pantWaist: String,
                      pantInseam: String,
                      shoe: String,
                      glove: String,
                      hat: String
                    },

  clothingWomenSizes: {
                        present: Boolean,
                        bustSize: String,
                        cupSize: String,
                        pantWaist: String,
                        pantInseam: String,
                        hips: String,
                        dress: String,
                        shoe: String,
                        glove: String,
                        hat: String
                    },

  wardrobe:   {tux: Boolean, fullSuit: Boolean, bathingSuit: Boolean,
               businessSuit: Boolean, cocktailDress: Boolean,
               lingerie: Boolean
              },

  costumes:   {doctor: Boolean, emt: Boolean, fireDept: Boolean,
               nurse: Boolean, paramedic: Boolean, police: Boolean,
               dragQueen: Boolean, clownSuit: Boolean
              },

  ethnicClothing: {african: Boolean, arabic: Boolean,
                   chinese: Boolean, eastIndian: Boolean,
                   hasidic: Boolean, japanese: Boolean
                  },


  looks:      {bodyBuilder: Boolean,
               business: Boolean, character: Boolean,
               dragQueen: Boolean, freckles: Boolean,
               punk: Boolean, multiplePiercings: Boolean
              },

  property:   {hasVehicle: Boolean,
                vehicleOne: {vehicleOneMake: String, vehicleOneYear: String,
                             vehicleOneColor: String},
                vehicleTwo: {vehicleTwoMake: String, vehicleTwoYear: String,
                             vehicleTwoColor: String},
              hasPet: Boolean,
                petOne: {petOneType: String, petOneColor: String,
                          petOneLicense: String},
                petTwo: {petTwoType: String, petTwoColor: String,
                          petTwoLicense: String}
              },

  skills:     {aerobic: Boolean, martialArts: Boolean,
               martialArtsWeapon: Boolean, militaryTraining: Boolean,
               stageCombat: Boolean, generalWeaponsTraining: Boolean,
               artist: Boolean, ballonSculpting: Boolean,
               bartender: Boolean, batonTwirler: Boolean,
               caligraphyArtist: Boolean, cardDealer: Boolean,
               cheerleader: Boolean, contortionist: Boolean,
               fireBreather: Boolean, fireEater: Boolean,
               fireman: Boolean, gunHandler: Boolean,
               juggler: Boolean, lifeguard: Boolean,
               magician: Boolean, manicurist: Boolean,
               massage: Boolean, mime: Boolean, footModel: Boolean,
               handModel: Boolean, legModel: Boolean, nurse: Boolean,
               paramedic: Boolean, signLanguage: Boolean,
               sketchArtist: Boolean, stenographer: Boolean,
               stiltwalker: Boolean, unicyclist: Boolean,
               welder: Boolean, yoga: Boolean, circus: Boolean,
               improve: Boolean, horseRiding: Boolean,
               canDrive: Boolean, stunts: Boolean
              },

  sports:     {basketball: Boolean, baseball: Boolean,
               soccer: Boolean, skateBoarding: Boolean,
               swimming: Boolean, cycling: Boolean,
               trackField: Boolean, football: Boolean,
               running: Boolean, hockey: Boolean,
               tennis: Boolean, tableTennis: Boolean,
               rollerskating: Boolean
              },

  music:      {guitar: Boolean, bass: Boolean, drums: Boolean,
               horns: Boolean, saxaphone: Boolean, keys: Boolean,
               dj: Boolean, banjo: Boolean, harmonica: Boolean,
               violin: Boolean,
               canSing: {sporano: Boolean, alto: Boolean, tenor: Boolean,
                        baritone: Boolean}
              },

  dance:      {ballet: Boolean, salsa: Boolean, ballroom: Boolean,
               swing: Boolean, hipHop: Boolean, flamingo: Boolean,
               contemporary: Boolean, tapDance: Boolean,
               irishDance: Boolean, bellyDance: Boolean,
               bollyWood: Boolean, breakDance: Boolean,
               eastCoastSwing: Boolean, westCoastSwing: Boolean,
               tango: Boolean, bachata: Boolean, kizomba: Boolean,
               argentinetango: Boolean
              },

  setCoordinator: {present: Boolean, pastExperience: String},

  standInExperience: {present: Boolean, pastExperience: String},

  profileMetrics: { wardrobeComplete: {type: Number},
                overviewComplete: {type: Number, default: 0},
                photosComplete: {type: Number, default: 0},
                physicalComplete: {type: Number, default: 0},
                profileComplete: {type: Number, default: 0} },

  createdAt: {type: Date, default: Date.now()},
  updatedAt: Date,
  lastLogin: Date
});

var profileProgress = function(next){
    var profileTotal = check.checkProfile(this);
    this.profileMetrics.overviewComplete = profileTotal[0];
    this.profileMetrics.photosComplete = profileTotal[1];
    this.profileMetrics.physicalComplete = profileTotal[2];
    this.profileMetrics.wardrobeComplete = profileTotal[3];
    this.profileMetrics.profileComplete = profileTotal[4];;
    next();
};
/* Pre-save hook*/
ActorSchema
  .pre('save', function(next) {
  this.updatedAt = new Date();
  next();
}); 

ActorSchema
  .pre('save', profileProgress);

ActorSchema
  .pre('update', profileProgress);
 

module.exports = mongoose.model('Actor', ActorSchema);
