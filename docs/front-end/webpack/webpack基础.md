## webpack

### 概念

webpack* 是一个现代 JavaScript 应用程序的*静态模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 *bundle\*（ 分块束 ）

Webpack 底层是由 Node.js 来开发的，也就是说 Webpack 的配置文件都是 Node.js 文件

## loader

Loader 可以看作具有文件转换功能的翻译员，配置里的 `module.rules` 数组配置了一组规则，

告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换。（因为 webpack 自身只理解 JavaScript）

- ### 常用 loader

  ### css 类

  - ### css-loader

    解释`@import` 和 `url()`，会 `import/require()` 后再解析它们。

    `css-loader`前应用了`loader`需要指定`importLoaders`选项

  - ### less-loader / sass-loader

    解析 less、scss 为 css 文件

  <hr/>

  ### JS 类

  - ### babel-loader

    `babel-loader`基于`babel`，用于解析`JavaScript`文件。

    `babel`有丰富的预设和插件，`babel`的配置可以直接写到`options`里或者单独写道配置文件里。

    `babel`常用的预设有`@babel/preset-env`、`@babel/plugin-proposal-class-properties`等；

  <hr/>

  ### 其他资源（图片、字体）

  - ### file-loader

    告诉`Webpack`引用的模块是一个文件，并返回其打包后的`url`

  - ### url-loader

    作用与`file-loader`类似，但当文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。

## webpack 插件

Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。

### 常用 webpack plugins

- ### html-webpack-plugin

  当使用 `webpack`打包时，创建一个 `html` 文件，并把 `webpack` 打包后的静态文件自动插入到这个 `html` 文件当中。

- ### optimization.splitChunks

  提取被重复引入的文件，单独生成一个或多个文件，这样避免在多入口重复打包文件。

- ### clean-webpack-plugin

- ### copy-webpack-plugin

## webpack 性能优化

> <https://segmentfault.com/a/1190000018493260>

### 优化编译速度

- ### HappyPack 并行构建 [优化 loader]

  **核心原理：**将 webpack 中最耗时的 loader 文件转换操作任务，分解到多个进程中并行处理，从而减少构建时间。

- ### ParallelUglifyPlugin 并行构建 [优化压缩文件速度]

  **原理：**webpack-parallel-uglify-plugin 能够把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程，从而实现并发编译，进而大幅提升 js 压缩速度

- ### DllPlugin 提前打包公共依赖 [减少打包文件]

  **原理：** 1. 将依赖的第三方模块抽离，打包到一个个单独的动态链接库中；

  2.当需要导入的模块存在动态链接库中时，让其直接从链接库中获取，而不用再去编译第三方库；

  3.这样第三方库就只需要打包一次。

## 基础 webpack 概念及属性

### 打包文件类型

module / chunk / bundle

1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 **module** ；
2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 **chunk** 文件，webpack 会对这个 chunk 文件进行一些操作；
3. webpack 处理好 chunk 文件后，最后会输出 **bundle** 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说一个 chunk 对应一个 bundle；

但也有例外，比如用 `MiniCssExtractPlugin` 从 chunks 0 中抽离出 `index.bundle.css` 文件。

总结：

`module`，`chunk` 和 `bundle` 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：

我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

### filename

filename 用来设置打包后输出的文件名；[官方文档](https://www.webpackjs.com/configuration/output/#output-filename)

```
output: {
	filename: 'js/chunk-[hash].js',
\},
```

这里说一下**[hash]、[chunkhash]、[contenthash]**之间的区别；

- ### hash

  hash 计算是跟整个项目的构建相关，生成的 hash 只要项目中有一个文件修改了，所以文件的 hash 都会更改；

- ### chunkhash

  可以理解为热更新，生成规则是**根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值**；所以只要当前 chunk 内容没有更改，是不会重新生成文件名 hash；

  这样也有利于客户端缓存；
