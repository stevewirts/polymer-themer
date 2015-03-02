'use strict';

var files = {

    polymercss: [
        'theme.css'
    ],

};
var delimeter = (__dirname.indexOf('/') > -1) ? '/' : '\\';
var myDir = __dirname.split(delimeter);
myDir.pop();
var parentDir = myDir.join(delimeter);
var lr = require('connect-livereload')({
    port: 35729
});

module.exports = function(grunt) {
    //load all npm tasks automagically
    require('load-grunt-tasks')(grunt);

    var myConfig = {

        watch: {
            livereloadflag: {
                files: ['abc.html'],
                options: {
                    livereload: true
                },
            },
            livereload: {
                files: ['template.css', 'options.js', 'index.html'],
                tasks: ['buildtheme', 'http:livereload'],
            },
        },

        http: {
            livereload: {
              options: {
                url: 'http://localhost:35729/changed',
                qs: {
                    files: 'foobarbaz'
                }
              }
            }
        },

        express: {
          all: {
            options: {
              port: 9000,
              hostname: "0.0.0.0",
              bases: [parentDir + '\/'],
              middleware: [lr]
            }
          }
        },
        open: {
            index: {
                path: 'http://localhost:<%= express.all.options.port%>/polymer-themer/index.html'
            }

        },

    };

    grunt.initConfig(myConfig);

    grunt.registerTask('buildtheme', function(){
      var template = grunt.file.read('template.css');
      var options = grunt.file.readJSON('options.js');
      var result = grunt.template.process(template, {data: options});
      grunt.file.write('theme.css', result);
    });

    grunt.registerTask('serve', function() {
        return grunt.task.run([
            'buildtheme',
            'express',
            'open',
            'watch'
        ]);
    });

};
