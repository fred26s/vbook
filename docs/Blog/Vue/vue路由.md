# 路由的概念
路由就是指向的意思，当你在页面中点击Home按钮，你就可以跳转到home内容部分，你点击about按钮，就跳转到about内容部分；在vue中，由于vue是一个单页面应用，路由就是处理组件之间的跳转。也可以理解为dom元素的隐藏和显示，在客户端（即前端）的路由实现总共有两种方法：
1. 基于`hash`
2. 基于h5新增属性`history`(常用)
### history与hash的区别

1. hash模式，url中会有#符号；hash模式虽然出现在url中，但是它不会真的发起http请求，改变hash不会引起页面的刷新；你可以将hash理解为html中的锚点链接，点击就会跳转到相应的位置显示。

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200721222201937.png)

2. history模式，利用了 HTML5 History Interface 中新增的 `pushState() `和 `replaceState()` 方法。且显示在页面中也不会有#出现，`美化了url`链接；
- 且`pushState()` 和`replaceState()`这个两个方法可以改变历史记录，`pushState()`就是往历史记录中`新增一个url链历史记录`，可以通过回退返回上一个链接；
- 而` replaceState()`这个方法，`只是修改了当前历史记录项`，而不是新建一个，所以不能回退页面。当这两个方法执行的时候，虽然改变了url，但是也`不会向后端发起真实请求`。
- 而vue中也是基于这两个方法实现的$router.push和$router.replace这两个方法，而且只能在支持`pushState() `和 `replaceState()`的浏览器中使用。

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200721222220299.png)

# 路由的项目配置
一般项目开发都会采用vue-cli来直接搭建项目，我们来看看生成的vue-router文件的部分：
这个是router的文件，一般会将routes配置单独分离出来：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200720155911660.png)
`index.js配置`
```javascript
import Vue from 'vue';  //引入Vue
import VueRouter from 'vue-router'; //引入vue-router
import routes from './router' //将routes引入

Vue.use(VueRouter); //全局使用路由

const router = new VueRouter({
	mode: 'history', //h5新增history属性，作用就是美化url，去除url中的#
	routes  //es6法，你也可以写成，routes: routes
});

export default router;  //导出 路由

```
下面来看路由配置文件：`router.js`
常见的路由有一下几种：
```javascript
import Home from '@/views/Home.vue'  //引入home组件

export default [
		//路由中每个链接都是一个对象
		{
			//首先是/路径的配置
			path: '/',
			//一般情况下访问根路径就会显示首页页面，那么这里怎么实现呢？
			//这里用到了重定向redirect的方法
			redirect:'/home' //当用户访问'/'路径，贼会跳转到'/home'
		},
		{
			path: '/home',      //配置路由的路径          
			name:'home',    //路由的名称
			component: Home,   //引入的组件，就是这个路由要渲染的组件页面
			meta:{         
				title:'Home' //meta的title属性就是document.title中的内容
			},
		},
		{
			path: '/about',
			name:'about',
			component: () => import('@/views/About.vue'),  
			//路由懒加载的形式,当你访问这个路径，浏览器才会加载这个组件的
			//渲染；如果为点击则不渲染，这样的好处大大减少了第一次加载vue
			//的所需要的time
			meta:{
				title:'About'
			}
		},
		{
			//动态路由，可以在路径中传递参数
			path: '/argu/:name',
			name:'argu',
			component: () => import('@/views/argu.vue'),
			//设置props为ture，代表将path后面的参数作为值，传递到组件中，
			//组件中可以通过props属性接收这个值
			props:true,
			meta:{
				title:'Argu'
			}
		},
		{
			//嵌套子路由
			path: '/parent',
			name:'parent',
			component: () => import('@/views/parent.vue'),
			children:[
				{
					path:'child',//在子路由中前面不需要/，它的访问路径为/parent/child
					component: () => import('@/views/child.vue')
				}
			],
			meta:{
				title:'Parent'
			}
		},
		{
			//一次显示多个组件
			path:'/named_view',
			components:{
				default: () => import('@/views/child.vue'),//这个是默认加载的组件
				email: () => import('@/views/email.vue'),
				tel: () => import('@/views/tel.vue')
			},
		},
		{
			//配置404的路由，这个路由一定要放在最下面，因为路由的读取是按顺序从上到下的。
			path:'*',
			component: () => import('@/views/error_404.vue'),
			meta:{
				title:'404'
			}
		}
	]
```
# 路由在组件中的配置
看了路由的配置之后，我们需要在组件中添加一些按钮来进行路由的跳转，来看看下列代码：
 -  第一种方法：使用`<router-link to="/">`的形式进行点击跳转，to中写入要跳转的path路径；
