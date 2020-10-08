# 一、首先要了解js中作用域链

### 1.执行环境

1.执行环境的定义（也称为执行上下文）：简单来说就是当前js代码在解析和执行时所在的环境。在一个执行环境中，有一个与之关联的变量对象（简称对象），在该对象中，存储着这个执行环境中定义的变量和函数；但这个对象是抽象的，并不能被外界所访问到。
2.那么在js中，就只有两种执行环境：

- 一个是window的全局执行环境：这个是默认的代码执行环境，一旦代码被载入，引擎最先进入的就是这个环境。例如，我们在全局运行下列代码，那么当前的执行环境就是<font color='red'> window </font>，也就是全局，在该环境中关联的对象中存储着定义的变量，也就是<font color='red'> color </font>。

```javascript
	<script>
        var color = 'red'
        console.log(color);
    </script>
```

- 在JavaScript中，函数也会形成一个环境。看下面代码,在函数的内部就是一个局部的环境，与该环境关联的对象中存储着变量<font color='red'> mycolor</font>,而在全局环境中<font color='red'> color</font>和<font color='red'> app函数</font>就是该环境关联对象中存储的<font color='red'> 变量</font>和<font color='red'> 函数</font>。

```javascript
<script>
	//全局环境下
		var color = 'red'
        console.log(color);

        function app() {
            //函数环境内
            var mycolor = 'green'
            console.log(mycolor);
        }
        app();
</script>
```


### 2.作用域链

1.在了解了上面的执行环境后，换个角度思考：那么函数环境内能不能访问全局环境下的变量呢？
看下列代码：

```javascript
<script>
        //全局环境
        var color = 'red'
        console.log(color);

        function app() {
            //局部环境
            var mycolor = 'green'
            console.log(mycolor + '---' + color)
        }
        app();
        console.log(color + '---' + mycolor)
</script>
```

打印结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200716204805352.png)
可以看到结果是可以的，但是在全局环境下访问函数环境内的变量却报错。
<font color='red'> 作用域链的概念：</font>当代码在一个环境中执行的时候，会针对环境中存储变量和函数的对象创建一个作用域链，作用域链的最前端就是当前环境的对象；如果当前环境是个函数，则作用域链的下一部分就是全局<font color='red'> window</font>环境的变量对象。<font color='red'> 而window环境的变量对象始终都是作用域链中最后一个对象。</font>

分析一下代码：
首先<font color='red'> app（）执行</font>，app函数内的执行环境会<font color='red'> 先访问内部的变量</font>，然后找到了mycolor变量，但是没找到color变量，因为app是个函数，所以它的作用域链还会延申到全局window下，所以由于作用域链在全局下寻找color变量；
再看window环境下的代码：

```javascript
 console.log(color + '---' + mycolor)
```

首先会在window环境中寻找到color变量，然后开始寻找mycolor但是没有找到，所以会沿着作用域链往下寻找；因为在window环境下，所以此时作用域链已经到达了尾部，不会再向下寻找了，所有就不能访问到<font color='red'> color变量</font>。
现在应该可以大概了解作用域链概念了，在看下面代码：

```javascript
<script>
        //全局环境
        var color = 'red'
        console.log(color);

        function app() {
            //函数内的局部环境
            var mycolor = 'green'
            console.log(mycolor + '---' + color )//这里可以访问外部window环境下的变量
            function inapp(){
            	//函数内的局部环境
                var incolor = 'blue'
                console.log(incolor + '---' + mycolor +'---'+ color);
                //在这里可以访问到incolor 、mycolor 、color变量
            }
            inapp()
  			console.log(mycolor + '---'+ incolor)//但是却不能访问到inapp（）函数内的变量
        }
        app();
        
    </script>
```

运行结果：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200717100353966.png)
这就是作用域链的作用：保证了<font color='red'> 执行环境中代码对变量的有序访问</font>。
你可以这样理解结论：当访问一个函数的变量或者方法时，它首先会在自己所在的内部环境中查找，如果没找到就会通过作用域链向外部环境查找，直到找到变量为止，如果到了全局window环境下都没有找到，就会抛出错误；但是外部环境不能访问内部环境中的任何变量和函数。

