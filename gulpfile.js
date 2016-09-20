var gulp = require("gulp"),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    concatCss = require('gulp-concat-css'),
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


//===== Синхронизация 	           << gulp sync >>   =====//
gulp.task('server', ['js', 'sass'], function() {
    browserSync.init({
        notify: false,
        server: "./app"
    });
    gulp.watch("app/js/*js", ['js']);
    gulp.watch("app/css/**/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('js', function () {
    return gulp.src('app/js/*js')
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());
});

// Компилируем sass в css
gulp.task('sass', function() {
    return gulp.src("app/css/style.scss")
        .pipe(sass())
        .pipe(autoprefixer({browsers: [
            "last 1 version",
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Opera versions",
            "last 2 Edge versions"
        ]}))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

//===== Подключаем ссылки из bower  << gulp wiredep >> =====//
gulp.task('wiredep', function() {
    gulp.src('app/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('app/'));
});


//===== Сборка                      << gulp build >> =====//
// Очистка папки
gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

// Переносим html, css, js в папку dist
gulp.task('useref', function() {
    //var assets = useref.assets();
    return gulp.src('app/*.html')
        //.pipe(assets)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso({restructure: true,
            sourceMap: false,
            debug: true
        })))
        //.pipe(assets.restore())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
    gulp.src('app/fonts/*')
        .pipe(filter(['*.svg','*.woff','*.woff2']))
        .pipe(gulp.dest(('dist/fonts/')));
});

// Картинки
gulp.task('images', function() {
    return gulp.src('app/img/*')
        .pipe(filter(['*.jpg','*.gif','*.png','*.svg']))
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true})
        ]))
        .pipe(gulp.dest('dist/img'));
});

gulp.task("symbols", function() {
    return gulp.src("app/img/icons/*.svg")
        //.pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("app/img"));
});

gulp.task('copy', function() {
    return gulp.src([
            'app/*.*',
            '!app/*.html'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', function() {
    return gulp.src('dist/**/*')
        .pipe(size({title: 'build'}));
});

// копируем исходники js и css
gulp.task('dev-source', function() {
    return gulp.src([
            'app/css/style.css',
            'app/js/main.js'
        ], {
            base: "app/."
        })
        .pipe(gulp.dest('dist/'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task("build", function(fn) {
    run(
        "clean",
        "useref",
        "images",
        "fonts",
        "copy",
        "dev-source",
        "dist",
        fn
    );
});


//===== Cливаем все на сервер     << gulp deploy >> =====//
gulp.task( 'deploy', function () {

    var conn = ftp.create( {
        host:     'хостинг',
        user:     'имя пользователя',
        password: 'пароль',
        parallel: 10,
        log:      gutil.log
    } );

    var globs = [
        'dist/**/*'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: 'dist/', buffer: false } )
        //.pipe( conn.newer( '/public_html' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html' ) );

} );
