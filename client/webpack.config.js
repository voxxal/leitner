const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotEnv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  devtool: "inline-source-map",
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      string_decoder: require.resolve("string_decoder/"),
      stream: require.resolve("stream-browserify"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    compress: true,
    contentBase: "./dist",
  },
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Leitner",
      template: "./public/index.html",
    }),
    new dotEnv(),
  ],
};
