## koa

Koa2 这个现在是 Koa 的默认版本，与 Koa1 最大的区别是**使用 ES7 的 Async/Await 替换了原来的 Generator + co 的模式，也无需引入第三方库，底层原生支持，Async/Await 现在也称为 JS 异步的终极解决方案**。

## koa和koa2

最大区别是实现方式：

- koa2实现异步是通过async/awaite
- koa1实现异步是通过generator/yield
- 而express实现异步是通过回调函数的方式。

进而说明了框架根据ES语法的进步而随之更新，可以看出各自的优缺点：

- **Express**

  - 优点

    - **为了降低人们的重复性劳动，更高效的使用nodejs搭建web服务**，人们开始发明各种轮子。express就是其中最流行的web框架

    - Express总体来说是相对大而全，API 较为丰富的框架。

      > 提供了例如路由、表单解析等功能模块，中后期做了大量的拆分，将大部分模块都独立出来官方自行维护。

      

  - 缺点

    - 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求

      而 callback 随着逻辑增多，会出现**callback hell的问题**

- **koa**

  - 优点

    - api简洁。

      koa的 context，也就是 ctx，可以通过 ctx.request 和 ctx.reponse 进行直接访问，原来 Express 两个独立对象做的事情

    - 中间件机制使用**洋葱模型**

- **koa2**

  - 优点

    - **结合了async/await**最新的语法来解决异步回调的洋葱模型问题

    - **源码精简**，轻量、优雅，仅提供web服务最基础的函数库

      koa2的源码只有四个文件，500行左右。只提供封装好http上下文、请求、响应，以及基于async/await的中间件调用机制。

## 洋葱模型

在 `koa` 中，中间件被 `next()` 方法分成了两部分。`next()` 方法上面部分会先执行，下面部门会在后续中间件执行全部结束之后再执行。

koa的中间件执行流程也就很形象的被称为**洋葱模型**，区分于express的回调执行顺序。

但是koa1和koa2的实现方式也不相同。

### koa1洋葱模型

koa1使用了generator函数来实现，实现模型类似于：

```js
function *foo(){
  console.log('foo');
  yield 'b'
  console.log('end foo');
}
function *next() {
  console.log('next');
  yield *foo()
  console.log('next end')
}

var g = next();
g.next();
g.next();
g.next();
// opuput:
// next
// foo
// end foo
// next end
```

koa1的中间件使用举例：

其内部原理是：**每次use的时候将gen放于middleware数组中，并且通过`koa-compose`， `co`库将这些中间组成fn, 然后每来一个请求都会将fn作为回调函数来处理请求；**

```js
app.use(function *(next) {
  var start = new Date()
  yield next
  var ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})
```



### koa2洋葱模型

koa2去除generator的方式，而使用ES7的async wait的方式来实现中间件模式开发，每个中间件都是返回一个Promise的函数，并且每个Promise里都会有next()的调用来指代下一个中间件，

简单版例如： 

```js
// 函数处理的数据
let context = {}

function middleware_01 (cxt) {
  console.log('middleware_01 start')
  // 本质上 这就是next()函数，指向了下一个要调用的函数名称
  middleware_02(cxt)
  console.log('middleware_01 end')
}

function middleware_02 (cxt) {
  console.log('middleware_02 start')
  middleware_03(cxt)
  console.log('middleware_02 end')
}

function middleware_03 (cxt) {
  console.log('middleware_03 start')
  console.log('middleware_03 end')
}

// 调用中间件 compose 函数
function compose () {
  // 默认调用第一个中间件
  middleware_01(context)
}

compose()
```

所以再增加next()函数后，也可以写成如下格式：

```js
const App = function () {
  // 中间件公共的处理数据
  let context = {}
  // 中间件队列
  let middlewares = []
  return {
    // 将中间件放入队列中
    use (fn) {
      middlewares.push(fn)
    },
    // 调用中间件
    callback () {
      // 初始调用 middlewares 队列中的第 1 个中间件
      return dispatch(0)
      function dispatch (i) {
        // 获取要执行的中间件函数
        let fn = middlewares[i]
        // 执行中间件函数，回调参数是：公共数据、调用下一个中间件函数
        // 返回一个 Promise 实例
        return Promise.resolve(
          fn(context, function next () { dispatch(i + 1) })
        )
      }
    },
  }
}
```

执行中间件调用时：

```js
// 测试代码

let app = App()

app.use(async (cxt, next) => {
  console.log('middleware_01 start')
  await next()
  console.log('middleware_01 end')
})

app.use(async (cxt, next) => {
  console.log('middleware_02 start')
  await next()
  console.log('middleware_02 end')
})

app.use(async (cxt, next) => {
  console.log('middleware_03 start')
  console.log('middleware_03 end')
})

// Koa2.js 源码中，放在 http.createServer(callback) 回调中调用
// 这里我们直接调用
app.callback()
```

