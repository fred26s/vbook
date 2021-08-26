## 初始化

- ### 初始化状态/数据

  ```
  new初始化实际是调用了Vue构造函数；并在Vue.prototype上挂载初始化状态/事件；
  ```

- ### 依赖收集

  ```
  依赖收集主要围绕三个概念类，Observe、Dep、Watcher;
  - Observe类
  首先通过`defineReactive`给每个对象属性增加响应式化（实现为definePorperty）;
  给每个对象属性递归添加getter/setter；
  所以当取值/改值时，触发getter/setter中的Dep依赖收集和派发更新；
  - Dep类
  dep作为依赖搜集器，用来收集Watcher的实例，用来通知更新；
  - Watcher类
  new实例时（初始化/mount时），添加Dep.target Watcher;
  获取getter时，通过dep.depend添加依赖，
  这里是Dep和Watcher方法间互相调用的过程，Dep中使用保存的`target watcher`去调用`addDep`方法；
  watcher中的`addDep`方法又用传入的dep实例，调用`addSub`方法来将自身添加到dep依赖中；
  ```

- ### 挂载 mount

  ```
  初始化数据后，实际就是直接调用了`$mount()`方法；
  这个方法多处有定义，实际web端调用的就是`mountComponent()`这个方法；
  新建了一个渲染Watcher，初始化和数据更新的时候都会调用`mountComponent `
  ```

## 响应式化

上面说过了依赖收集，即只要被依赖的响应式化数据，即被`defineReactive`；

例如 data、props、computed，就会生成一个`Dep`实例；用`dep.depend`来收集它被谁所依赖了；

然后在自身改变的时候回调用`setting`函数，其中会通过`dep.notify`来通知所有被它收集依赖的`watcher`实例；

`watcher`实例被`notify`通知后，实际上是调用了自身的`update`更新函数；

这就形成了响应式化的数据形式；

## 异步更新和 nextTick

上面说完了响应式化的数据，当`watcher`实例被通知`update`后，其实并不是直接更新数据，并刷新页面 dom；

这里会引入一个概念叫做**异步更新**；

也就是被通知更新的操作，会被先进行去重，然后暂时推入一个事件队列中（nextTick）；

也叫做`eventLoop`，这个队列会直接开启一个浏览器`microTask`异步微任务；

在执行`microTask`前或执行中，只要有`update`更新事件，都可以实时加入到事件`queue`中，进行更新，但不会再推入`eventLoop`一个新的微任务；

### nextTick

若浏览器开启此异步微任务前，例如使用`this.$nextTick()` 再次推入的事件仍然可以加入这个`tick`中，等开始这个`mricoTask`时一并进行处理；

但如果已经开始了当前`microTask`，再使用`nextTick`加入的事件，就会等到下一个`microTask`去执行；

## 编译 compile

compile 就是将`.vue`单文件`template`中的 HTML 编译转化为`render`函数的一个过程；

主要其实就是三步重要的过程: `parse`、`optimize`、`generate`

- `parse`：会用正则等方式解析 template 模板中的指令、class、style 等数据，形成抽象语法树 AST
- `optimize`：优化 AST，生成模板 AST 树，检测不需要进行 DOM 改变的静态子树，减少 patch 的压力
- `generate`：把 AST 生成 render 方法的代码

> 在[计算机科学](https://zh.wikipedia.org/wiki/计算机科学)中，**抽象语法树**（**A**bstract **S**yntax **T**ree，AST），或简称**语法树**（Syntax tree），
>
> 是[源代码](https://zh.wikipedia.org/wiki/源代码)[语法](https://zh.wikipedia.org/wiki/语法学)结构的一种抽象表示。
>
> 它以[树状](<https://zh.wikipedia.org/wiki/树_(图论)>)的形式表现[编程语言](https://zh.wikipedia.org/wiki/编程语言)的语法结构，树上的每个节点都表示源代码中的一种结构。
>
> 之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。
>
> 比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；
>
> 而类似于 `if-condition-then` 这样的条件跳转语句，可以使用带有三个分支的节点来表示。

## patch

## Macrotask 与 Microtask -[vue 视图更新]

`JS 事件循环

## Vnode

Virtual DOM 并没有完全实现 DOM，Virtual DOM 最主要的还是保留了 `Element` 之间的层次关系和一些基本属性。实际是使用 JS 对真实 DOM 的一种描述；

其中包含 Virtual DOM 算法，包括几个步骤：

1. 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
3. 把第 2 步所记录的差异应用到第 1 步所构建的真正的 DOM 树上，视图就更新了

## dom Diff

## 与 react 异同

vue 的官网中说它是一款渐进式框架，采用自底向上增量开发的设计;

例如做一个单页应用的时候才需要用路由；做一个相当庞大的应用，涉及到多组件状态共享以及多个开发者共同协作时，才可能需要大规模状态管理方案。

- react 使用自由化度高

  vue 入手简单，封装度高，更多的 API

- vue 起初的定位就是尽可能的降低前端开发的门槛；

  而 react 更多的对原有前端开发模式做出的改变；

三大框架数据更新差异

vue - defineproperty 数据劫持（vue3.0 使用 proxy）

angular - 脏检查

- 其实就是存储所有变量的值，每当可能有变量发生变化需要检查时，就将所有变量的旧值跟新值进行比较，**不相等就说明检测到变化**，需要更新对应视图。

- 1.不会脏检查所有的对象。当对象被绑定到 html 中后，这个对象才会添加为检查对象（watcher）

  2.不会脏检查所有的属性，同样当属性被绑定后，这个属性才会被列为检查的属性

  在 angular 程序初始化时，会将绑定的对象的属性添加为监听对象（watcher），也就是说一个对象绑定了 N 个属性，就会添加 N 个 watcher。

  angular 什么时候去脏检查呢？angular 所系统的方法中都会触发比较事件，比如：controller 初始化的时候，所有以 ng-开头的事件爱你执行后，都会出发脏检查

react - 单向数据流

和 vue 一样都是由父组件向子组件传值，但是 vue 实现的数据双向绑定实际上是语法糖；
