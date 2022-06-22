const path = require("path");

module.exports = {
  entry: "./image/index.ts",
  output: {
    filename: "./worker.js",
    path: path.join(__dirname, "dist"),
  },
  devtool: "cheap-module-source-map",
  mode: "development",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.image.json",
        },
      },
    ],
  },
};
