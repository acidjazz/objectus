
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var notify = require('gulp-notify');

gulp.task('coffee', function() {
  gulp.src('*.coffee')
    .pipe(coffee({bare: true})
      .on('error', notify.onError(function(error) {
        return "Coffee error: " + error.message;
      }))
    )
    .pipe(gulp.dest('.'))
});

gulp.task('watch', function() {
  gulp.watch('*.coffee', ['coffee']);
});

gulp.task('default', ['coffee']);
