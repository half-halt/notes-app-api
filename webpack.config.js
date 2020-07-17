const nodeExternals = require("webpack-node-externals");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const path = require('path');

const commonConfig = {
  entry:{
    pusherAuth: path.resolve(__dirname, 'src', 'pusherAuth.ts'),
    notesApi: path.resolve(__dirname, 'src', 'handler.ts')
  },
  output:{
    path: path.resolve(__dirname, 'dist'),
  },
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.json', '.gql', '.graphql'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  // Run ts-loader on all .ts files and skip those in node_modules
  module: {
    rules:[
      {
        test: /\.ts?$/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      {
        test: /\.graphql$|\.gql$/,
        use: "graphql-tag/loader",
        exclude: /node_modules/
      }
    ]
  }
};

const configs = {
  development: {
    mode: 'development'
  },
  production: {
    mode: 'production',
    optimization: {
      minimize: true
    }
  }
}

module.exports = (env, args) => {
  const mode = args.mode || "development";
  const config = configs[mode] || {};
 
  dotenv.config();
  const webpackConfig = Object.assign({}, commonConfig, config);
  if (config.plugins)
    webpackConfig.plugins = config.plugins.concat(commonConfig.plugins);
  return webpackConfig;
}