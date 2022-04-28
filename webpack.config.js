const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const _ESLintPlugin = require('eslint-webpack-plugin');
const SaveRemoteFilePlugin = require('./src/plugins/SaveRemoteFile');

const $ = require("jquery");

module.exports = {
  entry: path.join(__dirname, "src", "view", "index.js"),
  output: {
    filename: "[name].[hash].js",
    path: path.join(__dirname, "www"),
    clean: true,
  },
  resolve: {
    alias: {
      Api: path.resolve(__dirname,"src","view","api"),
      BlocklyPath: path.resolve(__dirname,"src","bot","blockly"),
      Bot: path.resolve(__dirname,"src","bot"),
      Common: path.resolve(__dirname,"src", "common"),
      Components: path.resolve(__dirname,"src","view","components"),
      Observer: path.resolve(__dirname,"src","common","utils","observer.js"),
      Shared: path.resolve(__dirname,"src","shared"),
      Static: path.resolve(__dirname,'static'),
      StorageManager: path.resolve(__dirname,"src","common","utils","storageManager.js"),
      Store:path.resolve(__dirname,"src","view","store"),
      Styles: path.resolve(__dirname, "src/view/styles"),
      Tools: path.resolve(__dirname,"src","common","utils","tools.js"),
      Translate: path.resolve(__dirname,"src","common","utils","translate"),
    },
    fallback: {
      https: require.resolve("https-browserify"),
      http: require.resolve("https-browserify"),
      zlib: require.resolve("browserify-zlib"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve('stream-browserify'),
      util: require.resolve("util/"),
      asert: require.resolve("assert/"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
      lib: require.resolve("lib/"),
      path: false,
      os: false,
      net: false,
      tls: false,
      child_process: false,
      jsdom: false,
      fs: false,
    },
  },
  mode: "development",
  // target: "web",
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    open: true,
    host: "localbot.binary.sx",
    port: 80,
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: "file-loader",
        options: {
          outputPath: "images",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(ogg|wav|mp3)$/i,
        loader: "file-loader",
        options: {
          outputPath: "xml",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(xml)$/i,
        loader: "file-loader",
        options: {
          outputPath: "xml",
          name: "[name].[ext]",
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
    new _ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, '.eslintrc'),
      context: path.resolve(__dirname, '../src/js'),
      files: '**/*.js',
    }),
    new StyleLintPlugin({ fix: true }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "static"), to: "static" }],
    }),
    new Dotenv(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
    new SaveRemoteFilePlugin(
      ['en', 'id', 'it', 'vi', 'pl', 'ru', 'pt', 'es', 'fr', 'zh-hans', 'zh-hant'].map(lang => {
        const url = `https://blockly-demo.appspot.com/static/msg/js/${lang}.js?_=${Date.now()}`;
        return {
          url,
          filepath: `./translations/${lang}.js`,
          lang,
        }
      })
    )
  ],
};