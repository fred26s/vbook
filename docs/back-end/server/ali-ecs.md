## 搭建一个阿里云ECS实例服务器

## 购买ECS服务器

不赘述了，支付宝一条龙

## 配置

购买服务器后，就创建了一个ECS实例；

## 添加安全组规则：

这里实际上就是配置服务器实例可供访问的端口和IP，可以指定访问IP白名单和黑名单；

初始化我们需要配置增加80端口，否则默认是不开放的；

## 连接LINUX服务器

这里使用PUTTY连接LINUX，通过SSH来实现远程连接；

> ## 在Windows环境中使用密钥对
>
> 下面以PuTTYgen为例介绍如何将私钥文件格式从.pem转换为.ppk，并以PuTTY为例介绍如何使用密钥对连接Linux实例。
>
> 1. 下载并安装PuTTYgen和PuTTY。
>
>    下载链接如下：
>
>    - [PuTTYgen ](https://the.earth.li/~sgtatham/putty/latest/w64/puttygen.exe)
>    - [PuTTY ](https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe?spm=5176.2020520101.0.0.42554df5Q7Lhji&file=putty.exe)
>
> 2. 将.pem私钥文件转换为.ppk私钥文件。
>
>    1. 启动PuTTYgen。
>
>       本示例中的PuTTYgen版本为0.71。
>
>    2. 选择**Type of key to generate**为**RSA**，然后单击**Load**。
>
>       ![windows_puttygen_1](https://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/zh-CN/8965033851/p51179.png)
>
>    3. 选择**All Files**。
>
>       ![windows_puttygen_2](https://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/zh-CN/8965033851/p5188.png)
>
>    4. 选择待转换的.pem私钥文件。
>
>    5. 在弹出的对话框中，单击**确定**。
>
>    6. 单击**Save private key**。
>
>    7. 在弹出的对话框中，单击**是**。
>
>    8. 指定.ppk私钥文件的名称，然后单击**保存**。
>
> 3. 启动PuTTY。
>
> 4. 配置用于身份验证的私钥文件。
>
>    1. 选择**Connection > SSH > Auth**。
>    2. 单击**Browse…**。
>    3. 选择转换好的.ppk私钥文件。
>
>    ![windows_putty_3](https://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/zh-CN/9965033851/p5191.png)
>
> 5. 配置连接Linux实例所需的信息。
>
>    1. 单击**Session**。
>
>    2. 在**Host Name (or IP address)**中输入登录账号和实例公网IP地址。
>
>       格式为**root@IP 地址**，例如root@10.10.xx.xxx。
>
>    3. 在**Port**中输入端口号**22**。
>
>    4. 选择**Connection type**为**SSH**。
>
>    ![windows_putty_4](https://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/zh-CN/9965033851/p5192.png)
>
> 6. 单击**Open**。
>
>    当出现以下提示时，说明您已经成功地使用SSH密钥对登录了实例。![windows_putty_5](https://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/zh-CN/9965033851/p51203.png)

## 通过VNC连接LINUX

如果SSH有问题，可以直接通过网页VNC连接服务器；

需要输入**远程连接密码**，这个密码是第一次连接时会给你；

连接linux后，输入账户`root`，密码是**实例密码**，

实例密码账户第一次登陆是没有的，需要重置实例密码，重置后重启实例即可生效；



## 连接成功

提示如下文字证明连接服务器成功；

```
Welcome to Alibaba Cloud Elastic Compute Service !
```



## putty工具反空闲

服务器为了安全会在一段时间内没有数据操作时，断开连接；

所以我们使用PUTTY连接服务器时，为了防止自动断开，可以设置反空闲操作每隔N秒向服务器自动发送一条消息；

```
putty的设置方法：
putty -> Connection -> Seconds between keepalives ( 0 to turn off ), 默认为0, 改为300
```





## 启动Apache服务

套用官网DOC一条龙，顺利启动起服务；

1. 安装Apache服务。

   ```
   yum install -y httpd
   ```

2. 启动Apache服务。

   ```
   systemctl start httpd
   ```

3. 设置Apache服务开机自启动。

   ```
   systemctl enable httpd
   ```

4. 查询Apache服务是否处于运行中状态。

   ```
   systemctl status httpd
   ```

那怎么关闭Apache服务呢，这里再说几个常用的命令；

```
service httpd start // 启动
service httpd restart // 重新启动
service httpd stop // 停止服务
rpm -e httpd  // Apache卸载
```

## 启动Nginx

安装nginx前，需要先添加yum源，因为默认情况Centos中并无Nginx的源；

1. 先安装yum-utils

   这是一个管理repository及扩展包的工具；

2. 添加源

   `cd /etc/yum.repos.d/ `目录下；

   新建 `vim nginx.repo `文件，就增加了一个源文件信息;

   然后输入以下内容：

   ```
   [nginx-stable]
   name=nginx stable repo
   baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
   gpgcheck=1
   enabled=1
   gpgkey=https://nginx.org/keys/nginx_signing.key
   
   [nginx-mainline]
   name=nginx mainline repo
   baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
   gpgcheck=1
   enabled=0
   gpgkey=https://nginx.org/keys/nginx_signing.key
   ```

   3. 安装Nginx

      先查看是否加源成功；

      ```
      yum search nginx
      ```

      如果成功，就开始通过yum安装；

      ```
      yum install nginx
      ```

      安装完毕后查看是否安装成功；

      ```
      rpm -qa | grep nginx
      ```

      这里说一下这个命令：

      ```
      rpm -qa|grep package-name 
      
      rpm -qa
      列出所有被安装的rpm package
      
      rpm -q <rpm package name>
      查询 rpm package name 的包是否知被安装
      
      | 表示将输出结果（字符道串）转向到后面的命令处理
      grep xxx 表示在当前结果中搜索包专含xxx字样的字符串
      ```

      也就是查询是否有被安装的nginx包；

   4. 启动nginx

      ```
      systemctl start nginx
      ```

   5. 开机启动

      ```
      systemctl enable nginx
      ```

   6. 查看状态

      ```
      systemctl status nginx
      ```

      



## 安装node环境

> <https://github.com/nodesource/distributions>
>
> 这里介绍了linux安装地址；

文件传输：（这里是下载10.X版本node）

```
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
```

yum安装：

```
yum install -y nodejs
```

查看是否安装成功：

```
node -v
```

## 安装mysql

> <https://segmentfault.com/a/1190000019507071>
>
> 这篇文章详细讲解了如何在linux下，安装mysql；
>
> 照步骤来即可；
>
> 1. 添加yum源
> 2. `yum i mysql-community-server`安装
> 3. 启动MySQL
> 4. 修改密码
> 5. 设置允许root远程访问
> 6. 设置编码格式为UTF8
> 7. 设置开机启动

### 常用命令

启动

```
systemctl start mysqld.service
```

查看状态

```
systemctl status mysqld.service
```

停止

```
systemctl stop mysqld.service
```

重启

```
systemctl restart mysqld.service
```

### 授权问题

1.mysql从8.0开始改变了授权语句，

之前版本使用的这个语句，现在会报错；

```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
```

应该使用以下语句进行授权

```
grant all privileges on *.* to ‘root'@'%' ;
```

但初始化设置时，可能会报错没有此用户授权权限，我们需要先创建root用户；

```
CREATE USER 'root'@'%' IDENTIFIED BY 'password';
```

2.navcat远程连接

> 会因为  Mysql远程连接报错：authentication plugin caching_sha2
>
> mysql 8.0 默认使用 caching_sha2_password 身份验证机制 —— 从原来的 mysql_native_password 更改为 caching_sha2_password。  

这里修改身份验证方式的解决方案：

1. 查看mysql版本

   ```
   > select version();
   ```

2. 查看当前默认的密码认证插件：

   ```
   show variables like 'default_authentication_plugin';
   ```

3. 查看当前所有用户绑定的认证插件：

   ```
   select host,user,plugin from mysql.user;
   ```

4. 假如想更改 root 用户的认证方式

   ```
    ALTER USER 'root'@'%' IDENTIFIED BY 'root' PASSWORD EXPIRE NEVER;
   # 更新用户密码
   > ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
   # 赋予 root 用户最高权限
   > grant all privileges on *.* to root@'%' with grant option;
   # 刷新权限
   > flush privileges;
   ```

### 启动node项目

安装pm2，可以直接启动dist目录下的server.js；



## mysql down掉

现在发现mysql数据库，会在服务器间歇性停止、并重启；

这样造成了`serve`端，请求数据库时，报错`Error: Cannot enqueue Query after fatal error.`，提示致命错误；

初步debug，发现问题是，`serve`端代码只在初始化时连接了`mysql`数据库，并且没有执行关闭操作；

`serve`服务持续开启，但当`mysql`数据库重启后，`serve`连接的`mysql`实例并没有被释放，仍旧使用重启前的连接实例，进行请求，造成请求失败；

### 目前解决方法：

可以重启`serve`端服务，即可解决此问题；

后期考虑修改`serve`代码，以事务为原子模块，进行实时开关数据库的操作；

保证每次请求，都是重新连接当前的`mysql`服务。





## 服务器迁移

1. 买新服务器
2. 买域名
3. 在旧服务器创建服务器共享镜像
4. 使用新服务器创建共享实例

> [ECS实例间迁移](https://www.alibabacloud.com/help/zh/doc-detail/171197.htm)
>
> [复制镜像创建实例](https://www.alibabacloud.com/help/zh/doc-detail/25462.htm?spm=a2c63.p38356.879954.3.4d8f38bbw09Nrm#concept-a3m-5dm-xdb)







## HTTPS证书SSL部署

[官方文档 SSL证书部署](https://help.aliyun.com/document_detail/98728.htm?spm=a2c4g.11186623.0.0.7aad31034XV0t1#concept-n45-21x-yfb)