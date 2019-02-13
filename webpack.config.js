const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({template: './client/index.html'})


module.exports = {
  entry: './client/App.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$|\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
    ]
  },
  devtool: 'source-map',
  devServer: {
    port: 4000,
    open: true,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  plugins: [HtmlWebpackPluginConfig]
};