const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})


module.exports = {
  entry: './client/App.jsx',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        loaders: ['babel-loader'],
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
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [HtmlWebpackPluginConfig]
};