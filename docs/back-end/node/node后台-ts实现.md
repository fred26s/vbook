## TS 中使用 nodejs 搭建后端服务

这里记录下自己使用TypeScript + nodeJS技术栈搭建一套后台服务的流程；

## 安装环境

### express-generator

全局安装后，就可以直接使用`express`命令

```
npm i express-generator -g
```

### 初始化项目结构

使用`express`命令创建项目结构

```
express --view=jade XXXX
```

生成的项目包含这些内容：

- bin
- public
- routes
- views
- -app.js
- -package.json

### 新增项目结构

新增一些项目必须的文件夹结构；

- config 存放配置文件
- controller 接口逻辑
- model 数据库相关
- types 第三方库声明文件
- utils 工具函数

### 安装依赖

先安装初始化项目`package.json`中默认依赖的包；

```
npm i
```

安装`typescript`；

```
npm i typescript -D
```

因为在`ts`中开发 node，所以安装`node`以及`express`框架的声明文件；

```
npm i @types/express @types/node -D
```

## 修改目录结构

### 修改所有.js 文件为.ts

因为我们要使用 ts 来写 node 项目，所以先将初始化项目中所有`.js`文件修改为`.ts`；

具体有：

- bin 中的`www` ，挪至根目录，修改为`server.ts`
- 根目录的`app.js`，修改为`app.ts`
- `routes`路由目录下，修改路由文件为`.ts`

修改完成后项目结构为：

```
- public
- routes
- types
- views
- -app.ts
- -package.json
- -server.ts
```

### 配置 tsconfig.json

- outDir

  修改输出目录为`./dist`文件夹

- moduleResolution

  选择模块解析策略，为`node`；

- baseUrl

  基础为`.`

- path

  `"*": ["node_modules/*", "./types/*"]`

### 配置 package.json

先配置脚本文件

```
"scripts": {
    "start": "npm run serve",
    // 启动服务
    "serve": "node ./dist/server.js",
    // 打包
    "build": "tsc && node ./handle-public.js",
    // cross-env NODE_ENV=develop 表示当环境变量是develop时
    // nodemon 相当于Node中的热更新插件 -e 表示指定检测的文件类型为ts, tsx
    // --exec 表示nodemon将监视和执行的文件 后面跟着 ./server.ts
    // ts-node 是因为nodemon只能执行js文件，所以使用这个插件，可以在node环境执行ts文件
    "dev": "cross-env NODE_ENV=develop nodemon -e ts, tsx --exec 'ts-node' ./server.ts"
},
```

## 启动服务

```
npm run dev
```

okay，现在已经成功启动`express`服务了。

## 安装 mysql 库

npm 安装 mysql 模块和声明文件，用来连接操作数据库

```
npm i mysql -S
npm i @types/mysql -D
```

## 新增 Mysql 配置文件

在根目录新增`config`文件夹，存放项目配置文件，并新增子文件`mysql.config.ts`来管理数据库配置；

```
const devConfig = {
  host: 'localhost',
  database: 'ts',
  user: 'root',
  password: '666666'
}

const prodConfig = {
  host: '192.168.0.1',
  database: 'ts',
  port: 3306
}

module.exports = process.env.NODE_ENV === 'development' ? devConfig : prodConfig

```

## 划分MVC架构

### model 层

在根目录新增`model`文件夹，存放数据层文件；

- 新增子文件`index.ts`来连接数据库，并导出 sql 实例；

  ```
  import mysql = require('mysql')
  const mysqlConfig = require('../config/mysql.config')
  
  const sql = mysql.createConnection(mysqlConfig)
  sql.connect()
  
  export = sql
  ```

- 新增文件夹`tables`，来管理表，具体的表 sql 语句都放在这个文件夹内

  -model

   -tables

### 业务 sql

我们现在创建一个`image`表，就在`tables`目录下新建`image.ts`，来存放 sql；

```
module.exports = sql => {
  sql.query(
    'SELECT table_name FROM information_schema.TABLES WHERE table_name ="image"',
    (err, res) => {
      if (res && res.length) return                  // 如果没有此表，就创建
      sql.query(`CREATE TABLE \`image\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`file_key\` VARCHAR(45) NOT NULL,
            \`file_name\` VARCHAR(45) NOT NULL,
            PRIMARY KEY (\`id\`))`)
    }
  )
}
```

`image.ts`暴露出的是一个函数，内部包含具体的 sql 逻辑语句；

将此 sql 引入`tables-index.ts` 文件，绑定在 sql 实例上；

这样就可以将所有具体的业务 sql 文件都引入到这个`index.ts`中，最终暴露给`server.ts`这一个文件即可；

```
----------tables内 index.ts----------------
import mysql = require('mysql')
const mysqlConfig = require('../config/mysql.config')

const sql = mysql.createConnection(mysqlConfig)
sql.connect()                                    // 连接数据库
require('./tables/image')(sql)                  // 用实例执行具体业务sql语句

