const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const HTMLPages = fs.readdirSync('./src')
  .filter(file => file.endsWith('.html'))
  .map(page => new HTMLWebpackPlugin({
    title: page === 'blog.html' ? 'Developer Sojourn | Blog' : 'Developer Sojourn',
    filename: page,
    template: `./src/${page}`
  }));

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
  plugins: HTMLPages,
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
