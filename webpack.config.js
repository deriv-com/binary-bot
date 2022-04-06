const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack');
const  $ = require("jquery");

module.exports = {
  entry: path.join(__dirname, "src", "botPage", "view", "index.js"),
  output: {
    filename: "[name].[hash].js",
    path: path.join(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'src/botPage/view/styles'),
    },
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'static'),
    },
    compress: true,
    open: true,
    port: 3000,
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
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "static"), to: "static" }],
    }),
    new Dotenv(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
  })
  ],
};
