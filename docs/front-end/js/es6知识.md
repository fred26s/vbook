## 1.Promise

先了解一下 Promise/a+规范内容：

1. 这个 promise 有三种状态：

   Promise 的初始状态为 pending，它可以由此状态转换为 fulfilled（本文为了一致把此状态叫做 resolved）或者 rejected，一旦状态确定，就不可以再次转换为其它状态，状态确定的过程称为 settle

2. then 方法返回一个新的 Promise，Promise 的 then 方法返回一个新的 Promise，而不是返回 this，此处在下文会有更多解释；

3. 只有一个 then 方法，并通过 then 调用，没有 catch，race，all 等方法，甚至没有构造函数；

### Promise 的实现

因为他只是一个规范，所以在不同的框架或者平台下有不同的实现

- Angular：\$q 服务

- Node：q 模块，co，then

- Es6: Promise, yield

- Es7： async await

### 解决痛点：

由于 JavaScript 语言特性是由事件驱动，所有程序都是单线程执行的（由浏览器决定）；

所以在解决异步问题上，例如浏览器事件，都是通过**回调函数**来处理异步结果；

当场景复杂多层嵌套后，就会形成所谓的**回调地狱**；

为了解决这种问题，社区提出了一些解决方案，采用**链式调用**的方法来解决异步回调；

也就是 Promise，并被加入 ES6 标准。

### 使用：

Promise 作为一个构造函数，使用`new`来创建实例，接受一个初始化函数作为参数；

这个初始化函数有两个参数`resolve/reject`，可供调用`Promise`构造函数中的两个处理函数；

```
 const promise = new Promise((resolve, reject) => {
   resolve('fulfilled'); // 状态由 pending => fulfilled
 })
```

resolve 返回出的结果，可以在`then`中进行结果处理；

`then()`其实是在为`Promise`中的 callback 注册回调函数，回调函数并没有直接执行，而是在 resolve 后才执行，所以可以获取结果进行处理；

### 链式调用：

链式调用里 then 中的函数一定要 return 一个结果或者一个新的 Promise 对象，

才可以让之后的 then 回调接收。

### 原理：

`then`

### 示例：

```
https://www.jianshu.com/p/559d25c88670 复杂案例
```

## 2.事件驱动

js 在浏览器端是单线程的，也注定是单线程，因为浏览器主要作为与用户的交互端；

如果是多线程，可能会造成复杂的操作问题，例如两个线程同时操作同一个 DOM，那么浏览器会无法进行；

从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变；

> -- 百科解释
>
> 事件驱动程序设计（英语：Event-driven programming）是一种电脑程序设计模型。这种模型的程序运行流程是由用户的动作（如鼠标的按键，键盘的按键动作）或者是由其他程序的消息来决定的。
>
> 相对于批处理程序设计（batch programming）而言，程序运行的流程是由程序员来决定。批量的程序设计在初级程序设计教学课程上是一种方式。然而，事件驱动程序设计这种设计模型是在交互程序（Interactive program）的情况下孕育而生的

### 进程与线程

进程是操作系统分配资源和调度任务的基本单位，线程是建立在进程上的一次程序运行单位，一个进程上可以有多个线程。

1. 浏览器线程
   - 用户界面-包括地址栏、前进/后退按钮、书签菜单等
   - 浏览器引擎-在用户界面和呈现引擎之间传送指令(浏览器的主进程)
   - 渲染引擎，也被称为浏览器内核(浏览器渲染进程)
   - 一个插件对应一个进程(第三方插件进程)
   - GPU 提高网页浏览的体验( GPU 进程)
2. 浏览器渲染引擎
   - 渲染引擎内部是多线程的，内部包含 ui 线程和 js 线程
   - js 线程 ui 线程 这两个线程互斥的，目的就是为了保证不产生冲突。
   - ui 线程会把更改的放到队列中，当 js 线程空闲下来的时候，ui 线程在继续渲染
