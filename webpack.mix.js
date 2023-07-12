const mix = require('laravel-mix');
const webpack = require('webpack');
require('dotenv').config() // -> add this

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

let dotenvplugin = new webpack.DefinePlugin({ // -> add this
	'process.env': {
		SENTRY_APP: JSON.stringify(process.env.SENTRY_APP || 'undefined')
	}
})

module.exports = {
	module: {
	  loaders: [
		{ test: /\.css$/, loader: "style-loader!css-loader" }
	  ]
	}
};

if (mix.inProduction()) {
	mix.webpackConfig({
		devtool: 'source-map',
		plugins: [
			new webpack.HashedModuleIdsPlugin(),
			new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
			dotenvplugin // -> add this
		],
		output: {
			filename: '[name].js',
			chunkFilename: 'js/prod/chunks/[name].[chunkhash].js'
		}
	});
	mix.react('resources/js/app.js', 'public/js/prod').version().browserSync({
		proxy: 'localhost:8000'
	});
	mix.options({
		uglify: {
			uglifyOptions: {
				mangle: {
					safari10: true,
				}
			}
		}
	})
} else {
	mix.webpackConfig({
		devtool: 'source-map',
		plugins: [
			new webpack.HashedModuleIdsPlugin(),
			new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
			dotenvplugin // -> add this
		],
		output: {
			filename: '[name].js',
			chunkFilename: 'js/dev/chunks/[name].[chunkhash].js'
		}
	});
	mix.react('resources/js/app.js', 'public/js/dev').browserSync({
		proxy: 'localhost:8000'
	});
}
