var gulp = require("gulp"),
  useref = require('gulp-useref'),
  csso = require('gulp-csso'),
  size = require('gulp-size'),
  filter = require('gulp-filter'),
  uglify = require('gulp-uglify'),
  clean = require('gulp-clean'),
  gulpif = require('gulp-if'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  gutil = require( 'gulp-util'),
  ftp = require( 'vinyl-ftp'),
  imagemin = require("gulp-imagemin"),
  svgstore = require("gulp-svgstore"),
  svgmin = require("gulp-svgmin"),
  rename = require("gulp-rename"),
  run = require("run-sequence");

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

//===== Cливаем все на сервер =====//
gulp.task( 'deploy', function () {

  var conn = ftp.create( {
    host:     'хостинг',
    user:     'имя пользователя',
    password: 'пароль',
    parallel: 10,
    log:      gutil.log
  } );

  var globs = [
    'build/**/*'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src( globs, { base: 'build/', buffer: false } )
    //.pipe( conn.newer( '/public_html' ) ) // only upload newer files
    .pipe( conn.dest( '/public_html' ) );
} );
