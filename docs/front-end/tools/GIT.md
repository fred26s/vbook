## git 配置公钥 SSH

### SSH 介绍

先大概说一下 SSH 是个什么东西；

SSH 为 Secure Shell 的缩写，由 IETF 的网络小组（Network Working Group）所制定；SSH 为建立在应用层基础上的安全协议。SSH 是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用 SSH 协议可以有效防止远程管理过程中的信息泄露问题。SSH 最初是 UNIX 系统上的一个程序，后来又迅速扩展到其他操作平台。SSH 在正确使用时可弥补网络中的漏洞。SSH 客户端适用于多种平台。几乎所有 UNIX 平台—包括 HP-UX、Linux、AIX、Solaris、Digital UNIX、Irix，以及其他平台，都可运行 SSH。
一般我们都会使用到两种方式去登陆 SSH，密码登陆和证书登陆。如果使用密码登陆，很有可能会遭受恶意攻击，所以在实际的工作中和大多数的互联网公司，都是会使用证书去登陆的。

### SSH 证书使用

### 如何生成公钥私钥

客户端生成证书:私钥和公钥，然后私钥放在客户端，妥当保存，一般为了安全，客户端在生成私钥时，会设置一个密 码，以后每次登录 ssh 服务器时，客户端都要输入密码解开私钥；

1）在本地创建 ssh key

打开终端，输入以下命令行

```
$ ssh-keygen -t rsa -C "your_email@youremail.com"
```

直接点回车，说明会在默认文件 id_rsa 上生成 ssh key。

然后系统要求输入密码，我们在这里直接按回车表示不设密码；

重复密码时也是直接回车，之后提示你 shh key 已经生成成功。

也就是连续按三次回车；

到此，已生成 ssh key(在`C:\Users\Administrator\.ssh`中的 id_rsa.pub 文件内)；

这里`~/.SSH`文件夹下就生成了两个文件，一个公钥(pub 后缀)，一个私钥。

2）获取本地生成的 ssh key

然后在终端输入：`vim ~/.ssh/id_ras.pub` 回车即可打开对应生成的文件，

里面的 key 是一对看不懂的字符数字组合，不用管它，直接复制。

另一个`id_rsa`文件，为你的客户端私钥；

### 服务器添加公钥

服务器添加信用公钥：把客户端生成的公钥，上传到 ssh 服务器，添加到指定的文件中，这样，就完成 ssh 证书登录的配置了。

1）假设客户端想通过私钥要登录其他 ssh 服务器，同理，就可以把公钥上传到其他 ssh 服务器。

```
比如以码云`gitee.com`来举例；

打开个人中心 => 左侧安全设置 => SSH公钥 => 把本地`id_rsa_pub`中的公钥粘贴到这里 => 新增服务器上的公钥验证；
```

2）验证是否配置成功

在 git bash 下输入

```
$ ssh -T git@gitee.com
```

回车就会看到：`You’ve successfully authenticated, but gitee does not provide shell access 。`

这就表示已成功连上 gitee，相当于服务端就认可你这个配置公钥的客户端是可以安全连接的。

**这里就完成了服务器添加公钥， 就可以正常使用 SSH 进行仓库的 pull & push 操作啦**

## TortoiseGit 配置问题

有时我们只通过`git bash`配置`SSH`后，会出现与`TortoiseGit`冲突问题，导致小乌龟无法正常拉取代码。

报错：`disconnected: No supported authentication methods available`

处理方法:

 修改小乌龟的`SSH cilent`地址；

1. 打开设置`Setting --- Network ---SSH`;

2. 修改默认地址`XX/TortoiseGit/bin/TortoiseGitPlink.exe`为

   `Git`安装地址中的`SSH.exe`;

3. 一般地址为`X:XX/Git/usr/bin/SSH.exe`;





## github已不支持密码push

[自2021年8月13日起，github不再支持使用密码push的方式](https://www.cnblogs.com/sober-orange/p/git-token-push.html)

解决方案

- 使用SSH

- 使用Personal access token

  可以 把token直接添加远程仓库链接中，这样就可以避免同一个仓库每次提交代码都要输入token了：

  `git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git`

  > <your_token>：换成你自己得到的token
  > <USERNAME>：是你自己github的用户名
  > <REPO>：是你的仓库名称
  >

