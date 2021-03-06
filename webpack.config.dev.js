const path = require('path')
const webpack = require('webpack')


module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './example/src/scripts/App'
  ],
  output: {
    path: path.join(__dirname, 'example/build'),
    filename: 'app.js',
    publicPath: 'build/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.sass']
  },
  module: {
    rules: [
      {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'example/src')
        ],
        test: /\.jsx?$/,
        use: [{loader: 'babel-loader'}]
      },
      {
        test: /\.sass$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'postcss-loader', options: {browsers: 'last 2 version'}},
          {loader: 'sass-loader', options: {indentedSyntax: 'sass', 'includePaths[]': path.resolve(__dirname, 'example/src')}}
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
        use: [{loader: 'file-loader'}],
        exclude: /node_modules/
      }
    ]
  }
}
