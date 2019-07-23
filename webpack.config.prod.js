const path = require('path')
const webpack = require('webpack')


module.exports = {
  entry: [
    './example/src/scripts/App'
  ],
  mode: 'production',
  output: {
    path: path.join(__dirname, 'example/build'),
    filename: 'app.js',
    publicPath: '../build/'
  },
  plugins: [
    // set env
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: false
      },
      output: {
        comments: false
      }
    })
  ],
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
          {loader: 'sass-loader', options: {indentedSyntax: 'sass', 'includePaths[]': path.resolve(__dirname, 'example/src')}},
        ]
      },
      {
        exclude: /node_modules/,
        test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
        use: [{loader: 'file-loader'}]
      }
    ]
  }
};
