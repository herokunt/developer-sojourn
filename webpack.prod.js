const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCSSExtractPlugin = require('mini-css-extract-plugin');

const postcssPlugins = [
  require('autoprefixer')
];

const HTMLPages = fs.readdirSync('./src')
  .filter(file => file.endsWith('.html'))
  .map(page => new HTMLWebpackPlugin({
    title: page === 'blog.html' ? 'Developer Sojourn | Blog' : 'Developer Sojourn',
    filename: page,
    template: `./src/${page}`
  }));

/* Updates theme's functions.php file with latest JS and CSS built files */
class WordPressFiles{
  apply(compiler){
    compiler.hooks.done.tap('Update functions.php on webpack build', function() {

      let functionsfile = fs.readFileSync('./src/wp_theme/functions.php', 'utf-8');

      const jsregex  = new RegExp(/^main\..+\.js/ig);
      const cssregex = new RegExp(/main\..+\.css/ig);

      fs.readdirSync('./dist').forEach(file => {
        if (file.match(jsregex)) {
          functionsfile = functionsfile.replace(/main\..+\.js/ig, file);
        } else if (file.match(cssregex)) {
          functionsfile = functionsfile.replace(cssregex, file);
        }
      });

      fs.writeFileSync('./src/wp_theme/functions.php', functionsfile);
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
    ...HTMLPages,
    new miniCSSExtractPlugin({ filename: "[name].[hash].css"}),
    new CleanWebpackPlugin(),
    new WordPressFiles()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
