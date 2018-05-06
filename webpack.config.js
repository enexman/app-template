const path = require('path');

module.exports = {
  mode: 'none',
  entry: './source/js-src/script.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, './source/js')
  },
  devtool: 'source-map'
};
