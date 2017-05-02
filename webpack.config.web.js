// 2017.04.30 最新配置

// 系统模块
const os                         = require('os');
const fs                         = require('fs');
const glob                       = require('glob');
const path                       = require('path');

// 配置变量
const projectRoot               = path.resolve(__dirname, 'package.json');
// const publicPath                 = 'http://locahost:8080/';
const publicPath                 = '/';
const packageConfig             = fs.existsSync(projectRoot) ? require(projectRoot) : {};


const autoprefixer               = require('autoprefixer');
const HappyPack                  = require('happypack');
const happyThreadPool            = HappyPack.ThreadPool({ size: os.cpus().length });

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
const ParallelUglifyPlugin       = require('webpack-parallel-uglify-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const WriteFilePlugin            = require('write-file-webpack-plugin');
// const I18nPlugin                 = require("i18n-webpack-plugin");



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
        chunkFilename: '[id].chunk.js',
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
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory : true,
//             presets: [
//               ['es2015', {modules: false}]
//             ],
// // ES7
//             plugins: [
// // 模块动态导入
//               'syntax-dynamic-import',
//               'transform-async-to-generator',
//               'transform-regenerator',
// // 运行时转换
//               'transform-runtime'
//             ]
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
// 解析
// ---------------------------------------------------------
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules']
  },
// ---------------------------------------------------------
// 插件
// ---------------------------------------------------------
  plugins: [
    // 内置插件
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
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      filename: '[name].js',
      minChunks: 2
    }),
// ---------------------------------------------
// 复制静态资源
// ---------------------------------------------

    // new CopyWebpackPlugin([
    //   {from: './src/images',              to: 'images'},
    // ], {
    //   copyUnmodified: true
    // }),

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
          presets: [[ 'es2015', { modules: false }], 'react' ],
          plugins: [
            ['transform-runtime', {
              polyfill: false,
              regenerator: false
            }],
          ]
        }
      }],
      threads: 4
    }),

// -------------------------
// 把样式表提取到单独的文件中
// -------------------------

    new ExtractTextPlugin({
      filename: '[id].[contenthash].chunk.css',
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
      chunksSortMode: 'dependency',
      favicon: './src/favicon.ico',
      minify: false,
      hash: true,
      xhtml: true,
      chunks: ['manifest', 'vendor', 'app']
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

// -------------------------
//
// -------------------------

  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./manifest.json')
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
    new WriteFilePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new I18nPlugin(languageConfig, {
    //   functionName: '__',
    //   failOnMissing: false,
    //   hideMessage: false
    // })
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
