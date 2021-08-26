## vue 源码结构

```
├── scripts ------------------------------- 包含与构建相关的脚本和配置文件
│   ├── alias.js -------------------------- 源码中使用到的模块导入别名
│   ├── config.js ------------------------- 项目的构建配置
├── build --------------------------------- 构建相关的文件，一般情况下我们不需要动
├── dist ---------------------------------- 构建后文件的输出目录
├── examples ------------------------------ 存放一些使用Vue开发的应用案例
├── flow ---------------------------------- JS静态类型检查工具 [Flow](https://flowtype.org/) 的类型声明
├── package.json
├── test ---------------------------------- 测试文件
├── src ----------------------------------- 源码目录
│   ├── compiler -------------------------- 编译器代码，用来将 template 编译为 render 函数
│   │   ├── parser ------------------------ 存放将模板字符串转换成元素抽象语法树的代码
│   │   ├── codegen ----------------------- 存放从抽象语法树(AST)生成render函数的代码
│   │   ├── optimizer.js ------------------ 分析静态树，优化vdom渲染
│   ├── core ------------------------------ 存放通用的，平台无关的运行时代码
│   │   ├── observer ---------------------- 响应式实现，包含数据观测的核心代码
│   │   ├── vdom -------------------------- 虚拟DOM的 creation 和 patching 的代码
│   │   ├── instance ---------------------- Vue构造函数与原型相关代码
│   │   ├── global-api -------------------- 给Vue构造函数挂载全局方法(静态方法)或属性的代码
│   │   ├── components -------------------- 包含抽象出来的通用组件，目前只有keep-alive
│   ├── server ---------------------------- 服务端渲染(server-side rendering)的相关代码
│   ├── platforms ------------------------- 不同平台特有的相关代码
│   │   ├── weex -------------------------- weex平台支持
│   │   ├── web --------------------------- web平台支持
│   │   │   ├── entry-runtime.js ---------------- 运行时构建的入口
│   │   │   ├── entry-runtime-with-compiler.js -- 独立构建版本的入口
│   │   │   ├── entry-compiler.js --------------- vue-template-compiler 包的入口文件
│   │   │   ├── entry-server-renderer.js -------- vue-server-renderer 包的入口文件
│   ├── sfc ------------------------------- 包含单文件组件(.vue文件)的解析逻辑，用于vue-template-compiler包
│   ├── shared ---------------------------- 整个代码库通用的代码
```

源码结构主要分为 5 大块：

- ## compiler

  编译器代码，用来将 template 编译为 render 函数

- ## core

  核心代码。存放通用的，平台无关的运行时代码

- ## server

  服务端渲染(server-side rendering)的相关代码

- ## platforms

  跨平台实现代码

- ## sfc

  .vue 文件的解析逻辑，用于 vue-template-compiler

- ## shared

  整个代码库通用的代码

![vue解析流程](//img.joyfred.com/vuepress/vue/vue解析流程.png)

## 入口文件

可以看到`package.json`中脚本 script，使用到了`rollup`:

```
"scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
    "build": "node scripts/build.js",
}
```

看到`dev`是使用`rollup`<!--类似webpack-->打包库进行模块处理，执行的文件是`scripts/config.js`;

进入到这个 config.js 中，看到最下面一行：

```
if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}

```

能看到通过全局环境变量`TARGET`来判断了获取的配置参数；

```
function genConfig (name) {
  const opts = builds[name]
	..... // 使用配置
}

const builds = {
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),   // 入口文件
    dest: resolve('dist/vue.js'), // 输出文件
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
}
```

可以看到打包的入口文件为`web/entry-runtime-with-compiler.js`;

这里可以看到实际就是跑了上面项目结构中`platforms - web - entry-runtime-with-compiler.js`的 web 平台实现代码；

再通过这个 runtime 文件中，可以找到`Vue`的初始化构造函数文件，

在`src/core/instance/index.js`,这里不赘述，看了源码就可以找到；

```
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)  // 初始化
}

// 初始化挂在Vue.prototype上各种属性方法
initMixin(Vue)         // 给Vue.prototype添加：_init函数,...
stateMixin(Vue)        // 给Vue.prototype添加：$data属性, $props属性, $set函数, $delete函数, $watch函数,...
eventsMixin(Vue)       // 给Vue.prototype添加：$on函数, $once函数, $off函数, $emit函数, $watch方法,...
lifecycleMixin(Vue)    // 给Vue.prototype添加: _update方法, $forceUpdate函数, $destroy函数,...
renderMixin(Vue)       // 给Vue.prototype添加: $nextTick函数, _render函数,...

```

## 初始化

vue 通过在入口文件上挂在 Vue 实例所需的属性和方法，包括一个`_init`初始化方法；

在`_init`方法中，初始化生命周期、实例属性、事件、watch 监听、调用`beforeCreate/ created`钩子；

最后调用了`vm.$mount`事件； 实现页面挂载调用；

这个`$mount`事件根据不同平台都有各自的定义实现，我们关注 web 平台的实现：

```
//-- src\platforms\web\runtime\index.js --//

import { mountComponent } from 'core/instance/lifecycle'
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)        // 实际上就是调用了这个mountComponent()
}

```

而 mountComponent 做了什么？

这个方法中调用了`beforeMount / mounted`钩子函数，

并且实例化了一个`Watcher`，用来监听数据更新，并实时调用`beforeUpdate`;

可以在`// src/core/instance/lifecycle.js`中详细阅读源码；

## 依赖收集

## compile 编译模板

挂载的 DOM 节点，如 template 模板文件中写的 HTML，都会被`compile`函数转换为`render`函数，来让浏览器识别；

看一下`compile`如何实现：

入口文件在：`src/platform/web/entry-runtime-with-compiler.js`;

追踪其中的``compileToFunctions` `方法，可以找到定义该编译方法的文件在`src/compiler/index.js`;

```
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)    // 解析HTML
  if (options.optimize !== false) {
    optimize(ast, options)                    // 优化AST
  }
  const code = generate(ast, options)       // 生成render函数
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

这里可以看到有三个重要的过程 `parse`、`optimize`、`generate`，之后生成了 render 方法代码。

- `parse`：会用正则等方式解析 template 模板中的指令、class、style 等数据，形成抽象语法树 AST
- `optimize`：优化 AST，生成模板 AST 树，检测不需要进行 DOM 改变的静态子树，减少 patch 的压力
- `generate`：把 AST 生成 render 方法的代码

## observe 响应式化

Vue 中的数据响应式是通过`Object.defineProperty`来实现的；

代码实现是在`this._init`的初始化代码中，`initState()`部分的代码；

```
// src/core/instance/state.js

export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)                      // 初始化data数据
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}

