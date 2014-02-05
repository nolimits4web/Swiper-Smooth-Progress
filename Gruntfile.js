'use strict';

/*global require:true, module:false*/
module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var swiper = {
        filename: 'idangerous.swiper.progress'
    };

    // Project configuration.
    grunt.initConfig({
        swiper: swiper,
        // Metadata.
        pkg: grunt.file.readJSON('bower.json'),
        banner: '/*\n' +
        ' * Swiper Smooth Progress <%= pkg.version %>\n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright 2010-<%= grunt.template.today("yyyy") %>, <%= pkg.author %>\n' +
        ' * The iDangero.us\n' +
        ' * http://www.idangero.us/\n' +
        ' *\n' +
        ' * Licensed under <%= pkg.license.join(" & ") %>\n' +
        ' *\n' +
        ' * Released on: <%= grunt.template.today("mmmm d, yyyy") %>\n' +
        '*/\n',
        // Task configuration.
        clean: {
            dist: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            js: {
                src: ['lib/<%= swiper.filename %>.js'],
                dest: 'dist/<%= swiper.filename %>.js'
            },
            umd: {
                src: ['<%= umd.lib.dest %>'],
                dest: 'dist/<%= swiper.filename %>.amd.js'
            }
        },
        copy: {
            demos: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.js'],
                    dest: 'demos/js/'
                }]
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            lib: {
                src: ['dist/<%= swiper.filename %>.js'],
                dest: 'dist/<%= swiper.filename %>.min.js',
            },
            umd: {
                src: ['dist/<%= swiper.filename %>.amd.js'],
                dest: 'dist/<%= swiper.filename %>.amd.min.js',
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['Gruntfile.js']
            },
            lib: {
                src: ['lib/<%= swiper.filename %>.js']
            },
        },
        umd: {
            lib: {
                src: '<%= jshint.lib.src %>',
                dest: 'dist/<%= swiper.filename %>.umd.js',
                amdModuleId: '<%= pkg.name %>',
                objectToExport: 'Swiper',
                indent: '    ',
                deps: {
                    'default': ['swiper'],
                    'amd': ['swiper'],
                    'cjs': ['swiper'],
                    'global': ['Swiper']
                }
            }
        },
        wrap: {
            js: {
                src: ['<%= jshint.lib.src %>'],
                dest: 'dist/<%= swiper.filename %>.js',
                options: {
                    wrapper: [
                        '(function (Swiper) {\n',
                        '\n})(Swiper);'
                    ],
                    indent: '    '
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib']
            }
        }
    });

    // Default task.
    this.registerTask('default', ['jshint', 'build']);

    // Build a new version of the library
    this.registerTask('build', 'Builds a distributable version of <%= pkg.name %>', [
        'wrap:js',
        'concat:js'
    ]);

    this.registerTask('build-umd', 'Builds a umd compatible distributable version of <%= pkg.name %>', [
        'umd:lib',
        'concat:umd',
    ]);

    this.registerTask('dist', 'Build dist of <%= pkg.name %>', [
        'clean',
        'jshint:lib',
        'build',
        'build-umd',
        'uglify'
    ]);

    // Build demo
    this.registerTask('demo', 'Builds demo of <%= pkg.name %>', [
        'build',
        'copy:demos'
    ]);
};