```javascript
	  <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      //同时还需要配和<router-view />来使用，用来显示组件的内容
      <router-view />
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200720193230407.png)
在to中也可以使用命名路由的方式，前面我们给每个路由都添加了name属性，这个就是为了方便我们后续的操作，我们以`动态路由`的配置来看，看下列代码：

```javascript
	{
			//动态路由，可以在路径中传递参数
			path: '/argu/:id',
			name:'argu',
			component: () => import('@/views/argu.vue'),
		},
```
在这个路由中携带了一个name参数
```javascript
<router-link to="/argu/123">User123</router-link>//这样写和下面的等价
<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
//在使用对象作为路由时，需要将to绑定
```
- 第二种就是通过操作js来实现页面跳转，也是平常用的比较多的，在vue-router中有两种方法进行跳转，分别是`push()`和`replace()`，那么两种方法有什么区别呢？
1. `push()` 方法会将你要访问的路径url存入历史history中，在页面点击回退会返回到之前的页面。
2. `replace()` 这个方法不会存入history中，他只是将当前页面的url替换成你目标的url,点击回退不会返回。
- 看下列代码：
```javascript
<template>
  <div class="home">
    <button @click="handle('back')">上一页</button>
    <button @click="handle('push')">push跳转parent</button>
    <button @click="handle('replace')">replace跳转parent</button>
  </div>
</template>
<script>

export default {
  name: "Home",
  methods: {
  	//通过判断type来看到底要使用哪种方法跳转路由
    handle(type) {
      if (type === "back") {
        this.$router.back(); //this.$router就代表当前所在路由页面
      } else if (type === "push") {
        this.$router.push('parent')
      } else if (type === 'replace') {
		this.$router.replace('parent')
	  }
  }
};
</script>
```
那么当页面中有些路由需要传递参数，看下列代码：

路由配置中的代码
```javascript
//以这个例子为例,我们需要访问argu页面，而访问argu
{
			//动态路由，可以在路径中传递参数
			path: '/argu/:id',
			name:'argu',
			//如果想让这个传过来的id显示在页面中，需要设置:
			props:true,  //设置props为ture，代表将path后面的参数作为值，传递到组件中，组件中通过props属性接受这个值
			component: () => import('@/views/argu.vue'),
		},
```
组件页面中的代码
```javascript
<template>
    <button @click="handle()">跳转到argu组件</button>
</template>
<script>
methods:{
	handle(){
		const id = 10
		this.$router.push({ path:`/argu/${id}` }); //1.可以直接写path的路径且后面带着参数
		this.$router.push({ name:'argu', params:{id:id} }); //2.通过name命名路由，和params传递参数
		//3. 也可以带参数查询
		this.$router.push({ path:'/argu', query:{ id : id}})
	}
}
</script>
```
argu组件中：

```javascript
<template>
 <div>
	 {{ id }}
 </div>
</template>

<script>
export default {
	 props:{
		  id:{
			 type:Number, // 设置传递来的id为number类型
			 default:'lily'  //如果没有传入参数，则默认显示lily
		 }
	 }
}
</script>
```
# 路由守卫
- 主要有三种守卫：全局守卫，组件内部守卫，单个路由独享守卫。
### 全局守卫
- `全局前置守卫`：主要用来拦截一些信息，比如判断一个用户是否登录，然后再根据权限进入相应的界面，来看全局前置守卫的配置：
用`router.beforeEach()`来注册全局前置守卫，里面传入三个参数：
	`to:`  表示要去往目标路由
	`from` 表示从那个路由离开
	`next()`这个方法用来启动下一个钩子，一般在有before-前缀的钩子函数中调用。
```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router'

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes
});
//false表示用户未登录，true表示登录成功
const HAS_LOGIN = true

