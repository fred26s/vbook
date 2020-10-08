## MVVM 理解

首先 MVVM 是一种架构模式；

Vue、react 作为其模式的一种代表实现广为流行；

MVVM 区别于 MVC，model 数据层和 view 视图层的直接关联；

在 M 与 V 之间加入了 VM(ViewModel )层，也可以理解将 view 层，拆分为了 MVVM；

实际 VM 就是链接 V 和 M 的桥梁，之前的模式我们获取数据 model 后，需要手动渲染 DOM 页面；

而 MVVM 模式下，

但是有 VM 这个中间件，实现了数据驱动页面的模式，因为视图状态和事件行为都封装在了 vm 中；

由于实现了数据的双向绑定，所以开发者不用再去关注如果通过数据改变页面，而是只关心数据在 VM 中的改变即可。

**MVVM 模式：不需要用户手动的操作 dom 的，主要是实现数据双向绑定**

- ### 优点:

  1. 分离视图（View）和模型（Model）,降低代码耦合，提高视图或者逻辑的重用性: 比如视图（View）可以独立于 Model 变化和修改，一个 ViewModel 可以绑定不同的"View"上，当 View 变化的时候 Model 不可以不变，当 Model 变化的时候 View 也可以不变。你可以把一些视图逻辑放在一个 ViewModel 里面，让很多 view 重用这段视图逻辑
  2. 自动更新 dom: 利用双向绑定,数据更新后视图自动更新,让开发者从繁琐的手动 dom 中解放

- ### 缺点

  1. Bug 很难被调试:

     因为使用双向绑定的模式，当你看到界面异常了，有可能是你 View 的代码有 Bug，也可能是 Model 的代码有问题。

     数据绑定使得一个位置的 Bug 被快速传递到别的位置，要定位原始出问题的地方就变得不那么容易了。

     需要使用调试工具： vue-devtool

## Vue 生命周期

生命周期就是 Vue 实例从创建到销毁的这个过程。

Vue 实例有一个完整的生命周期，也可以分为三个阶段：

- **初始化阶段**：开始创建、初始化数据、编译模版、挂载 Dom -> created \ mounted
- **运行阶段**：渲染、更新 -> update
- **销毁阶段**：渲染、卸载 -> destoryed

等一系列过程，我们称这是 Vue 的生命周期。

钩子函数

- beforeCreate：创建前，此阶段为实例初始化之后，this 指向创建的实例，此时的数据观察事件机制都未形成，不能获得 DOM 节点

  常用：可以在这加个 loading 事件。

- created：创建后，此阶段为实例已经创建，完成数据（data、props、computed）的初始化导入依赖项。

  常用：可以在这里结束 loading 事件，还做一些初始化，实现函数自执行。

- beforeMount：挂载前，虽然得不到具体的 DOM 元素，但 vue 挂载的根节点已经创建，下面 vue 对 DOM 的操作将围绕这个根元素继续进行。

  常用：不常用

- mounted：挂载，完成创建 vm.\$el，和双向绑定

  常用：可在这发起后端请求，拿回数据，配合路由钩子做一些事情。

- beforeUpdate：数据更新前，数据驱动 DOM。

  常用：不常用可在更新前访问现有的 DOM，如手动移出添加的事件监听器。

- beforeDestroy：销毁前，

  可做一些删除提示，如：您确定删除 xx 吗？ 取消一些手动添加的事件

![生命周期](/vue/生命周期.png)

## Vue 组件通信

Vue 组件通信的方法如下:

- props/\$emit+v-on:

  通过 props 将数据自上而下传递，而通过\$emit 和 v-on 来向上传递信息。

  符合单项数据流原则。

- EventBus:

  通过 EventBus 事件总线进行信息的发布与订阅 （**不推荐**，易逻辑混乱）

- vuex:

  是全局数据管理库，可以通过 vuex 管理全局的数据流 （可完全代替 EventBus）

- $attrs/$listeners:

  Vue2.4 中加入的$attrs/$listeners 可以进行跨级的组件通信

- provide/inject：

  以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效，这成为了跨组件通信的基础

事件通讯对比

- vuex 是官方推出的，事件总线是高手在民间
- 在大型应用方面，vuex 确实是一个比 EventBus 更好的解决方案
- vuex 更加易于调试与管理
- Vuex 并不是最佳的解决方案，在某些小型应用上，你可能只有小部分的数据交互，甚至只有一个登录状态储存，那样事件总线或者[简单状态管理](https://cn.vuejs.org/v2/guide/state-management.html#简单状态管理起步使用)都是值得推荐的。

毕竟 vue 是一个渐进式框架，选择什么工具和解决方案，还是根据项目具体情况来决定。

## VueX 状态管理

- ### 概念：

  Vuex 是一个专为 Vue.js 应用程序开发的状态管理插件；

  核心就是 store（仓库），store 中存放着组件间需要动态共享的数据状态；

- ### 优势：

  因为组件间通信存在着一定问题，例如兄弟组件和祖辈组件之间数据传递复杂，所以 Vuex 可以方便的解决这个问题；

  同时也解决了`eventBus`在大型项目中，会造成事件复杂耦合难以理解的问题。

- ### 举例：

  例如两个兄弟组件同时依赖一个共同数据，那么这个数据如何传递？

  例如不依赖其他手段，可能我们需要他们的共同父组件来管理这个共同依赖的数据，非常麻烦；

  如果用 vuex，我们就可以将这个共用的数据存在 store 中，并且其中一个组件如果想要改变值，

  那么可以调用 store 中统一的修改方法`mutation`，其他依赖这个 store 数据组件也可以动态的获取最新改变后的值;

- ### 使用：

  State：

  ​ 单一状态树。

  Getter：

  ​ 计算属性。

  Mutation：

  ​ 用于提交更改 store 中的状态（mutation 是更改 store 中状态的唯一方法）。

  ​ mutation 必须是同步操作；

  ​ 因为例如，当你能调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢

  Action：

  ​ 用于提交 mutation，可以包含异步操作。

  Module：

  ​ 当应用程序很大时，需要管理的状态很多时，需要将 state 进行拆分，分割成模块（modules)，最后统一管理。

  ​ 命名空间：namespaced: true, 为什么要加这个呢？默认情况下，模块内部的 action、mutation 和 getter 是注册在**「全局命名空间」**的。

  ​ 因为有可能在不同模块下定义了相同的方法就会产生覆盖，所以通过添加 namespace 进行区分。

