"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
// selected css kit
const tailwindcss = require("tailwindcss");
// plugin to process css files
const postcss = require("gulp-postcss");
// plugin to reduce css files
const purgecss = require("gulp-purgecss");
// plugin to control line break file generation
const lec = require("gulp-line-ending-corrector");

// Configuration
var configuration = {
    paths: {
        src: {
            html: './*.html',
            js: './js/**/*.js',
            fonts: './fonts/**/*.*',
            img: './img/**/*.*',
            css: './css_src/*.css',
            videos: './videos/**/*.mp4',
            tailwindConfig: './tailwind.config.js'
        },
        dist: './dist',
    }
};

class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g);
    }
}

// Clean dist
function distClean() {
    return del([configuration.paths.dist]);
}

// Copy html files to dist directory
function distHtml() {
    return gulp
        .src(configuration.paths.src.html)
        .pipe(gulp.dest(configuration.paths.dist))
}

// Copy assets files to dist directory
function distAssets() {
    var css = gulp.src(configuration.paths.src.css)
        .pipe(plumber())
        .pipe(postcss([
          // ...
            tailwindcss(configuration.paths.src.tailwindConfig),
          // require('tailwindcss-animatecss')(['responsive']),
          // require('autoprefixer'),
          // ...
        ]))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
        .pipe(purgecss({
            content: [configuration.paths.src.html],
            extractors: [
                {
                    extractor: TailwindExtractor,
                    extensions: ["html"]
                }
            ]
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(configuration.paths.dist + "/css/"))

    var js = gulp
        .src(configuration.paths.src.js)
        .pipe(gulp.dest(configuration.paths.dist + "/js/"))

    var fonts = gulp
        .src(configuration.paths.src.fonts)
        .pipe(gulp.dest(configuration.paths.dist + "/fonts/"))

    var img = gulp
        .src(configuration.paths.src.img)
        .pipe(gulp.dest(configuration.paths.dist + "/img/"))

    var videos = gulp
        .src(configuration.paths.src.videos)
        .pipe(gulp.dest(configuration.paths.dist + "/videos/"))

        return merge(css, js, fonts, img, videos);
}

// Bring third party dependencies from node_modules into dist vendor directory
function distModules() {

    // Font Awesome
    // var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest(configuration.paths.dist + "/vendor/"));

    // Simple Line Icons
    // var simpleLineIconsFonts = gulp.src('./node_modules/simple-line-icons/fonts/**')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest(configuration.paths.dist + "/vendor/simple-line-icons/fonts"));
    // var simpleLineIconsCSS = gulp.src('./node_modules/simple-line-icons/css/**')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest(configuration.paths.dist + "/vendor/simple-line-icons/css"));

    // return merge(fontAwesome, simpleLineIconsFonts, simpleLineIconsCSS);
    return null;
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean vendor
function clean() {
    return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
    // Font Awesome
    // var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest('./vendor'));

    // Simple Line Icons
    // var simpleLineIconsFonts = gulp.src('./node_modules/simple-line-icons/fonts/**')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest('./vendor/simple-line-icons/fonts'));
    // var simpleLineIconsCSS = gulp.src('./node_modules/simple-line-icons/css/**')
    //     .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
    //     .pipe(gulp.dest('./vendor/simple-line-icons/css'));

    // return merge(fontAwesome, simpleLineIconsFonts, simpleLineIconsCSS);
    return null;
}

// CSS task
function css() {
    return gulp
        .src(configuration.paths.src.css)
        // .pipe(plumber())
        .pipe(postcss([
          // ...
            tailwindcss('tailwind.config.js'),
          // require('tailwindcss-animatecss')(['responsive']),
          // require('autoprefixer'),
          // ...
        ]))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
        .pipe(gulp.dest("./css"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS())
        .pipe(lec({verbose: true, eolc: 'CRLF', encoding: 'utf8'}))
        .pipe(gulp.dest("./css"))
        .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
    gulp.watch(configuration.paths.src.css, css);
    gulp.watch(configuration.paths.src.tailwindConfig, css);
    gulp.watch(configuration.paths.src.html, browserSyncReload);
}

// Define complex tasks
// const vendor = gulp.series(clean, modules);
// const build = gulp.series(vendor, css);
const build = gulp.series(css);

const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
// const deploy = gulp.series(distClean, distModules, distHtml, distAssets);
const deploy = gulp.series(distClean, distHtml, distAssets);

// Export tasks
exports.css = css;
// exports.clean = clean;
// exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.deploy = deploy;