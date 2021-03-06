## HTTPS

## 为什么要升级 HTTPS

因为 HTTP 协议是无状态的，并且在传输过程中是明文传输；这样就造成在传输过程中，在一些路由节点中很容易被别人捕获并实施篡改；

所以升级成 HTTPS 更多的是为安全考虑，毕竟用户的账户密码都有可能在传输中被监听；

## HTTPS 和 HTTP 区别

HTTPS 全称（Hyper Text Transfer Protocol over SecureSocket Layer）也就是**超文本传输安全协议**；

多出来的这个安全协议，本质上就是对原有协议中传输的数据进行了加密，来保证传输数据的安全；

加密主要使用`HTTP + SSL / TLS`进行加密操作，加密过程中用到了：

- 非对称加密
- 对称加密

## HTTPS 做了什么

其实 HTTPS 就是针对 HTTP 协议做出的层层加强：

- ## 初级加密 - 对称加密

  如果 HTTP 协议是明文的，那我们可以提前告诉对方我们约定的秘钥，在传输数据前进行加密；

  对方收到后用约定的秘钥解密，即完成了 HTTP 协议的加密；

  ### 短板

  但这种加密是不安全的，因为虽然数据进行了加密，但双方使用的是**同一个秘钥**，

  这样会造成如果发送秘钥时被截取泄露，那这种加密就等同虚设；

- ## 非对称加密

  如果说对称加密容易被破解，那我们可以使用上面说过的**非对称加密**！

  传输方使用公钥加密，接收方使用私钥解密；

  ### 短板

  这样虽然安全性相对得到了保证，但非对称加密（例如 RSA）**效率较差**，速度比较慢，不适合常规使用；

  如果网站全部使用这种解密，那么速度得不到保证；

- ## 非对称+对称 加密

  为了解决速度和安全并重的问题，有人提出了 建立通讯之前先通过 RSA 加密一个对称秘钥，

  保证了秘钥没有被窃取后，可以让我们相信获取的秘钥的是安全的；

  之后的通讯中就使用秘钥进行效率较高的对称加密通信；

  这，也就是 HTTPS 的大致原型！但还是会有问题...

  ### 短板

  问题的点就出在，我们此时是相信初始化时通过 RSA 获取到的秘钥是安全可相信的，所以开启了后续的通讯；

  但，如何能保证通过 RSA 获取到的秘钥就是你真正想要获取的呢？

  仔细想想，我们进行 RSA 加密前，需要先获取公钥；

  但如果在获取公钥时，我们的数据被截取篡改，我们使用的是其他人的公钥进行了加密，那别人就可以使用自己的私钥进行解密，并伪装是我们想要通讯方，后续的安全就没有了意义；

  这就叫做**中间人攻击**，在中间截取公钥，做一个前后转发，前后真实通讯方并不知情；

如何证明你通讯的人就是想要的通讯方呢？问题又回到了保护数据安全的问题；

## 最终的 HTTPS 形式

所以引出了最终的 HTTPS 形式：

基于上述`非对称加密和对称加密`下的形式，因为担心公钥数据传输安全，现在不直接传输公钥了；

我们找一个官方认证的组织（数字证书认证机构（Certificate Authority，缩写为 CA））；

服务器将产生的公钥交给它，并进行登记相关的个人/公司、域名等信息；

现在的流程就变成了：

1. 初始化建立通讯时，serve 端发送证书给 client 端；

2. client 拿到证书后，会向 CA 验证证书真实性，

3. 如果真实未被篡改，那么就可安全的使用证书中的公钥；

   进行后续的通讯操作（同上一步[非对称+对称]）

   如果证书存在问题，一般浏览器在操作系统中内置的一些顶级 CA 信息来验证，并发出提示。

## HPPTS IN NODEJS

```
let express = require("express");
let http = require("http");
let https = require("https");
let fs = require("fs");
// Configuare https
const httpsOption = {
    key : fs.readFileSync("./https/xxxxxxxxxxxx.key"),
    cert: fs.readFileSync("./https/xxxxxxxxxxxx.pem")
}
// Create service
let app = express();
http.createServer(app).listen(80);
https.createServer(httpsOption, app).listen(443);
```
