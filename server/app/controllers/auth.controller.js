'use strict';

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	mongoose 			= require('mongoose'),
	passport 			= require('passport'),
	jwt 					= require('jsonwebtoken'),
	config 				= require('../../config/config'),
	errorHandler 	= require('./errors.controller'),
	User 					= mongoose.model('User');
	

/**
 * Signup
 */
exports.signup = function (req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	// var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				success: false,
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			res.json({
				success: true,
				user: user,
				message: 'login using your email and password'
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			var auth_token = jwt.sign(user, config.secret, {
				expiresInMinutes: 1440 // expires in 24 hours
			});

			res.json({
				success: true,
				user: user,
				auth_token: auth_token
			});
		}
	})(req, res, next);
};
