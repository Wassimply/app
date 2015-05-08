var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('babelify');
var markdown = require('markdownify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');

gulp
  .task('javascript', ['js:build', 'js:lint'])

  .task('js:lint', function () {
    gulp.src('./lib/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  })

  .task('js:build', ['public'], function () {
    var production = false;
    var b = browserify({
      extensions: ['.md', '.markdown'],
      debug: !production
    })
      .transform(babel)
      .transform(markdown)
      .add('./lib/boot/boot.js')
      .bundle()
      .on('error', function (err) {
        console.log(err);
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(buffer());

    // if (!production) b = b.pipe(sourcemaps.init({ loadMaps: true }))
    // if (production) b = b.pipe(uglify());
    // if (!production) b = b.pipe(sourcemaps.write('./'))

    b.pipe(gulp.dest('./public/'));
  })