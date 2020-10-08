优化BLOG

之前blog，最近部署blog到服务器上，发现加载速度实在太慢；

故进行一波性能优化；

blog使用了HEXO的NEXT皮肤，这里先考虑使用gulp来压缩文件；

## gulp处理任务流

先安装gulp，以及用到的压缩插件，有HTML-CSS-JS等静态资源;

```
$ npm install gulp -g
$ npm install gulp-minify-css gulp-uglify gulp-htmlmin gulp-htmlclean gulp --save
```

安装完插件后在项目根目录新增`gulpfile.js`配置文件，用来配置gulp的任务流；

```
-gulpfile.js-
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');

// 压缩 public 目录 css
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});

// 压缩 public 目录 html
gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
         removeComments: true,
         minifyJS: true,
         minifyCSS: true,
         minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});

// 压缩 public/js 目录 js
// 指定了src具体要压缩的文件路径，
// 不要重复压缩已经压缩过的文件（否则可能出现问题）
gulp.task("minify-js", function () {
  return gulp
    .src(["./public/js/**/*.js"])  // 这里注意下只压缩*/js/目录下的文件
    .pipe(
      babel({
        presets: ["@babel/env"] // es5检查机制
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("./public/js"));
});

// 执行 gulp 命令时执行的任务
gulp.task(
  "default",
  gulp.series(["minify-html", "minify-css", "minify-js"])
);
```

## 添加脚本

配置完gulp后，在package.json中配置脚本命令；

```
"scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server",
    "upload": "hexo clean & hexo generate & hexo deploy",
    "reload": "hexo clean & hexo generate",
    "gulpBuild": "hexo clean & hexo generate & gulp"            // gulp处理
  },
```

这样我们使用`gulpBuild`就可以在编译生成HEXO项目后，使用gulp进行打包后的压缩处理了

## 添加图片压缩

上面配置只是完成了HTML/CSS/JS的资源压缩，如果博客中图片较多，还需要配置图片压缩插件；

和上面配置一样；

压缩图片我们使用`gulp-imagemin`，这里针对不同的图片格式，会用到`imagemin.mozjpeg/optipng/svgo`;

这里我使用Npm下载的`gulp-imagemin`会报错，提示找不到`imagemin-mozjpeg`这几个插件；

看了下报错信息，提示是npm错误可能是天朝网络原因，使用cpm单独下载这几个插件即可解决；

> 这里处理gif用到的`imagemin-gifsicle`，但使用时添加到pipe任务中，imagemin会报错；
>
> 暂时还没找到处理方法，将处理gif的该插件去除即可正常压缩其他三种图片类型；
>
> 后面考虑使用其他压缩插件来处理gif格式；

```
// 压缩图片
gulp.task("minify-images", function () {
  return gulp
    .src(["./public/**/*.png", "./public/**/*.jpeg", "./public/**/*.svg"])
    .pipe(
      imagemin(
        [
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 7 }),
          imagemin.svgo(),
        ],
        { verbose: true }
      )
    )
    .pipe(gulp.dest("./public"));
});
```

