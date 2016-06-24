const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isProduction = (process.env.NODE_ENV === 'production');

// define some paths...
const appDirName = 'app';
const sourceDirName = 'scripts';
const stylesDirName = 'styles';
const imagesDirName = 'images';
const buildDirName = 'build';
const outputDirName = '';
const entryFileName = 'index.js';
const bundleFileName = 'index.js';

const appPath = path.join(__dirname, appDirName);
const buildPath = path.join(__dirname, buildDirName);
const sourcePath = path.join(appPath, sourceDirName);
const entryPath = path.join(sourcePath, entryFileName);
const stylesPath = path.join(appPath, stylesDirName);
const outputPath = path.join(buildPath, outputDirName);

const webpackConfig = {
	watch: false,

	entry: entryPath,
	output: {
		path: outputPath,
		publicPath: `/${outputDirName}`,
		filename: bundleFileName,
	},

	module: {
		loaders: []
	},

	postcss: [
		autoprefixer({ browsers: ['last 2 versions'] })
	],

	// for more information: https://webpack.github.io/docs/configuration.html#devtool
	devtool: (isProduction)
		? 'source-map'
		: 'eval-source-map',

	devServer: {
		port: 9090,
		contentBase: appPath,

		// Enable history API fallback so HTML5 History API based
		// routing works. This is a good default that will come
		// in handy in more complicated setups.
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true,

		// Display only errors to reduce the amount of output.
		stats: 'errors-only',
	},

	plugins: [],
};

// Adding loaders to the config...
webpackConfig.module.loaders.push({
	test: /\.js$/,
	exclude: /node_modules/,
	loader: 'babel-loader',
	query: {
		cacheDirectory: true,
		presets: (isProduction)
			? ['react', 'es2015-native-modules']
			: ['react-hmre', 'react', 'es2015-native-modules']
	}
});

const cssLoaders = (isProduction)
	? ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
	: ['style', 'css?sourceMap', 'postcss'];

webpackConfig.module.loaders.push({
	test: /\.css$/,
	loaders: cssLoaders,
	include: [stylesPath]
});

const stylusLoaders = (isProduction)
	? ExtractTextPlugin.extract('style', 'css?sourceMap!stylus!postcss?sourceMap')
	: ['style', 'css?sourceMap', 'stylus?sourceMap', 'postcss'];

webpackConfig.module.loaders.push({
	test: /\.styl$/,
	loaders: stylusLoaders,
	include: [stylesPath]
});


// Adding plugins to the config...
webpackConfig.plugins.push(
	new HtmlWebpackPlugin({
		template: path.join(appPath, 'index.html'),
		hash: false,
		filename: 'index.html',
		inject: true,
		minify: {
			collapseWhitespace: true
		}
	})
);

// webpackConfig.plugins.push(
// 	new CopyWebpackPlugin([
// 			{ from: path.join(appPath, imagesDirName), to: imagesDirName },
// 	], {
// 		ignore: []
// 	})
// );

// Plugins for production only
if (isProduction) {
	// save stylesheets in seperate file
	webpackConfig.plugins.push(
		new ExtractTextPlugin('styles.css', {
			allChunks: true
		})
	);
} else { // Plugins for development only
	webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