export = sql
```

将`model`层`index.ts`，暴露给`server.ts`

```
var app = require('./app')
var debug = require('debug')('service:server')
var http = require('http')
require('./model')                  // 暴露index.ts
```

### views 层

在`app.ts`中，可以指定视图页面文件夹；

```
app.set('views', path.join(__dirname, 'views'));   // 默认使用根目录`views`文件夹
```

所以我们在根目录的`views`文件夹就可以新建一个视图页面，这里我们使用的是`jade`模板；

-views

 -upload.jade

在新建的模板中使用`jade`语法创建 HTML；

```
extends layout

block content
  h1 this is fred's world! :)
  h1 And The Awesome Day.
```

然后我们在路由文件中，配置对应的路由地址即可显示刚才创建的模板页面；

打开`routes - index.ts`，添加对应的路由：

```
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Express' })             // 第一个参数表示路由地址
})
```

这里`render`函数有两个参数：

1. 第一个参数表示路由地址，即你在浏览器 url 中输入的地址路径；

2. 第二个参数是传入该路由的参数；

   这个例子中，是在页面 HEAD 中使用了 title；

然后配置好页面和路由后，我们就可以访问`<http://localhost:3000/upload>`（默认端口 3000），跳转到刚才创建的页面了。

### controller 层

现在我们准备写一个组件上传文件的案例，内容是：

1. 页面使用`input`上传文件；
2. 我们后台接受文件存储到指定文件夹；
3. 将文件索引存储数据库；

所以第一步在后台定义`api`接口：

### 封装文件上传方法

我们把具体的处理文件上传的方法封装在根目录下的`utils/uploadFiles.ts`内；

-utils

 -uploadFiles.ts

**先安装依赖库 formidable**

> 这个依赖库模块可以实现上传和编码图片和视频。它支持 GB 级上传数据处理，支持多种客户端数据提交。

因为要接受表单形式上传的文件，并进行处理，所以需要下载依赖库；

```
npm i formidable -S
npm i @types/formidable -D
```

然后封装使用依赖库处理文件的方法，我们把这个具体处理文件的方法封装在工具函数`utils`文件夹中：

```
-----------------utils / uploadFiles.ts-------------------------

import path = require('path')
import formidable = require('formidable')

export = req => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.encoding = 'utf-8'                                     // 文件编码
    form.uploadDir = path.join(__dirname, '../files/')         // 上传的文件保存位置[暂定项目根目录]
    form.keepExtensions = true                                 // 保留文件后缀
    form.parse(req, (err, fields, files) => {
      const { file } = files                              // 文件对象
      if (!err) resolve(file)
      else reject(err)
    })
  })
}

```

### 创建 controller

我们具体的逻辑写在`controller`中，所以根目录新建`controller`文件夹，然后创建`api.ts`文件用来写具体逻辑：

-controller

 -api.ts

```
---------------------controller / api.ts------------------------
const uploadFiles = require('../utils/uploadFiles')              // 引入工具函数 处理上传图片

export = {
  upload: async (req: Express.Request) => {
    await uploadFiles(req)                         // 同步执行工具函数
  }
}
```

现在写好了`controller`逻辑，我们定义一个对应的接口路由；

### 定义接口路由

首先在`routes`路由文件夹中定义`api.ts`路由文件：

```
-----------routes / api.ts------------
var express = require('express')
var router = express.Router()

/* listing. */
router.post('/files_upload', async function(req, res, next) {        // 接口地址是/files_upload
  try {
    await api.upload(req)                 // 调用couroller中upload逻辑
    res.send('success~')                  // 成功就返回`success`
  } catch (error) {
    res.send('error! please reUpload!')
  }
})

module.exports = router
```

然后在根目录`app.ts`中注册接口路由：

这里注册的就是一个根路由`api`，我们将刚才定义的路由接口文件，导入进来注册到`app`实例上；

```
-----------app.ts------------
var apiRouter = require('./routes/api')             // 引入接口路由

app.use('/api', apiRouter)                       // 实例注册路由
```

### 完成接口

这样就定义好了一个接口路由，和对应的`controller`中处理逻辑代码；

最终的接口地址为`http://localhost:3000/api/files_upload`

### 测试接口

在`views`页面中，增加上传标签`input`；

下面示例用`jade`，增加页面上传事件，即可发送请求将上传文件保存至指定位置；

```
extends layout

block content
  input(type="file", id="files")

  script.
    function uploadFiles() {
      const input = document.getElementById('files')
      const filesList = input.files[0];
      const form = new FormData()
      form.append('file', filesList)

      //- AJAX
      const url = 'http://localhost:3000/api/files_upload'
      const xhr = new XMLHttpRequest()
      xhr.open('post', url)
      xhr.send(form)
      xhr.onload = event => {
        console.log(event.target.responseText)
      }
    }
    document.getElementById('files').addEventListener('change', uploadFiles)
```

