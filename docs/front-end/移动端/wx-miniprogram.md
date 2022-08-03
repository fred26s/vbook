## 小程序项目

## 项目介绍

这里开发了一个基于sxh-admin的衍生微信小程序项目，为了更好的维护订单信息，以及方便支持图片上传

### 使用场景

1. 【用户使用】，管理在电脑端下单后让用户填写订单信息；
2. 【管理员使用】，填写用户提供的信息后，给用户确认或补充；

### 操作步骤

1. 在后台新增订单，生成对应的订单二维码（小程序二维码）；

2. 将二维码通过微信发送给用户；

3. 在微信端，扫描小程序二维码，来维护指定的订单信息；

   二维码对应指定的唯一订单；

### 二维码使用逻辑

二维码作为串联管理端生成的订单信息，方便用户在移动端进行信息确认和维护（可上传图片）

- CODE 码在当前【进行中】订单里，唯一；
- 只有【进行中】状态的订单，可以使用 CODE 码关联；
- 【已完成】状态的订单所关联的 CODE 码，过期作废，无需删除；（接口无法修改）
- 所有订单有自己的二维码
- 只有【进行中】状态的订单，可编辑修改；（非编辑订单接口无法成功修改）

## 小程序端介绍

### 小程序表单页内容

- 蛋糕图片(店主上传) 置顶

  使用 upyun 上传获取的图片地址：`域名+文件目录名`

- 顾客称呼

- 手机号

- 配送定位（经纬度和地址信息）

- 配送时间

- 蛋糕尺寸

### 页面流转逻辑（token）

1. 进入页面，即请求 token 权限；

   - 写死一个 wx 小程序专用的账号密码，获取此用户的 token

2. 页面后续所有请求，都携带此 token；

3. 页面有对应的订单 ID；

   页面是通过后台根据订单生成的二维码跳转而来，所以当前页面有对应订单的 ID；（通过小程序二维码获得）

4. 后续相关保存的请求，根据页面订单 ID 关联；

## 小程序开发技巧

## 页面间跳转

小程序启动时仅有一个页面层级，而在小程序运行中，页面之间的跳转表现包括这些：

| API               | 页面表现                                       | 页面栈表现                                                                                                 |
| :---------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `wx.navigateTo`   | 保留当前页面，跳转到应用内的某个页面           | 创建一个新的页面层级                                                                                       |
| `wx.navigateBack` | 关闭当前页面，返回上一页面或多级页面           | 销毁一个页面层级                                                                                           |
| `wx.redirectTo`   | 关闭当前页面，跳转到应用内的某个页面           | 将当前页面层级重新初始化。重新传入页面的初始数据、路径等，视图层清空当前页面层级的渲染结果然后重新渲染页面 |
| `wx.reLaunch`     | 关闭所有页面，打开到应用内的某个页面           | 销毁所有页面层级，再创建一个新的页面层级                                                                   |
| `wx.switchTab`    | 关闭其他所有非 tabBar 页面，跳转到 tabBar 页面 | 销毁所有非 tabBa 页面层级，打开 tabBar 页面层级                                                            |

上面提到了 tabBar。除了普通的页面跳转，小程序里还支持配置 tabBar。tabBar 就是类似客户端 APP 底部的 tab 切换，为了获得更好的体验，小程序提供了这样的全局组件，在 app.json 文件中设置 tabBar，因此我们小程序会区分 tabBar 页面和非 tabBar 页面。tabBar 页面之间的切换都只会有一个层级，而跳转到非 tabBar 页面之后，就有了页面层级和页面栈的管理。

## 小程序可配置数据预拉取

[小程序数据预拉取文档](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/pre-fetch.html)

## 小程序样式

- 发现引用的组件不能直接写类名，这样类名样式不生效

  需要组件内声明哪些样式类可以从外部修改，这样外部引用时才可以修改样式类名。。

  比较恶心。。

## 选点插件

地图选点功能使用了微信插件`chooseLocation`；

