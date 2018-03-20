var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.config.base');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

var Html_path = path.resolve(__dirname, 'src/index.html');
var Build_path = path.resolve(__dirname, '__build__/static');

/* ngnix映射目录 */

// const publicPath = 'http://10.0.30.152:8888/static/';
const publicPath = 'http://10.0.30.18:8888/static/';
// const publicPath = 'https://t2015.9188.com/lotteryNew/static/';

module.exports = merge(baseWebpackConfig, {
  devtool: 'source-map',
  output: {
    path: Build_path,
    filename: '[name].[hash:8].js',
    publicPath: publicPath,
    chunkFilename: './[chunkhash:8].chunk.js'
  }
});
