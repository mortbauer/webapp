const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./common.config.js');

var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

process.env.BABEL_ENV = 'dev';

module.exports = webpackMerge(commonConfig,{
  devtool: 'eval-source-map',
  entry: {
    client: ['./src/index.js',hotMiddlewareScript],
  },
  output: {
    publicPath: '/dist/',
  },

  module: {
    rules: [{
      test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader?localIdentName=[path][name]--[local]',
            'sass-loader',
        ]
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        API_URL: '"/api"',
      },
      __DEVELOPMENT__: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
