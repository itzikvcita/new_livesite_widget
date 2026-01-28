const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/scss/livesite.css.scss',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'livesite.css.js', // Dummy JS file, we only need CSS
      clean: false, // Don't clean, we're building alongside main config
      publicPath: '/dist/', // Ensures font URLs resolve correctly relative to CSS file
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                import: false, // Disable css-loader's @import processing - let sass-loader handle it
                url: {
                  filter: (url, resourcePath) => {
                    // Process all URLs including fonts - webpack will handle them correctly
                    return true;
                  },
                },
                // Make font URLs relative to the CSS file location, not the HTML document
                // This ensures fonts load correctly when CSS is in a different directory
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(eot|woff|woff2|ttf|svg)$/,
          type: 'asset/resource',
          generator: {
            // Preserve directory structure for fonts to avoid name conflicts
            // e.g., icomoon/fonts/icomoon.woff -> fonts/icomoon.woff
            //      icomoon/fonts/livesite-icons/icomoon.woff -> fonts/livesite-icons/icomoon.woff
            filename: (pathData) => {
              const filePath = pathData.filename || pathData.module.resource;
              // Extract relative path from src/scss
              const scssPath = path.resolve(__dirname, 'src/scss');
              const relativePath = path.relative(scssPath, filePath).replace(/\\/g, '/');
              // Remove query strings (e.g., ?84yycz)
              const cleanPath = relativePath.split('?')[0];
              // Preserve directory structure but remove 'icomoon/fonts/' prefix
              const fontPath = cleanPath.replace(/^icomoon\/fonts\//, '');
              return `fonts/${fontPath}`;
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? 'livesite.min.css' : 'livesite.css',
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.scss', '.css'],
      modules: [path.resolve(__dirname, 'src/scss'), 'node_modules'],
    },
  };
};
