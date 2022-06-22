const path = require("path");

const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  entry: "./cache/index.ts",
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "./worker.js",
    path: path.join(__dirname, "dist"),
  },
  devtool: "cheap-module-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.cache.json",
        },
      },
    ],
  },
};
