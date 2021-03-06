/// <binding ProjectOpened='jsonServer, webServer, watch:all' />
module.exports = function (grunt) {
    'use strict';

    var generatedDocsPath = 'wwwroot/docs/',
        
        _root='wwwroot';

    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                ' * blsComponents v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed under the <%= pkg.license %> license\n' +
                ' */\n',
        watch: {
            all: {
                files: ["wwwroot/app/Directives/*.js", "wwwroot/app/Services/*.js", "wwwroot/app/templates/*.js", "wwwroot/Content/Styles/*.css"],
                tasks: ['publishDev'],
                options: {
                    livereload: true
                }
            }
        },
        clean: ["wwwroot/dist/*", "wwwroot/dist/js/*", "wwwroot/dist/styles/*", "dist/js/*", "dist/styles/*"],
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
            files: ['wwwroot/dist/js/*.js'],
            options: {
                '-W069': false,
            }
        },
        concat: {
            options: {
                sourceMap: true
            },
            all: {
                src: ["wwwroot/app/templates/*.js", 'wwwroot/app/Directives/*.js', "wwwroot/app/Services/*.js", "wwwroot/Content/js/*.js"],
                dest: 'wwwroot/dist/js/blsComponents.js'
            }
        },
        uglify: {
            all: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: 'wwwroot/dist/js/blsComponents.js.map',
                    banner: '<%= banner %>'
                },
                files: {
                    'wwwroot/dist/js/blsComponents.min.js': '<%= concat.all.dest %>',
                }
            },
            publish: {
                src: ['wwwroot/temp/blsComponents.js'],
                dest: 'dist/js/blsComponents.min.js'
            }
        },
        shell: {
            express_server: {
                command: 'node wwwroot/app.js'
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
        }, copy: {
            css: {
                files: [
                  // includes files within path
                  { expand: true, src: ['wwwroot/Content/Styles/*'], flatten: true, dest: 'wwwroot/dist/Styles/', filter: 'isFile' },
                ],
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
        },
        ngdocs: {
            all: { src: ['wwwroot/app/Services/*.js', 'wwwroot/app/Directives/*.js'] },
            options: {
                dest: generatedDocsPath,
                //scripts: ['../app.min.js'],
                html5Mode: true,
                startPage: '/api',
                title: "BLS Components",
                //image: "path/to/my/image.png",
                //imageLink: "http://my-domain.com",
                //titleLink: "/api",
                //inlinePartials: true,
                //bestMatch: true,
            },
            //tutorial: {
            //    src: ['wwwroot/app/Directives/*.js'],
            //    title: 'Tutorial'
            //},
            //api: {
            //    src: ['wwwroot/app/**/*.js'],
            //    title: 'API Documentation'
            //}
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    //grunt.registerTask("default", ["bower:install"]);
    grunt.registerTask('jsonServer', ['shell:json_server']);
    grunt.registerTask('webServer', ['shell:express_server']);
    //grunt.registerTask('minCss', ['cssmin:dev']);
    //grunt.registerTask('deployDev', ['s3:dev']);
    //grunt.registerTask('deployProd', ['s3:prod']);
    grunt.registerTask('newVersionWithoutPublish', ['clean', 'concat', 'cssmin:publish', 'uglify:publish']);
    grunt.registerTask("default", ['clean', 'concat', 'cssmin:publish', 'uglify:publish', 'bump']);
    grunt.registerTask("publishDev", ['clean', 'concat', 'cssmin:dev', 'uglify:all', 'copy:css']);
    grunt.registerTask("publish_new_version_nuget", ['clean', 'concat', 'cssmin:dev', 'uglify:all', 'copy:css', 'bump', 'nuget_pack', 'nuget_publish']);
    grunt.registerTask("publish_new_version_nuget_VSTS", ['clean', 'concat', 'cssmin:dev', 'uglify:all', 'copy:css', 'nuget_pack', 'nuget_publish_VSTS']);
    grunt.registerTask("nuget_pack", "Create a nuget package", function () {
        //we're running asynchronously so we need to grab
        //a callback
        var done = this.async();

        //invoke nuget.exe
        grunt.util.spawn({
            cmd: "nuget.exe",
            args: [
                //specify the .nuspec file
                "pack",
                "Package.nuspec",

                //specify where we want the package to be created
                "-OutputDirectory",
                "dist",

                //override the version with whatever is currently defined
                //in package.json
                "-Version",
                grunt.file.readJSON('package.json').version
            ]
        }, function (error, result) {
            //output either result text or error message...
            if (error) {
                grunt.log.error(error);
            } else {
                grunt.log.write(result);
            }
            //...and notify grunt that the async task has
            //finished
            done();
        });
    });
    //"C:\Nuget\nuget.exe" push "$(TargetDir)BLS.Infrastructure.@(VersionNumber).nupkg" 440bc87f-c8b3-4410-b57b-192c649bcadd -src https://www.nuget.org
    grunt.registerTask("nuget_publish", "publish a nuget package", function () {
        //we're running asynchronously so we need to grab
        //a callback
        var done = this.async();

        //invoke nuget.exe
        //"C:\Nuget\nuget.exe" push "$(TargetDir)BLS.Infrastructure.@(VersionNumber).nupkg" 440bc87f-c8b3-4410-b57b-192c649bcadd -src https://www.nuget.org
        grunt.util.spawn({
            cmd: "nuget.exe",
            args: [
                //specify the .nuspec file
                "push",
                "dist/blsComponents." + grunt.file.readJSON('package.json').version + ".nupkg",
                "440bc87f-c8b3-4410-b57b-192c649bcadd",

                //specify where we want the package to be created
                "-src",
                "https://www.nuget.org"
            ]
        }, function (error, result) {
            //output either result text or error message...
            if (error) {
                grunt.log.error(error);
            } else {
                grunt.log.write(result);
            }
            //...and notify grunt that the async task has
            //finished
            done();
        });
    });

    //nuget.exe sources Add -Name "BlsComponent" -Source https://businessline.pkgs.visualstudio.com/_packaging/BlsComponent/nuget/v3/index.json
    //Publish to feed VSTS
    grunt.registerTask("nuget_publish_VSTS", "publish a nuget package to VSTS Feed", function () {
        //we're running asynchronously so we need to grab
        //a callback
        var done = this.async();

        //invoke nuget.exe
        //nuget.exe push yourpackage.nupkg -Source https://businessline.pkgs.visualstudio.com/_packaging/BlsComponent/nuget/v3/index.json -ApiKey VSTS
        //"C:\Nuget\nuget.exe" push "$(TargetDir)BLS.Infrastructure.@(VersionNumber).nupkg" 440bc87f-c8b3-4410-b57b-192c649bcadd -src https://www.nuget.org
        grunt.util.spawn({
            cmd: "NuGet.exe",
            args: [
                //specify the .nuspec file
                "push",
                "dist/blsComponents." + grunt.file.readJSON('package.json').version + ".nupkg",
                "rhczwfm3qjrhvftcmsqs5ebydvvsk2m3u5fntiv37fyipm57blcq",
                //specify where we want the package to be created
                "-src",
                "https://businessline.pkgs.visualstudio.com/_packaging/BlsComponent/nuget/v3/index.json"
            ]
        }, function (error, result) {
            //output either result text or error message...
            if (error) {
                grunt.log.error(error);
            } else {
                grunt.log.write(result);
            }
            //...and notify grunt that the async task has
            //finished
            done();
        });
    });

    //ngdocs 
    grunt.registerTask('docs', ['ngdocs']);

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
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Load the plugin that provides the "docular" tasks.
    grunt.loadNpmTasks('grunt-ngdocs');
};