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
const ClosureCompilerPlugin      = require('webpack-closure-compiler');
// const ClosureCompiler            = require("google-closure-compiler-js");
// const ClosureCompilerPlugin      = ClosureCompiler.webpack
const ParallelUglifyPlugin       = require('webpack-parallel-uglify-plugin');
const glob                       = require('glob');
const PurifyCSSPlugin            = require('purifycss-webpack');
const publicPath                 = 'http://locahost:3001/';
const ExtractTextPlugin          = require("extract-text-webpack-plugin");
const autoprefixer               = require('autoprefixer');

const fs                         = require('fs');
const pkgPath                    = path.resolve(__dirname, 'package.json');
const pkg                        = fs.existsSync(pkgPath) ? require(pkgPath) : {};
const BrowserSyncPlugin          = require('browser-sync-webpack-plugin');

let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = pkg.theme;
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

module.exports = {
  cache: true,
  // ---------------------------------------------------------
  // 输出定义
  // ---------------------------------------------------------
  output: {
             filename: '[name]-[hash].js',
        chunkFilename: '[id].[chunkhash].chunk.js',
                 path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[name].[chunkhash].map',
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
      'moment'
    ],
    // antd: [
    //   'antd'
    // ],
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
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     { loader: 'css-loader', options: { modules: true, importLoaders: 1 } },
      //     { loader: 'postcss-loader' },
      //   ]
      // },
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
            loader: `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
          }]
        })
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
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     postcss: [
    //       autoprefixer()
    //     ]
    //    }
    // }),
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
    // 第三方插件
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
    // new ClosureCompilerPlugin({
    //   compiler: {
    //     language_in: 'ECMASCRIPT6',
    //     language_out: 'ECMASCRIPT5',
    //     compilation_level: 'SIMPLE'
    //   },
    //   concurrency: 2,
    // }),

    // 脚本加载属性
    // new ScriptExtHtmlWebpackPlugin({
    //   defaultAttribute: 'defer'
    // }),
    // new PurifyCSSPlugin({
    //    paths: glob.sync(path.join(__dirname, 'src/*.html')),
    // }),
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
  ],

  // ---------------------------------------------------------
  // 开发服务器配置
  // ---------------------------------------------------------
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
// function buildConfig(env) {
//   return require('./config/' + env + '.js')(env)
// }
// module.exports = buildConfig;