....
function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
                    ? getData(data, vm)
                    : data || {}

  observe(data, true /* asRootData */) // 给data做响应式处理
}

```

可以看到在`initData`方法中，最后有比较关键的一行： ` observe(data, true /* asRootData */)`;

这个`observe`方法就是设置数据响应化的地方；

找到`src/core/observer/index.js`;

```
// 外部调用的ovserve方法
export function observe (value: any, asRootData: ?boolean): Observer | void {
  let ob: Observer | void
  ob = new Observer(value)
  return ob
}


export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
  	.....
    this.value = value
    .....
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)                   // 这里将传入data对象做处理
    }
  }

  /**
   * 给传入对象每个key-value都设置响应getter/setter
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])                // 主要处理方法
    }
  }
  ......
}
```

一步一步终于能看到做了`Object.defineProperty`的方法了，那就是`denfineReactive`这个方法；

```
// src/core/observer/index.js

function defineReactive (obj, key, val) {
	// 这里用到了观察者（发布/订阅）模式进行了劫持封装，它定义了一种一对多的关系，
	// 让多个观察者监听一个主题对象，这个主题对象的状态发生改变时会通知所有观察者对象，观察者对象就可以更新自己的状态。
	const dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter () {
            /* 进行依赖收集 */
            return val;
        },
        set: function reactiveSetter (newVal) {
            if (newVal === val) return;
            dep.notify()                // 触发通知
        }
    });
}
```

## 响应式实现

其实响应式系统主要依赖于三部分;

- `Observe` 类

  主要给响应式对象的属性添加 `getter/setter` 用于依赖收集与派发更新

- `Dep` 类

  用于收集当前响应式对象的依赖关系

- `Watcher` 类

  观察者，实例分为渲染 watcher、计算属性 watcher、侦听器 watcher 三种

![observe](//img.joyfred.com/vuepress/vue/observe.webp)

### 响应式小结：

watcher 有下面几种使用场景：

- `render watcher` 渲染 watcher，渲染视图用的 watcher
- `computed watcher` 计算属性 watcher，因为计算属性即依赖别人也被人依赖，因此也会持有一个 `Dep` 实例
- `watch watcher` 侦听器 watcher

只要会被别的观察者 (`watchers`) 依赖，比如 data、data 的属性、计算属性、props，就会在闭包里生成一个 Dep 的实例 `dep` 并在被调用 `getter` 的时候 `dep.depend` 收集它被谁依赖了，并把被依赖的 watcher 存放到自己的 subs 中 `this.subs.push(sub)`，以便在自身改变的时候通知 `notify` 存放在 `dep.subs` 数组中依赖自己的 `watchers` 自己改变了，请及时 `update` ~

只要依赖别的响应式化对象的对象，都会生成一个观察者 `watcher` ，用来统计这个 `watcher` 依赖了哪些响应式对象，在这个 `watcher` 求值前把当前 `watcher` 设置到全局 `Dep.target`，并在自己依赖的响应式对象发生改变的时候及时 `update`

## 异步更新和 nextTick

引用官网的一段描述，证明 vue 虽然是数据驱动页面，

但其在实现上并不是实时的去改变渲染 DOM，而是将改变的数据 DOM 更新加入到队列中，进行一个 tick 的统一渲染处理；

> 可能你还没有注意到，Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

在上面的说过当数据添加响应式 setting 后，数据对象会在改变时调用 setting 函数中的`dep.notify() `进行通知触发；

其本质上是触发了收集依赖器中的每个`Wathcer`实例的`update()`方法；

```
// src\core\observer\dep.js

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()                                  // 触发调用update
    }
  }
