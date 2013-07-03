module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! Grunt Processed [<%= grunt.task.current.filesSrc.join(",") %>] on <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
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
        banner: '/*! Minified [<%= grunt.task.current.filesSrc.join(",") %>] on <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
      },
      vendor: {
        src: "<%= vendor_src %>",
        dest: 'build/<%= vendor_dest_filename %>',
        nonull: true
      },
      app: {
        src: "<%= app_src %>",
        dest: 'build/<%= app_dest_filename %>',
        nonull: true
      }
    },
    jshint: {
      // jshint options http://www.jshint.com/docs/
      options: {
        "browser": true,
        "undef": true,
        "unused": true,
        "curly": true,
        "globals": {"Backbone": false, "google" : false, "ga": false, "_": false, "OverlappingMarkerSpiderfier" : false, "xola" : false},
        "eqeqeq": true,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "undef": true,
        "unused": true,
        "devel": true,
        "jquery": true
      },
      app: "<%= app_src %>"
    },

    scriptlinker: {
      vendor: {
        options: {
          startTag: "<!--VENDOR_SCRIPTS-->\n",
          endTag: "<!--VENDOR_SCRIPTS_END-->",
          fileTmpl: "<script src='%s'></script>\n",
        },
        files: {
          // Target-specific file lists and/or options go here.
          'sample.html': "build/<%= vendor_dest_filename %>"
        },
      },
      app: {
        options: {
          startTag: "<!--APP_SCRIPTS-->\n",
          endTag: "<!--APP_SCRIPTS_END-->",
          fileTmpl: "<script src='%s'></script>\n",
        },
        files: {
          // Target-specific file lists and/or options go here.
          'sample.html': "build/<%= app_dest_filename %>"
        },
      },
    },

    // Vendor Library Definitions
    vendor_src: ['js/lib/jquery*.js', 'js/lib/underscore*.js', 'js/lib/backbone*.js', 'js/lib/oms*', 'js/lib/jqueryui/jquery-ui-1.10.3.custom.min.js'],
    // Application Code
    app_src: ['js/app/models/*.js', 'js/app/collections/*', 'js/app/views/*.js', 'js/app/router.js', 'js/app/app.js'],
    // Destination filename for minified vendor library
    vendor_dest_filename: 'vendor<%= grunt.template.today("yyyymmdd") %>.min.js',
    // Destination filename for minified application code
    app_dest_filename: 'app<%= grunt.template.today("yyyymmdd") %>.min.js'
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify'); // will minify
  grunt.loadNpmTasks('grunt-contrib-jshint'); // will minify
  grunt.loadNpmTasks('grunt-scriptlinker');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'scriptlinker']);

};