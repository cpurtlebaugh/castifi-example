'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var User = require('../../api/user/user.model');
var _ = require('lodash');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});
    var token = auth.signToken(user._id, user.role);
    res.json({token: token});
  })(req, res, next)
  	//set lastLogin on User model, 
  	User.findOne(
  		{email: (req.body.email).toLowerCase()},
  		function (err, user) {
		    if (err) { return next(err); }
		    if(!user) { return next(err)}
		    var updated = _.merge(user, {lastLogin: Date.now()});
		    updated.save(function (err) {
		      if (err) { return next(err); }
		      return next();
		    });
  	});

});

module.exports = router;
