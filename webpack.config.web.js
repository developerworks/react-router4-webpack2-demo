// 2017.04.30 最新配置

// 系统模块
const os                         = require('os');
const fs                         = require('fs');
const glob                       = require('glob');
const path                       = require('path');
// 配置变量
const projectRoot                = path.resolve(__dirname, 'package.json');
// const publicPath                 = 'http://locahost:8080/';
const publicPath                 = '/';
const packageConfig              = fs.existsSync(projectRoot) ? require(projectRoot) : {};
const autoprefixer               = require('autoprefixer');
const HappyPack                  = require('happypack');
const happyThreadPool            = HappyPack.ThreadPool({ size: os.cpus().length });
// 插件
const webpack                    = require('webpack');
// const PreloadWebpackPlugin       = require('preload-webpack-plugin');
const ChunkManifestPlugin        = require("chunk-manifest-webpack-plugin");
const CopyWebpackPlugin          = require('copy-webpack-plugin');
const ExtractTextPlugin          = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin      = require('favicons-webpack-plugin');
const BrowserSyncPlugin          = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin          = require('html-webpack-plugin');
const AddAssetHtmlPlugin         = require('add-asset-html-webpack-plugin');
const ManifestPlugin             = require('webpack-manifest-plugin');
// const ParallelUglifyPlugin       = require('webpack-parallel-uglify-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const WriteFilePlugin            = require('write-file-webpack-plugin');
// const I18nPlugin                 = require("i18n-webpack-plugin");
const OfflinePlugin              = require('offline-plugin');
const QiniuPlugin                = require('qiniu-webpack-plugin');
const WebpackNotifierPlugin      = require('webpack-notifier');
// const WebpackGraphqlSchemaPlugin = require('webpack-plugin-graphql-schema-hot');


let theme = {};
if (packageConfig.theme && typeof(packageConfig.theme) === 'string') {
  let cfgPath = packageConfig.theme;
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (packageConfig.theme && typeof(packageConfig.theme) === 'object') {
  theme = packageConfig.theme;
}

let WebpackConfig = {
  cache: true,
// ---------------------------------------------------------
// 输出定义
// ---------------------------------------------------------
  // output: {
  //            filename: '[name]-[hash].js',
  //       chunkFilename: '[id].[chunkhash].chunk.js',
  //                path: path.resolve(__dirname, 'dist'),
  //   sourceMapFilename: '[name].[chunkhash].map',
  //          publicPath: publicPath
  // },
  output: {
             filename: '[name].js',
        chunkFilename: 'chunks/[id].chunk.js',
                 path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].map',
           publicPath: '/'
  },
// context: path.resolve(__dirname, 'src'),
// ---------------------------------------------------------
// 入口定义
// 对象语法: https://webpack.js.org/concepts/entry-points/#object-syntax
// ---------------------------------------------------------
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
    ],
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/index'
    ]
  },
// ---------------------------------------------------------
// 模块和加载器
// ---------------------------------------------------------
  module: {
    rules: [
// Javascript模块加载器
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
// CSS模块加载器, 提取到单独的文件中
// 把入口块中导入的所有CSS模块提取到单独的文件中, 样式表不再嵌入到
// JS模块中, 而在一个单独的CSS文件中. 如果样式表比较大, 把样式表分离
// 到单独的文件中是有好处的, 可以让JS和CSS并行下载.
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader?modules",
              options: {
                importLoaders: 1,
                sourceMap: true,
                minimize: false
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
              minimize: false
            }
          }, {
            loader: "postcss-loader"
          }, {
            loader: "sass-loader?modules"
          }]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                sourceMap: true,
                minimize: false
              }
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            },
            {
              // https://webpack.js.org/guides/migrating/#what-are-options-
              loader: "less-loader",
              options: {
                sourceMap: true,
                modifyVars: {
                  // 'primary-color': '#1DA57A',
                  // 'link-color': '#1DA57A',
                  'border-radius-base': '1px',
                  'border-radius-sm': '1px',
                  'line-height-base': '1.2',
                  'text-color': 'fade(#000, 80%)',
                  'font-size-base': '14px',

                }
              }
            },
          ]
        })
      },
      {
        test: /\.(png|jpg)$/,
        use: [{
          loader: "url-loader?limit=8192&name=images/[name].[ext]"
        }]
      },
      {
        test: /\.svg/,
        use: [{
          loader: "url-loader?limit=1000000"
        }]
      },

    ]
  },