[微信文档-插件使用](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

[腾讯位置服务](https://lbs.qq.com/product/miniapp/home/)

### 配置

1. 在 wepy 的 app.wpy 中增加配置；

```
<config>
{
    pages: [
    ],
    window: {
    },
    // 引入插件
    "plugins": {
      "chooseLocation": {
        "version": "1.0.5",
        "provider": "wx76a9a06e5b4e693e"
      }
    },

    "permission": {
    }
}
</config>

```

2. 使用插件

```
// 引入地图选点插件
const chooseLocation = requirePlugin('chooseLocation')

// 跳转地图选点插件
mapForPoint() {
  const key = '2RDBZ-TMME6-5BQSQ-MOW5G-.....' // 使用在腾讯位置服务申请的key
  const referer = 'sxh-admin' // 调用插件的app的名称
  const {latitude, longitude} = this.form
  const location = JSON.stringify({
    latitude,
    longitude
  })
  const category = '生活服务,娱乐休闲'
  // 跳转进入地图插件
  wx.navigateTo({
        url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
   })
},
```

3. 接收选点插件的数据

```
// 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow() {
  // 获取选点插件数据
    const location = chooseLocation.getLocation() // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
      // latitude 经度
      // longitude 纬度
      // name 地点名
      console.log('location=>', location)
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null)
  },
```

## wxSDK 使用

项目中用到了**地图规划导航**功能，这里引用微信 jsSDK 来实现；

### 配置

1. 将 SDK 引入项目

   ```
   // 引入SDK核心类
   var QQMapWX = require('../lib/qqmap-wx-jssdk.min.js')
   // 实例化API核心类
   var qqmapsdk = new QQMapWX({
     key: '2RDBZ-TMME6-5BQSQ-MOW5G......' // SCERET_KEY必填
   })
   ```

2. 通过 sdk 计算 map 所需的规划路径数据

   ```
   // SDK示例写法
       mapForSDKDirection({ to }) {
         const _this = this
         // 调用距离计算接口
         qqmapsdk.direction({
           mode: 'driving', // 可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
           // from参数不填默认当前地址
           // 路径起点位置
           from: {
             latitude: 34.317541809,
             longitude: 108.726918405
           },
           to,
           success(res) {
        	  // 这里获取的路径数据，是压缩过的，所以需要解压后使用
             const coors = res.result.routes[0].polyline
             const pl = []
             // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
             var kr = 1000000
             for (let i = 2; i < coors.length; i++) {
               coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
             }
             // 将解压后的坐标放入点串数组pl中
             for (let i = 0; i < coors.length; i += 2) {
               pl.push({ latitude: coors[i], longitude: coors[i + 1] })
             }
             // 设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
             _this.polyLine = [
               {
                 points: pl,
                 color: '#FF0000DD',
                 width: 4
               }
             ]
           },
           fail: function (error) {
             console.error(error)
           },
           complete: function (res) {
             console.log(res)
           }
         })
       },
   ```

## 又拍云存储

因为微信小程序只能使用`wx.uploadFile`上传流文件；

所以 rest 方式的又拍云上传案例不太好使，自己写了个微信版本的上传和签名接口；

1. ### 先实现服务端签名接口

   这里使用`upyun`依赖包，这个是官方的 Node 实现，包含了客户端、服务端功所有功能；

   [upyunSDK](https://github.com/upyun/node-sdk)

   ```
   const upyun = require("upyun");

   // 获取又拍云， formdata方式SIGN
   router.get("/upyun/token_formdata", function (req, res, next) {
     // js SDK
     // TODO 1-服务名 2-操作员 3-密钥
     const bucket = new upyun.Bucket(
       "img-blog-vuepress",
       "fred",
       "vxpt3QSwaubKWENqqpbIYjruF..."
     );
     const params = req.query
     // 这里调用formAPI所需的签名方法
     const headSign = upyun.sign.getPolicyAndAuthorization(
       bucket,
       params
     );
     res.send(JSON.stringify(headSign));
   });
   ```

2. 微信小程序端请求方式

   ```
       // 又拍云上传
       uploadForUpyun(file) {
         // 这里URL表示微信图片本地缓存地址
         const {url, id} = file
         const params = {
           bucket: 'img-blog-vuepress',
           'save-key': '/test/{year}/{mon}/{day}_{random32}{.suffix}' // 远端图片保存路径
         }
         wx.request({
           url: 'http://localhost:3000/upyun/token_formdata',
           data: {
             ...params
           },
           success: res => {
             const {data} = res
             const {authorization, policy} = data
             wx.uploadFile({
               url: `https://v0.api.upyun.com/img-blog-vuepress`,
               filePath: url,  // 这里使用本地上传的图片URL
               name: 'file',
               formData: {
                 authorization,
                 policy
               },
               success: res => {
               },
               fail: err => {
               }
             })
           },
           fail: function (err) {
           }
         })
       },
   ```

## 数据库存储

### 图片存储

这里使用 upyun 云存储服务，数据库中保存图片除域名外的 URL 地址；

例如图片 URL 为： `https://img.xx.com/cake/1.png`j

数据库中存储字段为： `cake/1.png`

| 图片 URL                        | 数据库中存储字段 |
| ------------------------------- | ---------------- |
| `https://img.xx.com/cake/1.png` | `cake/1.png`     |
| `https://img.xx.com/2.png`      | `2.png`          |

[图片存储常用的两种方案](https://www.cnblogs.com/wangtao_20/p/3440570.html)

### 图片与数据关联

通过图片 URL 和数据 ID 关联，直接将 url 信息插入到数据表中【例如 order 表】，作为一个字段；

### 冗余图片处理

每次上传图片都保存一个**图片记录表**。初始化记录对应的【订单】id 为 0，文章发布成功后把 id 改成【订单】真实的 id。

|                | 图片 URL（photoUrlList） | 关联 ID(enableId)     | 图片 id | 修改时间   | 生成时间   |
| -------------- | ------------------------ | --------------------- | :------ | ---------- | ---------- |
| 正常使用的图片 | `cake/1.png`             | 192938【订单真实 ID】 | 1       | updateTime | createTime |
| 冗余图片       | `cake/2.png`             | 0                     | 2       |            |            |

定期（例如一个月）处理过期的 id 为 0 的图片，将他们的 URL 搜集出来，使用 upyun 的删除接口处理掉。

实际操作：

1. 在 wx 添加图片时，此时还与订单无关联；

2. 提交订单时，修改图片维护表，修改关联的订单 ID；

   此时此张图片就是正常使用的图片；

3. 删除图片时，修改关联 ID 为 0；

   此时此张图片也就变成了冗余图片；

4. 定期删除冗余图片即可

<hr/>

## 部分服务端接口

### 又拍云签名接口

| URL                                          | TYPE |
| -------------------------------------------- | ---- |
| https://www.joyfred.com/upyun/token_formdata | GET  |
|                                              |      |

### 获取 TOKEN

| URL                                   | TYPE |
| ------------------------------------- | ---- |
| https://www.joyfred.com/auth/getToken | POST |

### 提交

使用修改订单接口

| URL                                           | TYPE |
| --------------------------------------------- | ---- |
| https://www.joyfred.com/api/update_cake_order | POST |

### 获取小程序权限

[获取权限 token](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)

[生成二维码](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html)





## 小程序常见问题

> 参考资料：
>
> - [小程序架构详解](https://juejin.cn/post/7096422167016914957#heading-4)