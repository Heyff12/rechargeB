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
    rev = require('gulp-rev-append'),//给页面的引用添加版本号，清除页面引用缓存
    shell = require('gulp-shell'), 
    amdOptimize = require('amd-optimize'),
    tinylr = require('tiny-lr'), //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload'); //livereload
//测试1-----监听及时添加删除文件    
var fs = require('fs');
var path = require('path');
var browserSync = require('browser-sync');
//测试1-----监听及时添加删除文件
//测试2-----监听及时添加删除文件    
var chokidar = require('chokidar');
//测试2-----监听及时添加删除文件
var del = require('del');

// 样式处理
gulp.task('css', function() {
    var cssSrc = './src/less/**/*.less',
        cssmid = './src/css',
        cssDst = './dest/css';

    gulp.src(cssSrc)
        .pipe(less({ style: 'expanded' }))
        //.pipe(gulp.dest(cssmid))
        //.pipe(rename({ suffix: '.min' }))    //添加后缀--不需要
        //.pipe(minifycss())             //todo暂时隐藏压缩
        .pipe(livereload(server))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0','last 2 Explorer versions','last 3 Safari versions','Firefox >= 20','> 5%'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest(cssDst));
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
    return gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// js处理
gulp.task('js', function() {
    var jsSrc = './src/js/**/*.js',
        jsDst = './dest/js';

    gulp.src(jsSrc)
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))   //全部合并成一个js--不需要
        //.pipe(gulp.dest(jsDst))    //上一步的输出全部合并成一个js--不需要
        //.pipe(rename({ suffix: '.min' }))   //添加后缀--不需要
        //.pipe(uglify())                //todo暂时隐藏压缩
        // .pipe(uglify({                //todo暂时隐藏压缩
        //     mangle: true,//类型：Boolean 默认：true 是否修改变量名
        //     compress: true,//类型：Boolean 默认：true 是否完全压缩
        //     preserveComments: 'all' //保留所有注释
        // }))
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
    gulp.src(['./src/js/lib/date/*.js', './src/js/recharge/*.js'])
        .pipe(jshint.reporter('default'))
        .pipe(concat('recharge_min.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest('./dest/js'));
});

// 图片处理
gulp.task('images', function() {
    var imgSrc = './src/img/**/*',
        imgDst = './dest/img';
    gulp.src(imgSrc)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dest/css', './dest/js', './dest/img'], { read: false })
        .pipe(clean());
});

// HTML处理--不使用
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dest';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

//控制版本号--测试文件--activity_detail.html
gulp.task('testRev', function () {
    gulp.src('./b/**/*.html')
        .pipe(rev())
        .pipe(gulp.dest('./c/'));
});
//合并模块--测试文件--activity_detail.html
gulp.task('bundle', function () {
  return gulp.src('./src/js/**/*.js')
    .pipe(amdOptimize('./src/js/test', {
      configFile: './src/js/require-config.js',
      findNestedDependencies: true,
      include: false
    }))
    .pipe(concat('test.js'))
    // .pipe(uglifyJS('test.js'))
    .pipe(gulp.dest('./dist/js'));
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
        // })

        // 监听css
        gulp.watch('src/less/**/*.less', function() {
            gulp.run('css');
        });

        // 监听images
        gulp.watch('src/img/**/*', function() {
            gulp.run('images');
        });

        // 监听js
        gulp.watch('src/js/**/*.js', function() {
            gulp.run('js');
        });

    });
    var watcher = gulp.watch(['src/**/*']);
    watcher.on('change', function (event) {
        //console.log(event.type);
        if (event.type === 'deleted') {
            var src = path.relative(path.resolve('src'), event.path);
            console.log(src);
            src = src.replace(/.es6$/, '.js');
            //console.log(path.resolve('src'));
            console.log(src);
            var dest = path.resolve('./dest/', src);
            del.sync(dest);
        }
    });
    //测试2-----监听及时添加删除文件 start-----------------------------------------------------------------  
    // One-liner for current directory, ignores .dotfiles
    // chokidar.watch('src/**/*', {ignored: /[\/\\]\./}).on('all', (event, path) => {
    //   console.log(event, path);
    //   if(event=='add'){
    //     watcher.add(path);
    //   }
    // });
    //测试2-----监听及时添加删除文件end-----------------------------------------------------------------
});
//测试监听及时添加删除文件---start-----------------------------------------------------------------
// 创建多层目录
function mkdirs(dirname, mode, callback){
    fs.exists(dirname, function (exists){
        if(exists){
            callback();
        }else{
            console.log(path.dirname(dirname));
            mkdirs(path.dirname(dirname), mode, function (){
                fs.mkdir(dirname, mode, callback);
            });
        }
    });
}
// 拷贝文件
function copyfile(oldPath, newPath) {
    console.log('复制'+oldPath+' -> '+newPath);
    
    var stat = fs.lstatSync(oldPath);
    if(stat.isDirectory()) {
        console.log(oldPath+'是目录');
        return false;
    }
    
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);
    readStream.pipe(writeStream);
    readStream.on('end', function () {
        console.log('copy end');
    });
    readStream.on('error', function () {
        console.log('copy error');
    });
}
// 监听任务 运行语句 gulp watch
// gulp.task('watch',function(){
//     server.listen(port, function(err){
//         if (err) {
//             return console.log(err);
//         }
        
