const path = require('path');
const gulp = require('gulp');
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


gulp.task('watch', ['babel', 'stylus'], () => {
	gulp.watch(jsSources, ['babel']);
	gulp.watch(stylSources, ['stylus']);
});
