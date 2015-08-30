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
        }
    });
    grunt.loadNpmTasks("grunt-contrib-clean");
    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks("grunt-bower-task");
};