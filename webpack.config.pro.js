var path = require('path');
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.config.base')

var Build_path = path.resolve(__dirname, 'prod/static');
const publicPath = 'https://5.9188.com/new/static/';
// const publicPath = 'https://t2015.9188.com/lotteryNew/static/';
module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-module-source-map',
  output: {
    path: Build_path,
    filename: '[name].[hash:8].js',
    publicPath: publicPath,
    chunkFilename: './[chunkhash:8].chunk.js'
  }
});
