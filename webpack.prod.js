const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');

const postcssPlugins = [
  require('autoprefixer')
];

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    filename: '[name].[contentHash].js',
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
      use: [
        miniCSSExtractPlugin.loader,
        'css-loader',
        'sass-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: postcssPlugins
            }
          }
        }
      ]
    },
    {
      test: /\.html$/,
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
    },{
      test: /\.(svg|png|jpe?g|gif)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images"
        }
      }
    },
    {
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'videos'
        }
      }
    }]
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './src/index.html' }),
    new miniCSSExtractPlugin({ filename: "[name].[hash].css"}),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
