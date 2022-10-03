## serverless概念

serverless 是云计算的一种，不同于 Iaas、Paas，使用 serverless 只需关心服务的业务逻辑，不需要关心计算资源的调度、弹性伸缩、负载均衡、运维等，这些都是云计算供应商做的事情。

加上按运行付费，这让开发者可以方便快捷且尽可能低成本的开发和部署。

### serverless function

`serverless function` 就是一个单体函数，当用户的请求到来的时候会触发云服务为它分配一个容器运行，然后用完即毁，不会保留状态，下一次运行可能又是在一个新的容器里面。比如数据库的连接是不持久的，这需要借助连接池（**connection pooling**）来实现数据库连接的复用。

特点：

- 不需要关心后台基础设施（环境、运维等）
- 按需付费（区别于云服务器 7*24）
- serverless function无状态，用完即毁



## vercel 

Vercel 是一个开箱即用的网站托管平台，方便开发者快速部署自己的网站。

简单的说，它能极简部署应用到服务端，且是免费不用购买服务器。

特点：

- 自动构建 CI/CD

  导入项目后，Vercel 会自动处理框架的构建设置配置。Vercel 还提供构建日志。

- Git集成

  （直接导入github项目）

- serverless Function

  不需要服务器，而提供接口来处理逻辑

- CDN



### 集成Git

直接导入github仓库，即可创建vercel项目部署。

可以设置生产环境分支，用于项目生产环境构建。

- vercel 会在生产分支推送时，自动编译打包更新生产环境。
- 若推送到非生产环境分支，vercel 会自动帮你编译构建 preview 环境，用于预览。



### 域名

默认构建成功后，会分配`vercel.app`的域名，用以预览项目。

若是自定义域名，则设置域名后，需要到域名提供商增加 `cname`解析，详见[官网文档介绍](https://vercel.com/docs/concepts/projects/domains/add-a-domain)。



### Serverless Function

最重要有趣的功能，简单来讲，前面的velcel提供的功能就是静态网站。

`serverless Function`则提供了动态网站的功能，你可以在项目中直接运行服务端代码以接收http请求。

例如：

```js
export default function handler(request, response) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}
```

如上，在项目根目录，创建一个`api/weather.js`文件，现在你就写好了第一个简单的 `serverless Function`！

现在访问项目主域的`/api/weather`路径，你就可以得到刚才定义的接口返回内容。

> vercel的 serverless Function 背后使用的是 AWS 的 lambda.
>
> 所以同理，你只有在需要 Lambda Function 时才运行您的函数，并且能自动扩展。从每天几个请求扩展到每秒数千个请求。您只需为消耗的计算时间付费 – 代码未运行时不产生费用。

所以我们也不需要关心服务端运行，只有接口被调用时，定义的服务代码才会执行。

这样我们就来到了 `serverless`的空间，我们可以在 function中，自己写服务端代码，或者**再接入`baas`平台**，例如 [supabase](https://supabase.com/docs)，这样我们完全不需要写服务端代码和处理服务端环境，只需要聚焦产品的核心逻辑，就能拥有一整套的应用！





## supabase

Supabase 是一个开源的 Firebase 替代品，**提供构建产品所需的所有后端功能**。您可以完全使用它，也可以只使用您需要的功能。

简单说，supabase可以让我们完全不需要编写或管理所有服务端组件，只以API的方式提供应用依赖的后端服务，例如数据库、权限控制和对象存储。

并且提供了`supabase.js`，用以支持客户端和服务端的功能调用。

特点：

- 管理你的用户和权限

- 用网页管理交互数据库，简单直观

- 第三方文件存储

- 专用的[Postgres 数据库](https://supabase.com/docs/guides/database)

- [自动生成的 API](https://supabase.com/docs/guides/api)

- 行级的数据权限 

  PostgreSQL 的[行级安全性 (RLS) ](https://supabase.com/docs/guides/auth/row-level-security#policies)



### 权限

解决了最主要的两个权限问题：

- **身份验证：**

  是否应允许此人进入？如果是，他们是谁？

- **授权：**

  一旦他们进入，他们可以做什么？

身份验证支持第三方登陆。



### 储存storage

这里在使用supabase.js时，还需要注意策略权限的设置；

storage自动开启了RLS权限管理，可以先设置为所有人都可查看；

- `buckets`权限
- `objects`权限



