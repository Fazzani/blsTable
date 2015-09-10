/// <binding ProjectOpened='jsonServer, webServer, watch:all' />
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                ' * blsComponents v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed under the <%= pkg.license %> license\n' +
                ' */\n',
        clean: ["wwwroot/dist/*", "wwwroot/temp/*", "dist/js/*", "dist/styles/*"],
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/blsGrid/bower_components",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        cssmin: {
            dev: {
                expand: true,
                cwd: 'wwwroot/Content/Styles',
                src: ['*.css'],
                dest: 'wwwroot/dist/styles',
                ext: '.min.css'
            },
            publish: {
                expand: true,
                cwd: 'wwwroot/Content/Styles',
                src: ['*.css'],
                dest: 'dist/styles'
            }
        },
        jshint: {
            files: ['wwwroot/temp/*.js'],
            options: {
                '-W069': false,
            }
        },
        concat: {
            all: {
                src: ["wwwroot/app/templates/*.js", 'wwwroot/app/Directives/*.js', "wwwroot/app/Services/*.js", "wwwroot/Content/js/*.js"],
                dest: 'wwwroot/temp/blsComponents.js'
            }
        },
        uglify: {
            all: {
                src: ['wwwroot/temp/blsComponents.js'],
                dest: 'wwwroot/dist/js/blsComponents.min.js'
            },
            publish: {
                src: ['wwwroot/temp/blsComponents.js'],
                dest: 'dist/js/blsComponents.min.js'
            }
        },
        watch: {
            all: {
                files: ["wwwroot/app/Directives/*.js", "wwwroot/app/Services/*.js", "wwwroot/app/templates/*.js", "wwwroot/Content/Styles/*.css"],
                tasks: ['publishDev'],
                options: {
                    livereload: true
                }
            }
        },
        shell: {
            express_server: {
                command: 'node wwwroot/Server.js'
            },
            json_server: {
                command: 'json-server --watch dbPersons.json'
            },
            bumpVersion: {
                command: 'npm version patch'
            }
        },
        aws: grunt.file.readJSON('grunt-aws.json'),
        s3: {
            options: {
                debug: false,
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                access: 'public-read',
                headers: {
                    // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
                    "Cache-Control": "max-age=630720000, public",
                    "Expires": new Date(Date.now() + 63072000000).toUTCString()
                }
            },
            dev: {
                options: {
                    bucket: '<%= aws.buckets.dev %>'
                },
                upload: [
                  {
                      src: 'wwwroot/dist/*.*',
                      dest: '/'
                  }
                ]
            },
            prod: {
                options: {
                    bucket: '<%= aws.buckets.prod %>'
                },
                upload: [
                  {
                      src: 'dist/**/*.*',
                      dest: '/'
                  }
                ]
            }
        },
        bump: {
            scripts: {
                files: ["wwwroot/dist/js/*.js", "wwwroot/dist/styles/*.css"],
                updateConfigs: ["pkg"],
                commitFiles: ["-a"],
                push: true,
                commit: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%'
            }
        },
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: false
                },
                files: {
                    src: ['dist/js/blsComponents.min.js','dist/js/blsComponents.js', 'dist/styles/styles.css']
                }
            }
        },
        copy: {
            main: {
                files: [{
                expand: true,
                cwd: 'wwwroot/temp/',
                src: ['**'],
                dest: 'wwwroot/dist/js/',
                }]
            },
        },
        removelogging: {
            dist: {
                src: "wwwroot/temp/blsComponents.js",
                dest: "wwwroot/temp/blsComponents-clean.js",
                options: {
                    namespace: ['console', 'window.console', '$log'],
                    methods:['debug']
                }
            }
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    //grunt.registerTask("default", ["bower:install"]);
    grunt.registerTask('jsonServer', ['shell:json_server']);
    grunt.registerTask('webServer', ['shell:express_server']);
    //grunt.registerTask('minCss', ['cssmin:dev']);
    //grunt.registerTask('deployDev', ['s3:dev']);
    //grunt.registerTask('deployProd', ['s3:prod']);
    grunt.registerTask('newVersionWithoutPublish', ['clean', 'concat', 'cssmin:publish', 'uglify:publish', 'copy:main', 'usebanner']);
    grunt.registerTask("default", ['clean', 'concat', 'cssmin:publish', 'uglify:publish', 'usebanner', 'bump']);
    grunt.registerTask("publishDev", ['clean', 'concat','cssmin:dev', 'uglify:all', 'copy:main', 'usebanner', 'jshint']);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.

    grunt.loadNpmTasks('grunt-shell'); 
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-remove-logging');

};