var gulp = require('gulp');
var cssnano = require("gulp-cssnano");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var rename = require("gulp-rename");
var watch = require("gulp-watch");
var bs = require("browser-sync").create();
var util = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");


var path = {
    'html': './templates/**/',
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};

//  创建任务
gulp.task('html', function () {
    gulp.src(path.html)
        .pipe(bs.stream())
});

gulp.task('css', function () {
    gulp.src(path.css + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())

});

gulp.task('js', function () {
    gulp.src(path.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify().on('error', util.log))
        .pipe(rename({'suffix': '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())
});

gulp.task('images', function () {
    gulp.src(path.images + '*.*')
        .pipe(cache(imagemin()))
        .pipe(path.images_dist)
        .pipe(bs.stream())
});

// 创建一个监听任务
gulp.task('watch', function () {
    watch(path.html + '*.html', gulp.series(['html']));
    watch(path.css + '*.scss', gulp.series(['css']));
    watch(path.js + '*.js', gulp.series(['js']));
    watch(path.images + '*.*', gulp.series(['images']));
});

// 定义一个浏览器刷新事件
gulp.task('bs', function () {
    bs.init({
        'server': {
            'baseDir': './'
        }
    })
});


gulp.task('server', gulp.series(gulp.parallel('bs','watch')));



