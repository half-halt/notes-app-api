//const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dotenv = require('dotenv');
const path = require('path');

const commonConfig = {
  entry: {
    server: './src/handler.ts'
  },
  // Generate sourcemaps for proper error messages
  devtool: 'source-map',
  // Since 'aws-sdk' is not compatible with webpack,
  // we exclude all node dependencies
  externals: [nodeExternals()],
  mode: "development",
  //mode: slsw.lib.webpack.isLocal ? "development" : "production",

  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.json', '.graphql'],
    alias: {
      '~': path.resolve(__dirname, '/src')
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
        test: /\.graphql$/,
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
  return Object.assign({}, commonConfig, config);
}