## 什么是vite

Vite (法语意为 "快速的"，发音 `/vit/`) 是一种**新型前端构建工具**，能够显著提升前端开发体验。

它主要由两部分组成：

- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](https://vitejs.bootcss.com/guide/features.html)，如速度快到惊人的 [模块热更新（HMR）](https://vitejs.bootcss.com/guide/features.html#hot-module-replacement)。
- 一套构建指令，它使用 [Rollup](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

## vite和webpack

- webpack

  成熟的构建打包工具，但其在开发和生产环境都会打包所有依赖，速度较慢；

  由于webpack对于所有运行资源进行了提前编译处理，对依赖模块进行了语法分析转义，最终的结果就是模块被打包到内存中。

- 而vite是一个**新型构建工具**

  优势：

  Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

  遵循着打包少、预处理的方式，让vite只有在运行第一次的时候进行依赖的打包处理；

  并且在运行中由于依赖着esmodule可以将文件采用import方式直接引入浏览器，这样就不用把文件打包到一起，而是采用esbuild对于语法的解析转换（如：ts、jsx等），这样就可以只需要在浏览器请求源码时进行转换并按需提供源码；

  **实际上是让浏览器接管了打包程序的部分工作**

  Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

**按需加载：**

- vite 只有在你真正的需要加载的时候，浏览器才会发送import请求，去请求文件中的内容，所以才说vite才是真正的按需加载
- webpack其实在开始构建打包的时候，还是对所有的文件进行一次打包构建，只是在webpack遇到 import( * ) 这种语法的时候,会另外生成一个chunk; 只有在合适的时候去加载import中的内容

## 生产环境仍需打包

Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](https://vitejs.bootcss.com/guide/dep-pre-bundling.html)。Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

1. **打包功能- 代码分割、CSS处理等**

   但虽然 `esbuild` 快得惊人，并且已经是一个在构建库方面比较出色的工具，但一些针对构建 *应用* 的重要功能仍然还在持续开发中 —— 特别是**代码分割和 CSS 处理方面**。

2. **原生 ESM效率低下**

   尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。

就目前来说，Rollup 在应用打包方面更加成熟和灵活，更适合生产环境打包。



## Vite 的劣势

- **兼容性**

  无论是 dev 还是 build 都会直接打出 ESM 版本的代码包，这就要求客户浏览器需要有一个比较新的版本，这放在现在的国情下还是有点难度的

- **代价**

  工程化本身的复杂度不会凭空消失，只 Vite 背后的团队在帮我们负重前行，这对 Vite 开发团队而言，维护这么多构建规则是一个不小的负担。而站在用户的角度，越容易上手的工具往往意味着越难被定制。

  如果只是在 Vite 预设好的边框里面玩确实很容易，但随着项目复杂度的提高，用户迟早还是会接触到底层的 esbuild 或 Rollup，高工们该补的知识还是迟早还是得补回来，逃不掉的。

  



## 配置文件













> ## 什么是ESM
>
> 是 Javascript 提出的实现一个标准模块系统的方案,在很多现代浏览器可以使用. 可以在 HTML 中调用，但是需要在 `script` 标签上添加属性 `type=‘module’`。
>
> ```
> <script type="module">
>  import {func1} from 'my-lib';
>  func1();
> </script>
> ```
>
> 可以导入本地的文件、库或者远程模块。(静态)
>
> ```
> import { createStore } from "https://unpkg.com/redux@4.0.5/es/redux.mjs";
> import * as myModule from './util.js';
> ```
>
> 除了能够静态导入，还可以动态导入。ES模块实际上是JavaScript对象：我们可以解构它们的属性以及调用它们的任何公开方法。 
> 使用动态导入可以拆分代码，只在适当的时候加载重要的代码。
>
> 在 JavaScript 引入动态导入之前，这种模式是webpack(模块绑定器)独有的。 像`React`和`Vue`通过动态导入代码拆分来加载响应事件的代码块，比如用户交互或路由更改。













