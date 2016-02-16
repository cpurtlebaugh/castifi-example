'use strict';

var User = require('./user.model');
var Actor = require('../actor/actor.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var gmailPassword = process.env.GMAIL_PASSWORD;

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.active = true;
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    //create new Actor associated with User
    var newActor = new Actor({ownedBy: user._id, email: user.email})
    newActor.save(function(err, actor){
      //save actorId to currentUser
      var updated = _.merge(user, {actorId: actor._id});
      updated.save(function (err) {
      })
    })

    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 60*45 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.passwordConfirm = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) {
        return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(user);
    });
  });
};
/**
 * Get my info
 */

exports.me = function(req, res, next) {
  var userId = req.user._id;
  User
   .findOne({ _id: userId}, '-salt -hashedPassword')
   .populate('actorId')
   .exec(function(err, user) {
      if(err) { return handleError(res, err); }
      if(!user) { return res.status(401).send('Unauthorized'); }
      return res.json(user);
    });
};

/**
* Reset Password
*/

exports.resetPassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(404).send('This email is not registered.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hello@castifi.com',
          pass: gmailPassword
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hello@castifi.com',
        subject: 'Castifi Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        return res.status(200).send('An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};

exports.acceptToken = function(req, res, next){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.status(404).send('Password reset token is invalid or has expired.');
        }
        else{
          user.password = req.body.password;
          user.passwordConfirm = req.body.passwordConfirm;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if(user.authenticate(req.body.password)){
                   if (err) return validationError(res, err);
                   done(err, user)
                }
            });
          }
      });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'hello@castifi.com',
          pass: gmailPassword
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hello@castifi.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
         return res.status(200).send('Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
};


/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
