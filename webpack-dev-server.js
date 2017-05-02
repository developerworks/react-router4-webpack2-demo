"use strict";

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config'); // haven't created this yet. No sweat.
const path = require('path');
const port = 8080;
// always dev enviroment when running webpack dev server
const env = { dev: process.env.NODE_ENV };
const devServerConfig = {
  contentBase: path.join(__dirname, './dist'),
  hot: true,
  stats: {
    colors: true
  }
  // Need historyApiFallback to be able to refresh on dynamic route
  historyApiFallback: { disableDotRule: true },
};
const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(compiler, devServerConfig);

server.listen(port, '192.168.0.126', function() {
  console.log(`Starting server on http://192.168.0.126:${port}``);
});
