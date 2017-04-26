const path                       = require('path');
const webpack                    = require('webpack');
const HtmlWebpackPlugin          = require('html-webpack-plugin');
const FaviconsWebpackPlugin      = require('favicons-webpack-plugin');
const HappyPack                  = require('happypack');
const os                         = require('os');
const happyThreadPool            = HappyPack.ThreadPool({ size: os.cpus().length });
const ManifestPlugin             = require('webpack-manifest-plugin');
const ChunkManifestPlugin        = require("chunk-manifest-webpack-plugin");
// const PreloadWebpackPlugin       = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const publicPath                 = 'http://locahost:3001/';



module.exports = {
  cache: true,
  // ---------------------------------------------------------
  // 输出定义
  // ---------------------------------------------------------
  output: {
    // library: "[name]_[hash]"
    // publicPath: publicPath,
             filename: '[name]-[hash].js',
        chunkFilename: '[id].[chunkhash].chunk.js',
        // chunkFilename: '[name]-[id].js',
                 path: path.resolve(__dirname, '../dist'),
    sourceMapFilename: '[name].[chunkhash].map',
           // publicPath: 'http://127.0.0.1:3001/'
  },
  // context: path.resolve(__dirname, 'src'),
  // ---------------------------------------------------------
  // 入口定义
  // 对象语法: https://webpack.js.org/concepts/entry-points/#object-syntax
  // ---------------------------------------------------------
  entry: {
    'app': [
      'babel-polyfill',
      './src/index'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'moment'
    ],
    antd: [
      'antd/lib/button',
      'antd/lib/table',
      'antd/lib/modal',
      'antd/lib/message',
      'antd/lib/form',
      'antd/lib/menu',
      'antd/lib/row',
      'antd/lib/col',
      'antd/lib/tooltip',
      'antd/lib/radio',
      'antd/lib/date-picker',
      'antd/lib/time-picker',
      'antd/lib/input',
      'antd/lib/input-number',
      'antd/lib/notification',
      'antd/lib/pagination',
      'antd/lib/select',
      'antd/lib/tag',
    ]
  },
  // ---------------------------------------------------------
  // 模块和加载器
  // ---------------------------------------------------------
  module: {
    rules: [
      // 模块加载器
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory : true,
            presets: [
              ['es2015', {modules: false}]
            ],
            // ES7
            plugins: [
              // 模块动态导入
              'syntax-dynamic-import',
              'transform-async-to-generator',
              'transform-regenerator',
              // 运行时转换
              'transform-runtime'
            ]
          }
        }
      },
      {
        test:/\.(png|jpg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },
      {
        test:/\.svg(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },
      {
        test:/\.woff(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            prefix: 'fonts/&name=[path][name].[ext]',
            limit:10000,
            mimetype:'application/font-woff'
          }
        }
      },
      {
        test:/\.woff2(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            prefix: 'fonts/&name=[path][name].[ext]',
            limit:10000,
            mimetype:'application/font-woff2'
          }
        },
      },
      {
        test:/\.otf(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            prefix: 'fonts/&name=[path][name].[ext]',
            limit:10000,
            mimetype:'mimetype=font/opentype'
          }
        }
      },
      {
        test:/\.ttf(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            prefix: 'fonts/&name=[path][name].[ext]',
            limit:10000,
            mimetype:'application/octet-stream'
          }
        }
      },
      {
        test:/\.eot(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            prefix: 'fonts/&name=[path][name].[ext]',
          }
        }
      }

    ]
  },
  // ---------------------------------------------------------
  // Source Map
  // ---------------------------------------------------------
  // devtool: 'cheap-module-source-map',
  // ---------------------------------------------------------
  // 解析
  // ---------------------------------------------------------
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules']
  },
  // ---------------------------------------------------------
  // 插件
  // ---------------------------------------------------------
  plugins: [
    // 内置插件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     screw_ie8: true, // React doesn't support IE8
    //     warnings: false
    //   },
    //   mangle: {
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false,
    //     screw_ie8: true
    //   }
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.HAPPY_CACHE': true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      // filename: '[name].[hash].js',
      minChunks: 2
    }),
    // new ManifestPlugin({
    //   fileName: 'manifest.json'
    // }),

    // 第三方插件
    new HappyPack({
      cache: true,
      threadPool: happyThreadPool,
      verbose: true,
      // cache: true,
      loaders: [
      {
        loader: 'babel-loader',
        options: {
          presets: [[ 'es2015', { modules: false }], 'react' ],
          plugins: [
            ['transform-runtime', {
              polyfill: false,
              regenerator: false
            }],
          ]
        }
      }],
      threads: 8
    }),
    // new ChunkManifestPlugin({
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),
    // 生成37种不同设备的Icon
    // new FaviconsWebpackPlugin({
    //   logo: './src/logo.png',
    //   prefix: 'icons-[hash]/',
    //   emitStats: false,
    //   statsFilename: 'iconstats-[hash].json',
    //   persistentCache: true,
    //   inject: true,
    //   background: '#fff',
    //   title: 'Webpack2 入门指南',
    //   icons: {
    //     android: true,
    //     appleIcon: true,
    //     appleStartup: true,
    //     coast: false,
    //     favicons: true,
    //     firefox: true,
    //     opengraph: false,
    //     twitter: false,
    //     yandex: false,
    //     windows: false
    //   }
    // }),
    // new webpack.DllPlugin({
    //   path: path.join(__dirname, "js", "[name]-manifest.json"),
    //   name: "[name]_[hash]"
    // })
    new HtmlWebpackPlugin({
      title: 'Webpack2 入门指南',
      inject: 'body',
      template: 'src/index.html',
      chunksSortMode: 'dependency',
      favicon: './src/favicon.ico',
      minify: false,
      hash: true,
      xhtml: true
    }),
    // 脚本加载属性
    // new ScriptExtHtmlWebpackPlugin({
    //   defaultAttribute: 'defer'
    // }),
  ],
  // ---------------------------------------------------------
  // 开发服务器配置
  // ---------------------------------------------------------
  devServer: {
    hot: true,
    port: 3001,
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, '../dist'),
    // historyApiFallback: true,
    noInfo: false,
    // stats: 'minimal',
    publicPath: publicPath
  }
};
// function buildConfig(env) {
//   return require('./config/' + env + '.js')(env)
// }
// module.exports = buildConfig;