### 3.块级作用域

1.在JavaScript中是没有块级作用域的，由花括号或小括号封闭起来的区域内没有自己的作用域，看下面两个例子：

```javascript
<script>
        if(true){
            var color = 'red'
        }
        console.log(color); //red
</script>
```

 可以看到外部能访问color变量，按照作用域链的规则来说应该是不能访问的，在看一个例子：


```javascript
for( var i = 1; i<5; i++){
            console.log(i); 
        }
console.log(i); // 5
```

可以看到在for语句中定义的i变量，在其外部也可以被访问到，以上两个例子都是没有块级作用域而造成的结果。解决以上问题可以用let和const变量来解决。

### 4.特殊情况

这种情况会影响访问变量的顺序，那就是不声明直接给一个变量赋值，看下列代码：

```javascript
function app(){
            sum = 10
        }
        app()
        console.log(sum); // 10
```

按照我们之前的理解，因为作用域链，sum变量应该是访问不到的；但在看却返回10，这是因为我们再用<font color='red'> var </font>声明变量的时候，会自动将该变量放到离其作用域最近的环境中，比如你在函数fn中var a = 1，那么a变量就放到fn的环境中；同理在window下定义的变量，就放在window全局环境中。但是如果该变量没有定义，直接赋值，那么该变量就会直接被放到全局环境下，这就是为什么可以访问到sum的原因。

# 二、闭包

### 1.闭包的定义

1. **闭包**： 是指有权访问另一个函数作用中的变量的函数，常见的闭包形式就是一个函数的内部再创建另一个函数。
2. 当你理解了作用域链的概念那么闭包就很好理解了，看下面的例子：

```javascript
let num = 10
    function outf(){
        let outnum = 20
        function inf(){
            let sum = outnum + num
            console.log(sum);
        }
        inf()
    }
    outf() // 打印 30
```

在inf函数中通过作用域链访问外部outf（）和全局window环境下的变量。
这就是我们所说的：**一个函数有权访问另一个函数内部的变量**。

# 三、使用闭包需要注意的问题

1.点击小li标签，打印出对应的index，看下列代码：

```javascript
function create() {
    var arr = []

    for(var i=0; i<10; i++) {
        arr[i] = function () {
            return i
        }
    }

    return arr
}

let result = create()

result[0]()         //返回10
result[1]()         //返回10   
   ……
result[9]()         //返回10

```

这个例子就是在函数 create 中通过 for 循环定义10个匿名函数，每个函数都返回变量 i，最终将每个匿名函数保存到数组 arr 中并返回数组 arr，然后我们在收到数组 arr 后依次调用每个匿名函数，发现每个返回的都是数字10，而我们最初的目的是依次返回的是 0~9。

这是因为，我们调用匿名函数的时候需要返回变量 i ，而匿名函数内部没有该变量，所以去往下一个变量对象，也就是定义匿名函数时所处的函数环境 create 中寻找变量 i ，但此时的变量 i 已经通过循环变成了10，所以当我们调用每个匿名函数时，返回的全部都是10.

为此，我们的代码可以写成这样：

```javascript
function create() {
    var arr = []

    for(var i=0; i<10; i++) {
        arr[i] = (function (num) {
            return function () {
                return num
            }
        })(i)
    }

    return arr
}

let result = create()

result[0]()         //返回 0
result[1]()         //返回 1   
   ……
result[9]()         //返回 9

```

这样做就直接在定义最内部的匿名函数时，把当前循环的变量 i 放在了最内部匿名函数外部的那个匿名函数内，这样的话，我们之后调用匿名函数时，寻找变量 i 就会从该匿名函数外部的那个匿名函数的变量对象中找到相应的变量。

# 四、内存泄漏

### 1.首先了解一下js的垃圾回收机制

1.在JavaScript中，具有自动垃圾回收机制，也就是说执行环境会管理自己内部内存，比如局部环境中的局部变量，变量在被声明后，这个局部变量会在局部环境中的内存中分配空间来存储；然后在函数中使用这些变量，直至函数执行结束。此时，局部变量就没有存在的必要了，就会被自动销毁，以释放内存。看下面代码：

