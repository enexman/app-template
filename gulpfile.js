var gulp = require("gulp");
var useref = require('gulp-useref');
var csso = require('gulp-csso');
var size = require('gulp-size');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var rename = require("gulp-rename");
var run = require("run-sequence");

//===== Синхронизация =====//
gulp.task('server', ['js', 'sass'], function() {
  browserSync.init({
      notify: false,
      server: "./source"
  });
  gulp.watch("source/js/*js", ['js']);
  gulp.watch("source/css/**/*.scss", ['sass']);
  gulp.watch("source/*.html").on('change', browserSync.reload);
});

gulp.task('js', function () {
  return gulp.src('source/js/*js')
    .pipe(gulp.dest('source/js'))
    .pipe(browserSync.stream());
});

// Компилируем sass в css
gulp.task('sass', function() {
  return gulp.src("source/css/style.scss")
    .pipe(sass())
    .pipe(autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
    ]}))
    .pipe(gulp.dest("source/css"))
    .pipe(browserSync.stream());
});

//===== Сборка =====//
// Очистка папки
gulp.task('clean', function() {
  return gulp.src('build')
    .pipe(clean());
});

// Переносим html, css, js в папку build
gulp.task('useref', function() {
  //var assets = useref.assets();
  return gulp.src('source/*.html')
    //.pipe(assets)
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', csso({restructure: true,
        sourceMap: false,
        debug: true
    })))
    //.pipe(assets.restore())
    .pipe(gulp.dest('build'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
  gulp.src('source/fonts/*')
    .pipe(filter(['*.woff2']))
    .pipe(gulp.dest(('build/fonts/')));
});

// Картинки
gulp.task('images', function() {
  return gulp.src('source/img/*')
    .pipe(filter(['*.jpg','*.gif','*.png','*.svg']))
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task("symbols", function() {
  return gulp.src("source/img/icons/*.svg")
    //.pipe(svgmin())
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task('copy', function() {
  return gulp.src([
        'source/*.*',
        '!source/*.html'
    ])
    .pipe(gulp.dest('build'));
});

gulp.task('dist', function() {
  return gulp.src('build/**/*')
    .pipe(size({title: 'build'}));
});

// Сборка и вывод размера содержимого папки build
gulp.task("build", function(fn) {
  run(
    "clean",
    "useref",
    "images",
    "fonts",
    "copy",
    "dist",
    fn
  );
});
