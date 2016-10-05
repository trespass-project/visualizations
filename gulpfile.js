const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');

const sourceDir = './src';
const buildDir = './dist';
const jsSources = path.join(sourceDir, '**', '*.js');
const stylSources = path.join(sourceDir, '**', '*.styl');
const stylEntry = path.join(sourceDir, 'index.styl');


gulp.task('babel', [], () => {
	return gulp.src(jsSources)
		.pipe(
			plumber(function(err) {
				const prefix = gutil.colors.red(
					`Error (${err.plugin}):  ${err.message}`
				);
				const msg = `${prefix}\n${err.stack}`;
				gutil.log(msg);
				this.emit('end');
			})
		)
		.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['es2015', 'react'] }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildDir));
});


gulp.task('stylus', [], () => {
	return gulp.src(stylEntry)
		.pipe(sourcemaps.init())
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildDir));
});


gulp.task('example-data', [], () => {
	return gulp.src('./example-data/**/*')
		.pipe(gulp.dest(path.join(buildDir, 'example-data')));
});


gulp.task('watch', ['babel', 'stylus'], () => {
	gulp.watch(jsSources, ['babel']);
	gulp.watch(stylSources, ['stylus']);
});


gulp.task('default', ['babel', 'stylus', 'example-data']);
