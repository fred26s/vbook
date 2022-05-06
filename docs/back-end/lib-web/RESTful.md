## 概念

REST 就是一种设计 API 的模式。最常用的数据格式是 JSON。由于 JSON 能直接被 JavaScript 读取，所以，以 JSON 格式编写的 REST 风格的 API 具有简单、易读、易用的特点。

REST -- REpresentational State Transfer 直接翻译：**表现层状态转移**

通俗的可以理解为：

**URL 定位资源，用 HTTP 动词（GET,POST,DELETE,DETC）描述操作。**

## 好处

由于 API 就是把 Web App 的功能全部封装了，所以，通过 API 操作数据，可以极大地把前端和后端的代码隔离，使得后端代码易于测试，前端代码编写更简单。

此外，如果我们把前端页面看作是一种用于展示的客户端，那么 API 就是为客户端提供数据、操作数据的接口。这种设计可以获得极高的扩展性。例如，当用户需要在手机上购买商品时，只需要开发针对 iOS 和 Android 的两个客户端，通过客户端访问 API，就可以完成通过浏览器页面提供的功能，而后端代码基本无需改动。

## 原则

- **网络上的所有事物都被抽象为资源**

- **每个资源都有一个唯一的资源标识符**
- **同一个资源具有多种表现形式(xml,json 等) **

- **对资源的各种操作不会改变资源标识符**

- **所有的操作都是无状态的**

- **符合 REST 原则的架构方式即可称为 RESTful**

## 规范

-如何对资源操作

采用 HTTP 协议规定的 GET、POST、PUT、DELETE 动作处理资源的增删该查操作

![img](//img.callbackhell.xyz/vuepress/lib-web/RESTful.webp)


## 示例

> URL命名通常有三种，
>
> - 驼峰命名法(serverAddress)
> - 蛇形命名法(server_address)
> - 脊柱命名法(server-address)。
>
> 由于URL是大小写敏感的，如果用驼峰命名在输入的时候就要求区分大小写，一个是增加输入难度，另外也容易输错，报404。
>
> **蛇形命名法**用下划线，在输入的时候需要切换shfit，同时下划线容易被文本编辑器的下划线掩盖；
>
> 支付宝用的是**蛇形命名法**，stackoverflow.com和github.com用的是**脊柱命名法**

### URL命名原则

1、 URL请求采用小写字母，数字，部分特殊符号（非制表符）组成。

2、 URL请求中不采用大小写混合的驼峰命名方式，尽量采用全小写单词，如果需要连接多个单词，则采用连接符“_”连接单词

### URL分级

第一级Pattern为模块,比如组织管理/orgz, 网格化：/grid

第二级Pattern为资源分类或者功能请求，优先采用资源分类

 

### CRUD请求定义规范（RESTful）

如果为资源分类，则按照RESTful的方式定义第三级Pattern，

RESTful规范中，资源必须采用资源的名词复数定义。

| /orgz/members     | GET    | 获取成员列表       |
| ----------------- | ------ | ------------------ |
| /orgz/members/120 | GET    | 获取单个成员       |
| /orgz/members     | POST   | 创建成员           |
| /orgz/members/120 | PUT    | 修改成员           |
| /orgz/members     | PUT    | 批量修改           |
| /orgz/members/120 | PATCH  | 修改成员的部分属性 |
| /orgz/members/120 | DELETE | 删除成员           |

 

### 复杂查询请求定义规范（RESTful）

| /module/tickets?state=open                                   | GET  | 过滤           |
| ------------------------------------------------------------ | ---- | -------------- |
| /module/tickets?sort=-priority                               | GET  | 排序           |
| /module/tickets?sort=-priority,created_at                    | GET  | 排序           |
| /module/tickets?sort=-updated_at                             | GET  | 排序           |
| /module/tickets?state=closed&sort=-updated_at                | GET  | 过滤+排序      |
| /module/tickets?q=return&state=open&sort=-priority,created_at | GET  | 搜索+过滤+排序 |
| /module/tickets/recently_closed                              | GET  | 一般数据请求   |
| /module/tickets?fields=id,subject,customer_name,updated_at&state=open&sort=-updated_at | GET  | 指定返回列     |
| /cars?offset=10&limit=5                                      | GET  | 分页           |

 