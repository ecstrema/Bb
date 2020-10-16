/* eslint-env node */
/**
 * This is the webpack configuration for the demo page
 */
const path = require('path');

const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const CopyPlugin			= require('copy-webpack-plugin');

const buildDir = path.resolve(__dirname, 'dist');

const config = {
    target:'web',
    // mode: 'production',
    mode: 'development',
    devtool: 'inline-source-map',

    entry: './src/main.ts',

    devServer: {
        contentBase: './dist',
    },

    output: {
        filename: 'main.js',
        path: buildDir,
    },

    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/chordSymbol.png', to: buildDir },
                { from: 'src/style.css', to: buildDir },
                { from: 'src/index.html', to: buildDir },
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
