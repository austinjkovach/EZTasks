const path = require('path');

module.exports = {
  entry: './client/App.jsx',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};