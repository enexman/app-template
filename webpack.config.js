const path = require('path');

module.exports = {
  mode: 'none',
  entry: "./app/js-src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, './app/js')
  },
  devtool: "source-map"
};
