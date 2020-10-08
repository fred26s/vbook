## 如何安装 mysql

1. 具体步骤不赘述，官网安装速度太慢，推荐使用[国内镜像](http://mirrors.sohu.com/mysql/MySQL-8.0/)；

2. 解压完成后，配置全局变量

   ```
   变量名：MYSQL_HOME
   变量值：E:\XX\mysql-5.7.20-winx64
   ```

   Path 路径(win7)

   ```
   在路径最后添加
   ;E:\xx\mysql-8.0.19-winx64\bin
   ```

3. 生成 data 文件

   以管理员身份运行 cmd，进入 E:\mysql\mysql-8.0.12-winx64\bin>下

   执行命令：

   `mysqld --initialize-insecure --user=mysql`

   在 E:\python\mysql\mysql-8.0.12-winx64\bin 目录下生成 data 目录

4. 安装 mysql

   ```bash
   mysqld --install mysql8.0
   ```

   `--install` 后面的`mysql8.0`是自定义名

   如果显示 Service successfully installed，代表安装服务 mysql8.0 已经成功，接下来启动服务：

5. 启动服务

   ```
   net start mysql8.0
   ```

   如果显示`mysql8.0 服务正在启动 .` ~~~ `mysql8.0 服务已经启动成功。`

   那就明白已经安装全部 okay 啦，就可以登录数据库了！

6. 设置 root 密码

   先登录进入数据库

   ```
   mysql  -u root
   ```

   如果出现一堆字符，写着`welcome`什么的那就表示正常登录进数据库啦，只不过目前使用的初始密码

   然后我们就修改密码，8.0 的修改密码语句为：

   ```
   alter user 'root'@'localhost' identified by 'new password';
   ```

   这里修改完后，`exit`退出 mysql，重新登录时就需要输入密码了（-p 表示输入密码）

   ```
   mysql  -u root -p
   ```

这里`mysql`就全部设置完成了，这里再说一下日常开发我们使用的软件，如`navcat`；

不赘述安装过程，但目前使用`mysql8.0`版本和`navcat12`，用`navicat`连接时，出现了报错如下：

```
Authentication plugin 'caching_sha2_password' cannot be loaded
```

查阅资料了解：出现这个原因是 mysql8 之前的版本中加密规则是 mysql_native_password，而在 mysql8 之后,加密规则是 caching_sha2_password；

解决问题方法有两种：

- 一种是升级 navicat 驱动
- 一种是把 mysql 用户登录密码加密规则还原成 mysql_native_password.

这里说一下第二种方法：

1. 登录数据库

   ```
    mysql -u root -p

    // 密码666666
   ```

2. 修改账户密码加密规则并更新用户密码

   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;   #修改加密规则

   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';   #更新一下用户的密码
   ```

3. 刷新权限并重置密码

   ```
    FLUSH PRIVILEGES;   #刷新权限
   ```

   再次重置密码

   ```
   alter user 'root'@'localhost' identified by '666666';
   ```

然后就可以解决此问题。

> Shelljs 是 Node.js 下的脚本语言解析器，具有丰富且强大的底层操作(Windows/Linux/OS X)权限。Shelljs 本质就是基于 node 的一层命令封装插件，让前端开发者可以不依赖 linux 也不依赖类似于 cmder 的转换工具，而是直接在我们最熟悉不过的 javascript 代码中编写 shell 命令实现功能。
>
> shelljs 做的事就是自动化，从耗时的重复性常规动作里解放出来，提升开发效率和工作心情。

## 开机自启动

### PM2 使用

这里介绍`PM2`进行开机自启动 nodejs 项目；

先全局安装`pm2`:

```
npm install pm2 -g
```

因为我们的 nodejs 项目使用的是`typescript`，所以再安装一下`ts`依赖；

```
pm2 install typescript
```

因为 PM2 项目启动的是 js 文件，所以我们先把`ts`构建一下`npm run build`;

然后启动 pm2;

okay，cd 到 serve 项目根目录，启动！

```
pm2 start serve.js --name='xxx'
```

不确定是否启动成功，可以监听一下活动端口，是否有当前端口：

```
netstat
```

这里就开启了一个永久后台启动的 nodejs 项目了。

### 开机自启动

这里如果想在 windows 下，开机自启动 node 项目；

可以安装`pm2-windows-service`模块来支持；

```
npm i -g pm2-windows-service
```

### 添加 pm2 环境变量

添加系统环境变量 `PM2_HOME=D:\.pm2`
右键 [我的电脑] - [属性] - [高级系统设置] - [环境变量] - 新建 [系统变量]
名称`PM2_HOME`
路径`D:\.pm2`（这路径根据自己需要定）

### 安装服务

以管理员权限打开新的命令行窗口,执行以下命令来安装服务

```undefined
pm2-service-install
```

`Perform environment setup ?` 选 n, 继续
此时, PM2 服务已安装成功并已启动, 可以通过 Wn+R 来查看，输入`services.msc`即可看到服务

### 启动 node 程序

下面用 pm2 来启动我们自己的服务程序 app.js, 然后告诉 pm2 开机后自动运行我 app.js
继续在管理员命令行下, cd 到 app.js 所在目录

```css
pm2 start app.js --name myapp
```

查看服务列表

```cpp
pm2 list
```

添加到自启动服务

```undefined
pm2 save
```

`pm2 save`很重要, 它保存当前 pm2 正在管理的 NodeJS 服务, 并在开机后恢复这些服务
至此, 安装配置完成

### 卸载服务

```undefined
pm2-service-uninstall
```

### pm2 常用命令

```
$ pm2 start app.js # 启动app.js应用程序
$ pm2 start app.js -i 4 # cluster mode 模式启动4个app.js的应用实例
# 4个应用程序会自动进行负载均衡
$ pm2 start app.js --name="api" # 启动应用程序并命名为 "api"
$ pm2 start app.js --watch # 当文件变化时自动重启应用
$ pm2 start script.sh # 启动 bash 脚本

$ pm2 list # 列表 PM2 启动的所有的应用程序
$ pm2 monit # 显示每个应用程序的CPU和内存占用情况
$ pm2 show [app-name] # 显示应用程序的所有信息

$ pm2 logs # 显示所有应用程序的日志
$ pm2 logs [app-name] # 显示指定应用程序的日志
pm2 flush

$ pm2 stop all # 停止所有的应用程序
$ pm2 stop 0 # 停止 id为 0的指定应用程序
$ pm2 restart all # 重启所有应用
$ pm2 reload all # 重启 cluster mode下的所有应用
$ pm2 gracefulReload all # Graceful reload all apps in cluster mode
$ pm2 delete all # 关闭并删除所有应用
$ pm2 delete 0 # 删除指定应用 id 0
$ pm2 scale api 10 # 把名字叫api的应用扩展到10个实例
$ pm2 reset [app-name] # 重置重启数量

$ pm2 startup # 创建开机自启动命令
$ pm2 save # 保存当前应用列表
$ pm2 resurrect # 重新加载保存的应用列表
```

## 日志服务

### 种类

日志服务分为代码中为两种：

- ### 定位问题产出的日志

- ### 请求记录日志

定位问题产出的日志我们可以通过在代码中引入库来完成，好用的有`morgan`、`winston`等等；

这里只列出使用介绍，不详细讲解配置信息；

使用`morgan`库实现日志服务；

> 使用方法可参照官方项目示例：<https://www.npmjs.com/package/morgan>
>
> 详细进阶方法可访问：[https://github.com/chyingp/nodejs-learning-guide/blob/master/%E8%BF%9B%E9%98%B6/%E6%97%A5%E5%BF%97%E6%A8%A1%E5%9D%97morgan.md](https://github.com/chyingp/nodejs-learning-guide/blob/master/进阶/日志模块morgan.md)

```
自定义日志格式
首先搞清楚morgan中的两个概念：format 跟 token。非常简单：

format：日志格式，本质是代表日志格式的字符串，比如 :method :url :status :res[content-length] - :response-time ms。
token：format的组成部分，比如上面的:method、:url即使所谓的token。
搞清楚format、token的区别后，就可以看下morgan中，关于自定义日志格式的关键API。

morgan.format(name, format);  // 自定义日志格式
morgan.token(name, fn);  // 自定义token
```

示例：

```
var express = require('express');
var app = express();
var morgan = require('morgan');

// 自定义token
morgan.token('from', function(req, res){
    return req.query.from || '-';
});

// 自定义format，其中包含自定义的token
morgan.format('joke', '[joke] :method :url :status :from');

// 使用自定义的format
app.use(morgan('joke'));

app.use(function(req, res, next){
    res.send('ok');
});

app.listen(3000);
```

### pm2 产出监控日志

如我们一个持久化的服务，在运行时如果需要错误日志，我们可以通过`pm2.json`配置文件完成；

pm2.json 可以配置多个运行的进程参数；

详细配置可以参照： https://www.cnblogs.com/bq-med/p/9012438.html

## 文件上传

可以使用插件库解决，`Multiparty`和`Formidable`；

Multiparty 可以用来解析 FormData 数据，Formidable 也是与之功能相同的插件；

## 登录鉴权

可以使用`express-jwt`插件库；

Node.js 上 Token 鉴权常用的是 passport，它可以自定义校验策略，但如果你是用 express 框架，又只是解析 JWT 这种简单需求，可以尝试下 express-jwt 这个中间件。

## 项目分层

3 层架构，controller service DAO

sql 写在 DAO 层中；
