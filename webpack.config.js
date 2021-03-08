const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/MediaPlayer.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/',
    crossOriginLoading: 'anonymous'
  },
  devServer: {
    port: 4000,
    hot: true,
    publicPath: '/',
    stats: {
      colors: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'raw-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')]
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: false,
              encoding: false,
            },
          },
        ],
      },
    ],
  }
};