## Vue 双向数据绑定

​ vue 实际上利用了原生的`Object.definedProperty()`，在 new vue 实例时对他所有响应式化的数据对象进行递归遍历，对每一个依赖收集的属性添加`setter/getter`来实现数据劫持；

​ 这样在获取这个数据时，触发`getter`就会将当前`watcher`实例加入这个对象属性的被依赖列表中，那么当这个数据再次改变时，就会触发`setter`，通知依赖自己的`watcher`实例进行`update`更新视图。

​ 这就完成了单向的数据绑定，数据改变相应的视图更新；

​ 而双向数据绑定，相当于给视图 UI 增加了`input`事件来实时修改`data`数据，例如`v-model`语法糖；

- ### 依赖收集

  依赖收集其实发生在 vue 实例的初始化阶段，当初始化数据后，就会遍历挂载的对象属性，进行响应式化处理；

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

- ### 响应式系统简述:

  - 任何一个 Vue Component 都有一个与之对应的 Watcher 实例。
  - Vue 的 data 上的属性会被添加 getter 和 setter 属性。
  - 当 Vue Component render 函数被执行的时候, data 上会被 触碰(touch), 即被读, getter 方法会被调用, 此时 Vue 会去记录此 Vue component 所依赖的所有 data。(这一过程被称为依赖收集)
  - data 被改动时（主要是用户操作）, 即被写, setter 方法会被调用, 此时 Vue 会去通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新。

## Vue2.x 和 vue3 区别

- ### Proxy 与 Object.defineProperty

  vue 在 3 中将实现响应式的方法由 Object.defineProperty 改为了`proxy`；

  **Proxy 的优势如下:**

  - Proxy 可以直接监听对象而非属性
  - Proxy 可以直接监听数组的变化
  - Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是`Object.defineProperty`不具备的
  - Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而`Object.defineProperty`只能遍历对象属性直接修改
  - Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利

  **Object.defineProperty 的优势如下:**

  - 兼容性好,支持 IE9

- ### 组合式 API

## 为什么需要 DOM diff

因为 vue2.0 属于中等粒度的更新，组件的每个数据只是与组件建立依赖关系，内存开销变少了，这也是 vdom 的 diff 更新机制给 vue 带来的能力

所以根据目前的响应式系统，通常我们会第一时间侦测到发生变化的组件，然后在组件内部进行 Virtual Dom Diff 获取更加具体的差异,而 Virtual Dom Diff 则是 pull 操作,Vue 是 push+pull 结合的方·式进行变化侦测的.

## Virtual DOM

- ### 概念

  Virtual DOM 是对 DOM 的抽象,本质上是 JavaScript 对象,这个对象就是更加轻量级的对 DOM 的描述；

- ### 存在价值

  - 提升性能

    因为频繁变动 DOM 会造成浏览器的回流或者重回,这些都是性能的杀手,因此我们通过使用 VirtualDOM,

    在 patch 过程中尽可能地一次性将差异更新到 DOM 中;并且无需手动操作 DOM；

  - 跨平台

    例如实现 SSR，因为服务端 nodejs 就没有 DOM，所以使用 virtualDOM 可以解决跨平台问题。

## diff 逻辑

diff 的目的就是比较新旧 Virtual DOM Tree 找出差异并更新.

- 头头对比: 对比两个数组的头部，如果找到，把新节点 patch 到旧节点，头指针后移
- 尾尾对比: 对比两个数组的尾部，如果找到，把新节点 patch 到旧节点，尾指针前移
- 旧尾新头对比: 交叉对比，旧尾新头，如果找到，把新节点 patch 到旧节点，旧尾指针前移，新头指针后移
- 旧头新尾对比: 交叉对比，旧头新尾，如果找到，把新节点 patch 到旧节点，新尾指针前移，旧头指针后移
- 利用 key 对比: 用新指针对应节点的 key 去旧数组寻找对应的节点,这里分三种情况,当没有对应的 key，那么创建新的节点,如果有 key 并且是相同的节点，把新节点 patch 到旧节点,如果有 key 但是不是相同的节点，则创建新节点

## 异步更新

## typescript

- 好处

  - IDAE 提示丰富

    **为什么 IDEA 可以支持 TS 类型系统**

  - 增加类型系统

  - 便于后期维护

- 缺点

  - 前期需要增加大量工作

- ## d.ts
