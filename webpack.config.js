// 2017.04.30 最新配置

// 系统模块
const os                         = require('os');
const fs                         = require('fs');
const glob                       = require('glob');
const path                       = require('path');

// 配置变量
const projectRoot               = path.resolve(__dirname, 'package.json');
const publicPath                 = 'http://locahost:3001/';
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

const HtmlWebpackPlugin          = require('html-webpack-plugin');
const ManifestPlugin             = require('webpack-manifest-plugin');
const ParallelUglifyPlugin       = require('webpack-parallel-uglify-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');




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
  output: {
             filename: '[name]-[hash].js',
        chunkFilename: '[id].[chunkhash].chunk.js',
                 path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].[chunkhash].map',
           publicPath: publicPath
  },
// context: path.resolve(__dirname, 'src'),
  target: 'electron-renderer',
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
    'app': [
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
          use: [{
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true,
              minimize: false
            }
          }, {
            loader: "postcss-loader"
          }, {
            loader: "less-loader",
            options: {
              sourceMap: true,
              modifyViars: JSON.stringify(theme)
            }
          }]
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
// new webpack.DefinePlugin({
//   'process.env.NODE_ENV': JSON.stringify('production'),
//   'process.env.HAPPY_CACHE': true
// }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      filename: '[name].[hash].js',
      minChunks: 2
    }),
// new webpack.optimize.CommonsChunkPlugin({
//   name: 'vendor',
//   filename: '[name].[hash].js',
//   minChunks: function (module) {
//     // 该配置假定你引入的 vendor 存在于 node_modules 目录中
//     return module.context && module.context.indexOf('node_modules') !== -1;
//   }
// }),
// new ManifestPlugin({
//   fileName: 'manifest.json'
// }),
// new ParallelUglifyPlugin({
//   cacheDir: '.cache/',
//     uglifyJS:{
//     output: {
//       comments: false
//     },
//     compress: {
//       warnings: false
//     }
//   }
// }),

// ---------------------------------------------
// 复制静态资源
// ---------------------------------------------

    new CopyWebpackPlugin([
      {from: './src/images', to: 'images' }
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
      title: 'Webpack2 入门指南',
      inject: 'body',
      template: './src/index.html',
      chunksSortMode: 'dependency',
      favicon: './src/favicon.ico',
      minify: false,
      hash: true,
      xhtml: true
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

// new webpack.DllPlugin({
//   path: path.join(__dirname, "js", "[name]-manifest.json"),
//   name: "[name]_[hash]"
// })


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
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: publicPath
  }
};

// -------------------------
// 浏览器同步刷新: 开发环境
// -------------------------
if (process.env.NODE_ENV === 'development') {
  const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
  let plugin = new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    // server: {
    //   baseDir: ['dist']
    // },
    proxy: 'http://localhost:8080/'
  }, {
      name: 'dev',
      reload: false
  });
  WebpackConfig.plugins.push(plugin);
}

module.exports = WebpackConfig;
