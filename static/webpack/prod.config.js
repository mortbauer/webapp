const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
    //new ExtractTextPlugin('bundle.css'),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
