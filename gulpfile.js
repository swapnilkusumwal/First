'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify-es').default,
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin'),
    concat=require('gulp-concat'),
    gulpRemoveHtml = require('gulp-remove-html');
 
// this is more code based tast runner
gulp.task('sass', function(){
    return gulp.src('./css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

/**
* the source files travel through a pipe of functions and finally end up in the destination specified
*/

gulp.task('sass:watch', function(){
    gulp.watch('./css/*.scss', ['sass']);
});
// run the sass task when some css has changed

gulp.task('browser-sync', function(){
    var files = [
        './*.html',
        './css/*.css',
        './img/*.{png,jpg,gif}',
        './js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', ['browser-sync'], function(){
    gulp.start('sass:watch');
});

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('copyfonts', function(){
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function(){
    return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
    .pipe(gulp.dest('./dist/img'));
});

// flatmap - each html goes throw same series parallely
gulp.task('usemin', function(){
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
        .pipe(usemin({
            css: [rev()],
            html: [function() { return htmlmin({collapseWhitespace: true})}],
            js: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [cleanCss(), 'concat']
        }))
    }))
    .pipe(gulp.dest('dist/'));
});

// clean task has to be completed first
gulp.task('build', ['clean'], function(){
    gulp.start('copyfonts', 'imagemin', 'usemin');
});