module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! Grunt Processed <%= grunt.task.current.filesSrc.join(";") %> on <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      },
      vendor: {
        src: "<%= vendor_src %>",
        dest: 'build/vendor.js',
        nonull: true
      },
      app: {
        src: "<%= app_src %>",
        dest: 'build/app.js',
        nonull: true
      },
    },
    uglify: {
      options: {
        banner: '/*! Minified <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      vendor: {
        src: 'build/vendor*.js',
        dest: 'build/vendor<%= grunt.template.today("yyyymmdd") %>.min.js'
      },
      app: {
        src: 'build/app*.js',
        dest: 'build/app<%= grunt.template.today("yyyymmdd") %>.min.js'
      }
    },

    // Properties
    vendor_src: ['js/lib/jquery*.js', 'js/lib/underscore*.js', 'js/lib/backbone*.js', 'js/lib/oms*', 'js/lib/jqueryui/jquery-ui-1.10.3.custom.min.js'],
    app_src: ['js/app/models/*.js', 'js/app/collections/*', 'js/app/views/*.js', 'js/app/router.js', 'js/app/app.js']
  });

  // A very basic default task.
  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify'); // will minify

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};