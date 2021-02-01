const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /\.(html)$/,
      use: ['html-loader']
    },
    {
      test: /\.(ttf|otf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts'
        }
      }
    },
    {
      test: /\.(svg|png|jpe?g|gif|svg|webp)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images'
        }
      }
    },
    {
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'videos'
        }
      }
    }]
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './src/index.html' }),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
    // host: '0.0.0.0',
    // https: true
  }
};
