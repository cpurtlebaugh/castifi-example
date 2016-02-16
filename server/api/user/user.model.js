'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var Actor = require('../actor/actor.model');
var _ = require('lodash');

var UserSchema = new Schema({
  email: {type: String, lowercase: true, required: true,
           unique: true, match: /.+\@.+\..+/},
  active: {type: Boolean, default: true},
  actorId: {type: mongoose.Schema.Types.ObjectId,
               ref: 'Actor'
              },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  provider: String,
  salt: String,
  facebook: {},
  facebookSignup: {type: Boolean},
  google: {},
  github: {},
  createdAt: {type: Date, default: Date.now()},
  updatedAt: {type: Date},
  lastLogin: {type: Date}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

//Password Confirmation
UserSchema
  .virtual('passwordConfirm')
  .get(function() {
    return this._passwordConfirm;
  })
  .set(function(value) {
    this._passwordConfirm = value;
  });  

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate password length and password confirmation must match

UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if(this._password){
      if(this._password.length < 8){
        this.invalidate('password', 'Password must be at least 8 characters.');
      }
    }
    if(this._password !== this._passwordConfirm) {
      this.invalidate('passwordConfirm', 'Passwords must match.');
    }
  });

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

UserSchema
  .pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

UserSchema
  .post('save', function(doc, next) {
    Actor.findOne(
      {ownedBy: doc._id},
      function (err, actor) {
        if (err) { return next(err); }
        if(!actor) { return next(err)}
        var updated = _.merge(actor, {lastLogin: doc.lastLogin});
        updated.save(function (err) {
          if (err) { return next(err); }
          return next();
        });
    });
});  

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
