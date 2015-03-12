/*
    Gulp.js file for frontend boilerplate
    last modified: 3.12.15
*/

var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    path = require('path'),
    args = require('minimist')(process.argv.slice(2))
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    coffee = require('gulp-coffee'),
	compass = require('gulp-compass'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    handlebars = require('gulp-handlebars'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	server = require('tiny-lr')(),
	watch = require('gulp-watch'),
	lrport = 35729,
    jslint = require('gulp-jslint'),
	srcPaths = {
        coffee: 'coffee/**/*.coffee',
		scripts: 'assets/js/*.js', 
		sass: 'sass/**/*.sass',
        hbs: 'assets/templates/**/*.hbs'
	},
    destPaths = {
        js: 'assets/js',
        css: 'assets/css'
    };

// error handler
var onError = function (err) {
    gutil.beep();
    console.log(err.toString());
    this.emit('end');
};

// default task -- if prod, watch won't happen
gulp.task('default', ['sass', 'coffee', 'watch']);

// helper tasks
gulp.task('sass', function() {
    return gulp.src('sass/main.sass')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({sourceComments:true,indentedSyntax:true}))
        .pipe(prefix("last 2 versions", "> 1%", "ie 8"))
        .pipe(gulpif(!args.dev, minifycss()))
        .pipe(gulp.dest(destPaths.css))
        .pipe(gulpif(args.dev, livereload(server)));
});

// helper tasks
gulp.task('sass-ie', function() {
    return gulp.src('sass/ie.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass({sourceComments:true}))
        .pipe(gulpif(!args.dev, minifycss()))
        .pipe(gulp.dest(destPaths.css))
        .pipe(gulpif(args.dev, livereload(server)));
});

/* // for ember handlebar templates
gulp.task('templates', function () {
    return gulp.src(srcPaths.hbs)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(handlebars({ handlebars: require('ember-handlebars')}))
        .pipe(wrap('Ember.Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Ember.TEMPLATES',
            noRedeclare: true,
            processName: function (oldPath) {
                var pathStr = 'assets' + path.sep + 'templates' + path.sep,
                    newPath = oldPath.replace(pathStr, ''),
                    name = declare.processNameByPath(newPath);
                return name.split('.').join('/');
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(gulpif(!args.dev, uglify()))
        .pipe(gulp.dest(destPaths.js))
        .pipe(gulpif(args.dev, livereload(server)));
});*/

gulp.task('coffee', function () {
    return gulp.src(srcPaths.coffee)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(coffee({
            bare: true
        }))
        .pipe(concat('main.min.js'))
        .pipe(gulpif(!args.dev, uglify()))
        .pipe(gulp.dest(destPaths.js))
        .pipe(gulpif(args.dev, livereload(server)));
});

gulp.task('uglify', function() {
    return gulp.src(srcPaths.scripts)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destPaths.js));
});

gulp.task('watch', function () {
    // only watch if in dev
    if (!args.dev) { return; }
    server.listen(lrport);    
    gulp.watch(srcPaths.sass, ['sass', 'sass-ie']);
    gulp.watch(srcPaths.coffee, ['coffee']);
    gulp.watch(srcPaths.hbs, ['templates']);
});