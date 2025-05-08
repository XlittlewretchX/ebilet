const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.module\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[hash:base64:8]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(css|scss)$/i,
        exclude: /\.module\.(css|scss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash:8].css',
      chunkFilename: 'styles/[id].[contenthash:8].css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({ parallel: true }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].[contenthash:8].js',
    publicPath: '/ebilet/',
  },
}); 