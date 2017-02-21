const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./common.config.js');

module.exports = webpackMerge(commonConfig,{
  devtool: 'source-map',

  target: 'web',

  entry: [],

  output: {
    publicPath: 'dist/',
  },

  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader','css-loader','postcss-loader','sass-loader'],
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        API_URL: '"http://localhost:5000/api"',
      },
      __DEVELOPMENT__: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
});
