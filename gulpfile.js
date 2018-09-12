const gulp = require('gulp'),
      gulpLoadPlugins = require('gulp-load-plugins'),
      plugins = gulpLoadPlugins();

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(plugins.webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('templates', function() {
    gulp.src('./src/templates/*.jade')
      .pipe(plugins.jade())
      .pipe(gulp.dest('./dist'))
});

gulp.task('scss', function () {
	gulp.src('./src/scss/*.scss')
	  .pipe(plugins.scss({"bundleExec": true}))
      .pipe(plugins.autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
	  }))
	  .pipe(plugins.rename({suffix: ".min",}))
	  .pipe(plugins.cleanCss({compatibility: 'ie8'}))
	  .pipe(gulp.dest('./dist/css/'))
});

gulp.task('compress', () =>
    gulp.src('src/app.js')
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.babel({
			presets: ['@babel/env']
		}))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(plugins.rename({suffix: ".min",}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('dist'))
);

gulp.task('build', ['templates', 'scss', 'compress']);
gulp.task('watch',function(){
	gulp.watch('./src/templates/*.jade', ['templates'])
	gulp.watch('./src/scss/*.scss', ['scss'])
	gulp.watch('./src/js/*.js', ['compress'])
});
gulp.task('default', function () {
	gulp.start('templates', 'scss', 'compress', 'webserver')
  })