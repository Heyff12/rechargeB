/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-less gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr gulp-autoprefixer gulp-rev-append gulp-shell amd-optimize fs path browser-sync del --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩
    less = require('gulp-less'), //less
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    autoprefixer = require('gulp-autoprefixer'), //使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀
    rev = require('gulp-rev-append'), //给页面的引用添加版本号，清除页面引用缓存
    shell = require('gulp-shell'),
    amdOptimize = require('amd-optimize'),
    fs = require('fs'),
    path = require('path'),
    browserSync = require('browser-sync'),
    del = require('del'),
    tinylr = require('tiny-lr'), //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload'); //livereload
var file_road = {
    cssSrc: './src/less/**/*.less',
    cssSrc_mid: './src/css',
    cssDst: './dest/css',
    jsSrc: './src/js/**/*.js',
    jsDst: './dest/js',
    imgSrc: './src/img/**/*',
    imgDst: './dest/img',
    htmlSrc: './src/*.html',
    htmlDst: './dest',
    w_cssSrc: 'src/less/**/*.less',
    w_jsSrc: 'src/js/**/*.js',
    w_imgSrc: 'src/img/**/*',
    src_source: './src/**/*',
    w_src_source: 'src/**/*',
    w_dst_source: './dest/',
};
// 样式处理
gulp.task('css', function() {
    gulp.src(file_road.cssSrc)
        .pipe(less({ style: 'expanded' }))
        //.pipe(gulp.dest(file_road.cssSrc_mid))             //编译成css文件后的中间文件夹--不需要
        //.pipe(rename({ suffix: '.min' }))    //添加后缀--不需要
        //.pipe(minifycss())                   //todo暂时隐藏压缩
        .pipe(livereload(server))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'last 2 Explorer versions', 'last 3 Safari versions', 'Firefox >= 20', '> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：//-webkit-transform: rotate(45deg);transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest(file_road.cssDst));
    //收到合并指定文件---不需要
    // gulp.src(['./src/less/lib/date/*.less', './src/less/common/common.less', './src/less/recharge.less'])
    //     .pipe(less())
    //     .pipe(concat('recharge_min.css'))
    //     //.pipe(rename({ suffix: '.min' }))
    //     .pipe(minifycss())
    //     .pipe(livereload(server))
    //     .pipe(gulp.dest('./dest/css')); 
});

//语法检查
gulp.task('jshint', function() {
    return gulp.src(file_road.jsSrc)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// js处理
gulp.task('js', function() {
    gulp.src(file_road.jsSrc)
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))   //全部合并成一个js--不需要
        //.pipe(gulp.dest(jsDst))    //上一步的输出全部合并成一个js--不需要
        //.pipe(rename({ suffix: '.min' }))   //添加后缀--不需要
        //.pipe(uglify())                //隐藏压缩--同下一个--不需要
        // .pipe(uglify({                //todo暂时隐藏压缩
        //     mangle: true,//类型：Boolean 默认：true 是否修改变量名
        //     compress: true,//类型：Boolean 默认：true 是否完全压缩
        //     preserveComments: 'all' //保留所有注释
        // }))
        .pipe(livereload(server))
        .pipe(gulp.dest(file_road.jsDst));
    //收到合并指定文件---不需要    
    // gulp.src(['./src/js/lib/date/*.js', './src/js/recharge/*.js'])
    //     .pipe(jshint.reporter('default'))
    //     .pipe(concat('recharge_min.js'))
    //     .pipe(rename({ suffix: '.min' }))
    //     .pipe(uglify())
    //     .pipe(livereload(server))
    //     .pipe(gulp.dest('./dest/js'));
});

// 图片处理
gulp.task('images', function() {
    gulp.src(file_road.imgSrc)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(livereload(server))
        .pipe(gulp.dest(file_road.imgDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(file_road.w_dst_source, { read: false })
        .pipe(clean());
});

// HTML处理--不使用
gulp.task('html', function() {
    gulp.src(file_road.htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(file_road.htmlDst))
});


// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {

    server.listen(port, function(err) {
        if (err) {
            return console.log(err);
        }
        // 监听html
        // gulp.watch('./src/*.html', function(event){
        //     gulp.run('html');
        // });

        // 监听css
        gulp.watch('src/less/**/*.less', function() {
            gulp.run('css');
        });

        // 监听images
        gulp.watch(file_road.w_imgSrc, function() {
            gulp.run('images');
        });

        // 监听js
        gulp.watch(file_road.w_jsSrc, function() {
            gulp.run('js');
        });

    });
    var watcher = gulp.watch(file_road.w_src_source);
    watcher.on('change', function(event) {
        //console.log(event.type);
        if (event.type === 'deleted') {
            var src = path.relative(path.resolve('src'), event.path);
            //console.log(src);
            src = src.replace(/.es6$/, '.js');
            if(src.split('/')[0]=='less'){
                //src=src.split('.')[0]+'.css';
                src=src.replace(/less/g,'css');
            }
            //console.log(src);
            var dest = path.resolve(file_road.w_dst_source, src);
            del.sync(dest);
        }
    });
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', ['clean', 'jshint'], function() {
//     gulp.start('css', 'images', 'js', 'watch');
// });
gulp.task('default', ['clean', 'jshint'], function() {
    gulp.start('css', 'images', 'js', 'watch');
});
