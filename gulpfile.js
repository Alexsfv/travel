const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const sass = require('gulp-sass');
const minify = require('gulp-minify');
const babel = require("gulp-babel");


const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);


function clear(){
	return del('build/*');
}

function styles(){
	return gulp.src('./src/css/index.scss')
			   .pipe(gulpif(isDev, sourcemaps.init()))
			   .pipe(sass())

			   .pipe(gcmq())

			   .pipe(autoprefixer({
				overrideBrowserslist: ['last 6 versions'],
		            cascade: false
		        }))

			   .pipe(gulpif(isProd, cleanCSS({
			   		level: 2
			   })))
			   .pipe(gulpif(isDev, sourcemaps.write()))
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function css(){
	return gulp.src('./src/css/**/*.css')
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function fonts(){
	return gulp.src('./src/fonts/**/*')
			   .pipe(gulp.dest('./build/fonts'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function img(){
	return gulp.src('./src/img/**/*')
			   .pipe(gulp.dest('./build/img'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function html(){
	return gulp.src('./src/*.html')
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function js(){
	return gulp.src('./src/js/**/*')
			   .pipe(gulp.dest('./build/js'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function php(){
	return gulp.src('./src/php/**/*')
			   .pipe(gulp.dest('./build/php'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/",
	        }
	    });
	}
	gulp.watch('./src/fonts/**/*', fonts);
	gulp.watch('./src/css/**/*.scss', styles);
	gulp.watch('./src/css/**/*.css', css);
	gulp.watch('./src/**/*.html', html);
	gulp.watch('./src/js/**/*', js);
	gulp.watch('./src/img/**/*', img);
	gulp.watch('./src/php/**/*', php);
}

function compress() {
	return gulp.src('./src/js/*.js')
	.pipe(minify({
        ext:{
            min:'-minify.js'
        }
        }))
		.pipe(gulp.dest('./build/js'))
}

function compress() {
	del('build/js/*');
	return gulp.src('./src/js/*.js')
	.pipe(minify({
        ext:{
            min:'-minify.js'
        }
        }))
		.pipe(gulp.dest('./build/js'))
}

function babelJs() {
	return gulp.src("./build/js/*.js")
	  .pipe(babel())
	  .pipe(gulp.dest("./build/js/babel/"));
} 

let build = gulp.series(clear, compress,
	gulp.parallel(styles, css, img, html, fonts, babelJs, php)
);

let buildW = gulp.series(clear, 
	gulp.parallel(styles, css, img, html, compress, fonts, php)
);



gulp.task('build', build);
gulp.task('watch', gulp.series(buildW, watch));
gulp.task('min', compress);