3. js 单线程
   - js 是单线程，为什么呢？如果多个线程同时操作 DOM ，哪页面不会很混乱？这里所谓的单线程指的是主线程是单线程的,所以在 Node 中主线程依旧是单线程的。
4. webworker 多线程
   - 它和 js 主线程不是平级的，主线程可以控制 webworker，但是 webworker 不能操作 DOM，不能获取 document，window
5. 其他线程
   - 浏览器事件触发线程(用来控制事件循环,存放 setTimeout、浏览器事件、ajax 的回调函数)
   - 定时触发器线程(setTimeout 定时器所在线程)
   - 异步 HTTP 请求线程(ajax 请求线程)

> 单线程特点是节约了内存,并且不需要在切换执行上下文。而且单线程不需要管锁的问题,所谓 锁，在 java 里才有锁的概念，所以我们不用细研究

## 3.事件循环

事件循环的步骤：
（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
（4）主线程不断重复上面的第三步。

一个线程中，事件循环是唯一的，但是任务队列可以有多个;

- 任务队列又分为 macro-task（宏任务）和 micro-task（微任务）;

- macro-task 大概包括：

  ```
  script（整体代码）,
  setTimeout,
  setInterval,
  setImmediate,
  I/O,
  UI rendering;
  ```

- micro-task 大概包括：

  ```
  process.nextTick,
  Promise,
  Object.observe(已废弃),
  MutationObserver(html5新特性)
  ```

- 事件循环的顺序，决定了 JavaScript 代码的执行顺序。它从 script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的 micro-task。当所有可执行的 micro-task 执行完毕之后。循环再次从 macro-task 开始，找到其中一个任务队列执行完毕，然后再执行所有的 micro-task，这样一直循环下去。

## 4.ES6 运行环境

虽然目前大部分主流浏览器都支持了 es6 语法，但仍不能保证所有用户浏览器都支持；

所以我们需要使用`babel`来进行编译，让 ES5+的语法都能编译为 ES5 运行在所有浏览器上；

起初是为了兼容性，但后来更多是为了让 es 规范可以更大刀阔斧的添加新特性，因为我们有编译！；

`tc39`渐进式的演进模式，浏览器根本跟不上新特性的步伐，而 babel 存在，可以让`tc39`没有包袱的前进。

> #### TC39 是什么？包括哪些人？
>
> 「TC39」全称「Technical Committee 39」译为「第 39 号技术委员会」，是 Ecma 组织架构中的一部分。
>
> 一个推动 JavaScript 发展的委员会，由各个主流浏览器厂商的代表构成。
>
> #### TC39 这群人主要的工作是什么？
>
> 制定 ECMAScript 标准，标准生成的流程，并实现。
>
> #### ECMA 是什么
>
> ECMA 就是欧洲计算机制造协会的简称：`European Computer Manufacturers Association`

## 5.模块系统

### 意义：

就是将一个复杂的程序，依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起，通常只是向外部暴露一些接口(方法)与外部其它模块通信；

本质是一种复杂度管理的手段技术。

### 实现方案：

- `AMD/CMD`

  AMD 作为模块加载器，可以在浏览器环境中异步加载多个模块，解决了`COMMONJS`同步加载模块的问题；

  使用`注入依赖`的思想，需要在引用模块的文件中写明依赖的模块；

  ```
  //demo.js
  (function(){
      //配置每个变量对应的模块路径
      require.config({
          paths: {
              m1: './modules/m1',
              m2: './modules/m2',
              jquery:'./jquery-3.3.1'
          }
      })
      require(['m2','jquery'],function(m2,$){
          m2.show(); //结果：m2-amd m1-amd
          $('body').css('backgroundColor','#000');
      })
  })()
  ```

- `COMMONJS`

  `CommonJS`规范是 Node 独有的模块规范；

  `CommonJS`规范加载模块是**同步**的，也就是说，只有加载完成，才能执行后面的操作。

  ```
  // a.js
  module.exports = {
      a: 1
  }
  // or
  exports.a = 1

  // b.js
  var module = require('./a.js')
  module.a // -> log 1
  ```

