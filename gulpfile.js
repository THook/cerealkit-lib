var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var autoprefixer  = require('gulp-autoprefixer');
var uglify        = require('gulp-uglify');
var ghPages       = require('gulp-gh-pages');
var rename        = require('gulp-rename');
var reload        = browserSync.reload;
var cleanCSS      = require('gulp-clean-css');
var gutil = require('gulp-util');
let babel = require('gulp-babel');

/* config
---------------------------------------------------- */

var srcFolder =  'src';
var distFolder = 'dist';

var pump = require('pump');

gulp.task('uglify-error-debugging', function (cb) {
  pump([
    gulp.src('./src/*.js'),
    uglify(),
    gulp.dest('./dist/')
  ], cb);
});

/**
 * CSS build
 */
gulp.task('css', function () {
    return gulp.src('src/cerealkit.css')
    .pipe(autoprefixer({
        browsers: ['> 1%', 'last 3 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}));
});

/**
 * CSS build + min
 */
gulp.task('css-min', function () {
    return gulp.src('src/cerealkit.css')
    .pipe(autoprefixer({
        browsers: ['> 1%', 'last 3 versions'],
        cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename("cerealkit.min.css"))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}));
});

/**
* JS build
*/
gulp.task('js', function() {
    return gulp.src('src/cerealkit.js')
    .pipe(gulp.dest('dist'))
});

/**
* JS build + min
*/
// gulp.task('js-min', function() {
//     return gulp.src('src/tingle.js')
//     .pipe(uglify({
//         mangle: true
//     }))
//     .pipe(rename("tingle.min.js"))
//     .pipe(gulp.dest('dist'))
// });

gulp.task('js-min', () => {
  return gulp.src('src/cerealkit.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify({
        mangle: true
    }))
    .pipe(rename("cerealkit.min.js"))
    .pipe(gulp.dest('dist'))
});

/**
* Deploy documentation to Github
*/
gulp.task('deploy', function() {
    return gulp.src('./doc/**/*')
    .pipe(ghPages());
});

/**
 * Copy sources to doc folder
 */
gulp.task('copy', gulp.parallel('css', 'css-min', 'js', 'js-min', function () {
    return gulp.src(['dist/**/*'])
      .pipe(gulp.dest('doc/cerealkit'));
}));

gulp.task('serve', function() {

    browserSync.init({
        server: "./doc"
    });

    gulp.watch('src/**', ['copy']);
});



gulp.task('doc', gulp.series('copy', 'deploy'));
gulp.task('default', gulp.parallel('css-min', 'js-min'));
