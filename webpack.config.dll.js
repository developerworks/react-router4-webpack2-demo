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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|dist|dist_electron|.cache|.happypack)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheIdentifier: 'v1',
            presets: [
              ['es2015', {modules: false}]
            ],
            plugins: [
              'syntax-dynamic-import',
              'transform-async-to-generator',
              'transform-regenerator',
              'transform-runtime'
            ]
          }
        }
      },
    ]
  }
};
