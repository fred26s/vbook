## npm

2010 年 1 月，一款名为 npm 的包管理器诞生，npm也可以称为是Node.js能够如此成功的主要原因之一。

npm团队做了很多的工作，以确保npm保持向后兼容，并在不同的环境中保持一致。

### 嵌套地狱

npm 在早期采用的是**嵌套的 node_modules 结构**，直接依赖会平铺在 node_modules 下，子依赖嵌套在直接依赖的 node_modules 中。

在真实场景下，依赖增多，冗余的包也变多，node_modules 最终会堪比黑洞，很快就能把磁盘占满。而且依赖嵌套的深度也会十分可怕，这个就是**依赖地狱**。



但在npm@3+管理复杂依赖的过程中，也有一些常见的**缺点短板：**

- **版本不确定**

  默认安装的依赖包版本会在开头加上`^1.X.0`，这个字符告诉npm，安装主版本等于1的任意一个版本，基本上是1.X最新的版本。这就导致了即使不同的开发人员使用了相同的package.json文件，在他们自己的机器上也可能会安装同一个库的不同种版本；

- **安装速度慢**

  在npm@3以前，是通过整理依赖树来安装依赖，虽然npm@3改为了扁平化安装依赖。

  但npm必须为所有使用到的模块构建一个完整的依赖关系树，这是一个耗时的操作；因为npm必须首先遍历所有的项目依赖关系，然后再决定如何生成扁平的node_modules目录结构；

  虽然npm有用本地缓存的设计助于减少安装时间。

在扁平化依赖后又出现了很多复杂的问题，如：

### 幽灵依赖 Phantom dependencies

幽灵依赖是指在 package.json 中未定义的依赖，但项目中依然可以正确地被引用到。

### 不确定性 Non-Determinism

同样的 package.json 文件，install 依赖后可能不会得到同样的 node_modules 目录结构。

### 依赖分身 Doppelgangers

不同模块引用了相同库的不同版本，那么同时在依赖项中安装了两个不同版本的库，就会出现引用问题



## Yarn

Yarn发布于2016年10月，在Github山的Star迅速超越了npm。

yarn 也采用**扁平化 node_modules 结构**。它的出现是为了解决 npm v3 几个最为迫在眉睫的问题：

- 依赖安装速度慢
- 不确定性

### 优化

- **提升安装速度** （并行、缓存）

  在 npm 中安装依赖时，安装任务是串行的，会按包顺序逐个执行安装，这意味着它会等待一个包完全安装，然后再继续下一个。

  为了加快包安装速度，yarn 采用了并行操作，在性能上有显著的提高。而且在缓存机制上，yarn 会将每个包缓存在磁盘上，在下一次安装这个包时，可以脱离网络实现从磁盘离线安装。

- **lockfile**

  yarn 更大的贡献是发明了 yarn.lock。

  在依赖安装时，会根据 package.josn 生成一份 yarn.lock 文件。

  lockfile 里记录了依赖，以及依赖的子依赖，依赖的版本，获取地址与验证模块完整性的 hash。 

  即使是不同的安装顺序，相同的依赖关系在任何的环境和容器中，都能得到稳定的 node_modules 目录结构，**保证了依赖安装的确定性。**

  > 而 npm 在一年后的 v5 才发布了 package-lock.json

### 缺点

与 npm 一样的弊端，yarn 依然和 npm 一样是扁平化的 node_modules 结构，没有解决**幽灵依赖**和**依赖分身**问题。



## pnpm

pnpm - performant npm，在 2017 年正式发布，定义为**快速的，节省磁盘空间的包管理工具**，开创了一套新的依赖管理机制，成为了包管理的后起之秀。

### 优化：

**内容寻址存储 CAS**

与依赖提升和扁平化的 node_modules 不同，pnpm 引入了另一套依赖管理策略：**内容寻址存储**。

该策略会将包安装在系统的**全局 store** 中，所以依赖的每个版本只会在系统中安装一次。

在引用项目 node_modules 的依赖时，会通过硬链接与符号链接在全局 store 中找到这个文件。为了实现此过程，node_modules 下会多出 `.pnpm` 目录，而且是非扁平化结构。

使用 pnpm 安装依赖后 node_modules 结构如下：

```markdown
node_modules
├── .pnpm
│   ├── A@1.0.0
│   │   └── node_modules
│   │       ├── A => <store>/A@1.0.0
│   │       └── B => ../../B@1.0.0
│   ├── B@1.0.0
│   │   └── node_modules
│   │       └── B => <store>/B@1.0.0
│   ├── B@2.0.0
│   │   └── node_modules
│   │       └── B => <store>/B@2.0.0
│   └── C@1.0.0
│       └── node_modules
│           ├── C => <store>/C@1.0.0
│           └── B => ../../B@2.0.0
│
├── A => .pnpm/A@1.0.0/node_modules/A
└── C => .pnpm/C@1.0.0/node_modules/C
```

