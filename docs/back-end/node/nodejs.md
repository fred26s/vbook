## nodejs

Node.js 是一个**开发平台**，有对应的编程语言(JS)、运行环境(Chrome V8)；

并且提供了实现了特定功能的API，可以开发控制台程序、桌面应用程序、Web应用程序。



## 优点

- Node.js 是一个基于 `Chrome V8`引擎的 JavaScript 运行环境,让 JavaScript 的执行效率与低端的 C 语言的相近的执行效率。
- Node.js 使用了一个`事件驱动`、`非阻塞式 I/O` 的模型，使其轻量又高效。
- Node.js 的包管理器`npm`，是全球最大的开源库生态系统。



## nodejs的架构组成

Node.js 主要分为四大部分：

- Node Standard Library

  是常用的标准库，如 Http, Buffer 模块。

- Node Bindings

  是沟通 JS 和 C++的桥梁，封装 V8 和 Libuv 的细节，向上层提供基础 API 服务。

- V8，Libuv，C-ares，http_parser、OpenSSL、zlib

  - V8 是 Google 开发的 JavaScript 引擎，提供 JavaScript 运行环境，可以说它就是 Node.js 的发动机。
  - Libuv 是专门为 Node.js 开发的一个封装库，提供跨平台的异步 I/O 能力
  - C-ares：提供了异步处理 DNS 相关的能力。
  - http_parser、OpenSSL、zlib 等：提供包括 http 解析、SSL、数据压缩等其他的能力。

  

![nodejs](http://img.callbackhell.xyz/vuepress/server/nodejs.webp)



## 规范

在nodejs中的模块主要采用commonjs规范：

- 每个文件就是一个模块， 有自己的作用域。
- 每个文件中定义的变量、函数、类都是私有的，对其它文件不可见
- 每个模块内部可以通过 `exports` 或者 `module.exports` 对外暴露接口
- 每个模块通过 `require` 加载另外的模块

> nodejs从v13.x版本开始，原生支持了 es6 module；
>
> 不需要修改文件后缀名，只需要在 package.json 中添加 `{"type": "module"}`属性。

## 

## 常用API

- fs：常用于文件的查看，编辑，创建等操作；`fs`模块同时提供了异步和同步的方法。

  - 异步读取文件 readFile
  - 同步读文件 readFileSync
  - 异步写文件 writeFile 
  - 同步写文件 writeFileSync
  - 文件或目录的详细信息 stat

- http：网络的关键模块

  - http.createServer()

  ```js
  // 导入http模块:
  var http = require('http');
  
  // 创建http server，并传入回调函数:
  var server = http.createServer(function (request, response) {
      // 回调函数接收request和response对象,
      // 获得HTTP请求的method和url:
      console.log(request.method + ': ' + request.url);
      // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
      response.writeHead(200, {'Content-Type': 'text/html'});
      // 将HTTP响应的HTML内容写入response:
      response.end('<h1>Hello world!</h1>');
  });
  
  // 让服务器监听8080端口:
  server.listen(8080);
  
  console.log('Server is running at http://127.0.0.1:8080/');
  ```

  

- socket：socket网络通信

- events：事件模块

- path： 路经相关

















> 参考资料：
>
> [深入nodejs](https://www.hlwen.com/2022/03/28/471.html)
>
> [为什么要使用Nodejs](https://juejin.cn/post/6844903441890967565)