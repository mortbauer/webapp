const path = require('path');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const development = require('./dev.config.js');
const production = require('./prod.config.js');

require('babel-polyfill').default;

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../dist'),
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: PATHS.app,

  resolve: {
    modules: [
      "node_modules",
      PATHS.app
    ],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".css"],
  },

  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },

  module: {
      rules: [
            {
              test: /bootstrap-sass\/assets\/javascripts\//,
              loader: 'imports-loader?jQuery=jquery',
            }, {
              test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff',
            }, {
              test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff2',
            }, {
              test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
            }, {
              test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-otf',
            }, {
              test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'file-loader',
            }, {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
            }, {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
            }, {
              test: /\.png$/,
              loader: 'file-loader?name=[name].[ext]',
            },{
              test: /\.jpg$/,
              loader: 'file-loader?name=[name].[ext]',
            },{
              test: /\.css$/,
              use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
            },
      ],
  },

};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(development, common);
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge(production, common);
}
