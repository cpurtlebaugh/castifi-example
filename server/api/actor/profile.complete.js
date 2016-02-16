'use strict';

var mongoose = require('mongoose');
var Actor    = require('./actor.model');
var _        = require('lodash');
var async    = require('async');


function checkOverview(actor){

// total metric to equal 25 pts
  var requiredTotal,
      willingTotal,
      quoteTotal,
      unionTotal,
      newActorTotal,
      eligibleTotal,
      overviewTotal;

  // required:
  var requiredArray = [actor.legalFirstName, actor.legalLastName, actor.overEighteen,
                       actor.contact.mainPhoneNum, actor.contact.fullAddress];

  var required      = _.every(requiredArray, function(value){
     return value !== undefined;
  })

  required ? requiredTotal = 6.25 : requiredTotal = 0;

  // willing:
  var willingArray  = [actor.willing.partialNudity, actor.willing.fullNudity, actor.willing.kissing,
                      actor.willing.kissingSameSex, actor.willing.drag, actor.willing.cutHair,
                      actor.willing.colorHair,actor.willing.eatMeat, actor.willing.travel ]

  var willing       = _.some(willingArray, function(value){
                          return value === true;
                        })
  willing ? willingTotal = 3.125 : willingTotal = 0;

  // Quote:
  actor.info.movieQuote !== undefined ? (actor.info.movieQuote.length < 1 ? quoteTotal = 0 : quoteTotal = 3.125) :  quoteTotal = 0;

  // SAG or Non-Union:
  actor.info.union !== undefined ? unionTotal = 4.25 : unionTotal = 0;

  // newActor:
  actor.info.newActor !== undefined ? newActorTotal = 4 : newActorTotal = 0;

  // sagEligible:
  actor.info.sagEligible !== undefined ? eligibleTotal = 4.25 : eligibleTotal = 0;

  // console.log('requiredTotal')
  // console.log(requiredTotal)
  // console.log('willingTotal');
  // console.log(willingTotal);
  // console.log('quoteTotal')
  // console.log(quoteTotal)
  // console.log('unionTotal')
  // console.log(unionTotal)
  // console.log('newActorTotal')
  // console.log(newActorTotal)
  // console.log('eligibleTotal')
  // console.log(eligibleTotal)

  overviewTotal = requiredTotal + willingTotal + quoteTotal + unionTotal + newActorTotal + eligibleTotal;
  overviewTotal = Math.floor(overviewTotal);

  // console.log('overviewTotal')
  // console.log(overviewTotal)

  return overviewTotal;
}

function checkPhotos(actor){
    var headShotTotal,
        headToToeTotal,
        realLifeTotal,
        photosTotal;

        (typeof(actor.headShot) === "string") ? headShotTotal = 8.5 :  headShotTotal = 0;
        (typeof(actor.headToToe) === "string") ? headToToeTotal = 8.5 :  headToToeTotal = 0;
        (typeof(actor.realLife) === "string") ? realLifeTotal = 8.5 :  realLifeTotal = 0;

        // console.log(headShotTotal)
        // console.log(headToToeTotal)
        // console.log(realLifeTotal)

        photosTotal = headShotTotal + headToToeTotal + realLifeTotal;
        photosTotal = Math.floor(photosTotal)

        // console.log(photosTotal)
        return photosTotal;
}

