# compositionAPI

**组合式API对应着原2.0中的选项式API；**

在大型组件中，**逻辑关注点**会跟随着方法和对象，在VUE选项式API代码中来回跳跃（思路）。

这种碎片化使得理解和维护复杂组件变得困难。选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。

如果能够将同一个逻辑关注点相关代码收集在一起会更好。而这正是组合式 API 使我们能够做到的。

**强烈建议使用 [组合式 API](https://v3.cn.vuejs.org/api/composition-api.html) 来替代继承与 mixin**

## 组合式API做了什么

- **options API（Vue2）**

  开发出来的vue应用功能是杂糅在一起对的。

  它的特点是理解容易，好上手。

  因为各个选项都有固定的书写位置（比如数据就写到data选项中，操作方法就写到methods中，等等），应用大了之后，相信大家都遇到过来回上下找代码的困境。

- **composition API(Vue3)**

  开发的vue应用功能是分块解耦的。

  它的特点是特定功能相关的所有东西都放到一起维护，比如功能A相关的响应式数据，操作数据的方法等放到一起，这样不管应用多大，都可以快读定位到某个功能的所有相关代码，维护方便设置，如果功能复杂，代码量大，我们还可以进行逻辑拆分处理；



# teleport

Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件；

使用场景：

- 全局组件

  例如modal框，loading组件，需要在业务子组件中使用，但DOM位置不用嵌入到子组件中，而是可以通过`<teleport>`插入到外层公用结构；

```
// 插入到body子节点
<teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
</teleport>
```



# 片段

vue3.x支持了组件包含多个根元素标签;

但需要显式定义 attribute 应该分布在哪里.

```
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>   // 式定义 attribute 
  <footer>...</footer>
</template>
```



# 自定义事件- emit

v3需要在组件内显式的定义组件内的emit事件。

默认情况下，v3组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件;

> 原vue2.x中，v-model默认使用 `value` 的 prop 和名为 `input` 的事件

1. v3可以支持定义组件的自定义事件，并提供事件验证

   ```
   // emits 传入数组，来定义事件
   app.component('custom-form', {
     emits: ['inFocus', 'submit']
   })
   
   // emits 传入对象，来验证事件
   app.component('custom-form', {
     emits: {
       // 没有验证
       click: null,
   
       // 验证submit 事件
       submit: ({ email, password }) => {
         if (email && password) {
           return true
         } else {
           console.warn('Invalid submit event payload!')
           return false
         }
       }
     },
     methods: {
       submitForm(email, password) {
         this.$emit('submit', { email, password })
       }
     }
   })
   ```

2. **多个v-model绑定**

   v-model:update可以接收Update作为参数，并在组件内部使用；

   方便的双向绑定多个属性。

   ```
   <user-name
     v-model:first-name="firstName"
     v-model:last-name="lastName"
   ></user-name>
   
   app.component('user-name', {
     props: {
       firstName: String,
       lastName: String
     },
     emits: ['update:firstName', 'update:lastName'],
     template: `
       <input 
         type="text"
         :value="firstName"
         @input="$emit('update:firstName', $event.target.value)">
   
       <input
         type="text"
         :value="lastName"
         @input="$emit('update:lastName', $event.target.value)">
     `
   })
   ```

   

# 全局API

全局 Vue API 已更改为使用应用程序实例.

## createApp

全局配置使得在同一页面上的多个“app”之间共享同一个 Vue 副本会存在互相影响；

例如：

```
// 这会影响两个根实例
Vue.mixin({
  /* ... */
})

const app1 = new Vue({ el: '#app-1' })
const app2 = new Vue({ el: '#app-2' })
```

为了避免这些问题，在 Vue 3 中引入了`createApp`



## treeshaking

为了让vue更换的支持treeshaking，将一些之前绑定在Vue.实例上的全局方法，修改为模块导出的方式引入使用；

> Vue 2.x 中的这些全局 API 受此更改的影响：
>
> - `Vue.nextTick`
> - `Vue.observable` (用 `Vue.reactive` 替换)
> - `Vue.version`
> - `Vue.compile` (仅完整构建版本)
> - `Vue.set` (仅兼容构建版本)
> - `Vue.delete` (仅兼容构建版本)

例如：

```
// vue2.x
import Vue from 'vue'
Vue.nextTick(() => {
  // 一些和DOM有关的东西
})

// vue3.x
import { nextTick } from 'vue'
nextTick(() => {
  // 一些和DOM有关的东西
})
```



## 异步组件

现在需要用`defineAsyncComponent` 助手方法中来显式地定义

```
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// 带选项的异步组件
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```



## 渲染函数 render

> 更改的简要总结：
>
> - `h` 现在是全局导入，而不是作为参数传递给渲染函数
> - 更改渲染函数参数，使其在有状态组件和函数组件的表现更加一致
> - VNode 现在有一个扁平的 prop 结构

在 3.x 中，由于 `render` 函数不再接收任何参数，**它将主要在 `setup()` 函数内部使用**。

这还有一个好处：可以访问在作用域中声明的响应式状态和函数，以及传递给 `setup()` 的参数。





# ref/reactive/toRef/toRefs

> [Vue3 ref、reactive、toRef、toRefs的区别](https://blog.csdn.net/u010059669/article/details/112287552)

- reactive和ref

  都是给数据添加响应式，reactive只能传入对象类型，ref类型不限制

- toRef和toRefs

  都是将源响应式对象，新建其中的响应式属性；

  但toRef是指定对象中的单个属性，

  toRefs是将对象中所有属性都

尽量不要混着用，reactive和ref选一种，toRef和toRefs选一种，不然代码会很乱。