```

而这个被调用的`update()`方法中，我们可以看到 watcher 实例中进行了判断，

如果非`lazy`或`sync`模式，那么就会将此`watcher`实例推入一个观察者队列(queueWatcher)中;

```
// src\core\observer\watcher.js

  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```

本质上`queueWatcher(this)`，就是将当前 watcher 实例进行去重等一系列判断，并加入到观察者队列(queue)中；

然后在最后将`flushSchedulerQueue()`方法，推入`nextTick()`事件队列中；

这里注意，`flushSchedulerQueue()`方法实际上作用就是执行当前`queue`队列中的所有`watcher`实例的`run`方法，也就是将队列变更都更新至 DOM；

看这里并没有直接调用`flushSchedulerQueue`，而只是将它推入事件队列；

这里的事件队列(nextTick)是**微任务（microTask）**，后面细说；

**所以一个事件队列中，相同的`watcher`实例只会被推入一次，这也可以得出，在一个事件队列中，一个 watcher 实例就算被多次更改，也只会响应更新最后一次，因为事件 handler 只执行一次；**

如果 update 调用时想要推入事件，可`nextTick`事件队列中事件已经执行了（flushing），那就根据 id 排序直接将更新事件放入进行中的队列(queue)；

但这里不会重新将事件推入`nextTick`；

```
// src\core\observer\scheduler.js

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {              // 判断去重
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)                // 推入事件队列
    }
  }
}
```

## nextTick

在 nextTick 中发生了什么呢？

源码中可以得知，这个方法是将传入的事件都放入了定义的`callbacks`这个数组中， 这个数组就被定义为`eventLoop`；

一个事件循环；

然后在一个事件循环开始后，使用`microTask`的方式（2.6 中优先使用 promise）执行所有`callbacks`数组中的队列事件；

```
// src\core\util\next-tick.js

export function nextTick (cb?: Function, ctx?: Object) {       // 这个就是调用的方法 包括$nextTick
  let _resolve
  callbacks.push(() => {             // 将传入事件再放入一个匿名函数中，推入事件队列callbacks
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true       // 开启异步锁
    timerFunc()         // 执行事件队列  这个方法会根据执行环境（兼容性）选择相应的microTask方法
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}


// 例如使用promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {        // 这里就给浏览器中插入一个异步事件（等待同步事件执行后 开始执行）
    p.then(flushCallbacks)                // 通过promise执行 flushCallbacks函数 也就是开始事件队列
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}

// 这里是开始执行队列的方法
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {        // 执行队列中所有事件
    copies[i]()
  }
}
```

这里很有趣的一点，就是异步锁`pending`这个概念；

起初看到这里，不太明白为什么为什么要加一个`pending`，然后看到一篇文章讲到这部分举了一个例子：

```
这里的Pending打个比喻：
相当于一群旅客准备上车，当第一个旅客上车的时候，车开始发动，准备出发，等到所有旅客都上车后，就可以正式开车了。
```

啊，有点意思了。解释一下，**第一个旅客上车，车开始发动**也就相当于刚进入`nextTick()`事件时，将`pending`设为 true，并执行`timerFunc`方法；

执行`timerFunc`就相当于发动了车，因为`timerFunc`在实现中是一个`promise`函数，也就是一个`microTask`，执行后就给浏览器插入了一个异步任务；

**等到所有旅客都上车后**，这个比喻可以理解为，当异步锁开启后，虽然不再调用`timerFunc`插入异步任务了，但此时调用`nextTick`仍可以继续向`callbacks`事件队列中插入事件；

这时插入的事件，就是发动车时后续上的旅客；

然后当浏览器同步代码任务执行完后，开始执行了异步任务了，也就是我们的`timerFunc`了，内部就调用了我们的`flushCallbacks`，这个函数第一句就是将异步锁关闭，也就是开车了！

正式执行这整个事件循环，同时清空之前的事件队列，也就是之后的事件就加入下一个事件队列；

从比喻上来说，可以形象理解成这班车开车了！你再用`nextTick`加进来的旅客，那就等下一班车吧！

经过这个例子，顿觉醍醐灌顶！也不由得佩服尤大在异步更新上这方面的思维想法！

### vue 中的微任务

vue 中`nextTick`的实现也经过了多次调整，比如 2.5 和 2.6 就进行了调整；

> - 2.6 版本优先使用 microtask 作为异步延迟包装器，且写法相对简单。
> - 2.5 版本中，nextTick 的实现是 microTimerFunc、macroTimerFunc 组合实现的，延迟调用优先级是：Promise > setImmediate > MessageChannel > setTimeout，具体见源码。
