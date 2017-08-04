const path = require('path');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client'
    'src/entry.js'
  ],
  output: {
    path: '/',
    publicPath: 'http://localhost:8080/js'
    filename: 'bundle.js'
  },
  // tut said to do this: google what tut does
  target: 'web'
};
