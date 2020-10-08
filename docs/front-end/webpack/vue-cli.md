## vue-cli 概述

Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统；

作用就是让团队精简化 webpack 配置，不必过多精力放在配置上；

而是给开发者一定的默认配置，这些配置可以支持常规下的开发需求，并且也提供了可扩展的空间。

也就是说，用上 vue-cli4，你不用再纠结 webpack 配置了！

无论是生成项目结构，还是增加插件配置， 用我 vue-cli 封装的命令和配置规则就 ok。

## 组成

`vue-cli`脚手架也是由几部分单独模块构成；

- ### CLI

  CLI (`@vue/cli`) 是一个全局安装的 npm 包，提供了终端里的 `vue` 命令。

- ### CLI 服务

  CLI 服务 (`@vue/cli-service`) 是一个开发环境依赖。

- ### CLI 插件

  CLI 插件是向你的 Vue 项目提供可选功能的 npm 包，例如 Babel/TypeScript 转译、ESLint 集成、单元测试和 end-to-end 测试等。

## 开发模式

**模式**是 Vue CLI 项目中一个重要的概念。默认情况下，一个 Vue CLI 项目有三个模式：

- `development` 模式用于 `vue-cli-service serve`
- `production` 模式用于 `vue-cli-service build` 和 `vue-cli-service test:e2e`
- `test` 模式用于 `vue-cli-service test:unit`

所以我们在对应的模式中，可以直接使用全局变量`process.env.NODE_ENV`来区分当前模式；

## webpack 配置

> 详细介绍了<https://forum.vuejs.org/t/chainwebpack-configurewebpack/68750>

## 插件使用

vue-cli 因为是 webpack 的上层封装，所以在`vue.config.js`配置文件中的``configureWebpack` `中

无缝支持了 webpack 的插件使用；

使用方法和 webpack 中一致，

webpack 中是在`webpack.config.js`中这样配置插件：

```
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```

所以对等的来看`vue.config.js`中的配置：

```
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```

好吧，说白了`configureWebpack`就是对原`webpack.config.js`中配置的补充合并和覆盖；

在`vue.config.js`中以增量的形式去配置插件以及属性；

具体使用方法[官方 Vue-cli 文档](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)有很详细的介绍，不赘述；

## 拆分打包文件

默认 webpack 会将所有 node_modules 中引用的三方库打包进一个`vendors`文件包，

一个文件过大，常常超过 1~2mb，这样是不利于首页加载的；所以我们需要对三方库引入的包进行打包拆分；

这里使用`webpack`内置的拆分插件， `SplitChunksPlugin`;

这个插件功能强大，可以配置打包类型，打包方式，打包偏好（正则匹配文件），打包文件大小等；

下面是一个拆分配置示例：

着重说一下`chunks`和`cacheGroups`配置

- **chunks:**

  all: 不管文件是动态还是非动态载入，统一将文件分离。当页面首次载入会引入所有的包

  async： 将异步加载的文件分离，首次一般不引入，到需要异步引入的组件才会引入。

  initial：将异步和非异步的文件分离，如果一个文件被异步引入也被非异步引入，那它会被打包两次（注意和 all 区别），用于分离页面首次需要加载的包。

- ### cacheGroups

  用来定制分割包的规则，会继承和覆盖 splitChunks 的配置项；

  priority：设置缓存组打包的优先级

  test: 可以配置正则和写入 function 作为打包规则

  chunks：打包类型

```
chainWebpack: config => {
    // 忽略打包的模块
    config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

    // 拆分打包文件
    config.optimization.splitChunks({
      chunks: 'all', // initial, async ,all三种拆分类型
      minSize: 30000, // 形成一个新代码块最小的体积
      maxAsyncRequests: 5, // 按需加载时最大的并行请求数
      maxInitialRequests: 3, // 最大初始化请求数
      automaticNameDelimiter: '~', // 打包分割符
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'initial',
          priority: 10,
          minChunks: 2,
        },
        antdesigns: {
          test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
          name: 'antdesigns',
          chunks: 'all',
          priority: 20,
        },
        antdesignVue: {
          test: /[\\/]node_modules[\\/](ant-design-vue)[\\/]/,
          name: 'antdesingVue',
          chunks: 'all',
          priority: 30,
        },
      },
    })
  },
```

-