- `ES6`

  使用简单，静态化设计思想，编译时就可确定依赖关系；足以取代上述两种方案；

  目前需要`babal`编译；

  ```
  // 导出
  export function hello() { };
  export default {
    // ...
  };
  // 导入
  import { readFile } from 'fs';
  import React from 'react';
  ```

### 总结：

模块化本质是在管理程序复杂度，JS 模块化的演进另一方面也说明了 Web 的能力在不断增强，Web 应用日趋复杂。

相信未来 JS 的能力进一步提升，我们的开发效率也会更加高效。

## 6.Proxy / Reflect

两个都是 ES6 新增的 API，proxy 作用是可以用来定义对象各种基本操作的自定义行为；

可以改变 JS 默认的一些语言行为，包括拦截默认的 get/set 等底层方法，使得 JS 的使用自由度更高

也能相当于对象或函数的浅拷贝，修改 target，可以对响应的代理 proxy 自定义操作；

```
let target = { age: 18, name: 'Niko Bellic' }
let handlers = {
  get (target, property) {
    return `${property}: ${target[property]}`
  },
  set (target, property, value) {
    target[property] = value
  }
}
let proxy = new Proxy(target, handlers)

proxy.age = 19
console.log(target.age, proxy.age)   // 19,          age : 19
console.log(target.name, proxy.name) // Niko Bellic, name: Niko Bellic
```

target 是源对象，你设置的`handler`，在修改 target 的同时可以自定义 proxy 的结果；

例如上面例子中，`get`的 handler 中返回了拼接后的`${property}: ${target[property]}`，这个返回值其实返回给了 new 代理的 proxy 实例；

打个比方就是：

可以理解为，有一个很火的明星，开通了一个微博账号，这个账号非常活跃，回复粉丝、到处点赞之类的，但可能并不是真的由本人在维护的。
而是在背后有一个其他人 or 团队来运营，我们就可以称他们为代理人，因为他们发表的微博就代表了明星本人的意思。

这个**代理运营团队**就是`proxy`， 而明星**本人**就是`target`；

### Reflect

Reflect 是 ES6 引入的一个新的对象，

**他的主要作用有两点**，一是将原生的一些零散分布在 Object、Function 或者全局函数里的方法(如 apply、delete、get、set 等等)，统一整合到 Reflect 上，这样可以更加方便更加统一的管理一些原生 API。

其次就是因为 Proxy 可以改写默认的原生 API，如果一旦原生 API 别改写可能就找不到了，所以 Reflect 也可以起到备份原生 API 的作用，使得即使原生 API 被改写了之后，也可以在被改写之后的 API 用上默认的 API。

## 7.ES6 的优化/新增

### String

- 模板字符串
- String.includes()

### Array

- 解构赋值
- 扩展运算符
- Array.find()

### Object

- 对象解构赋值

- 变量式声明属性

  ```
  let es5Fun = {
      method: function(){}
  };
  let es6Fun = {
      method(){}
  }
  ```

- 扩展运算符

- Object.assign()

- Object.keys()

### Function

- 箭头函数

  **箭头函数内的 this 指向的是函数定义时所在的对象，而不是函数执行时所在的对象**

  ES5 函数里的 this 总是指向函数执行时所在的对象，这使得在很多情况下 this 的指向变得很难理解，尤其是非严格模式情况下，this 有时候会指向全局对象，这甚至也可以归结为语言层面的 bug 之一

-

### Number

- 优化 Number.isNaN()

### Symbol

Symbol 是 ES6 引入的第七种原始数据类型,所有 Symbol()生成的值都是**独一无二**的

可以从根本上解决对象属性太多导致**属性名冲突**覆盖的问题。对象中 Symbol()属性**不能被 for...in 遍历**

### Set

**解决痛点：轻松去重，效率提升**

