var gulp = require('gulp');
var includer = require('gulp-html-ssi');
var webserver = require('gulp-webserver');
var concat =  require('gulp-concat');
var uglify =  require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var scss = require('gulp-sass');
var plumber =  require('gulp-plumber');
var headerfooter =  require('gulp-headerfooter');

//util
var errorAlert = function(error) {
    console.log(error.toString());
    this.emit('end');
};

//front path
var src = 'front/src';
var dist = 'front/dist';
var paths = {
    js: src +'/static/js',
    scss: src + '/static/scss',
    html: src + '/pages/**/*.html',
    lib : src + '/static/lib'
};

/** task */
//웹서버를 localhost:8000으로 실행한다.
gulp.task('SERVER:8000', () => {
    return new Promise( resolve => {
        gulp.src(dist + '/').pipe(webserver());

        resolve();
    });
});

//플러그인을 하나로 합친다
gulp.task('NODE-PLUGINS:combine',() => {
    return new Promise( resolve => {
         gulp.src([
            'node_modules/lodash/lodash.min.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/moment/locale/ko.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/js-cookie/src/js.cookie.js',
            'node_modules/fotorama/fotorama.js',
            'node_modules/materialize-css/dist/js/materialize.min.js'
        ])
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('plug-in.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist + '/static/js/'));

        resolve();
    });
});

//plugins : site javascript
gulp.task('PLUGINS:lib', () => {
    return new Promise( resolve => {
        gulp.src(paths.lib + '/**/*.*')
            .pipe(gulp.dest(dist + '/static/lib/'));

        resolve();
    });
});

//JS : site javascript
gulp.task('JS:combine', () => {
    return new Promise( resolve => {
        gulp.src(paths.js + '/**/*.*')
            .pipe(gulp.dest(dist + '/static/js/'));

        resolve();
    });
});


//webfont 복사
gulp.task('FONTS:webfont', () => {
    return new Promise( resolve => {
        gulp.src([
            paths.lib + '/font/nanumfont/**/*.*',
            paths.lib + '/font/rp/**/*.*'
        ])
        .pipe(gulp.dest(dist + '/static/css/fonts'));

        resolve();
    });
});


//image 복사
gulp.task('IMAGES:copy', () => {
    return new Promise( resolve => {
        gulp.src([
            'node_modules/fotorama/*.png',
            src + '/static/images/*.*',
            src + '/static/images/**/*.*',
            paths.lib + '/images/**/*.*'
        ])
        .pipe(gulp.dest(dist + '/static/images/'));

        resolve();
    });
});

//SCSS 파일을 css 컴파일
gulp.task('SCSS:compile', () => {
    return new Promise( resolve => {
        var options = {
            outputStyle: "expanded" // nested, expanded, compact, compressed
            , indentType: "space" // space, tab
            , indentWidth: 4
            , precision: 8
            , sourceComments: true // 코멘트 제거 여부
        };

        gulp.src(paths.scss + '/style.scss')
            .pipe(plumber({errorHandler: errorAlert}))
            .pipe( sourcemaps.init() )
            .pipe( scss(options) )
            .pipe( sourcemaps.write() )
            .pipe( gulp.dest(dist + '/static/css'));

        resolve();
    });
});

//INDEX : index.html
gulp.task('INDEX:indexCopy', () => {
    return new Promise( resolve => {
        gulp.src([
            src + '/pages/*.html',
            src + '/pages/*/main.html'
        ])
        .pipe(gulp.dest(dist+'/'));

        resolve();
    });
});

//HTML : header + section + footer
gulp.task('HTML:headerFooterCombine', () => {
    return new Promise( resolve => {
        gulp.src([
            src + '/pages/*/*.html',
            '!' + src + '/pages/main/main.html'
        ])
        .pipe(includer())
        .pipe(headerfooter.header(src + '/include/_header.html'))
        .pipe(headerfooter.footer(src + '/include/_footer.html'))
        .pipe(gulp.dest(dist+'/'));

        resolve();
    });
});

/** Watch **/
gulp.task('watch', () => {
    return new Promise( resolve => {
        gulp.watch(paths.js + '/*.js', gulp.series(['JS:combine']));
        // gulp.watch(paths.json + '/*.json', gulp.series(['JSON:combine']));
        gulp.watch(paths.scss + '/*.scss', gulp.series(['SCSS:compile']));
        gulp.watch(paths.scss + '/**/*.scss', gulp.series(['SCSS:compile']));
        gulp.watch(src+ '/include/*.html', gulp.series(['HTML:headerFooterCombine']));
        gulp.watch(src + '/pages/main/*.html', gulp.series(['INDEX:indexCopy']));
        gulp.watch( paths.html, gulp.series(['HTML:headerFooterCombine']));

        resolve();
    });
});

gulp.task( 'default', gulp.series([
    'NODE-PLUGINS:combine',
    'PLUGINS:lib',
    'JS:combine',
    'FONTS:webfont',
    'IMAGES:copy',
    'SCSS:compile',
    'INDEX:indexCopy',
    'HTML:headerFooterCombine'
]));