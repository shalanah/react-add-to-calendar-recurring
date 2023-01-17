"use strict";

var _ = require("lodash");
var webpack = require("webpack");
var sass = require("node-sass");

var mergeWebpackConfig = function (config) {
  // Load webpackConfig only when using `grunt:webpack`
  // load of grunt tasks is faster
  var webpackConfig = require("./webpack.config");
  return _.merge({}, webpackConfig, config, function (a, b) {
    if (_.isArray(a)) {
      return a.concat(b);
    }
  });
};

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    sass: {
      dist: {
        files: {
          "dist/react-add-to-calendar-recurring.css":
            "src/styles/ReactAddToCalendar.scss",
        },
      },
      options: {
        implementation: sass,
        sourceMap: true,
      },
    },

    watch: {
      eslint: {
        files: ["{src,test,docs/src}/**/*.{js,jsx}", "*.js"],
        tasks: ["eslint"],
      },

      css: {
        files: "**/*.scss",
        tasks: ["sass"],
      },

      karma: {
        files: ["src/**/*.jsx", "src/**/*.js", "test/**/*.jsx", "test/**/*.js"],
        tasks: ["karma"],
      },

      webpack: {
        files: ["src/**/*.js", "src/**/*.jsx"],
        tasks: ["webpack"],
      },
    },

    karma: {
      unit: {
        configFile: "karma.conf.js",
        singleRun: true,
      },
    },

    eslint: {
      files: ["{src,test,docs/src}/**/*.{js,jsx}", "*.js"],
      options: {
        configFile: ".eslintrc",
      },
    },

    // standalone build for ./dist
    webpack: {
      unmin: mergeWebpackConfig({
        output: {
          filename: "react-add-to-calendar-recurring.js",
        },
      }),
      min: mergeWebpackConfig({
        output: {
          filename: "react-add-to-calendar-recurring.min.js",
        },
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compressor: {
              warnings: false,
            },
          }),
        ],
      }),
      docs: require("./webpack.docs.config"),
    },

    // source build for ./lib
    babel: {
      lib: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: ["**/*.js", "**/*.jsx"],
            dest: "lib/",
            ext: ".js",
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-eslint");

  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("travis", ["eslint", "karma"]);
  grunt.registerTask("build", ["babel", "webpack", "sass"]);
};
