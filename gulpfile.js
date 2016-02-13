
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var notify = require('gulp-notify');

gulp.task('coffee', function() {
  gulp.src('**/*.coffee')
    .pipe(coffee({bare: true})
      .on('error', notify.onError(function(error) {
        return {title: "Coffee error", message: error.message + "\r\n" + error.filename + ':' + error.location.first_line, sound: 'Pop'};
      }))
    )
    .pipe(gulp.dest('.'))
});

gulp.task('watch', function() {
  gulp.watch('**/*.coffee', ['coffee']);
});

gulp.task('default', ['coffee']);