//         //拷贝修改过的文件
//         gulp.watch('./src/**/**', function(e) {
//             console.log(e);
//             var oldPath = e.path;
//             var newPath = oldPath.replace('\\src\\', '\\target\\');
//             var newDirPathTemp = newPath.split("\\");
//             var currentPath = fs.realpathSync('.');
//             var newDirPath = [];
//             for(var i = 0; i < newDirPathTemp.length-1; i++) {
//                 newDirPath[i] = newDirPathTemp[i];
//             }
//             newDirPath = newDirPath.join("\\");
//             newDirPath = newDirPath.replace(currentPath, '');
//             newDirPath = newDirPath.replace(/\\/g, "/");
//             newDirPath = newDirPath.replace("/", "./");
//             //console.log('当前路径'+newDirPath);
            
//             // 修改或增加时
//             if('added' == e.type || 'changed' == e.type || 'renamed' == e.type) {
//                 // 判断目录是否存在，不存在则创建
//                 fs.exists(newDirPath, function(exists){ 
//                     if(exists){ 
//                         //console.log("文件夹存在");
//                         copyfile(oldPath, newPath);
//                     } else {
//                         //console.log("文件夹不存在，则创建目录");
//                         mkdirs(newDirPath);
                        
//                         // 延时，等待目录创建完成
//                         setTimeout(function(){
//                             copyfile(oldPath, newPath);
//                         }, 200);
//                     }
//                 });
//             } else if('deleted' == e.type) { //删除
//                 fs.unlink(newPath, function(err){
//                     console.log('删除'+newPath+err);
//                 });
//             }
//         });

//         // 监听html
//         // gulp.watch('./src/*.html', function(event){
//         //     gulp.run('html');
//         // })

//         // 监听css
//         gulp.watch('./src/less/**/*.less', function() {
//             gulp.run('css');
//         });

//         // 监听images
//         gulp.watch('./src/img/**/*', function() {
//             gulp.run('images');
//         });

//         // 监听js
//         gulp.watch('./src/js/**/*.js', function() {
//             gulp.run('js');
//         });
        
//     });
    
//     // 实时同步到浏览器
//     browserSync.init(['./src/css/*', './src/js/*', './src/img/**/*'], {
//         //静态服务
//         // server: {
//         //     baseDir: "./dest"
//         // }
        
        
//         // 代理模式
//         //proxy: "dz.com"
//     });
    
// });
//测试监听及时添加删除文件---end-----------------------------------------------------------------



// 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', ['clean', 'jshint'], function() {
//     gulp.start('css', 'images', 'js', 'watch');
// });
gulp.task('default', function() {
    gulp.start('css', 'images', 'js', 'watch');
});


