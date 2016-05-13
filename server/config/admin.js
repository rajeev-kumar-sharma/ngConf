'use strict';

// =================================================================
// get the packages we need (the sub app) ==========================
// =================================================================
var fs 				= require('fs'),
	http 			= require('http'),
	https 			= require('https'),
	express 		= require('express'),
	morgan 			= require('morgan'),
	bodyParser 		= require('body-parser'),
	methodOverride 	= require('method-override'),
	config 			= require('./config'),
	path 			= require('path'),
	chalk 			= require('chalk');

module.exports = function () {
	// Initialize express app
	var admin = express();
	
	// Globbing model files
	config.getGlobbedFiles('./admin/models/**/*.js').forEach(function (modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	admin.locals.title = config.app.title;
	admin.locals.description = config.app.description;
	admin.locals.keywords = config.app.keywords;

	// Enable logger (morgan)
	// use morgan to log requests to the console
	admin.use(morgan('dev'));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {

	} else if (process.env.NODE_ENV === 'production') {

	}

	// Request body parsing middleware should be above methodOverride
	admin.use(bodyParser.urlencoded({
		extended: true
	}));
	admin.use(bodyParser.json());
	admin.use(methodOverride());

	admin.set('secret', config.secret); // secret variable
	
	// Return Express server instance
	return admin;
};