function checkPhysical(actor){

    var portrayTotal,
        heightWeightTotal,
        hairTotal,
        bodyTotal,
        ethnicTotal,
        tatTotal,
        pierceTotal,
        tatPierceTotal,
        complexionTotal,
        physicalTotal;

    //portrayAge
    actor.appearance.portrayAgeMin && actor.appearance.portrayAgeMax ? portrayTotal = 5 : portrayTotal = 0;


    //height and weight
    (actor.appearance.heightFeet || actor.appearance.heightInches) && actor.appearance.weight ? heightWeightTotal = 5 : heightWeightTotal = 0;

    //hair
    actor.appearance.hairColor && actor.appearance.hairLength ? hairTotal = 2.5 : hairTotal = 0;

    //body
    actor.appearance.bodyType ? bodyTotal = 2.5 : bodyTotal = 0;

    //ethnicLook
    var ethnicLookArray = [actor.ethnicLook.caucasian, actor.ethnicLook.africanAmerican, actor.ethnicLook.nativeAmerican,
                          actor.ethnicLook.pacificIslander, actor.ethnicLook.asian, actor.ethnicLook.easternIndian,
                          actor.ethnicLook.middleEastern, actor.ethnicLook.hispanic]

    var ethnicLook =  _.some(ethnicLookArray, function(value){
                          return value === true;
                      })

    ethnicLook ? ethnicTotal = 5 : ethnicTotal = 0;

    //piercings, tattoos
    actor.tattoos.present !== true ?  tatTotal = 0 : tatTotal = 2.5;
    actor.piercings.present !==  true ? pierceTotal = 0 : pierceTotal = 2.5;
    (typeof(tatTotal) === 'number') && (typeof(pierceTotal) === 'number') ? tatPierceTotal = 2.5 : tatPierceTotal = 0;

    //complexion
    actor.appearance.complexion ? complexionTotal = 2.5 : complexionTotal = 0

    //console
    // console.log('portrayTotal')
    // console.log(portrayTotal)
    // console.log('heightWeightTotal')
    // console.log(heightWeightTotal)
    // console.log('hairTotal')
    // console.log(hairTotal)
    // console.log('bodyTotal')
    // console.log(bodyTotal)
    // console.log('ethnicTotal')
    // console.log(ethnicTotal)
    // console.log('tatPierceTotal')
    // console.log( tatPierceTotal)
    // console.log('complexionTotal')
    // console.log(complexionTotal)

    physicalTotal = portrayTotal + heightWeightTotal + hairTotal + bodyTotal + complexionTotal + tatPierceTotal + ethnicTotal;
    physicalTotal = Math.floor(physicalTotal);
    // console.log('physicalTotal');
    // console.log(physicalTotal);
    return physicalTotal;
}


function checkWardrobe(actor){
  var wardrobeTotal,
      uniformTotal,
      measureTotal,
      basicTotal;

   //basic wardrobe
   var wardrobe = [actor.wardrobe.tux,
    actor.wardrobe.fullSuit, actor.wardrobe.bathingSuit,
    actor.wardrobe.businessSuit, actor.wardrobe.cocktailDress,
    actor.wardrobe.lingerie]

   var basicWardrobe =  _.some(wardrobe, function(value){
                            return value === true;
                          })

    basicWardrobe ? basicTotal = 8.5 : basicTotal = 0;

    //costume/uniform wardrobe
    var costumes = [actor.costumes.doctor, actor.costumes.emt, actor.costumes.fireDept,
                    actor.costumes.nurse, actor.costumes.paramedic, actor.costumes.police,
                    actor.costumes.dragQueen, actor.costumes.clownSuit ]

     var costumeWardrobe =  _.some(costumes, function(value){
                                return value === true;
                            })

    costumeWardrobe ? uniformTotal = 8.25 : uniformTotal = 0;

    //clothingSizes wardrobe, need to add a check on individual clothing fields
    actor.clothingWomenSizes.present || actor.clothingMenSizes.present ?  measureTotal = 8.25 : measureTotal = 0;

    wardrobeTotal = basicTotal + measureTotal + uniformTotal;
    wardrobeTotal = Math.floor(wardrobeTotal);

    //console logs
    // console.log("basicTotal");
    // console.log(basicTotal);
    // console.log("uniformTotal")
    // console.log(uniformTotal)
    // console.log("measureTotal");
    // console.log(measureTotal);
    // console.log("wardrobeTotal");
    // console.log(wardrobeTotal);

    return wardrobeTotal;
  }

  function checkProfile(actor){
     var finalArr = [];

     var overviewTotal = checkOverview(actor);
     var photosTotal   = checkPhotos(actor);
     var physicalTotal = checkPhysical(actor);
     var wardrobeTotal = checkWardrobe(actor);
     var profileTotal  = overviewTotal + photosTotal + physicalTotal + wardrobeTotal;

     finalArr = [overviewTotal, photosTotal, physicalTotal, wardrobeTotal, profileTotal]
     return finalArr;
  }


exports.checkOverview = checkOverview;
exports.checkPhotos = checkPhotos;
exports.checkPhysical = checkPhysical
exports.checkWardrobe = checkWardrobe;
exports.checkProfile = checkProfile;
