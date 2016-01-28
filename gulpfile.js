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
    sass = require('gulp-sass');


//===== Синхронизация -->
// Запускаем локальный сервер
gulp.task('sync', ['sass'], function() {
    browserSync.init({
        notify: false,
        server: "./app"
    });
    gulp.watch("app/css/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Компилируем sass в css
gulp.task('sass', function() {
    return gulp.src("app/css/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});
// gulp sync


//===== Подключаем ссылки из bower
gulp.task('wiredep', function() {
    gulp.src('app/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('app/'))
});
// gulp wiredep


//===== Сборка -->
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
        .pipe(gulpif('*.css', minifyCSS({compatibility: 'ie8'})
            .pipe(autoprefixer('last 5 versions'))))
        //.pipe(assets.restore())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
    gulp.src('app/fonts/*')
        .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
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
// gulp build  --сборка проекта