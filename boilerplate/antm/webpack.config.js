'use strict';
// 得到 webpack
var webpack = require('atool-build/lib/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = function(webpackConfig) {

  // 开发环节添加source-map
  if (process.env.NODE_ENV === 'development') {
    webpackConfig.devtool = 'source-map';
  }

  Object.keys(webpackConfig.entry).forEach(function(entry) {
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      inject: false,
      minify:{ 
        collapseWhitespace: true
      },
      filename: entry + '.html',
      env: process.env.NODE_ENV,
      title: entry,
      entry: entry,
      template: path.join(__dirname, 'src/entry/index.ejs'),
    }));
  });

  webpackConfig.babel.plugins.push(['import', {
    style: true, // if true, use less
    libraryName:'antd-mobile'
  }]);

  // Production Environment, reference to an external resource of React / ReactDOM
  if (process.env.NODE_ENV === 'production') {
    webpackConfig.externals = {
      "react": "React",
      "react-dom": "ReactDOM"
    };
  }

  webpackConfig.plugins.some(function (plugin, i) {
    if (plugin instanceof webpack.optimize.CommonsChunkPlugin) {
      webpackConfig.plugins.splice(i, 1, new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        // minChunks: 2 如果对项目的common提取需要精确,可以控制设置这个值
      }));

      return true;
    }
  });

  // 返回 webpack 配置对象
  return webpackConfig;
};
