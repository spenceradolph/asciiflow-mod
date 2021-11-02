const webpack = require("webpack");
const path = require("path");

const config = {
  entry: "./client/app.tsx",
  output: {
    path: path.resolve(__dirname, "client"),
    filename: "app.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "client"),
    },
    // compress: true,
    port: 9000,
  },
};

module.exports = config;
