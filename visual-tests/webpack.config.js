/* eslint-env node */
/**
 * This is the webpack configuration for the demo page
 */
const path = require('path');

const HtmlWebpackPlugin 	= require('html-webpack-plugin');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const TerserPlugin       	= require('terser-webpack-plugin');
const CopyPlugin			= require('copy-webpack-plugin');

const buildDir = path.resolve(process.cwd(), 'dist');

const config = {
	target:'web',
	mode: 'development', // "production" | "development" | "none"
	devtool: 'source-map',

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	},

	entry: {
		'bouncing-score': './src/index.js',
	},

	output: {
		filename: '[name].js',
		path: buildDir,
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
			}),
		],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Bouncing-Score',
			template:'assets/index.html',
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'assets/img', to: buildDir + '/img' },
				{ from: 'assets/css', to: buildDir + '/css' },
			]
		}),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
		]
	},
};

module.exports = config;
