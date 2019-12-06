const merge = require("webpack-merge");
const path = require("path");
const baseConfig = require("./webpack.base.config.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

// 去掉css loader规则
baseConfig.module.rules.pop();

module.exports = merge(baseConfig, {
  entry: "./src/entry-runner.js",
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "manifest",
          minChunks: Infinity
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader",
          fallback: "vue-style-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].[chunkhash].css",
      allChunks: true
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
});
