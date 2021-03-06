"use strict";

var pkg = require('./package.json');

var del = require('del');
var glob = require("glob");
var merge = require('merge-stream');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var proxyquire = require('proxyquireify');
var requireUncached = require('require-uncached');


var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require("gulp-bump");
var yuidoc = require("gulp-yuidoc");
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var ignore = require('gulp-ignore');
var header = require('gulp-header');
var markdown = require('gulp-markdown');
var webserver = require('gulp-webserver');
var cached = require('gulp-cached');


//var debug = require('gulp-debug');
// var using = require('gulp-using');

var banner= '/*<%= pkg.name %> - v<%= pkg.version %> - <%= new Date() %> */\n';

var paths = {
    files: {
        jsSrc: 'src/**/**/*.js',
        libSrc: 'src/lib/**/*.js',
        indexSrc: 'src/lib/index.js',
        modelsSrc: 'src/lib/models/*.js',
        effectsSrc: 'src/lib/effects/*.js',
        coreSrc: 'src/lib/core/*.js',
        allTestSrc: 'test/**/*.js',
        unitTestCases: 'test/unit/cases/**/*.js',
        builtSrc : 'build/**/*.js',
        packageData : ['LICENSE', 'package.json', 'README.md'],
        publishableSrc : ['src/lib/models/*.js', 'src/lib/effects/*.js', 'src/lib/core/SPAudioParam.js','src/lib/core/BaseSound.js', 'src/lib/core/BaseEffect.js', 'src/lib/core/SPAudioBuffer.js']
    },
    dirs: {
        build: 'build/',
        dist: 'dist/',
        src: 'src/',
        lib: 'src/lib/',
        core: 'src/lib/core/',
        models: 'src/lib/models/',
        apiDocs: 'docs/api/',
        yuiDocSrc: 'docs/yuidocs/',
        yuiDocTheme: 'docs/yuitheme/',
        test : 'test/',
        unittest: 'test/unit/',
        integration: 'test/integration/',
        manualtest: 'test/manual/'
    },
};

/*
**** Documentation ****
*/

var yuiParserOpts = {
    project: {
        "name": pkg.name,
        "description": pkg.description,
        "version": pkg.version,
        "url": pkg.homepage,
        "logo": 'http://sonoport.com/img/Logo.png',
    },
};


gulp.task('publishdocs', function() {
    var generatorOpt = {
        themedir: paths.dirs.themedir,
        linkNatives: "true",
        nocode: "true"
    };

    var ignoreFiles = ignore.exclude('**/files/**');

    return gulp.src(paths.files.publishableSrc)
    .pipe(yuidoc.parser(yuiParserOpts))
    .pipe(yuidoc.generator(generatorOpt))
    .pipe(ignoreFiles)
    .pipe(gulp.dest(paths.dirs.apiDocs));
});

