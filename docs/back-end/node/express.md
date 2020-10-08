## express

最流行的nodejs框架；类似的还有koa等

Express应用程序本质上就是一系列中间件函数调用。

## 特性

1. 路由系统简单易用
2. 机集众多模板引擎
3. 中间件系统

## 范例

最简单的web服务器代码：

```
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('<h1>fred HomePagefred HomePage</h1>');
})

app.listen('5050');
```

这样我们就可以访问到了5050端口返回的文本；

## 请求与响应

上面例子返回响应使用了`res.send()`这个方法，

这个方法不光可以返回字符串，甚至`json`、数组等都可以使用他来返回响应；

> 具体详细API参见官网文档：<https://www.expressjs.com.cn/4x/api.html#express>

## 路由

### 路由传参

可以通过URL路由，使用请求动态传参；

语法是在路由中使用`:`这个符号：

```
app.get('/:name/get_json/:id', (req, res) => {
  const params = req.params
  const str = {
    name: params.name,
    color: 'gray',
    id: params.id
  }
  res.send(str);
})
```

如上面这个示例，例如请求URL为： `localhost/fred/get_json/123`; 则响应内容为：

```
{
    "name": "fred",
    "color": "gray",
    "id": "123"
}
```

**中间件可以通过`req.params`，来接受URL中传递的参数；**



### 查询字符串

```
app.get('/', (req, res) => {
  res.send('query:' + req.query.name);   //返回url中的name
})

URL: localhost?name=fred
send: query: name
```

query表示查询字符串的键值对；

### post传参

参数体传输在express中，需要借助`body-parse`这个中间件；

```
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())               // 使用中间件

app.post('/', (req, res) => {
  console.log(req.body)
  res.send(req.body.name);   // 返回post请求体中的name
})

```





## 中间件

中间件，本质就是位于**请求**和**响应**这两个过程中间的处理函数，我们可以把它理解为一个从接收到请求，再执行完响应这个过程中间的**流水线**；

在这个流水线中，我们可以执行一些影响响应数据的操作，一步一步的执行；

中间件可以不止有一个，多个中间件之间以流水线的形式执行，

a执行完，next()，通知b中间件执行；

### next逻辑

中间件作为管道形式，添加在请求和响应中间；

可以在每一个中间件里，处理请求对象和响应对象；

例如上一个中间件给请求对象添加了时间属性，下一个中间件里就可以拿到时间，并作出响应；

```
const setDate = (req, res, next) => {
  req.reqTime = new Date()
  next()
}
app.use(setDate)

app.get('/get_json', (req, res) => {
  const str = {
    name: 'fred',
    date: req.reqTime           // 这里可以获取上一步中间件设置的时间
  }
  res.send(str);
})
```




### Express路由分组机制

> Express的路由内部实现比较复杂，这里只挑有关的讲。
>
> Express中，路由是以组的形式添加的。什么意思呢，可以看下面伪代码
>
> app.get('/user/:id', fn1, fn2, fn3);
>
> app.get('/user/:id', fn4, fn5, fn6);
>
> 在内部，Express把上面添加的路由，分成了两个组。继续看伪代码，可以看到，路由在内部被分成了两个组。
>
> var stack = [
>
> {path: '/user/:id', fns: [fn1, fn2, fn3], // 路由组1
>
>   {path: '/user/:id', fns: [fn4, fn5, fn5] // 路由组2
>
>   ];
>
> 路由匹配就是个遍历的过程，略。
>
> next('route')是干嘛的
>
> 答案：跳过当前路由分组中，剩余的handler（中间件）
>
> 如果没有next('route')，一路next()调用下去的话，调用顺序是这样的：
>
> fn1 -> fn2 -> fn3 -> fn4 -> fn5 -> fn6
>
> 假设某些情况下，在执行了fn1后，想要跳过fn2、fn3，怎么办？（比如楼主举的例子）
>
> 答案就是在fn1里调用next('route')。
>
> 然后就变成了
>
> fn1 -> fn4 -> fn5 -> fn6



## 路由器级中间件

可以使用`express.Router()`,来新建局部路由器级中间件；

```
// admin.js
var app = express()
var router = express.Router()

// 如果访问 localhost/0 跳入下一个路由组，返回special
router.get('/:id', function (req, res, next) {
  if (req.params.id === '0') next('route')  // 跳到下一个路由组
  else next()
}, function (req, res, next) {
  if (req.params.id === '1') next('router')  // 跳到下一个路由器
  else res.send('regular')
})

router.get('/:id', function (req, res, next) {
  console.log(req.params.id)
  res.send('special')               // 这里是第二个路由组， 由0跳入
})

// server.js
var app = express()
const cellRouter = require('admin.js')
app.use('/cell', cellRouter, function(req, res, next) {
    res.send('finally')             // 这里是第二个路由器
})
```

上面返回结果为： 

- `localhost/cell/0` =》返回 `special`
- `localhost/cell/1` =》返回 `finally`
- `localhost/cell/2` =》返回 `regular`

**这里先说一下为什么上面例子会按注释的说明执行；**

因为Express中，路由是以组的形式添加的，

上面例子中路由器中，相当于重复定义了两个相同的路由`/:id`；

第一个路由包含两个路由组；第二个路由是一个路由组；

next('route')，表示跳过当前路由分组中，剩余的中间件handler；

next('router')，表示跳过当前整个路由router，上例跳过router后，就进入了`/cell`路由的第二个中间件；
