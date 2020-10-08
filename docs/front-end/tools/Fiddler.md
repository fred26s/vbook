## Fiddler 工具简介

### 工作环境

[Fiddler 官网](http://www.telerik.com/fiddler)

主要功能（详见官网）：

Web Debugging
Performance Testing
HTTP/HTTPS Traffic Recording
Web Session Manipulation
Security Testing
Customizing Fiddler

### 工作原理

Fiddler 作为客户端和服务器之间的代理服务器。

Fiddler 的 2 种代理模式

流模式（streaming）：可实时把服务器数据返回给客户端。优点：更接近于浏览器本身真实的行为。
缓冲模式（buffering）：HTTP 请求的所有数据在服务器端都准备好之后，才把数据返回给客户端。优点：可以控制最后的服务器响应。

### 常见使用场景

1. 开发环境 hosts 配置 通常情况下，配置 hosts 文件需要修改系统文件，很不方便；在多个开发环境下切换很低效。Fiddler 提供了相对高效的 hosts 配置方法。
2. 前后端接口调试 通常情况下，调试前后端接口需要真实的环境、一大堆假数据、写 JavaScript 代码。Fiddler 只需要一个 UI 界面进行配置即可。
3. 线上 bugfix Fiddler 可将发布文件代理到本地，快速定位线上 bug。
4. 性能分析和优化 Fiddler 会提供请求的实际图，清晰明了网站需要优化的地方。



## Fiddler 界面操作介绍



### 工具条常用功能

备注按钮(Set Comments)
回放按钮（Replay）快捷键 R
清空监控面板按钮（Remove）
调试 Debug 按钮（Go）结合状态栏断点图标指示
模式切换按钮（Stream）默认为缓冲模式
解码请求按钮（Decode）
保持会话按钮（Keep sessions）
过滤请求按钮（Any Process）
查找按钮（Find）
保存会话按钮（Save）
保存截图按钮
计时器按钮
快速启动浏览器按钮（Browse）
清除缓存按钮（Clear Cache）
编码、解码按钮（TextWizard）
分离面板按钮（Tearoff）
MSDN 搜索框



### 状态栏操作

控制台：help 命令
Capturing 按钮：控制 Fiddler 是否进行捕获工作
过滤会话来源
记录当前展示的会话数量
显示选中的会话 URL



###  监控面板的使用

监控面板是 Fiddler 的最核心的功能之一，显示 HTTP 的会话。

Result: HTTP 状态码
Protocol: 协议
Host: 主机
ServerIP: 服务器 IP
URL

监控面板右侧 Tabs

分为上下 2 部分，上部分为 HTTP 请求相关信息，下部分为 HTT P响应相关信息。

数据统计（Statics): RTT 往返时间 Show Chart
对请求进行解包（Inspectors）:
Heraders 文件代理（AutoResponder）: 线上 bug 文件本地测试
前后端接口联调（Composer）: 和服务器接口进行调试 日志（Log）
网站性能分析的时间线（Timeline）



## Fiddler 常用功能场景

- ### 定位线上bug

  > 参考：https://www.cnblogs.com/LanTianYou/p/7207694.html

  在测试的过程中，有的需求是这样的，它需要你修改接口返回的数据，从而检查在客户端手机app内是否显示正确，这也算是一种接口容错测试，接口容错测试属于app性能（专项）测试的其中一种。

  ### 通过Fiddler我们可以有好几种方法修改返回结果：

  1. 在Fiddler底部的黑色命令行显示区域通过bpu url的形式按回车之后进行拦截，通过手机app访问指定接口，拦截到后可以选择response文件后通过拦截；

     ```
     请求前断点（before response)： bpu
     取消断点，在命令行输入： bpu 回车就可以了
     响应后断点（after  requests）： bpafter
     取消断点，在命令行输入： bpafter 回车就可以了
     ```

     

  2. **在AutoResponder里Add Rule，然后在Rule Editor里设置response的内容；**

     ```
     实际就是使用AutoResponder来自动给指定接口返回指定数据；
     ```

  3. 在Rules设置中选择Automatic Breakpoints中的After Responses进行拦截。

  第一种不能自定义创建response，只能通过选择文件的形式来指定response。

  第三种对所有请求进行拦截，太粗太泛。所以实际测试拦截请求中，**最灵活、功能最强的是第二种。**

  

- ### 文件、文件夹代理和 HOSTS 配置

  AutoResponder Tools->HOSTS

- ### 请求模拟、前后端接口调试

  Composer->GET/POST



### 网络限速

FiddlerScript



## Fiddler 插件介绍

[Fiddler 插件](http://www.telerik.com/fiddler/add-ons)



### 代码格式化插件

JavaScript Formatter Traffic Differ

###  HTTP 代理插件

Willow 还有限速功能

## fiiddler抓包HTTPS

> fiddler无法为windows配置根证书解决办法
>
> win10系统中安装了fiddler，一直无法成功创建根证书，一直出现错误提示。无法为windos配置根证书。
>
> 解决办法：
>
> 打开cmd命令行
>
> 进入Fiddler的安装目录下。比如：D:\Program Files\Fiddler Web Debugger
>
> 输入命令：
>
> makecert.exe -r -ss my -n "CN=DO_NOT_TRUST_FiddlerRoot, O=DO_NOT_TRUST, OU=Created by http://www.fiddler2.com" -sky signature -eku 1.3.6.1.5.5.7.3.1 -h 1 -cy authority -a sha1 -m 120 -b 10/12/2020
>
> 注意，最后的日期需要超过你安装软件的日期
>
> 最后出现 Succeeded。即可成功创建证书，完美解决。
> ————————————————
> 版权声明：本文为CSDN博主「white-night」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
> 原文链接：https://blog.csdn.net/shuryuu/java/article/details/88803581







## Rosin

Rosin是一个Fiddler插件，协助开发者进行移动端页面开发调试，是移动端web开发、调试利器。







## 