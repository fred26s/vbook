## LINUX 基础

## 安装软件

centos 下可以使用`yum`指令来安装软件，它类似于 Npm 是一个包管理工具，基于 RPM 包管理，可以将所需要的软件连同所有依赖一同下载到本地；

```
yum i package-name
```

## 安装路径

用 yum 安装，实质上是用 RPM 安装，所以 RPM 查询信息的指令都可用。

所以可以使用

```
rpm -ql package-name
```

来查询软件安装路径；

以及一些常用的查询语句：

```
rpm -qa|grep package-name

rpm -qa
列出所有被安装的rpm package

rpm -q <rpm package name>
查询 rpm package name 的包是否知被安装

| 表示将输出结果（字符道串）转向到后面的命令处理
grep xxx 表示在当前结果中搜索包专含xxx字样的字符串
```

## linux 文件目录

linux 目录实际可以理解为是一个树状结构，

![img](/server/linux1.webp)

|                    | 可分享的(shareable)        | 不可分享的(unshareable) |     |
| ------------------ | -------------------------- | ----------------------- | --- |
| 不变的(static)     | /usr (软件放置处)          | /etc (配置文件)         |     |
|                    | /opt (第三方协力软件)      | /boot (开机与核心档)    |     |
| 可变动的(variable) | /var/mail (使用者邮件信箱) | /var/run (程序相关)     |     |
|                    | /var/spool/news (新闻组)   | /var/lock (程序相关)    |     |

## 路径

#### 相对路径：

参照当前所在目录进行查找 如：cd ../usr/local/src/

#### 绝对路径：

从根目录开始指定，一级一级递归查找，在任何目录下，都能进入指定位置 如：cd /etc/

## Linux 文件扩展名

为了更好的管理和维护文件，Linux 以下扩展名为约定俗成
压缩包：`* .gz`、`* .bz2`、`* .tar.bz2`、`* .tgz`等
二进制软件包： `.rpm`
网页文件： `* .html`、`* .php`
脚本文件： `* .sh`
配置文件： `* .conf`

## 软连接/硬链接

### 建立软链接和硬链接的语法

软链接：ln -s 源文件 目标文件
硬链接：ln 源文件 目标文件
源文件：即你要对谁建立链接

### 什么是软链接和硬链接

1，软链接可以理解成快捷方式。它和 windows 下的快捷方式的作用是一样的。
2，硬链接等于 cp -p 加 同步更新。

## YUM Repository

我们要使用 YUM，必须要先找到适合的 YUM Server，配置 YUM Repositry。CentOS 有很多的[镜像站点](<https://blog.51cto.com/7308310/(https://www.centos.org/download/mirrors/)>)供全世界软件更新之用。CentOS 安装后已配置好这些 Yum Repository，配置文件位于/etc/yum.repos.d 目录下，文件扩展名为 repo