```javascript
let color = 'red'

function change() {
	let my_color = 'blue'
	color = 'green'
}

change()
```

当函数执行结束后，里面的变量<font color='red'> my_color </font>就会被回收；在JavaScript中一共有两种方法来实现垃圾回收：<font color='red'> 标记清除</font>、<font color='red'> 引用计数</font>。

##### 标记清除

1.这是js最常用的清除方式。当一个变量进入环境（比如在函数中声明了一个变量），就会将这个变量标记为<font color='red'> 进入环境</font>，那么当变量<font color='red'> 离开环境</font>时，就会将其标记为“离开环境”，等到垃圾回收执行时，会根据标记来清除相关变量。

##### 引用计数

2.这种方式不是很常用，就是针对值为引用类型数据的变量进行计数，来看简单的例子：

```javascript
let num = [1,2,3]
  function change() {
            let my_num = [4,5,6]
            num = my_num 
 }
 change()
 console.log(num); // num = [4,5,6]
```

当my_color被声明，并将一个<font color='red'>引用类型值</font>赋值给它，同时又将my_num赋值给了全局num，那么此时my_num的值被全局变量num所引用了，所以my_num的引用次数+1，就不会被垃圾回收机制所回收，若取消了原本的引用，次数就-1，那么当一个变量的引用次数为0时候，那么就会被垃圾回收机制回收，不为 0 就不做处理。
那么我们如何处理掉那些被引用的变量呢，不让他占用内存；
很简单，在使用该变量后，<font color='red'>将其赋值为null</font>，看下列代码：

```javascript
let num = [1,2,3]
  function change() {
            let my_num = [4,5,6]
            num = my_num 
 }
 change()
 console.log(num); // num = [4,5,6]
 num = null
```

### 2.内存泄漏概念

1. 只有在IE9之前才会因为闭包出现内存泄露的问题。
2. 你可以简单的理解为： 当一个闭包的作用域链内有一个html元素时候，那么这个html元素是无法被js垃圾回收机制回收。
   看下列代码：

```javascript
function handle() {

    let element = document.querySelector('#app')
    
    element.onclick = function () {
        console.log(element.id)
    }
}
```

在函数 handle 中，给HTML元素 element 创建了一个点击事件的匿名函数，该函数内部引用了变量 element ，所以变量 element 的引用次数为1，这样的话垃圾回收机制一直都不会清除该元素了，这就是一个内存泄露的情况。
那么如何解决？so easy

```javascript
function handle() {
    
    let element = document.querySelector('#app')
    let id = element.id
    
    element.onclick = function () {
        console.log(id)
    }
    
    element = null
}

```

将元素 element 的 id 值保存在一个变量 id 内，然后在该元素的点击处理事件中引用变量 id ， 并且在最后通过把变量 element设置为 null ，以解除对DOM元素的引用，这样引用次数就变为0，而不再是1了，垃圾回收机制就可以对其进行清除了。

# 五、闭包中私有变量

了解作用域链的关系，就知道了只有内部环境访问外部环境的规则，而外部环境不能访问内部环境，所以在内部环境的定义的变量就成为自己的私有变量，闭包也是JavaScript实现私有变量的方法。
看代码来了解一下把：

```javascript
let a = 1
let c = 4

     function fn1() {
          let b = 2
          console.log(c);    //打印 4 而不打印 3，就是因为作用域链的关系没有访问fn2的权限
          function fn2() {
              let c = 3
              console.log(b); //打印 2 ，那么此时c变量就成为了fn2 的私有变量
          }
      }
```

# 总结

现在你应该对js闭包有了一个全面的认识了吧.

- 闭包是指有权访问另一个函数作用中的变量的函数，常见的闭包形式就是一个函数的内部再创建另一个函数。
- 闭包作用就是形成私有变量，是外部无法访问到。 

参考文档：https://blog.csdn.net/l_ppp/article/details/107130054 写的很好。