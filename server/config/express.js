'use strict';

/**
 * Module dependencies.
 */
// =================================================================
// get the packages we need ========================================
// =================================================================
var fs 				= require('fs'),
	http 			= require('http'),
	https 			= require('https'),
	express 		= require('express'),
	morgan 			= require('morgan'),
	bodyParser 		= require('body-parser'),
	methodOverride 	= require('method-override'),
	helmet			= require('helmet'),
	config 			= require('./config'),
	path 			= require('path'),
	chalk 			= require('chalk');

module.exports = function (db) {
	// Initialize express app
	var app = express();
	
	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;

	// Enable logger (morgan)
	// use morgan to log requests to the console
	app.use(morgan('dev'));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {

	} else if (process.env.NODE_ENV === 'production') {

	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	
	// CORS middleware
	app.use(function (req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, accept', 'x-access-token');
		
		if (req.method == 'OPTIONS') {
    	res.send(200);
    } else {
    	next();
    }
	});
	
	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	app.set('secret', config.secret); // secret variable
	
	// Return Express server instance
	return app;
};
