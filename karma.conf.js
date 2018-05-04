/* eslint-disable */
const path = require('path')
const webpack = require('webpack')


module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 30000,
    frameworks: ['es5-shim', 'mocha', 'chai', 'sinon-chai'],
    files: ['tests.webpack.js'],
    preprocessors: {'tests.webpack.js': ['webpack', 'sourcemap']},
    reporters: ['progress'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: /\.jsx?$/,
            use: [{loader: 'babel-loader'}]
          },
          {
            exclude: /node_modules/,
            test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
            use: [{loader: 'file-loader'}]
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            BROWSER: JSON.stringify(true),
            NODE_ENV: JSON.stringify('test')
          }
        }),
        new webpack.ProvidePlugin({
          React: 'react'
        })
      ],
      resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
      }
    },
    webpackServer: {
      noInfo: true
    }
  })
}
