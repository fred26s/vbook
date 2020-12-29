前言，最近项目用到了 Nginx 做反向代理，顺便记录一篇博文。

## Nignx

Nginx 同 Apache 一样都是一种 Web 服务器，但其轻量级的体积，及高并发等特点广受好评;

### 优点

1. **性能方面**

   Nginx 是专门为性能优化而开发的，实现上非常注重效率。

   它采用内核 Poll 模型，可以支持更多的并发连接，最大可以支持对 5 万个并发连接数的响应，而且只占用很低的内存资源。

2. **稳定性方面**

   Nginx 采取了分阶段资源分配技术，使得 CPU 与内存的占用率非常低。

   Nginx 官方表示，Nginx 保持 1 万个没有活动的连接，而这些连接只占用 2.5MB 内存，

   因此，类似 DOS 这样的攻击对 Nginx 来说基本上是没有任何作用的。

3. **高可用性方面**

   Nginx 支持热部署，启动速度特别迅速，因此可以在不间断服务的情况下，对软件版本或者配置进行升级，

   即使运行数月也无需重新启动，几乎可以做到 7x24 小时不间断地运行。

4. **效率方面**

   作为 Web 服务器，Nginx 处理静态文件、索引文件，自动索引的效率非常高。

## web 服务器

说到这个名字了，简单说一下定义：

> 当我们使用 PC 并通过浏览器查看网站时，页面访问到的服务器都是我们都可称之为 Web 服务器。

### 那 web 服务器做了什么呢？

再等一下（。。估计看文的大家心想，我就是想看看 nignx 是什么，怎么牵扯出了这么多东西），

了解 web 服务器做了什么之前，我们先说一下使用浏览器访问页面是怎么一个流程；

1. 用户使用浏览器，输入想要访问的网址（**域名**：例如`http://www.baidu.com`）；
2. 浏览器访问**DNS**服务器，查询得到域名对应的**IP**；
3. 浏览器通过**IP**，向**web 服务器**发送资源请求； （注意这里 web 服务器登场了）
4. **web 服务器**根据请求，向**计算机**获取所需资源；
5. **web 服务器**将获取到的资源返回给浏览器；
6. **浏览器**接收到返回的资源（例如 HTML），**解析**成页面，展示给用户；

那 web 服务器到底做什么了？

一般 web 服务器都会有配置映射文件地址，也就是文件路径和 URL 的关系映射；

我们看第 4 步，web 服务器接到请求`URL`后，解析`URL`字符串；

通过解析得到的`URL`，拿到映射的文件路径，在计算器磁盘中就可以获取静态资源，然后将资源返回给浏览器；

所以 web 服务器就是做了**静态资源分配**这个事，供外界远程访问；

也是 web 服务器最常用的场景。

严格意义上 web 服务器只负责处理`http`协议，管理静态资源，其他内容都**转交**给其他应用服务器来做；

怎么转交呢？

那么就是使用 Nignx 的**反向代理**功能了，这也就是 Nignx 常见的使用方式；

### 常见的 web 服务器有哪些呢？

Nginx、Apache、Lighttpd 等等很多；

## Nginx 使用

了解 Nginx 是什么后，那么赶紧说一下怎么使用吧。

分为三步：

1.下载安装

到官网直接下载 windows 版就可以了，解压即可；

2.运行 Nignx

使用 CMD 进入到解压目录，命令`start nginx`看到一个窗口闪现，nginx 就成功启动了！

是不是很简单...：|

3.验证

浏览器打开`lacalhost:80`，如果显示 nginx 欢迎页，则表示启动成功；

到这里 Nginx 已经 ok 了！

接下来就告诉他，怎么让它变成一个成熟的 nginx，承担起上面提到**web 服务器**的责任吧

### 静态资源托管

上面也说了浏览器获取网页的步骤，那么当浏览器发送请求给 web 服务器的时候，我们现在手握 nginx 应该怎么办呢？

**配置代理映射**即可！

打开 nginx 解压路径`nginx-1.9.9\conf\nginx.conf`这个**配置文件**；

这个文件就是 ngnix 的配置文件，所有你需要的功能配置，都在这个文件里搞定；

