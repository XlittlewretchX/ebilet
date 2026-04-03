const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.ts',
  resolve: {
    extensions: ['.vue', '.tsx', '.ts', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/i,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/img', to: 'img' }
      ],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
}; 
