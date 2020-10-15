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
	mode: 'production',
	devtool: 'source-map',

	entry: './src/index.ts',

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
			title: 'Bb-format Demo',
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
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};

module.exports = config;