打开到 35 行左右，会发现下面这段代码，这里就主要配置的内容了：

```
server {
        listen       80;               // nginx服务端口
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;                         // 现在映射的资源是默认的nginx欢迎页（相对路径）
            index  index.html index.htm;      // 这里index表示默认文件，nginx会优先从这些文件里匹配
        }
		...
		...
		...
}

```

这里举个栗子，

如果我们要实现图片资源的访问，浏览器输入`location:80/public/cake.jpg`，

希望获取到电脑上想要的`E:/nginx-1.12.9/static/cake.jpg`这张图片时；

那我们用 location 来匹配文件映射即可， 上代码：

```
server {
        listen       80;               // nginx服务端口
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

		location /public {
            alias   E:/nginx-1.12.9/static/;   //alias表示将location映射到的路径替换
		   autoindex on;                 //表示可以访问目录，显示文件列表（类似ftp）
        }
		...
}

```

通过这个配置就可以实现浏览器输入的 URL 虽然是`location:80/public/cake.jpg`，

但我们的 web 服务器 nginx 收到后，将其中的`public`替换为`E:/nginx-1.12.9/static/`，

所以最终指向了文件路径`E:/nginx-1.12.9/static/cake.jpg`；

这样就实现了**web 服务器**的静态资源托管！

### 配置属性

这里在说明一下 location 中常用的一些配置属性；

1. ### root 和 alias === 设置静态资源根目录

   > 这两个常用来访问文件系统；

   alias：表示直接替换掉 location 指定的 url；

    **需要注意 alias 指定的 url，结尾要以`/`结尾！否则会出现无法匹配**

   root：表示将新路径拼接到 location 之前

   ```
   例如:
   location /public {
         root E:/nginx-1.12.9/static/;  // 这里的最终映射URL为 E:/nginx-1.12.9/static/public
         index  index.html index.htm;
   }
   ```

2. ### autoindex === 访问目录时列出文件列表

   设置后，该地址打开会生成目录页面，类似于 ftp 服务；

   ```
   location /public {
         root E:/nginx-1.12.9/static/;
         autoindex on;
   }
   ```

3. ### index === 优先匹配文件

   这里设置的文件，如果访问的是目录文件夹地址，nginx 会优先匹配指定文件，如果匹配到，则直接展示；

4. ### proxy_pass === 反向代理配置

   > 常用于代理请求，适用于前后端负载分离或多台机器、服务器负载分离的场景；
   >
   > 例如，服务器上部署了配置的静态资源映射，用来访问主页 HTML，
   >
   > HTML 中的请求，我们使用反向代理来配置到指定的服务 serve 上；

   例如实际请求为：`http://192.168.0.1/api/get_list`

   ```
   (1).
   location /api/ {
       proxy_pass http://127.0.0.1:8080; // 结尾不加'/'，最终URL为： http://127.0.0.1:8080/api/list
   }

   (2).
   location /api/ {
       proxy_pass http://127.0.0.1:8080/; // 结尾加'/'，最终URL为： http://127.0.0.1:8080/list
   }

   (3).
   location /api/ {
       proxy_pass http://127.0.0.1:8080/test/;
   }
   // 结尾加'/'，最终URL为： http://127.0.0.1:8080/test/get_list

   (4).
   location /api/ {
       proxy_pass http://127.0.0.1:8080/test;
   }
   // 结尾加'/'，最终URL为： http://127.0.0.1:8080/testget_list
   ```

这样就配置好了基础的 web 服务器，实现了基本功能；

虽然 web 服务器的作用很简单，目的也很明确，就是管理静态资源；

但 nginx 能做的显然不止这么点，无论是反向代理负载均衡、gzip 压缩、跨域设置等等很多功能都可以简单做到；

实现方式都是在配置文件中设置，碍于篇幅，暂不赘述了。先把 nginx 用起来吧~ ：)

## location 详解

location 语法规则很简单，一个`location`关键字，后面跟着可选的修饰符；

最后是要匹配的字符，花括号中是要执行的操作。

```
// location 修饰符 URL {执行内容}

location [ = | ~ | ~* | ^~ ] url {
	...
}
```

