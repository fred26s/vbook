## hexo next 主题配置

## 创建“分类”选项

打开命令行，进入博客所在文件夹。执行命令

```cpp
$ hexo new page categories
```

成功后会提示：

```bash
INFO  Created: ~/Documents/blog/source/categories/index.md
```

根据上面的路径，找到`index.md`这个文件，打开后默认内容是这样的：

```css
---
title: 文章分类
date: 2020-01-01 12:12:57
---

```

添加`type: "categories"`到内容中，添加后是这样的：

```bash
---
title: 文章分类
date: 2020-01-01 12:12:57
type: "categories"
---
```

保存并关闭文件；这样就成功给主页添加了“文章分类”这个菜单。

### 给文章添加“categories”属性

刚才我们创建了首页的分类菜单，那么我们新写的文章怎么加入到分类菜单中呢？

打开需要添加分类的文章，为其添加 categories 属性。下方的`categories: web前端`表示添加这篇文章到“web 前端”这个分类。注意：hexo 一篇文章只能属于一个分类，也就是说如果在“- web 前端”下方添加“-xxx”，hexo 不会产生两个分类，而是把分类嵌套（即该文章属于 “- web 前端”下的 “-xxx ”分类）。

```css
---
title: vue源码解读
date: 2020-01-01 12:12:57
categories:
  - web前端
---

```

这样，就成功给文章添加分类，点击首页的“分类”可以看到该分类下的所有文章。当然，只有添加了`categories: xxx`的文章才会被收录到首页的“分类”中。

## 创建“标签”选项

### 生成“标签”页并添加 tpye 属性

打开命令行，进入博客所在文件夹。执行命令

```cpp
$ hexo new page tags
```

成功后会提示：

```bash
INFO  Created: ~/Documents/blog/source/tags/index.md
```

根据上面的路径，找到`index.md`这个文件，打开后默认内容是这样的：

```css
---
title: 标签
date: 2020-01-01 12:12:57
---

```

添加`type: "tags"`到内容中，添加后是这样的：

```bash
---
title: "tags"
date: 2020-01-01 12:12:57
type: "tags"
---
```

这样，就成功给文章添加标签，操作和分类几乎一模一样；

### 给文章添加“tags”属性

新增的文章如果要加入标签，那么就在头部添加如下内容；

```
---
title: vue源码解读
date: 2020-01-01 12:12:57
categories:
- web前端
tags:
- vue
- 表格
- 表单验证
---
```

tags 中的内容，就是当前这个文章所属的标签，可以理解为与分类的区别是：

一个文章可以有多个标签属性，但一个文章只能属于一个分类。 可以仔细理解一下，是符合逻辑的。

## 新建文章

### Step 1: 新建文章

在 hexo 所在目录下，打开 terminal，在命令行输入：

```
hexo new a
```

a 是文章标题，也可以加上双引号,如“a”。

正确的结果：我们会在\_posts 里看见多了一个 a.md 文件。

而这个\_posts 文件夹，算是一个比较特殊的文件夹，因为它装着所有你发布出去的文章。

### Step 2: 草稿箱

上一步我们新建出来的，叫做 post page。除了 post page，我们还可以新建 draft page，也就是草稿。很多时候我们需要先写成草稿，而暂时不发布出去。draft page 就可以满足我们的要求，我们的网站上是看不到草稿文件的。

在 terminal 输入

```
hexo new draft b
```

我们会在 source 下看见一个新的文件夹，\_drafts，这个里面会装我们所有的草稿文件。

那写好了的草稿，如何可以在不发布的情况下，预览一下文章在网站上的样子呢？

```
hexo server --draft
```

### Step 3: 发布草稿

当你准备好了要发布草稿时:

```
hexo publish b
```

你会发现\_drafts 里的 b.md 不见了，跑到了\_posts 里面,也就说明你的草稿发布成功了。

### Step 4: normal page

我目前还不知道该如何用中文称呼这类页面。我们可以把 post 和 draft 统称为 blog pages，在这之外的一种就是 normal pages， 类似一个网站上的“关于”，“了解我们”之类的页面。

这类 page 要如何新建呢？

```
hexo new page c
```

和前两种不同，这个命令会在 source 文件夹内创建出 c 文件夹，与\_posts，\_drafts 并列。文件夹里面有一个 index.md 文件。

刷新页面，你会发现 c 并没有出现在页面内，那它在哪儿呢？

在网址后面加上 c/， 即[http://localhost:4000/c/](https://link.jianshu.com?t=http://localhost:4000/c/)，就可以看到了。

正因为 c 不是一个 blog page，所以它也不会出现在 blog 列表中，而是要通过 URL 去 access。

**所以 HEXO 的 page 一共有三种，post，draft，normal。**

## 首页不显示全文

next 配置文件中，修改配置即可；

不显示全文，只显示每篇文章的预览摘要；

```
# Automatically Excerpt. Not recommand.
# Please use <!-- more --> in the post to control excerpt accurately.
auto_excerpt:
  enable: true            // 这里false 改为 true
  length: 150            // 文章预览字数
```

## 翻页数量按钮调整

翻页正常只显示 3 个按钮，如果要自定义配置

打开 `./themes/next/layout/_partials/pagination.swig` 文件，修改 `mid_size` 字段：

[配置按钮]: https://segmentfault.com/q/1010000022474021 "这篇文章详细配置"

## 首页分页数量

在 hexo 配置文件中修改`index_generator`，55 行左右；

```
index_generator:
  path: ""
  per_page: 10              // 每页展示文章数
  order_by: -date           // 文章排序
```

## hexo 配置

### 全局安装 hexo-cli

```
npm install -g hexo-cli
```

### 初始化项目结构

```
$ hexo init <folder>
$ cd <folder>
$ npm install
```

### 常用脚本

```
"scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server",     // 起本地服务预览  --draft可以预览草稿箱
    "upload": "hexo clean & hexo generate & hexo deploy",   // 上传git
    "reload": "hexo clean & hexo generate"  // 重新编译
  }
```
