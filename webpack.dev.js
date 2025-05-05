// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    static: './dist',
  },
  module: {
    rules: [
      // а) SCSS‑модули (*.module.scss)
      {
        test: /\.module\.(css|scss)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      // б) глобальные стили (.css/.scss, кроме *.module.*)
      {
        test: /\.(css|scss)$/i,
        exclude: /\.module\.(css|scss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
