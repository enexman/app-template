var gulp = require("gulp"),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    minifyCSS = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    imagemin = require('gulp-imagemin'),
    size = require('gulp-size'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    gutil = require( 'gulp-util'),
    ftp = require( 'vinyl-ftp' );



//===== Синхронизация 	           << gulp sync >>   =====//
gulp.task('sync', ['js', 'sass'], function() {
    browserSync.init({
        notify: false,
        server: "./app"
    });
    gulp.watch("app/js/*js", ['js']);
    gulp.watch("app/css/style.scss", ['sass']);
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
        .pipe(gulpif('*.css', autoprefixer('last 6 versions')))
        .pipe(gulpif('*.css', minifyCSS({compatibility: 'ie10'})))
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
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function() {
    return gulp.src([
            'app/*.*',
            '!app/*.html'
        ])
        .pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function() {
    return gulp.src('dist/**/*')
        .pipe(size({title: 'build'}));
});

// Собираем папку dist
gulp.task('build', ['clean'], function() {
    gulp.start('dist');
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
