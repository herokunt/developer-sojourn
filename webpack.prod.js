const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');

const postcssPlugins = [
  require('autoprefixer')
];

class BuildWordPressFiles{
  apply(compiler){
    compiler.hooks.done.tap('Link compiled JS and CSS files to custom theme', function(){

      let functionsphp = fs.readFileSync('./src/wp_theme/functions.php', 'utf-8');
      const jsfiles = new RegExp(/^main\..+\.js/ig);
      const cssfiles = new RegExp(/main\..+\.css/ig);

      fs.readdirSync('./dist').forEach(file => {
        if (file.match(jsfiles)) {
          fs.copyFile(`./dist/${file}`, `./src/wp_theme/js/${file}`, (err) => {
            if (err) throw err
          });
          functionsphp = functionsphp.replace(/main\..+\.js/ig, file);
        }

        if (file.match(cssfiles)) {
          fs.copyFile(`./dist/${file}`, `./src/wp_theme/css/${file}`, (err) => {
            if (err) throw err
          });
          functionsphp = functionsphp.replace(cssfiles, file);
        }
      });

      fs.writeFileSync('./src/wp_theme/functions.php', functionsphp);
    });
  }
};

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
    new HTMLWebpackPlugin({ filename: 'index.html', template: './src/index.html' }),
    new HTMLWebpackPlugin({ filename: 'blog.html', template: './src/blog.html' }),
    new miniCSSExtractPlugin({ filename: "[name].[hash].css"}),
    new CleanWebpackPlugin(),
    new BuildWordPressFiles()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
