// next.config.js
const webpack = require("webpack");
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

require("dotenv").config();

module.exports = withImages(withCSS(
  {
    webpack: function (config) {

      config.node = {
        fs: 'empty'
      }
      /**
       * Returns environment variables as an object
       */
      const env = Object.keys(process.env).reduce((acc, curr) => {
               acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
               return acc;
     }, {});

      /** Allows you to create global constants which can be configured
      * at compile time, which in our case is our environment variables
      */
      config.plugins.push(new webpack.DefinePlugin(env));

      return config
    }
  }
))