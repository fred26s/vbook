## Mac前端开发环境

## XCode

Xcode 是**在命令行上运行**的软件开发人员的工具，即在终端应用程序（也称为控制台）中运行。完整的 Xcode 包很大，需要超过 40 GB 的磁盘空间，并且支持所有 Apple 操作系统的开发。

我们前端开发，只是需要命令行工具，并不需要IOS开发相关的环境。所以我们只需要安装`xcode command line tools`即可。

### xcode command line tools

xcode command line tools 是 Apple 针对上述问题提供了一个单独的、更小的下载。它安装了软件开发最需要的实用程序，我们可以从终端应用程序安装这个较小的包。

```shell
xcode-select --install
```

然后就是一些弹框，按提示执行即可。

### 原理

安装 Xcode 只是为了让其给我们提供许多常用的工具、实用程序和编译器这些。包括：`svn，git，make，GCC，clang，perl，size，strip，strings，libtool，cpp，what`以及其他很多能够在Linux默认安装中找到的有用的命令。

### xcode-select --install安装包工具列表

安装包有多达六十一个命令，下面是命令列表

```mipsasm
ar
as
asa
bison
BuildStrings
c++
c89
c99
cc
clang
clang++
cmpdylib
codesign_allocate
CpMac
cpp
ctags
ctf_insert
DeRez
dsymutil
dwarfdump
dyldinfo
flex
flex++
g++
gatherheaderdoc
gcc
gcov
GetFileInfo
git
git-cvsserver
git-receive-pack
git-shell
git-upload-archive
git-upload-pack
gm4
gnumake
gperf
hdxml2manxml
headerdoc2html
indent
install_name_tool
ld
lex
libtool
lipo
lldb
lorder
m4
make
MergePef
mig
mkdep
MvMac
nasm
ndisasm
nm
nmedit
otool
pagestuff
projectInfo
ranlib
rebase
redo_prebinding
ResMerger
resolveLinks
Rez
RezDet
RezWack
rpcgen
segedit
SetFile
size
SplitForks
strings
strip
svn
svnadmin
svndumpfilter
svnlook
svnrdump
svnserve
svnsync
svnversion
unifdef
unifdefall
UnRezWack
unwinddump
what
xml2man
yacc
```





## Brew

brew 是 Mac 下的一个包管理工具，作用类似于 ：

- centos 下的 yum；
- node 下的npm；

### 安装

```shell
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

后续根据流程提示执行即可；

安装成功后，需要按照脚本提示运行一下 如下设置：

```shell
git config --global --add safe.directory /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core

git config --global --add safe.directory /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask
```

最终执行`brew -v`显示版本号，以及显示core/cask的git version和commit日期即可。





## Nvm

使用brew安装；

```shell
brew install nvm
```

跟着安装提示即可完成；

然后需要进行全局变量配置，否则会出现再次启动终端无法识别全局变量问题；

1. 编辑.base_profile文件

   启动终端 Terminal，进入当前用户的 home 目录

   ```
   cd ~
   ```

   创建 .bash_profile 文件

   ```
   touch ～/.bash_profile
   ```

   编辑 .bash_profile 文件

   ```
   open -e .bash_profile
   ```

   在 ~/.bash_profile 添加两行 :

   ```
   export NVM_DIR=~/.nvm
   source $(brew --prefix nvm)/nvm.sh 
   ```

2. 编辑.zshrc文件

   新建.zshrc文件

   ```
   open ~/.zshrc
   ```

   在.zshrc文件中添加如下内容

   ```
    export NVM_DIR="$HOME/.nvm"
     [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
     [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
   ```

3. 重新打开终端，`node -v`使用即可；





```shell
 export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

