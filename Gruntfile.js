module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        paths: {
            src : {
                js : {
                    libs: ['libs/underscore.js', 'libs/backbone.js', 'libs/jquery-2.2.3.js', 'libs/bootstrap.js', 'libs/d3.js'],
                    app: 'app/js/*.js',
                    models: 'app/js/Models/*.js',
                    router: 'app/js/Router/*.js',
                    views: 'app/js/Views/*.js'
                },
                css : {}
            },
            dest : {
                js : 'build/main.js',
                jsmin : 'build/main.min.js',
                css : 'build/styles.css'
            }
        },

        concat: {
            build : {
                src: [ '<%= paths.src.js.libs %>', '<%= paths.src.js.models %>', '<%= paths.src.js.router %>', '<%= paths.src.js.views %>','<%= paths.src.js.app %>'],
                dest: '<%= paths.dest.js %>'
            }
        },

        uglify: {
            options: {
                separator: ';',
                compress: true,
                mangle: true,
                sourceMap: true
            },
            build: {
                src: '<%= paths.dest.js %>',
                dest: '<%= paths.dest.jsmin %>'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('concat-basic', ['concat']);
    grunt.registerTask('uglify-basic', ['uglify']);
    grunt.registerTask('build', ['concat', 'uglify']);

};