// ---------------------------------------------------------
// Source Map
// ---------------------------------------------------------
// devtool: 'cheap-module-source-map',
// ---------------------------------------------------------
// 模块查找路径列表
// ---------------------------------------------------------
  resolve: {
    modules: [
      'node_modules',
      path.join(__dirname, 'src'),
    ]
  },
// ---------------------------------------------------------
// 插件
// ---------------------------------------------------------
  plugins: [
    // 内置插件
    new webpack.NamedModulesPlugin(),
// new webpack.optimize.UglifyJsPlugin({
//   beautify: false,
//   comments: false,
//   sourceMap: true,
//   compress: {
//     screw_ie8: true, // React doesn't support IE8
//     warnings: false,
//     drop_console: true,
//     collapse_vars: true,
//     reduce_vars: true,
//   },
//   mangle: {
//     screw_ie8: true
//   },
//   output: {
//     comments: false,
//     screw_ie8: true
//   }
// }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "app"],
      filename: '[name].js',
      minChunks: 2
    }),
// ---------------------------------------------
// 复制静态资源
// ---------------------------------------------

    new CopyWebpackPlugin([
      {from: './src/images',              to: 'images'},
    ], {
      copyUnmodified: true
    }),

// ---------------------------------------------
// 并行打包
// ---------------------------------------------

    new HappyPack({
      cache: true,
      threadPool: happyThreadPool,
      verbose: true,
      // cache: true,
      loaders: [
      {
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
      }],
      threads: 4
    }),

// -------------------------
// 把样式表提取到单独的文件中
// -------------------------

    new ExtractTextPlugin({
      // filename: '[id].[contenthash].chunk.css',
      filename: '[id].chunk.css',
      allChunks: true,
      disable: false
    }),
// -------------------------
// 处理HTML入口文件
// -------------------------

    new HtmlWebpackPlugin({
      title: '重庆龙猫信息技术有限公司「广告实时竞价管理系统」',
      inject: true,
      template: './src/index.html',
      filename: 'index.html',
      chunksSortMode: 'auto',
      favicon: './src/favicon.ico',
      minify: false,  // HTML压缩
      hash: false,    // 防缓存随机串
      xhtml: true,
      chunks: ['manifest', 'vendor', 'app'],
      cache: true,
      showErrors: true,
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./dist/vendor.9389d7ef810eeab740c3.dll.js')
    }),

// new ChunkManifestPlugin({
//   filename: "chunk-manifest.json",
//   manifestVariable: "webpackManifest"
// }),

// -------------------------
// 生成37种不同设备的Icon
// -------------------------

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
  // new webpack.ProgressPlugin(function(percentage, msg) {
  //   var stream = process.stderr;
  //   if (stream.isTTY && percentage < 0.71) {
  //     stream.cursorTo(0);
  //     stream.write('  ' + msg);
  //     stream.clearLine(1);
  //   } else if (percentage === 1) {
  //     console.log('');
  //     console.log('webpack: bundle build is now finished.');
  //   }
  // }),

  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./dist/vendor-manifest.dll.json')
  }),

// 脚本加载属性
// new ScriptExtHtmlWebpackPlugin({
//   defaultAttribute: 'defer'
// }),
// -------------------------
// 浏览器同步刷新: 开发环境
// -------------------------
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      // server: {
      //   baseDir: ['dist']
      // },
      proxy: 'http://localhost:8080/'
    }, {
        name: 'dev',
        reload: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new I18nPlugin(languageConfig, {
    //   functionName: '__',
    //   failOnMissing: false,
    //   hideMessage: false
    // })
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      basePath: '/dist/'
    }),
    new OfflinePlugin({
      main: [
        'vendor.*.dll.js',
      ],
    }),
    new WriteFilePlugin(),
    // new QiniuPlugin({
    //   ACCESS_KEY: '',
    //   SECRET_KEY: '',
    //   bucket: 'webpack-bucket-name',
    //   path: '[hash]'
    // }),
    new WebpackNotifierPlugin({
      title: 'Webpack构建通知',
      // contentImage: path.join(__dirname, 'logo.png'),
      excludeWarnings: true,
      alwaysNotify: true,
      skipFirstNotification: false,
    }),
  ],

  // ---------------------------------------------------------
  // 开发服务器配置
  // ---------------------------------------------------------
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: publicPath,
    inline: true
  }
};

module.exports = WebpackConfig;
