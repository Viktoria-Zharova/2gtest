const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/', // Ensure correct path resolution
  },
  devServer: {
    static: './dist',
    hot: true,
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|glb)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash][ext]' // Output to assets folder
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/lowPoly.html',
      filename: 'lowPoly.html',
      inject: 'body',
      templateParameters: {
        isLowPoly: true
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          noErrorOnMissing: true, // Ignore if folder doesn't exist
          globOptions: {
            ignore: ['**/*.css'], // Skip CSS files (handled by css-loader)
          },
        },
      ],
    }),
  ]
};
