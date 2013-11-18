/*global module*/

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'TabsView.min.js': 'TabsView.js'
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['TabsView.js'],
        options: {
          destination: 'docs'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify:dist', 'jsdoc:dist']);
};