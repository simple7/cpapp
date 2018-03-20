var express = require("express");
var path = require('path');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackDevMiddleware = require('webpack-dev-middleware');
var proxy = require('http-proxy-middleware');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.dev");

var app = express();
var compiler = webpack(webpackConfig);
var open = require("open");

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    inline: true,
    progress: true,
    stats: {
      colors: true,
    }
}));

app.use(webpackHotMiddleware(webpack(webpackConfig)));

var buildPath = "./__build__";
app.use(express.static(path.resolve(__dirname,buildPath)));//设置静态文件目录

/* 代理服务器 */
app.use('*', proxy({
  target: "http://5.9188.com",
  changeOrigin: true
}));

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname,buildPath,'./index.html'));
});

//现在你只需要执行这一行代码，当你访问需要跨域的api资源时，就可以成功访问到了。
app.listen(3000, function () {
    console.log("Listening on port 3000!");
});


