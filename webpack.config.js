const webpack = require('webpack');
const path = require('path');

const STYLE_LOADER = { 
	loader: "style-loader",
	options: {
		sourceMap: true,
	}
};

const CSS_LOADER = { 
	loader: "css-loader",
	options: {
		sourceMap: true,
	}
};

const SASS_LOADER = { 
	loader: "sass-loader",
	options: {
		sourceMap: true,
	}
};

// =========== GENERATE ENTRYPOINTS ===========

// Idea
// For each html file, i want to load a JS file with the corresponding name.
// This allows me to create as many html files as there are tasks.

const _ = require('lodash');
const fs = require('fs');
const htmlRegex = /\.html$/;
const filenames = fs.readdirSync(__dirname); // Read the current folder
const htmlfiles = filenames
	.filter( x => htmlRegex.exec(x)) // Grab only html files
	.map( x => x.substring(0, x.length - 5)); // strip the .html

const entryPoints = _.zipObject(htmlfiles, 
	htmlfiles.map( x => `./src/${x}.js`)); 
// Entrypoints are files in the format:
// filename: './src/filename.js'

console.log(entryPoints)

module.exports = {
	entry: entryPoints,
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, 'dist'),
		publicPath: "/dist/",
	},
	devServer: {
		contentBase: '.'
	},
	module: {
		rules: [
			{
			  test: /\.m?js$/,
			  exclude: /(node_modules|bower_components)/,
			  use: {
				loader: 'babel-loader',
				options: {
				  presets: ['@babel/preset-env']
				}
			  }
			},
			{
				test: /\.css$/,
				use: [STYLE_LOADER, CSS_LOADER],
			},
			{
				test: /\.scss$/,
				use: [STYLE_LOADER, CSS_LOADER, SASS_LOADER],
			},
		]
	}
};


