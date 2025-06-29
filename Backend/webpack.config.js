const path = require('path');
module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'final.js',
  },
  optimization: {
    minimize: false
  },
  target: 'node',
};