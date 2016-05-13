var seeder 	= require('mongoose-seeder'),
    data 	= require('../db/seeds/data.json'),
    path    = require('path');
    
require(path.resolve('./app/models/user.js'));

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('db', 'Seed your mongodb database using mongoose-seeder', function () {

    var options = this.options();

    // Drop the entire database (default behaviour)
    seeder.seed(data, options).then(function (dbData) {
      // ...
      console.log(dbData);
    }).catch(function (err) {
      // handle error
      console.log(err);
    });

  });
};