Set 是 ES6 引入的一种**类似 Array**的新的数据结构，Set 实例的成员类似于数组 item 成员，区别是 Set 实例的成员都是**唯一**，不重复的。这个特性可以轻松地实现数组去重。

```
const duplicateCollection = ['A', 'B', 'B', 'C', 'D', 'B', 'C'];
// 将数组转换为 Set
let uniqueCollection = new Set(duplicateCollection);
console.log(uniqueCollection) // Result: Set(4) {"A", "B", "C", "D"}
// 值保存在数组中
let uniqueCollection = [...new Set(duplicateCollection)];
console.log(uniqueCollection) // Result: ["A", "B", "C", "D"]
```

相比 Array 来说，Set 操作效率更高，方法更简洁；

因为和 Array 相比之下，`set`是一个键的集合。`set`不使用索引，而是使用键对数据排序。

`set` 中的元素按插入顺序是可迭代的，它不能包含任何重复的数据。换句话说，`set`中的每一项都必须是惟一的。

`set` 相对于数组有几个优势，特别是在运行时间方面：

- **查看元素**：使用`indexOf()`或`includes()`检查数组中的项是否存在是比较慢的。
- **删除元素**:在`Set`中，可以根据每项的的 `value` 来删除该项。在数组中，等价的方法是使用基于元素的索引的`splice()`。与前一点一样，依赖于索引的速度很慢。
- **保存 NaN**：不能使用`indexOf()`或 `includes()` 来查找值 `NaN`，而 `Set` 可以保存此值。
- **删除重复项**:`Set`对象只存储惟一的值,如果不想有重复项存在，相对于数组的一个显著优势，因为数组需要额外的代码来处理重复。

### Map

解决痛点：**key 值不限于 string，有序排列，统一遍历方法，API 方便**

Map 是 ES6 引入的一种**类似 Object**的新的数据结构，Map 可以理解为是**Object 的超集**，打破了以传统键值对形式定义对象，**对象的 key 不再局限于字符串**，也可以是 Object。可以更加全面的描述对象的属性。

- 一个`Object` 的键只能是字符串或者 `Symbols`，但一个`Map` 的键可以是任意值。
- `Map`中的键值是**有序的**（FIFO 先进先出原则），而添加到对象中的键则不是。
- `Map`的键值对个数可以从 size 属性获取，而 `Object` 的键值对个数只能手动计算。
- 合并两个 Map 对象时，如果有重复的键值，则**后面的会覆盖前面**的。

## 8. for...of

### 解决痛点：

Iterator 接口的目的就是为所有数据结构，**提供了一种统一的访问机制**，即`for...of`循环。

当使用`for...of`循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有 iterator 接口，就可以用 for...of 循环遍历它的成员。

也就是说，for...of 循环内部调用的是数据结构的`Symbol.iterator`方法。

**Iterator 接口主要供 for...of 消费， 且 for...of 循环需要有`iterator接口`。**

```
// 模拟Iterator接口

let it = makeIterator(['a','b']);

it.next();// { value: "a", done: false }
it.next();// { value: "b", done: false }
it.next();// { value: undefined, done: true }

fucntion makeIterator(array){
    let nextIndex = 0;
    return {
        next : function(){
            return nextInedx < array.length ?
            {value : array[nextIndex++], done : false} :
            {value : undefined, done : true};
        }
    }
}
```

## Interator 接口

Iterator 是 ES6 中一个很重要概念，它并不是对象，也不是任何一种数据类型。

因为 ES6 新增了 Set、Map 类型，他们和 Array、Object 类型很像，Array、Object 都是可以遍历的，但是 Set、Map 都不能用 for 循环遍历；

所以为了统一所有可遍历类型的遍历方式，Interator 就是这样一种标准；

### 原生接口

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被 for...of 循环遍历。

具备原生接口的类型：

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

以上类型可以原生使用`for...of`循环，但不包括对象`Object`，所以对象使用就需要手动添加`Iterator`接口；
