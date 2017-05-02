const webpack = require('webpack');
const path = require('path');

const vendors = [
  'antd',
  'isomorphic-fetch',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
];

module.exports = {
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]',
  },
  entry: {
    vendor: vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist", "[name]-manifest.dll.json"),
      context: __dirname,
      name: "[name]_[chunkhash]",
    })
  ],
};
