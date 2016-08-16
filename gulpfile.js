// Include gulp
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
    return browserify('./js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('uglify', function() {
    return gulp.src('./build/js/bundle.js')
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'browserify']);
});

gulp.task('default', ['lint', 'browserify', 'watch']);
