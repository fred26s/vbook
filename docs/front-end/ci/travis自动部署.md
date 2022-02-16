## 1.主体部署思路

1. 本地修改代码，提交到指定分支

2. Travis监听仓库改变

3. Travis执行**install**和**script**任务（这里可以做一些安装测试构建任务的依赖和测试构建命令）

   - install: # 在安装项目环境阶段需要运行的命令，一条一行，类似的还有 before_install
     
   - 
     script: # 在构建阶段需要运行的命令，一条一行，类似的还有 before_script、after_script


4. 任务执行成功后，在Travis的 **after_success** 钩子里面用 *ssh免密登陆* 服务器

   - 
     after_success: # 在构建成功后要运行的命令，构建失败不会执行，其他同上
     

5. 自动在服务器上执行配置的脚本

6. 完成自动部署



## 2.项目部署

> - Github公开项目(Travis对[开源项目](https://travis-ci.org/)是免费，对[私有项目](https://travis-ci.com/)是收费的)
>
>   所以使用travis需要在github创建公开项目

1. ### 创建Github仓库，初始化工程

2. ### 在travis激活仓库

   用Github账户登陆[Travis-CI](https://travis-ci.org/)。Travis-CI会同步你的Github上面的所有仓库信息。

   登陆之后会列出你的所有仓库:

3. ### 添加Travis配置文件

   在本地项目**根目录**的**master**分支里面添加 ***.travis.yml*** 配置文件

   添加如下配置:

   ```
   # .travis.yml
   language: node_js   #前端工程所以是JavaScript，编译环境是node_js
   node_js:
   - '8'   #指定node版本
   branchs:
     only:
     - master  #指定只有检测到master分支有变动时才执行任务
   复制代码
   ```

   将该配置文件推送到服务器。 返回Travis网站，此时Travis已经检测到该仓库的变动（有可能会有点延迟），所以会根据仓库根目录下的.travis.yml配置文件开始执行任务。

经过这三步，travis已经可以监控项目master分支的推送变动了。

## 3.Travis配置使用SSH免密登陆服务器

> 主要思路为：
>
> 1. 在服务器上面生成公/私密钥对；
> 2. 客户端发起连接请求时，服务器发送一个字符串给客户端，客户端用本地的私钥对字符串进行加密然后发送给服务器，服务器将收到的加密字符串用公钥解密，如果能解密成功就登陆成功。
> 3. 把私钥放在Git代码仓库中，使用Travis提供了对私钥进行加密，把私钥加密之后放在代码仓库，在登陆的时候Travis解密该私钥用于连接。

### 生成公钥/私钥对

#### 在**root**用户下创建新用户travis

```
#新建用户
useradd travis
#修改密码（应该不是必要，但是万一以后需要用密码登陆呢）,按照提示设置密码。
passwd travis
#为用户添加添加权限
vim /etc/sudoers
复制代码
```

找到#Allow root to run any commands anywhere这一段注释，在下面新增一行：

```
travis  ALL=(ALL)   ALL
复制代码
```

#### 生成密钥对

- 一定要切到travis用户
- passphase一定要为空

```
#切换至用户travis，注意后面的操作都在该用户下操作，不然从git上面拉下来的代码或者生成的文件拥有着将不是travis，会造成一些麻烦
[root@VM_156_69_centos ~]# su travis
[travis@VM_156_69_centos root]$ cd ~
# 生成RSA密钥对，后面所有的直接以默认就行，passphase一定要为空
[travis@VM_156_69_centos ~]$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/travis/.ssh/id_rsa): 
Created directory '/home/travis/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/travis/.ssh/id_rsa.
Your public key has been saved in /home/travis/.ssh/id_rsa.pub.
The key fingerprint is:
8b:1f:5b:c5:b8:e2:09:21:0a:f8:6d:ef:5f:25:84:24 travis@VM_156_69_centos
The key's randomart image is:
+--[ RSA 2048]----+
|      E .        |
|       o .       |
|        . .      |
|.        . o     |
|o   . . S o +    |
| o o . o . =     |
|  o o o + +      |
|   . . + B       |
|     .o.*        |
+-----------------+
复制代码
```

可以看到生成密钥对在用户家目录的.ssh文件夹(**/home/travis/.ssh**)下面。 由于Linux权限的控制规则，文件的权限不是越大越好，所有需要设置合适的权限。这里需要把**.ssh目录设置为700权限，给.sshm=目录下面的文件设置为600权限**

```
#设置.ssh目录为700
[travis@VM_156_69_centos ~]$ chmod 700 ~/.ssh/
#设置.ssh目录下的文件为600
[travis@VM_156_69_centos ~]$ chmod 600 ~/.ssh/*
#可以看到下面的所有目录和文件所用者都是travis这个用户
[travis@VM_156_69_centos ~]$ ls -al
total 28
drwx------  3 travis travis 4096 Mar  6 20:12 .
drwxr-xr-x. 5 root   root   4096 Mar  6 20:03 ..
drwx------  2 travis travis 4096 Mar  6 20:12 .ssh
[travis@VM_156_69_centos ~]$ ls ~/.ssh/ -al
total 16
drwx------ 2 travis travis 4096 Mar  6 20:12 .
drwx------ 3 travis travis 4096 Mar  6 20:12 ..
-rw------- 1 travis travis 1675 Mar  6 20:12 id_rsa
-rw------- 1 travis travis  405 Mar  6 20:12 id_rsa.pub
复制代码
```

#### *将生成的公钥添加为受信列表（重点）*

```
[travis@VM_156_69_centos ~]$ cd .ssh/
#将公钥内容输出到authorized_keys中
[travis@VM_156_69_centos .ssh]$ cat id_rsa.pub >> authorized_keys
[travis@VM_156_69_centos .ssh]$ cat authorized_keys 
# authorized_keys文件内容类似这样
ssh-rsa  *************centos
复制代码
```

#### 测试SSH登陆

```
#在.ssh目录下新增配置文件config
[travis@VM_156_69_centos .ssh]$ vim config
#添加下面代码段中的内容并保存
#测试连接
[travis@VM_156_69_centos .ssh]$ ssh test
Bad owner or permissions on /home/travis/.ssh/config
#注意此时的测试是失败的，因为authorized_keys和config是我们后面添加的文件，文件权限并不是600
[travis@VM_156_69_centos .ssh]$ ls -al
total 28
drwx------ 2 travis travis 4096 Mar  6 20:40 .
drwx------ 3 travis travis 4096 Mar  6 20:38 ..
-rw-rw-r-- 1 travis travis  405 Mar  6 20:40 authorized_keys
-rw-rw-r-- 1 travis travis   91 Mar  6 20:38 config
-rw------- 1 travis travis 1675 Mar  6 20:12 id_rsa
-rw------- 1 travis travis  405 Mar  6 20:12 id_rsa.pub
#修改文件权限
[travis@VM_156_69_centos .ssh]$ chmod 600 config 
[travis@VM_156_69_centos .ssh]$ chmod 600 authorized_keys 
#查看修改后的权限
[travis@VM_156_69_centos .ssh]$ ls -al
total 28
drwx------ 2 travis travis 4096 Mar  6 20:40 .
drwx------ 3 travis travis 4096 Mar  6 20:38 ..
-rw------- 1 travis travis  405 Mar  6 20:40 authorized_keys
-rw------- 1 travis travis   91 Mar  6 20:38 config
-rw------- 1 travis travis 1675 Mar  6 20:12 id_rsa
-rw------- 1 travis travis  405 Mar  6 20:12 id_rsa.pub
#重新执行测试
[travis@VM_156_69_centos .ssh]$ ssh test 
The authenticity of host '139.199.90.74 (139.199.90.74)' can't be established.
ECDSA key fingerprint is 41:39:50:e1:e7:c2:f5:19:86:dc:70:e5:91:42:bb:56.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '139.199.90.74' (ECDSA) to the list of known hosts.
Last login: Tue Mar  6 20:43:32 2018 from 139.199.90.74
#测试成功，生成了一个known_hosts文件，以后再登陆时就不需要在输入yes确认了，你可以再做一次测试
[travis@VM_156_69_centos ~]$ ls .ssh/
authorized_keys  config  id_rsa  id_rsa.pub  known_hosts
复制代码
```

config文件内容：

```
Host test
HostName 99.99.99.99(你的服务器ip)
#登陆的用户名
User travis
IdentitiesOnly yes
#登陆使用的密钥
IdentityFile ~/.ssh/id_rsa
```

## 4.安装Travis客户端工具

Travis的客户端工具需要用gem来安装，**gem**是ruby的管理工具，所以首先安装ruby。

这里直接采用ruby版本管理工具**rvm**(类似nvm安装node)。

### 安装rvm

参考[www.rvm.io/](http://www.rvm.io/)

```
[travis@VM_156_69_centos ~]# gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
[travis@VM_156_69_centos ~]# curl -sSL https://get.rvm.io | bash -s stable
#安装完成后测试是否安装成功
[root@VM_156_69_centos ~]# rvm version
rvm 1.29.3 (master) by Michal Papis, Piotr Kuczynski, Wayne E. Seguin [https://rvm.io]
```

### 安装ruby

```
[travis@VM_156_69_centos ~]# rvm list known
// 查看所有ruby版本
[travis@VM_156_69_centos ~]# rvm install 2.7
#测试ruby安装
[travis@VM_156_69_centos root]$ ruby --version
ruby 2.7.0p0 (2019-12-25 revision 647ee6f091) [x86_64-linux]
```

### 修改镜像源

安装完ruby之后就可以使用gem包管理工具了，但是好像官方镜像源被墙了，所以需要更换gem的镜像源。参考[gems.ruby-china.com/](https://gems.ruby-china.com/)

注意这里是`gems.ruby-china.com`，而不是`org`域名。

```
[travis@VM_156_69_centos ~]$ gem sources -l
*** CURRENT SOURCES ***

https://rubygems.org/
[travis@VM_156_69_centos ~]$ gem -v
2.6.14
#更换镜像源
[travis@VM_156_69_centos ~]$ gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
https://gems.ruby-china.com/ added to sources
https://rubygems.org/ removed from sources
[travis@VM_156_69_centos ~]$ gem sources -l
*** CURRENT SOURCES ***

https://gems.ruby-china.org/
```

### 安装travis命令行工具

```
#在travis下面提示没有权限，我切到root用户去安装
[travis@VM_156_69_centos ~]$ gem install travis
Fetching: multipart-post-2.0.0.gem (100%)
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You dont have write permissions for the /usr/local/rvm/gems/ruby-2.4.1 directory.
#安装travis
[root@VM_156_69_centos ~]# gem install travis
Successfully installed travis-1.8.8
Parsing documentation for travis-1.8.8
Done installing documentation for travis after 1 seconds
1 gem installed
#切回travis用户，执行travis命令有以下输出说明安装成功
[travis@VM_156_69_centos root]$ travis
Shell completion not installed. Would you like to install it now? |y| y
Usage: travis COMMAND ...
```

## 5.添加加密的私钥至代码仓库

切换至travis用户，在家目录下拉取代码，进入代码目录。**一定要切换至travis用户，要不然将没有权限操作这些文件，导致代码都不能提交**

执行下面命令生成加密的私钥文件

> 这里`travis login`实测无法登录，目前未知具体原因；但解决方案是使用`travis login --github-token xxxx`登录，token是从github dev token获取；

```
#首先用GitHub账户登陆travis
[travis@VM_156_69_centos blog-front]$ travis login
We need your GitHub login to identify you.
This information will not be sent to Travis CI, only to api.github.com.
The password will not be displayed.

Try running with --github-token or --auto if you dont want to enter your password anyway.

Username: lzq4047
Password for lzq4047: ******
Successfully logged in as lzq4047!
#登陆成功后解密私钥，--add参数会把加密的私钥解密命令插入到.travis.yml，Travis解密时要用到的
[travis@VM_156_69_centos blog-front]$ travis encrypt-file ~/.ssh/id_rsa --add
Detected repository as lzq4047/blog-front, is this correct? |yes| yes
encrypting /home/travis/.ssh/id_rsa for lzq4047/blog-front
storing result as id_rsa.enc
#由于我之前生成过，所有这里提示是否覆盖
DANGER ZONE: Override existing id_rsa.enc? |no| yes
storing secure env variables for decryption

Make sure to add id_rsa.enc to the git repository.
Make sure not to add /home/travis/.ssh/id_rsa to the git repository.
Commit all changes to your .travis.yml.
#可以看到已经生成了加密后的私钥id_rsa.enc
[travis@VM_156_69_centos blog-front]$ ls -al
total 464
drwxrwxr-x 7 travis travis   4096 Mar  6 21:24 .
drwx------ 7 travis travis   4096 Mar  6 21:24 ..
...
-rw-rw-r-- 1 travis travis   1680 Mar  6 21:27 id_rsa.enc 
...
-rw-rw-r-- 1 travis travis   1286 Mar  6 21:27 .travis.yml
#.travis.yml中也自动添加了解密命令
[travis@VM_156_69_centos blog-front]$ cat .travis.yml 
language: node_js
node_js:
- '8'
branchs:
  only:
  - master
before_install:
- openssl aes-256-cbc -K $encrypted_****_key -iv $encrypted_****_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
复制代码
```

解释下解密命令中 *-in* 和 *-out* 参数:

- -in 参数指定待解密的文件，位于仓库的根目录(Travis执行任务时会先把代码拉到Travis自己的服务器上，并进入仓库更目录)
- -out 参数指定解密后的密钥存放在Travis服务器的~/.ssh/id_rsa，如果你的后面需要的话可以取这个路径，我看到网上有的SSH登陆方式用到了这个文件

### 这里有个大坑

生成出来的钩子（下面这段）不能用！ travis自动编译时执行到这里会报错！

```
before_install:
- openssl aes-256-cbc -K $encrypted_****_key -iv $encrypted_****_iv
  -in id_rsa.enc -out ~\/.ssh/id_rsa -d
```

为什么呢？！ 太坑了吧...

经过我半天的查找定位，最终在issues里找到了解决方案！

因为找不到存储在travis服务器的地址。。

所以要修改`-in id_rsa.enc -out ~\/.ssh/id_rsa -d` 

为`-in id_rsa.enc -out ~/.ssh/id_rsa -d`

### 也就是删除`\`这个符号；

[travis issues]: https://github.com/travis-ci/travis.rb/issues/555

```
before_install:
- openssl aes-256-cbc -K $encrypted_****_key -iv $encrypted_****_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d    // 这里删掉 ~\/ 为~/
```

## 6.配置after_success钩子

前面的所有工作实际上都是为这一步做准备，SSH免密登陆服务器执行脚本。

在.travis.yml中添加一些配置，主要是after_success钩子配置。修改之后的配置如下：

```
language: node_js
node_js:
- '8'
branchs:
  only:
  - master
install:
- npm install
script:
- npm run build
env:
  global:
    secure: *********
addons:
  ssh_known_hosts:
  - 99.99.99.99 #受信主机，你的Linux服务器ip
before_install:
- openssl aes-256-cbc -K $encrypted_****_key -iv $encrypted_****_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
after_success:
- chmod 600 ~/.ssh/id_rsa   #还是Linux文件权限问题
- ssh blog@139.199.90.74 -o StrictHostKeyChecking=no 'cd ~/blog-front && git pull && npm install && npm run build'   #使用ssh连接服务器
```

**注意：使用 ssh 命令连接一定要设置StrictHostKeyChecking=no，否则第一次连接时依然会要求你确认。后面引号的内容就是登陆你的Linux服务器之后，在你的服务器执行的命令，你也可以写成一个脚本。只要登陆上服务器之后，就随你操作了。**

after_success是在Travis执行完 **install** 和 **script** 之后执行的钩子,其他的Travis配置可以参考官方文档。我这里构建成功之后就简单的build一下，看能不能build成功，build成功才登陆服务器，在服务器上build（当然也可以直接把Travis的build结果通过scp拷贝到服务器指定目录）...

## 7.遇到的问题

现在其实已经完成了基础的自动化部署了。目前travis可以在我推送自己的blog仓库后，自动连接到我的服务器，并更新blog仓库。

因为我已经用nginx部署了仓库dist文件的位置，所以基本可以完成推送blog代码，我的线上网页实时更新内容。

但现实是，在我配置使用第一次的过程中就发现了几个很蠢很现实的问题：

1. blog用的是vuepress，我需要在本地build出dist文件后，再将整个dist文件一同推上仓库。。

   不符合ci的宗旨，我写完文章后既要执行build，又要推送代码；

2. dist文件实在太大！因为我blog中包含的图片，一并打包在了dist中；

所以。。依次来解决吧

第二个问题，就要处理blog中的图片问题，这个详情见我的另一篇文章；

第一个问题，现在下一节进行介绍。

## 8.优化CI流程

解决第一个问题，不应该在本地build再将dist文件夹传来传去的，而是直接在远端构建。

因为目前我用的是阿里云1G的弱鸡服务器，构建vuepress时会报出内存溢出的问题，所以这里曲线救国:

1. 在travis服务器构建，
2. 再通过scp传输到自己的服务器。

```
// .travis.yml

language: node_js
node_js:
- '8'
branchs:
  only:
  - master
addons:
  ssh_known_hosts:
  - 8.140.151.101
install: # 在安装项目环境阶段需要运行的命令，一条一行，类似的还有 before_install
  - source travis_init.sh # 执行指定的 shell 脚本来做初始化
script: # 在构建阶段需要运行的命令，一条一行，类似的还有 before_script、after_script
  - npm run build # 生成dist
before_install:
- openssl aes-256-cbc -K $encrypted_04674a2fxxx_key -iv $encrypted_04674a2fxxx_iv #解密ssh私钥
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
after_success:
- chmod 600 ~/.ssh/id_rsa
- ssh travis@182.92.131.xxx -o StrictHostKeyChecking=no 'cd ~ && ./hello.sh' #通过ssh连接自己的远端服务器
- scp -o stricthostkeychecking=no -i ~/.ssh/id_rsa -r ./dist travis@182.92.131.xxx:/home/travis/vbook #通过scp将打包后的dist文件传输到自己的服务器上

```

记得！yml中不能添加注释，否则travis会无法识别自动构建！

这里发现。。travis服务器上构建也会报内存溢出，看来……这个问题还是绕不开，不过思路是没问题的，目前暂时还是使用之前本地构建的方法吧

## 9.更换服务器

- ~~删除travis全局变量，测试~~
- ~~更新git ssh公钥，测试~~
- 替换加密文件

> 背景：因合约到期更换了一台服务器，发现之前配置好的blogCI，推送远端后构建失败了；

### 尝试解决：

上述步骤第3步-6步，重新执行了一遍（思路没问题，但还是没有成功）；

travis报错显示了：

```
$ openssl aes-256-cbc -K $encrypted_04674a2f3de9_key -iv $encrypted_04674a2f3de9_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d
bad decrypt

140428259944088:error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt:evp_enc.c:529:

The command "openssl aes-256-cbc -K $encrypted_04674a2f3de9_key -iv $encrypted_04674a2f3de9_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d" failed and exited with 1 during .
```

根据现实是解密travis加密文件时发生了错误；

所以追根溯源，发现了刚才操作的问题：

1. 重新执行了上述配置步骤，生成了新的`id_rsa.enc`加密文件；
2. 但问题是这步操作是在linux服务器执行；所以需要将该加密文件，提交至git仓库，用来给travis服务器使用；（并且很多人反馈若在windows生成的`id_rsa.enc`很可能解析失败，所以还是在linux上生成为好）
3. 所以将服务器上加密文件同步上传git即可；







## 后续问题

1. `fatal: unable to access 'https://xxxxxx@github.com/fred26s/vbook.git/': Empty reply from server`

   考虑是HTTPS的GIT网络连接方式问题（GFW），切换SSH连接。

   测试是否成功🆗

   