![pnpm](http://img.callbackhell.xyz/vuepress/tools/pnpm.png)

这套全新的机制设计地十分巧妙，不仅兼容 node 的依赖解析，同时也解决了：

1. 幽灵依赖问题：只有直接依赖会平铺在 node_modules 下，子依赖不会被提升，不会产生幽灵依赖。
2. 依赖分身问题：相同的依赖只会在全局 store 中安装一次。项目中的都是源文件的副本，几乎不占用任何空间，没有了依赖分身。

同时，由于链接的优势，pnpm 的安装速度在大多数场景都比 npm 和 yarn 快 2 倍，节省的磁盘空间也更多。



### 缺点

1. 由于 pnpm 创建的 node_modules 依赖软链接，因此在不支持软链接的环境中，无法使用 pnpm，比如 Electron 应用。
2. 因为依赖源文件是安装在 store 中，调试依赖或 patch-package 给依赖打补丁也不太方便，可能会影响其他项目。



## yarn2

2020 年 1 月，yarn v2 发布，也叫 yarn berry（v1 叫 yarn classic）。它是对 yarn 的一次重大升级。

无论是 npm 还是 yarn，都具备缓存的功能，大多数情况下安装依赖时，其实是将缓存中的相关包复制到项目目录中 node_modules 里。

而 yarn2则不会进行拷贝这一步，而是在项目里维护一张静态映射表 pnp.cjs。所有依赖都存在全局缓存中，而不是查找 node_modules。

### 缺点：

- 脱离 node 生态

  因为使用 PnP 不会再有 node_modules 了，但是 Webpack，Babel 等各种前端工具都依赖 node_modules。虽然很多工具比如 pnp-webpack-plugin 已经在解决了，但难免会有兼容性风险。



## npx

npx是一个工具，它是npm v5.2.0引入的一条命令（npx），是npm的一个包执行器。

例子：

- 用创建一个react项目的对比 npm创建

  npm创建

  ```lua
     npm install -g create-react-app
     create-react-app test-app
  ```

  npx创建

  ```lua
     npx create-react-app test-app
  ```

区别在于：

- npm他会在本地全局性的安装create-react-app，这个包会存储在node目录下面去。以后创建react项目直接执行create-react-app命令就可以了。
- npx命令他会把create-react-app安装包临时安装上，**等项目初始化完成以后，就自动删除掉**。

**主要特点**： 

1. 临时安装可执行依赖包，不用全局安装，不用担心长期的污染。 
2. 可以执行依赖包中的命令，安装完成自动运行。 
3. 自动加载node_modules中依赖包，不用指定$PATH。 
4. 可以指定node版本、命令的版本，解决了不同项目使用不同版本的命令的问题。









## Corepack

Corepack可以称为「管理包管理器的管理器」，Corepack是一个实验性工具，在 Node.js v16.13 版本中引入，它可以指定项目使用的包管理器以及版本。

简单来说，Corepack 会成为 Node.js 官方的内置 CLI，用来管理『包管理工具（npm、yarn、pnpm、cnpm）』，用户无需手动安装，即『包管理器的管理器』。

**主要作用**：

- 不再需要专门全局安装 yarn pnpm 等工具。
- 可以强制团队项目中使用他特定的包管理器版本，而无需他们在每次需要进行更新时手动同步它，如果不符合配置将在控制台进行错误提示。

### 优化：

虽然npm 是现在node的默认包管理器，但是由于它多年来的不思进取，及种种缺陷，corepack 的出现可以说是大快人心。

其最大的意义是**让 npm 不再成为唯一的官方指定工具**，这将使各种包管理器在一个更公平的地位上进行竞争，相信对开发者来说也是一件很好的事情。

### 缺点：

- 目前仅支持 pnpm 和 yarn，cnpm 也是不支持的
- 兼容性还有些问题，npm 还无法拦截也就是说 即便配置了 packageManager 使用 yarn，但是依然可以调用全局 npm 安装
- 目前还在非常早期阶段，Bug 不少，名字也还不统一，有叫 pmm 也叫 corepack

> [corepack体验](https://zhuanlan.zhihu.com/p/408122100)





## npm总结

目前还没有完美的依赖管理方案，可以看到在依赖管理的发展过程中，出现了：

- 不同的 node_modules 结构，有嵌套，扁平，甚至没有 node_modules（yarn2），不同的结构也伴随着兼容与安全问题。
- 不同的依赖存储方式来节约磁盘空间，提升安装速度。
- 每种管理器都伴随新的工具和命令，不同程度的可配置性和扩展性，影响开发者体验。

库与开发者能够在这样优化与创新的发展过程中互相学习，站在巨人的肩膀上继续前进，不断推动前端工程领域的发展。







## npm常用命令

## npm link

npm link是一种把包链接到包文件夹的方式，即：可以在不发布npm模块的情况下，调试该模块，并且修改模块后会实时生效，不需要通过npm install进行安装

```shell
npm clone 模块到本地

模块和项目在同一目录下
$ npm link ../module
模块和项目不在同一目录下
$ # 先去到模块目录，把它 link 到全局
$ cd ../npm-link-test
$ npm link
$
$ # 再去项目目录通过包名来 link
$ cd ../my-project-link
$ npm link test-npm-link(模块包名，即：package.json中name)
$
$ # 解除link
$ 解除项目与模块的link，在项目目录下，npm unlink 模块名
$ 解除模块全局的link，在模块目录下，npm unlink 模块名
```

npm link 命令可以将一个任意位置的npm包链接到全局执行环境，从而在任意位置使用命令行都可以直接运行该npm包。

这个命令主要做了两件事：

- 为npm包目录创建软链接，将其链到 {prefix}/lib/node_modules/<package>，是一个快捷方式
- 为可执行文件(bin)创建软链接，将其链到 {prefix}/bin/{name}