# 节流
##### 概念：
节流的意思是让函数有节制地执行，而不是毫无节制的触发一次就执行一次。什么叫有节制呢？就是在一段时间内，只执行一次。
#### 注意（区别与防抖的地方）
防抖函数文章戳这里：[防抖](https://blog.csdn.net/weixin_42282727/article/details/108151189)
- 持续触发并不会执行多次
- 到一定时间再去执行
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200822203832562.png#pic_center)
`不管你触发多少次`，我都是`每隔一段时间执行一次`，我行我素！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200822203949621.png#pic_center)
### 来康康代码实现
工具函数中写入
```javascript
// 函数节流
export function throttle(fn, wait) {
    let run = true
    return function () {
		var args = arguments 
      if (!run) {
        return  // 如果开关关闭了，那就直接不执行下边的代码
      }
      run = false // 持续触发的话，run一直是false，就会停在上边的判断那里
      setTimeout(() => {
        fn.apply(this, args)
        run = true // 定时器到时间之后，会把开关打开，我们的函数就会被执行
      }, wait)
    }
}
```
页面导入
然后在vue页面中，methods中使用
- 先导入函数
```javascript
import { throttle} from '../../utils/common.js'
```

```javascript
<input v-model="searchText" @input='think()' placeholder="搜索" >
```
- 在methods中

```javascript
// 联想
think:throttle( function(value) {
	// 请求联想接口....
},200), 
```
### 现在对于防抖和节流应该有很清楚的了解了吧，不熟悉的反复多看看，一定要写熟练！
