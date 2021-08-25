## vue-router

### 为什么需要vue-router

因为vue是个SPA单页面应用，所以需要做到不向后台发送请求的情况下改变试图；

为了达到改变视图的同时不会向后端发出请求这一目的，浏览器当前提供了以下两种支持：

- hash模式:

  即地址栏 URL 中的 # 符号

- history模式：

  利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。（需要特定浏览器支持）

这两个方法应用于浏览器的历史记录栈，在当前已有的 back()、forward()、go() 方法的基础之上，这两个方法提供了对历史记录进行修改的功能。

当这两个方法执行修改时，**只能改变当前地址栏的 URL，但浏览器不会向后端发送请求**，也不会触发popstate事件的执行

**因此可以说，hash 模式和 history 模式都属于浏览器自身的特性，Vue-Router 只是利用了这两个特性（通过调用浏览器提供的接口）来实现前端路由.**



## history模式

HTML5 History Interface 中新增的两个 pushState() 和 replaceState() 方法（需要特定浏览器支持），用来完成 URL 跳转而无须重新加载页面；

不过这种模式还需要后台配置增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面。





## 对比

History模式

优点:

1. History模式的地址栏更美观。。。
2. History模式的pushState、replaceState参数中的新URL可为同源的任意URL（可为不同的html文件），而hash只能是同一文档
3. History模式的pushState、replaceState参数中的state可为js对象，能携带更多数据
4. History模式的pushState、replaceState参数中的title能携带字符串数据（当然，部分浏览器，例如firefox不支持title，一般title设为null，不建议使用）

缺点:
这种模式需要后端配置，因为我们这个页面是单页面应用，如果用户直接访问且后台没有正确的配置，则就会返回404。

