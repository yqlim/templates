const path = require('path');
const autoprefixer = require('autoprefixer');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[id].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(styl|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer()
              ]
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|otf|woff|woff2)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    alias: {
      MODULE: path.resolve(__dirname, 'src', 'modules'),
      STYLE: path.resolve(__dirname, 'src', 'styles'),
      SCRIPT: path.resolve(__dirname, 'src', 'scripts')
    }
  },
  plugins: [],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true
      })
    ]
  }
}
