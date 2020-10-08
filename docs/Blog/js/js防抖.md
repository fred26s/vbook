# 防抖
一直对防抖和节流傻傻分不清楚，看了也总是忘记，直到项目中遇到了，才彻底搞清楚。
##### 什么是防抖？
- 防抖就是当你触发了一个事件，这个事件就会被执行，你又不想这个事件频繁的被触发执行，所以就可以设置间隔时间，让事件被触发后，过了间隔时间在执行。
##### 注意：（区别节流的地方）
- 当你在`间隔时间内持续触发`事件，函数`不执行`
- 当你`结束触发`后，过了间隔时间在执行
##### 开发应用场景：
- 在使用uni-app开发小程序的时候，我需要实现一个搜索框的搜索联想功能，那么当用户输入内容时候，需要实时对后端请求接口，如果不设置防抖，每输入一个文字，都会发起一次请求，这样太消耗性能了；如图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200821174554641.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MjI4MjcyNw==,size_16,color_FFFFFF,t_70#pic_center)
输入了6次`a`,那么不设置防抖就会`请求6次`。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020082117461518.png#pic_center)
如果设置了`防抖`，那么在`间隔时间内`（就是防抖函数中的设置的间隔时间wait）用户输入完，那么`请求只会发送一次`，很大程度上优化了性能。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020082117554611.png#pic_center)
### 下面我们来康康怎么样手写，实现防抖函数吧！（在vue项目中）
首先创建一个common.js，将防抖函数写入并导出
```javascript
// 防抖函数
export function debounce( fn, wait ) {
	var wait = wait || 200
	var timeOut 
	return function() {
		var args = arguments  //用来接受参数，如果不加，则事件对象e为undefined
		if( timeOut ) clearTimeout(timeOut)
		 // 利用箭头函数来解决this指向问题
		 // 当然也可以定义that = this 来保存this，两种方法
		timeOut = setTimeout( () => {  
			fn.apply(this,args)
		}, wait)
	}
 }
```
然后在vue页面中，methods中使用
- 先导入函数
```javascript
import { debounce } from '../../utils/common.js'
```

```javascript
<input v-model="searchText" @input='think()' placeholder="搜索" >
```
- 在methons中

```javascript
// 联想
think:debounce( function(value) {
	// 请求联想接口....
},200), 
```
##### 这样就写完啦，一定要反复理解防抖函数的实现原理，不懂得知识点要反复推敲，这段工具代码一定要记得很熟练，手写出来！！
详细的防抖函数点击这里[防抖函数](https://github.com/mqyqingfeng/Blog/issues/22)

