'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

var Actor = require('./actor.model');
var AWS = require('aws-sdk');
var AWS_ACCESS_KEY = process.env.AMZ_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AMZ_ACCESS_SECRET_KEY;
var AWS_S3_BUCKET = process.env.AMZ_S3_BUCKET;

// Get list of actors
exports.index = function(req, res) {
  Actor.find(function (err, actors) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(actors);
  });
};

// Get a single actor
exports.show = function(req, res) {
  Actor
  .findById(req.params.id)
  .populate('ownedBy')
  .exec(function(err, actor) {
      if(err) { return handleError(res, err); }
      if(!actor) { return res.status(404).send('Not Found'); }
      return res.json(actor);
  });
};

// Creates a new actor in the DB.
exports.create = function(req, res) {
  Actor.create(req.body, function(err, actor) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(actor);
  });
};

// Updates an existing actor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Actor.findById(req.params.id, function (err, actor) {
    if (err) { return handleError(res, err); }
    if(!actor) { return res.status(404).send('Not Found'); }
    var updated = _.merge(actor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(actor);
    });
  });
};

//upload file
exports.uploadFile = function(req, res) {
  var file = req.files.file;
  var unique = req.body.unique;
  // console.log(req.files.file.size)
  // if(req.files.file.size < 4000000){
  //   console.log("yo")
  // }
  fs.readFile(file.path, function (err, data) {
    if (err) throw err;
    // gm(data).compress('JPEG').quality(60)
    //   .resizeExact(225)
    //   .autoOrient()
    //   .toBuffer('JPEG', function(err, buffer){
    //   if(err) return err;
       AWS.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
       AWS.config.region = 'us-west-1';
       var s3 = new AWS.S3();
       var params = {
           Key: unique + file.originalFilename,
           Bucket: AWS_S3_BUCKET,
           Body: data, //buffer
           ContentType: file.type
       };
       s3.putObject(params, function(err, data) {
         if(err) {
           console.log(err.message,err.code);
           return false;
         }
         else {
           console.log('File Uploaded Successfully', 'Done');
         }
       })
    // });

  })
}




// Deletes a actor from the DB.
exports.destroy = function(req, res) {
  Actor.findById(req.params.id, function (err, actor) {
    if(err) { return handleError(res, err); }
    if(!actor) { return res.status(404).send('Not Found'); }
    actor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
