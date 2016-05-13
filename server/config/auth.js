'use strict';

/**
 * Module dependencies.
 */
var jwt    	= require('jsonwebtoken'),
	config 	= require('./config');
	
// ---------------------------------------------------------
// authentication middleware -------------------------------
// ---------------------------------------------------------
module.exports = function (apiRoutes) {
	var users = require('../app/controllers/auth.controller');
	// Auth Routes
	apiRoutes.post('/signup', users.signup);
	apiRoutes.post('/authenticate', users.signin);
	
	// ---------------------------------------------------------
	// route middleware to authenticate and check token
	// ---------------------------------------------------------
	apiRoutes.use(function (req, res, next) {
	
		// check header or url parameters or post parameters for token
		var token = req.body.auth_token || req.param('auth_token') || req.param('id_token') || req.headers['x-access-token'] || (req.headers['Authorization'] && req.headers['Authorization'].split(' ')[0]);
	
		// decode token
		if (token) {
	
			// verifies secret and checks exp
			jwt.verify(token, config.secret, function (err, decoded) {
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});

		} else {
	
			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}

	});

	apiRoutes.get('/check', function (req, res) {
		res.json(req.decoded);
	});

	return apiRoutes;
};