//全局前置守卫,拦截用户是否登录
router.beforeEach((to, from, next) => {
	//首先判断是否是登录页面
	if (to.name !== 'login') {
		//如果是其他页面，则判断是否登录，是登录状态，直接跳转到想去的界面
		if (HAS_LOGIN) next()
		//如果没有登录则返回到登陆界面
		else next({ name: 'login' })
	} else {
		//若是登录页面，且登录状态，则跳转到首页
		if (HAS_LOGIN) next({ name: 'home' }) 
		else next()
	}
})

export default router;

```
### 在路由中配置的守卫

```javascript
{
			path: '/home',
			name:'home',
			component: Home,
			beforeEnter: (to, from, next) => {
				if(from.name === 'about') alert('这个界面是从about来的')
				else alert('这不是从about来的')
				next()
			},
		},
```
### 组件内的守卫
在组件内methods中定义
```javascript
//路由进入之前，页面还未渲染
	beforeRouteEnter(to, from, next){
			//to:当前路由， from:进来的路由
			console.log(to.name);
			console.log(from.name);
			next()
			//这个钩子函数中不能访问组件内部的this,因为这时候页面还未渲染
	},
	//路由离开之前，判断用户一些操作，是否确认跳转之类的。比如一个个人信息修改之类的，用户还未保存就跳转到下一个界面，那么这里会做一个提示拦截，提醒用户保存信息
	beforeRouteLeave(to, from, next){
			const leave = confirm('您确定要离开吗?')
			if(leave) next()
			else next(false) //将next设置为false，就会取消进入下一个钩子
			//这里可以访问this
	},
	beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 可以访问组件实例 `this`
  },
```
这三种是比较常用的路由模式。
### 过渡动画效果
如果想让你路由之间切换的时候带有动画效果，就将`<router-view>` 用`<transition></transition> `包裹起来，看下列代码： 
在`app.vue`中配置
```javascript
	//单个
	<transition>
		<router-view />
	</transition>
	//如果有多个router-view就加-group
	<transition-group name="router">
    	<router-view  key="default"/>
    	<router-view key="email" name="email"/>
    	<router-view key="tel" name="tel"/>
	</transition-group>
```
然后在style中设置过渡样式：

```javascript
<style lang="less">
//动画过渡
//页面进来
.router-enter {
	opacity: 0;
}
//动画过程
.router-enter-active {
	transition: opacity 0.6s ease;
}
//页面完全显示的状态
.router-enter-to {
	opacity: 1;
}
//页面离开
.router-leave {
	opacity: 1;
}
//动画过程
.router-leave-active {
	transition: opacity 0.6s ease;
}
//页面完全离开的状态
.router-leave-to {
	opacity: 0;
}
</style>
```
这样你的路由之间跳转就可以有动画效果啦！
# 总结
阅读下面的流程看你彻底搞懂整个导航顺序没有。
- 1.导航`被触发`。
- 2.在失活的组件里(`就是即将离开的页面组件中`)调用 beforeRouteLeave 守卫。(来提示用户离开等一些友好信息和保存操作)
- 3.调用全局的 beforeEach 守卫。`（调用这个来判断用户权限）`
- 4.在`重用的组件`(例如动态路由，传递参数在不断变化，那么这个组件就不会断重新渲染，那么这个组件就被复用了)里调用 beforeRouteUpdate 守卫 。
- 5.在路由配置里调用 beforeEnter。
- 6.解析异步路由组件。(`就是懒加载路由`)
- 7.在`被激活的组件`里调用 beforeRouteEnter。
- 8.导航`被确认`。
- 9.调用全局的 afterEach 钩子。
- 10.触发 `DOM 更新`。(`即渲染组件到页面`)
- 11.用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
