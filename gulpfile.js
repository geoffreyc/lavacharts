  var gulp = require('gulp'),
     gutil = require('gulp-util'),
      bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
   stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
   replace = require('gulp-replace'),
sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
      argv = require('yargs').array('browsers').argv;

var pkg = require('./package.json');


gulp.task('default', [
    'jshint',
    'browserify'
]);

gulp.task('browserify', function (done) {
    var fs = require('fs'),
browserify = require('browserify'),
  watchify = require('watchify');

    var b = browserify({
        debug: pkg.config.debug,
        entries: [pkg.config.entry],
        cache: {},
        packageCache: {},
        plugin: [watchify]
    });

    function bundle() {
        b.bundle()
        .on('error', function(err){
            if (err instanceof SyntaxError) {
                gutil.log(gutil.colors.red('Syntax Error'));
                console.log(err.message);
                // console.log(err.filename+":"+err.loc.line);
                console.log(err.codeFrame);
            } else {
                gutil.log(gutil.colors.red('Error'), err.message);
            }
            this.emit('end');
        })
        .pipe(fs.createWriteStream('./javascript/dist/lava.js'));
    }

    b.on('log', function (msg) {
        gutil.log(gutil.colors.green(msg));
    });

    b.on('update', bundle);

    bundle();
});

gulp.task('jshint', function (done) {
    return gulp.src('./javascript/src/**/*.js')
               .pipe(jshint())
               .pipe(jshint.reporter(stylish));
});

gulp.task('karma', function (done) {
    var karma = require('karma');

    var server = new karma.Server({
        configFile: 'karma.conf.js',
        singleRun: argv.dev ? false : true
    }, function(exitStatus) {
        done(exitStatus ? "There are failing unit tests" : undefined);
    });

    server.start();
});

gulp.task('bump', function (done) { //-v=1.2.3
    var version = argv.v;
    var minorVersion = version.slice(0, -2);

    gulp.src('./package.json')
        .pipe(bump({version:argv.v}))
        .pipe(gulp.dest('./'));

    gulp.src(['./README.md', './.travis.yml'])
        .pipe(replace(/("|=|\/|-)[0-9]+\.[0-9]+/g, '$1'+minorVersion))
        .pipe(gulp.dest('./'));
});
