'use strict';

var config 		= require('./config/config');

module.exports = function (grunt) {

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		run: {
			server: {
				args: ['.node_modules/mongo-express/app.js'],
				options: {
					// passArgs: [
					// 	'port'
					// ]
				}
			}
		},
		db: {
			options: {
				db: {
					uri: config.db.uri,
					options: config.db.options
				}
			},
			seed: {
				
			}
		}
	});
	
	// Load the plugin that provides the "uglify" task.
  	// grunt.loadNpmTasks('grunt-mongoose-seeder');
	grunt.loadNpmTasks('grunt-run');
	  
	// Default task(s).
  	grunt.registerTask('default', []);
	
	// Seed task(s)
	// grunt.registerTask('db:seed', []);
	
	// Load local grunt tasks
	grunt.loadTasks('tasks');
		
};