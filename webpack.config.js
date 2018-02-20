module.exports = {
  context: __dirname + '/public',
  entry: './js/bundler.js',
  output: {
    filename: 'main.bundled.js',
    path: __dirname + '/public/js'
  }
};
