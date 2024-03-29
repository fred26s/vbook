## rollup

## rollup多文件输入/输出配置

## 实现例子

- 编译输入多个ES6+的js源文件 `src/index.js` 和 `src/lib/index.js`
- 编译输出多个ES5的js文件 `dist/index.js` 和 `dist/lib.js`

demo例子

https://github.com/chenshenhai/rollupjs-note/blob/master/demo/chapter-01-05/

```sh
npm i

npm run dev
```

## 实现步骤

### 步骤1: 目录和准备

```sh
.
├── build # 编译脚本目录
│   ├── rollup.config.dev.js # 开发模式配置
│   ├── rollup.config.js # 基本 rollup.js编译配置
│   └── rollup.config.prod.js # 生产模式配置
├── dist
│   ├── index.js
│   ├── index.js.map
│   ├── lib.js
│   └── lib.js.map
├── example
│   └── index.html
├── package.json
└── src
    ├── index.js
    └── lib
        ├── demo.js
        └── index.js
```

安装对应编译的npm模块

```sh
## 安装 rollup.js 基础模块
npm i --save-dev rollup 

## 安装 rollup.js 编译本地开发服务插件
npm i --save-dev rollup-plugin-serve

## 安装 rollup.js 编译代码混淆插件
npm i --save-dev rollup-plugin-uglify

## 安装 rollup.js 编译ES6+的 babel 模块
npm i --save-dev @rollup/plugin-babel @babel/core @babel/preset-env
```

- `rollup` 模块是rollup编译的核心模块

### 步骤2: rollup配置

- 编译基本配置 `./build/rollup.config.js`

```js
const path = require('path');
const { babel } = require('@rollup/plugin-babel');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

const babelOptions = {
  'presets': ['@babel/preset-env'],
}

module.exports = [
  {
    input: resolveFile('src/index.js'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'umd',
    }, 
    plugins: [
      babel(babelOptions),
    ],
  },
  {
    input: resolveFile('src/lib/index.js'),
    output: {
      file: resolveFile('dist/lib.js'),
      format: 'cjs',
    }, 
    plugins: [
      babel(babelOptions),
    ],
  }
]
```

- `开发模式`配置基本 `./build/rollup.config.dev.js`

```js
const path = require('path');
const serve = require('rollup-plugin-serve');
const configList = require('./rollup.config');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}
const PORT = 3001;


configList.map((config, index) => {

  config.output.sourcemap = true;

  if( index === 0 ) {
    config.plugins = [
      ...config.plugins,
      ...[
        serve({
          port: PORT,
          contentBase: [resolveFile('example'), resolveFile('dist')]
        })
      ]
    ]
  }

  return config;
})

module.exports = configList;
```

- `生产模式`配置基本 `./build/rollup.config.prod.js`

```js
const { uglify } = require('rollup-plugin-uglify');
const configList = require('./rollup.config');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

configList.map((config, index) => {

  config.output.sourcemap = false;
  config.plugins = [
    ...config.plugins,
    ...[
      uglify()
    ]
  ]

  return config;
})

module.exports = configList;
```

- 在

  ```
  ./package.json
  ```

  配置编译执行脚本

  ```
  {
  "scripts": {
    "dev": "node_modules/.bin/rollup -w -c ./build/rollup.config.dev.js",
    "build": "node_modules/.bin/rollup -c ./build/rollup.config.prod.js"
  },
  }
  ```

### 步骤3: 待编译ES6源码

- `./src/index.js`源码内容

```js
import demo from './lib/demo';

const arr1 = [1,2,3];
const arr2 = [4,5,6];
console.log([...arr1, ...arr2]);

async function initDemo () {
  let data = await demo();
  console.log(data);
}

initDemo();
```

- `./src/lib/demo.js`源码内容

```js
function demo() {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(()=>{
        const obj1 = {a:1};
        const obj2 = {b:2};
        const obj3 = {c:3};
        const obj4 = {d:4};
        const result = {...obj1, ...obj2, ...obj3, ...obj4};
        resolve(result);
      }, 1000)
    } catch (err) {
      reject(err);
    }
  })
}

export default demo;
```

- `./src/lib/index.js`源码内容

```js
console.log('this is lib.js')
```

### 步骤4: 编译结果

- 在项目目录下执行`开发模式` `npm run dev`
- 在项目目录下执行`生产模式` `npm run build`
- 编译结果在目录 `./dist/` 下
- 编译结果分成
  - ES5代码文件 `dist/index.js` 和 `dist/lib.js`
  - `生产模式` ES5代码的生成会被`uglify`混淆压缩
  - `开发模式` 会生成源码的sourceMap 文件 `./dist/index.js.map` 和 `./dist/lib.js.map`
- 插件服务启动了`3001` 端口

### 步骤5: 浏览器查看结果

- example目录`./example/index.html`
- example源码

```html
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.bootcss.com/babel-polyfill/6.26.0/polyfill.js"></script>
  </head>
  <body>
    <p>hello world</p>
    <script src="./index.js"></script>
    <script src="./lib.js"></script>
  </body>
</html>
```

- 访问 [http://127.0.0.1:3001](http://127.0.0.1:3001/)
- 打开工作台console 就会显示可运行结果

```sh
[1, 2, 3, 4, 5, 6]
this is lib.js
{a: 1, b: 2, c: 3, d: 4}
>
```