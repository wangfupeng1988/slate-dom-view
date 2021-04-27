const webpack = require('webpack')
const { merge } = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')
const { distPath } = require('./paths.js')

module.exports = merge(webpackCommonConf, {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify('development')
        })
    ],
    devServer: {
        port: 3000,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        // open: true,  // 自动打开浏览器
        compress: true  // 启动 gzip 压缩
    },
    devtool: 'eval-cheap-source-map'
})
