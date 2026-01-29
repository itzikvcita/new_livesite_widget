const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src-classic/livesite.js',
    output: {
      path: path.resolve(__dirname, 'dist-classic'),
      filename: isProduction ? 'livesite.min.js' : 'livesite.js',
      // Don't use library export - the code modifies window.LiveSite directly
      // Using library would overwrite window.LiveSite with module.exports
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: path.resolve(__dirname, 'webpack-require-loader.js'),
            },
          ],
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src-classic/scss/icomoon/fonts'),
            to: path.resolve(__dirname, 'dist-classic/fonts'),
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false, // Keep console.log for debugging
            },
            // Disable mangling to avoid breaking template strings
            mangle: false,
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.js'],
      modules: [path.resolve(__dirname, 'src-classic'), 'node_modules'],
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};