gulp.task('publishdev', function(){
    return gulp.src('src/docs/dev/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('docs/dev/'));
});

/*
**** Hinting and Code Style
*/

gulp.task('jshint:src', function(){
    return gulp.src([paths.files.jsSrc, 'package.json', 'Gulpfile.js', '!src/docs/yuitheme/**/*.js', '!src/**/AudioContextMonkeyPatch.js'])
    .pipe(cached('jshint:src'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jsbeautify:src', ['jshint:src'], function(){
    return gulp.src(paths.files.libSrc)
    .pipe(cached('beautify:src'))
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest(paths.dirs.lib));
});

/*
**** Builds ****
*/

gulp.task('build',['devbuild']);

// Returns an array of Gulp Streams
function createBundlerStreams(globPattern, destDir, transforms){
    var moduleStripRegex = /.*\//;
    var extStripRegex = /\.js/;
    return glob.sync(globPattern).map(function (thisFile){
        gutil.log("Bundling ", thisFile);
        var fileName = thisFile.replace(moduleStripRegex,'');
        var bundleName = fileName.replace(extStripRegex,'');
        var bundler = browserify({
            plugin : "browserify-derequire",
            entries: ["./" + thisFile],
            standalone: bundleName
        });
        if (transforms){
            bundler.transform({
              global: true
          }, transforms);
        }
        return bundler
        .bundle()
        .pipe(source(fileName))
        .pipe(gulp.dest(destDir));
    });
}

gulp.task('devbuild',['jsbeautify:src'], function(){

    del([paths.dirs.build], function () {
        console.log('Cleaning old built assets.');
    });

    var modelStreams = createBundlerStreams(paths.files.modelsSrc, 'build/models/');
    var effectsStreams = createBundlerStreams(paths.files.effectsSrc, 'build/effects/');
    var coreStream = createBundlerStreams(paths.files.coreSrc, 'build/core/');
    var indexStream = gulp.src(paths.files.indexSrc).pipe(gulp.dest(paths.dirs.build));
    var packageDataStream = gulp.src(paths.files.packageData).pipe(gulp.dest(paths.dirs.build));

    var combinedStreams = modelStreams.concat(effectsStreams).concat(coreStream).concat(indexStream).concat(packageDataStream);



    return merge.apply(this,combinedStreams);
});

gulp.task('releasebuild',['jsbeautify:src'], function(){

    del([paths.dirs.build], function () {
        console.log('Cleaning old built assets.');
    });

    var modelStreams = createBundlerStreams(paths.files.modelsSrc, 'build/models/', 'uglifyify');
    var effectsStreams = createBundlerStreams(paths.files.effectsSrc, 'build/effects/', 'uglifyify');
    var coreStream = createBundlerStreams('src/lib/core/SPAudioBuffer.js', 'build/core/', 'uglifyify');
    var indexStream = gulp.src(paths.files.indexSrc).pipe(gulp.dest(paths.dirs.build));

    var combinedStreams = modelStreams.concat(effectsStreams).concat(coreStream).concat(indexStream);

    return merge.apply(this,combinedStreams);
});

gulp.task('watch:lib', function(){
    gulp.watch(paths.files.libSrc, ['devbuild']);
});

/*
**** Version Bumping ****
*/

gulp.task('bump:major', function(){
  var packageStream =  gulp.src('./package.json')
  .pipe(bump({type: 'major'}))
  .pipe(gulp.dest('./'));

  var bowerStream =  gulp.src('./bower.json')
  .pipe(bump({type: 'major'}))
  .pipe(gulp.dest('./'));

  return merge(packageStream,bowerStream);
});

gulp.task('bump:minor', function(){
  var packageStream =  gulp.src('./package.json')
  .pipe(bump({type: 'minor'}))
  .pipe(gulp.dest('./'));

  var bowerStream =  gulp.src('./bower.json')
  .pipe(bump({type: 'minor'}))
  .pipe(gulp.dest('./'));

  return merge(packageStream,bowerStream);
});

gulp.task('bump:patch', function(){
  var packageStream =  gulp.src('./package.json')
  .pipe(bump({type: 'patch'}))
  .pipe(gulp.dest('./'));

  var bowerStream =  gulp.src('./bower.json')
  .pipe(bump({type: 'patch'}))
  .pipe(gulp.dest('./'));

  return merge(packageStream,bowerStream);
});

/*
**** Release ****
*/


gulp.task('release', ['releasebuild', 'publishdocs', 'publishdev'], function(){
    pkg = requireUncached('./package.json');
    gutil.log("Creating the ", pkg.version, " release.");

    var builtFileStream = gulp.src(paths.files.builtSrc)
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(paths.dirs.dist));

    var packageDataStream = gulp.src(paths.files.packageData)
    .pipe(gulp.dest(paths.dirs.dist));

    return merge(builtFileStream,packageDataStream);
});

gulp.task('release:testbuild', ['bump:pre', 'releasebuild', 'publishdocs'], function(){
    pkg = requireUncached('./package.json');
    gutil.log("Creating the ", pkg.version, " test release.");

    var builtFileStream = gulp.src(paths.files.builtSrc)
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest(paths.dirs.dist));

    var packageDataStream = gulp.src(paths.files.packageData)
    .pipe(gulp.dest(paths.dirs.dist));

    return merge(builtFileStream,packageDataStream);
});

gulp.task('bump:pre', function(){
  return gulp.src('./package.json')
  .pipe(bump({type: 'prerelease'}))
  .pipe(gulp.dest('./'));
});


/*
**** Testing ****
*/


gulp.task('jsbeautify:test', function(){
    return gulp.src([paths.files.allTestSrc, '!test/unit/vendor/**'])
    .pipe(cached('beautify:test'))
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest(paths.dirs.test));
});

gulp.task('watch:test', ['watch:lib'], function(){
    gulp.watch(paths.files.allTestSrc, ['jsbeautify:test']);
});

gulp.task('test', ['devbuild'], function(){
    return gulp.src([paths.dirs.manualtest, paths.dirs.build])
    .pipe(webserver({
        port: 8080,
        open: true,
        host : "0.0.0.0"
    }));
});

gulp.task('watch:unittest', ['watch:lib'], function(){
    gulp.watch([paths.files.unitTestCases, './test/unit/spec_entry.js'], ['unittestbuild']);
});

gulp.task('unittestbuild',['jsbeautify:test'], function(){

    del(['test/unit/test_bundle.js'], function () {
        console.log('Cleaning old built assets.');
    });

    var bundler = browserify({
        entries: ['./test/unit/spec_entry.js'],
        paths : [paths.dirs.lib],
    });
    return bundler
    .plugin(proxyquire.plugin)
    .bundle()
    .pipe(source('test_bundle.js'))
    .pipe(gulp.dest('test/unit/'));
});

gulp.task('unittest', ['jsbeautify:src', 'unittestbuild', 'watch:unittest'], function(){
    return gulp.src([paths.dirs.unittest, paths.dirs.build])
    .pipe(webserver({
        port: 8081,
        open: true,
        host : "0.0.0.0"
    }));
});

gulp.task('integration', function(){
    return gulp.src([paths.dirs.integration, paths.dirs.build])
    .pipe(webserver({
        port: 8082,
         open: true,
        host : "0.0.0.0"
    }));

});
