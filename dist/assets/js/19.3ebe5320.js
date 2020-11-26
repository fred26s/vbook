(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{373:function(t,s,a){"use strict";a.r(s);var e=a(42),v=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"https"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#https"}},[t._v("#")]),t._v(" HTTPS")]),t._v(" "),a("h2",{attrs:{id:"为什么要升级-https"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#为什么要升级-https"}},[t._v("#")]),t._v(" 为什么要升级 HTTPS")]),t._v(" "),a("p",[t._v("因为 HTTP 协议是无状态的，并且在传输过程中是明文传输；这样就造成在传输过程中，在一些路由节点中很容易被别人捕获并实施篡改；")]),t._v(" "),a("p",[t._v("所以升级成 HTTPS 更多的是为安全考虑，毕竟用户的账户密码都有可能在传输中被监听；")]),t._v(" "),a("h2",{attrs:{id:"https-和-http-区别"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#https-和-http-区别"}},[t._v("#")]),t._v(" HTTPS 和 HTTP 区别")]),t._v(" "),a("p",[t._v("HTTPS 全称（Hyper Text Transfer Protocol over SecureSocket Layer）也就是"),a("strong",[t._v("超文本传输安全协议")]),t._v("；")]),t._v(" "),a("p",[t._v("多出来的这个安全协议，本质上就是对原有协议中传输的数据进行了加密，来保证传输数据的安全；")]),t._v(" "),a("p",[t._v("加密主要使用"),a("code",[t._v("HTTP + SSL / TLS")]),t._v("进行加密操作，加密过程中用到了：")]),t._v(" "),a("ul",[a("li",[t._v("非对称加密")]),t._v(" "),a("li",[t._v("对称加密")])]),t._v(" "),a("h2",{attrs:{id:"https-做了什么"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#https-做了什么"}},[t._v("#")]),t._v(" HTTPS 做了什么")]),t._v(" "),a("p",[t._v("其实 HTTPS 就是针对 HTTP 协议做出的层层加强：")]),t._v(" "),a("ul",[a("li",[a("h2",{attrs:{id:"初级加密-对称加密"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#初级加密-对称加密"}},[t._v("#")]),t._v(" 初级加密 - 对称加密")]),t._v(" "),a("p",[t._v("如果 HTTP 协议是明文的，那我们可以提前告诉对方我们约定的秘钥，在传输数据前进行加密；")]),t._v(" "),a("p",[t._v("对方收到后用约定的秘钥解密，即完成了 HTTP 协议的加密；")]),t._v(" "),a("h3",{attrs:{id:"短板"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#短板"}},[t._v("#")]),t._v(" 短板")]),t._v(" "),a("p",[t._v("但这种加密是不安全的，因为虽然数据进行了加密，但双方使用的是"),a("strong",[t._v("同一个秘钥")]),t._v("，")]),t._v(" "),a("p",[t._v("这样会造成如果发送秘钥时被截取泄露，那这种加密就等同虚设；")])]),t._v(" "),a("li",[a("h2",{attrs:{id:"非对称加密"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#非对称加密"}},[t._v("#")]),t._v(" 非对称加密")]),t._v(" "),a("p",[t._v("如果说对称加密容易被破解，那我们可以使用上面说过的"),a("strong",[t._v("非对称加密")]),t._v("！")]),t._v(" "),a("p",[t._v("传输方使用公钥加密，接收方使用私钥解密；")]),t._v(" "),a("h3",{attrs:{id:"短板-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#短板-2"}},[t._v("#")]),t._v(" 短板")]),t._v(" "),a("p",[t._v("这样虽然安全性相对得到了保证，但非对称加密（例如 RSA）"),a("strong",[t._v("效率较差")]),t._v("，速度比较慢，不适合常规使用；")]),t._v(" "),a("p",[t._v("如果网站全部使用这种解密，那么速度得不到保证；")])]),t._v(" "),a("li",[a("h2",{attrs:{id:"非对称-对称-加密"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#非对称-对称-加密"}},[t._v("#")]),t._v(" 非对称+对称 加密")]),t._v(" "),a("p",[t._v("为了解决速度和安全并重的问题，有人提出了 建立通讯之前先通过 RSA 加密一个对称秘钥，")]),t._v(" "),a("p",[t._v("保证了秘钥没有被窃取后，可以让我们相信获取的秘钥的是安全的；")]),t._v(" "),a("p",[t._v("之后的通讯中就使用秘钥进行效率较高的对称加密通信；")]),t._v(" "),a("p",[t._v("这，也就是 HTTPS 的大致原型！但还是会有问题...")]),t._v(" "),a("h3",{attrs:{id:"短板-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#短板-3"}},[t._v("#")]),t._v(" 短板")]),t._v(" "),a("p",[t._v("问题的点就出在，我们此时是相信初始化时通过 RSA 获取到的秘钥是安全可相信的，所以开启了后续的通讯；")]),t._v(" "),a("p",[t._v("但，如何能保证通过 RSA 获取到的秘钥就是你真正想要获取的呢？")]),t._v(" "),a("p",[t._v("仔细想想，我们进行 RSA 加密前，需要先获取公钥；")]),t._v(" "),a("p",[t._v("但如果在获取公钥时，我们的数据被截取篡改，我们使用的是其他人的公钥进行了加密，那别人就可以使用自己的私钥进行解密，并伪装是我们想要通讯方，后续的安全就没有了意义；")]),t._v(" "),a("p",[t._v("这就叫做"),a("strong",[t._v("中间人攻击")]),t._v("，在中间截取公钥，做一个前后转发，前后真实通讯方并不知情；")])])]),t._v(" "),a("p",[t._v("如何证明你通讯的人就是想要的通讯方呢？问题又回到了保护数据安全的问题；")]),t._v(" "),a("h2",{attrs:{id:"最终的-https-形式"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#最终的-https-形式"}},[t._v("#")]),t._v(" 最终的 HTTPS 形式")]),t._v(" "),a("p",[t._v("所以引出了最终的 HTTPS 形式：")]),t._v(" "),a("p",[t._v("基于上述"),a("code",[t._v("非对称加密和对称加密")]),t._v("下的形式，因为担心公钥数据传输安全，现在不直接传输公钥了；")]),t._v(" "),a("p",[t._v("我们找一个官方认证的组织（数字证书认证机构（Certificate Authority，缩写为 CA））；")]),t._v(" "),a("p",[t._v("服务器将产生的公钥交给它，并进行登记相关的个人/公司、域名等信息；")]),t._v(" "),a("p",[t._v("现在的流程就变成了：")]),t._v(" "),a("ol",[a("li",[a("p",[t._v("初始化建立通讯时，serve 端发送证书给 client 端；")])]),t._v(" "),a("li",[a("p",[t._v("client 拿到证书后，会向 CA 验证证书真实性，")])]),t._v(" "),a("li",[a("p",[t._v("如果真实未被篡改，那么就可安全的使用证书中的公钥；")]),t._v(" "),a("p",[t._v("进行后续的通讯操作（同上一步[非对称+对称]）")]),t._v(" "),a("p",[t._v("如果证书存在问题，一般浏览器在操作系统中内置的一些顶级 CA 信息来验证，并发出提示。")])])]),t._v(" "),a("h2",{attrs:{id:"hppts-in-nodejs"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#hppts-in-nodejs"}},[t._v("#")]),t._v(" HPPTS IN NODEJS")]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v('let express = require("express");\nlet http = require("http");\nlet https = require("https");\nlet fs = require("fs");\n// Configuare https\nconst httpsOption = {\n    key : fs.readFileSync("./https/xxxxxxxxxxxx.key"),\n    cert: fs.readFileSync("./https/xxxxxxxxxxxx.pem")\n}\n// Create service\nlet app = express();\nhttp.createServer(app).listen(80);\nhttps.createServer(httpsOption, app).listen(443);\n')])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br")])])])}),[],!1,null,null,null);s.default=v.exports}}]);