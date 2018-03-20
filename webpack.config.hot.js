var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

var Build_path = path.resolve(__dirname, '__build__/static');
var Html_path = path.resolve(__dirname, 'src/index.html');
const Root_Path = path.resolve(__dirname);
const App_Path = path.resolve(Root_Path, './src');
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
  path.resolve(__dirname, 'src/Img'),  // 2. 自己私人的 svg 存放目录
];

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ["babel-polyfill", './src/index.js'],
  },
  output: {
    path: Build_path,
    filename: 'bundle.js',
    publicPath: '/',
    chunkFilename: './[chunkhash:8].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {modules: false}]]
          }
        },
        exclude: /^node_modules$/,
        include: [App_Path]
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader','less-loader']
        }),
        /*exclude: /^node_modules$/*/
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
          publicPath: './'
        }),
        exclude: /^node_modules$/
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[hash:8].[name].[ext]'
        },
        //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
        exclude: /^node_modules$/,
        include: [App_Path]
      }, {
        test: /\.(svg)$/i,
        use: ['svg-sprite-loader'],
        include: svgDirs, // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
      }, {
        test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
        use: ['url-loader'],
      }, {
        test: /\.html$/,
        use: [
          'html-loader',
        ],
      }, {
        test: /\.json$/,
        use: ['json-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    inline: true,
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*', // 5
    },
    proxy: {
      '*': {
        changeOrigin: true,
        target: 'https://5.9188.com'
      }
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js'}),
    new HtmlWebpackPlugin({
      template: Html_path,
      hash: false
    }),
    new ExtractTextPlugin({filename: './[name].css', allChunks: true}),
    new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/)

  ],
  resolve: {
    mainFiles: ["index.web", "index"],// 这里哦
    modules: ['app', 'node_modules', path.join(__dirname, '../node_modules')],
    extensions: [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx',
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ]
  }
}
