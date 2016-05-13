'use strict';

/**
 * Module dependencies.
 */
var path 	= require('path'),
	User 	= require('mongoose').model('User'),
	config 	= require('./config');

/**
 * Module init function.
 */
module.exports = function () {
	// Initialize strategies 
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
		require(path.resolve(strategy))();
	});
};
