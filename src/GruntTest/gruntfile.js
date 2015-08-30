/// <binding ProjectOpened='watch:tasks, jsonServer, webServer' />
module.exports = function (grunt) {
    grunt.initConfig({
        clean: ["wwwroot/lib/*", "temp/"],
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/blsGrid/bower_components",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        jshint: {
            files: ['temp/*.js'],
            options: {
                '-W069': false,
            }
        },
        concat: {
            all: {
                src: ['wwwroot/app/Directives/*.js'],
                dest: 'temp/combined.js'
            }
        },
        uglify: {
            all: {
                src: ['temp/combined.js'],
                dest: 'wwwroot/lib/combined.min.js'
            }
        },
        watch: {
            files: ["wwwroot/app/Directives/*.js"],
            tasks: ["dist"]
        },
        shell: {
            express_server: {
                command: 'node wwwroot/Server.js'
            },
            json_server: {
                command: 'json-server --watch dbPersons.json'
            }
        }
    });
   
    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);
    grunt.registerTask("dist", ['clean', 'concat', 'jshint', 'uglify']);
    grunt.registerTask('jsonServer', ['shell:json_server']);
    grunt.registerTask('webServer', ['shell:express_server']);
    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks('grunt-contrib-watch');
   
};