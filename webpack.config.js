const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const AutomaticVendorFederation = require('@module-federation/automatic-vendor-federation');

const opts = {
  orgName: 'openemp-mf',
  projectName: 'dashboard',
  port: 9001,
};

module.exports = (webpackConfigEnv = {}) => {
  return {
    entry: path.resolve(__dirname, 'src/index'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: `http://localhost:${opts.port}/`,
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          include: [/node_modules/, /src/],
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: false,
              },
            },
          ],
        },
      ],
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: opts.port,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: webpackConfigEnv.analyze ? 'server' : 'disabled',
      }),
      new ModuleFederationPlugin({
        name: '__openemp_mf_dashboard__',
        library: { type: 'var', name: '__openemp_mf_dashboard__' },
        filename: 'remoteEntry.js',
        exposes: {
          index: './src/index.js',
        },
        shared: ['react', 'react-dom', 'single-spa-react', '@material-ui/core', '@material-ui/core'],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
    resolve: {
      extensions: ['.js', '.mjs', '.jsx', '.wasm', '.json'],
    },
  };
};
