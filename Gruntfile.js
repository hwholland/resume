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
              '!web/ui5/**',
              '!node_modules/**',
              'web/nav/json/timeline.json',
              'web/nav/Component.js',
              'web/nav/index.html',
              'web/nav/manifest.json',
              'web/nav/view/App.view.xml',
              'web/nav/controller/App.controller.js',
              'web/nav/view/block/entreprenuer.js',
              'web/nav/view/block/entreprenuer.view.xml',
              'web/nav/i18n/*'
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