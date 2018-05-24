module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      openui5_preload: {
        component: {
          options: {
            resources: {
              cwd: '',
              prefix: '',
              src: [
                '!web/ui5/**/*.js',
                '!web/sapui5/**/*.js',
                '!node_modules/**/*.js',
                'web/**/*.js',
                'web/**/*.fragment.html',
                'web/**/*.fragment.json',
                'web/**/*.fragment.xml',
                'web/**/*.view.html',
                'web/**/*.view.json',
                'web/**/*.view.xml',
                'web/**/*.properties'
              ]
            },
            dest: '',
            compress: true
          },
          components: true
        }
      }
    });
  
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', [
        "openui5_preload"
    ]);
  }