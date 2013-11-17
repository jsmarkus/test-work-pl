module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
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
  grunt.registerTask('default', ['jsdoc']);
};