### 修饰符

- `=` 表示精确匹配。只有请求的 url 路径与后面的字符串完全相等时，才会命中。
- `~` 表示该规则是使用正则定义的，区分大小写。
- `~*` 表示该规则是使用正则定义的，不区分大小写。
- `^~` 表示如果该符号后面的字符是最佳匹配，采用该规则，不再进行后续的查找。

### 匹配类型

从修饰符可以看出 location 有**两种表示形式**，

- 一种是使用前缀字符，也就是直接使用`URL`中的字符匹配；

- 一种是使用正则。

所以如果是正则匹配的话，前面有`~`或`~*`修饰符。

### 匹配规则

可以先排一下匹配规则的**优先程度**；

精准匹配 > 正则匹配 > 前缀字符匹配

为什么这样认为呢？因为 Location 匹配顺序是这样：

1. 首先先检查使用前缀字符定义的 location，选择最长匹配的项并记录下来。（这里并没有使用，只是记录暂存）

2. 如果找到了精确匹配的 location，也就是使用了`=`修饰符的 location，结束查找，使用它的配置。

   （这也就能说明精准匹配优先度最高，只要符合直接执行并结束）

3. 如果没有精准匹配，然后就按顺序查找使用正则定义的 location，

   如果匹配则停止查找，使用它定义的配置。 （这里就是正则优先程度居其次）

4. 最后如果没有匹配的任何正则 location，则使用前面记录的最长匹配前缀字符 location。

   （前缀字符匹配优先程度最低）

也需要注意的是，因为正则和精准匹配的特性，所以他们只要匹配后，就不会再往下查找；

## 常用命令

### linux 下

```
启动Nginx服务

要启动Nginx服务，请运行以下命令。 请注意，如果配置语法不正确，此过程可能会失败。

$ sudo systemctl start nginx
或者
$ sudo service nginx start

启用Nginx服务

上一个命令仅在此期间启动服务，要在启动时启用它自动启动，请运行以下命令。

$ sudo systemctl enable nginx
或者
$ sudo service nginx enable

重启Nginx服务

要重新启动Nginx服务，将停止然后启动该服务的操作。

$ sudo systemctl restart nginx
或者
$ sudo service nginx restart

查看Nginx服务状态

您可以按如下方式检查Nginx服务的状态。 此命令显示有关服务的运行时状态信息。

$ sudo systemctl status nginx
或者
$ sudo service nginx status
```

### window

```
1、启动：

C:\server\nginx-1.0.2>start nginx

或

C:\server\nginx-1.0.2>nginx.exe

注：建议使用第一种，第二种会使你的cmd窗口一直处于执行中，不能进行其他命令操作。

2、停止：

C:\server\nginx-1.0.2>nginx.exe -s stop

或

C:\server\nginx-1.0.2>nginx.exe -s quit

注：stop是快速停止nginx，可能并不保存相关信息；quit是完整有序的停止nginx，并保存相关信息。

3、重新载入Nginx：

C:\server\nginx-1.0.2>nginx.exe -s reload

当配置信息修改，需要重新载入这些配置时使用此命令。

4、重新打开日志文件：

C:\server\nginx-1.0.2>nginx.exe -s reopen

5、查看Nginx版本：

C:\server\nginx-1.0.2>nginx -v
```



## nginx 配置 gzip 压缩

【参考】: `https://blog.csdn.net/qq_15807277/article/details/91909372`

```
    #开启gzip压缩
    gzip on;
    #http的协议版本
    gzip_http_version 1.0;
    #IE版本1-6不支持gzip压缩，关闭
    gzip_disable 'MSIE[1-6].';
    #需要压缩的文件格式 text/html默认会压缩，不用添加
    gzip_types text/css text/javascript application/javascript;
    #设置压缩缓冲区大小，此处设置为4个8K内存作为压缩结果流缓存
    gzip_buffers 4 8k;
    #压缩文件最小大小
    gzip_min_length 1k;
    #压缩级别1-9
    gzip_comp_level 9;
    #给响应头加个vary，告知客户端能否缓存
    gzip_vary on;
    #反向代理时使用
    gzip_proxied off;
```
