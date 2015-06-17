/*
*picks up changes that happen in the backend, without restarting the server
*/
var gulp       = require( 'gulp' ),
    server     = require( 'gulp-develop-server' ),
    livereload = require( 'gulp-livereload' ),
    ejs = require('gulp-ejs'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    path = require('path'),
    supervisor = require('gulp-supervisor');

var options = {
    path: './app.js' // looks for changes in the app.js file
};

gulp.task( 'server:start', function() {
    server.listen( options, livereload.listen );
});




//using gulp-ejs in a watch/livereload task prevents gulp from exiting on error
gulp.src('./templates/*.ejs')
    .pipe(ejs({
        msg: 'Hello Gulp!'
    }).on('error', gutil.log))
    .pipe(gulp.dest('./dist'));


gulp.task('serve', function() {
  supervisor('./bin/www', {
    watch: ['./models', './utils','./app.js','./routes','./controllers'], // looks for changes in these files and automatically restarts the server
    exec: 'node',
    extensions: ['js'],
    noRestartOn: 'exit'
  });
});

gulp.task('default', ['serve']);