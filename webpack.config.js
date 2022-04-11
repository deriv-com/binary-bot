const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const $ = require("jquery");

module.exports = {
  entry: path.join(__dirname, "src", "view", "index.js"),
  output: {
    filename: "[name].[hash].js",
    path: path.join(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, "src/view/styles"),
      Static: path.resolve(__dirname,'static'),
      Translate: path.resolve(__dirname,"src","common","i18n.js"),
      StorageManager: path.resolve(__dirname,"src","common","utils","storageManager.js"),
      Observer: path.resolve(__dirname,"src","common","utils","observer.js"),
      Tools: path.resolve(__dirname,"src","common","utils","tools.js"),
      Common: path.resolve(__dirname,"src", "common"),
      CommonDeriv: path.resolve(__dirname,"src", "common"),
      BlocklyPath: path.resolve(__dirname,"src","view","blockly"),
      Api: path.resolve(__dirname,"src","view","deriv","api"),
      Store:path.resolve(__dirname,"src","view","deriv","store"),
      Components: path.resolve(__dirname,"src","view","deriv","components"),
      Bot: path.resolve(__dirname,"src","bot"),
      Shared: path.resolve(__dirname,"src","shared"),
    },
    fallback: {
      https: require.resolve("https-browserify"),
      http: require.resolve("https-browserify"),
      zlib: require.resolve("browserify-zlib"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve('stream-browserify'),
      fs: false,
      path: false,
      os: false,
      net: false,
      tls: false,
      child_process: false,
      jsdom: false,
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
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "static"), to: "static" }],
    }),
    new Dotenv(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
