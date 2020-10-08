1. query传递参数会在url后面用？连接起来，且参数之间用&&符号连接然后显示在页面的url中；params传递参数不会显示在页面中；query有点像ajax中的get请求，而params像post请求。

2. 在vue中使用query要搭配path路径，而`params只能由命名路由name来引入`；看下列代码：

   **路由中path的配置**

   ```javascript
   	{
   			path: '/argu/:name/:id', //这种路由配置是params传递参数,且这个后面必须加参数，如果不加，刷新页面这些参数会消失
   			name:'argu',
   			component: () => import('@/views/argu.vue'),
   		},
   ```

   使用params传递参数注意要在`path路径后面添加参数`，不然刷新页面数据会丢失。

   看图：这是没有刷新之前；
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200722095355335.png)


   如果`path:'/argu'`没有后面的参数，刷新页面数据就会丢失

   这是刷新之后：可以看到数据消失了，变为了默认数据。
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200722095607246.png)
   使用params传参的具体写法：
   ```javascript
   this.$router.push({
       				//params要name一起用，不然接收不到参数
   					name: `argu`,
   					params:{
   						name:'xrw',
                           id:'123'
   					}	
           });
   ```

   使用query传递参数，在路由中设置path: '/argu'，后面可以不跟参数。

   ```js
   this.$router.push({ 
       path:'/argu', 
       //如果在路由中配置了name属性在这里也是可以用的 name:'argu' 效果同上
       query:{ 
           name:'xrw'
           id : '123'
       }
   })	
   ```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200722100943394.png)
   可以看到使用query传递的参数会显示在url中用？连接起来，可以在浏览器中看到保密性不怎么好。

3. **两者接收参数的形式**：

   query： 

   ```javascript
   //query接收参数
   {{ this.$route.query.name }}
   {{ this.$route.query.id }}
   ```

   params:

   ```javascript
   //params接受参数
   {{ this.$route.params.name }}
   {{ this.$route.params.id }} 
   ```

   组件中也可以用`props`来进行接受参数，这种方式（`推荐方法`）

   这样需要在路由配置中`设置props为true`:

   ```javascript
   	{
   			path: '/argu', 
   			name:'argu',
   			component: () => import('@/views/argu.vue'),
   			//设置props为ture，代表将path后面的参数作为值，传递到组件中，组件中通过props属性接受这个值
   			props:true,
   		},
   ```

   然后再组件中设置props来接收这个参数：

   ```javascript
   <template>
    <div>
       //props形式传递参数
   	 {{ name }}
   	 {{ id }}
   	//$route形式传递参数
   	 {{ this.$route.params.name }} 
   	 {{ this.$route.params.id }}
   	 {{ this.$route.query.name }}
   	 {{ this.$route.query.id }} 
    </div>
   </template>
   
   <script>
   export default {
   	 props:{
   		 name:{
   			 type:String,
   			 default:'lily' //默认情况
   		 },
   		 id:{
   			 type:Number,
   			 default:'0' //默认情况
   		 }
   	 }
   }
   </script>
   ```

   这里我们需要来了解一下 $ route和$router的区别：

   ```javascript
   //$router : 是路由操作对象，只写对象
   //$route : 路由信息对象，只读对象
   
   //操作 路由跳转
   this.$router.push({
         name:`argu`,
         params:{
             name:'xrw',
             age:'123'
        }
   })
   
   //读取 路由参数接收
   this.name = this.$route.params.name;
   this.age = this.$route.params.age;
   ```

   ### 总结

   - query和params是两种`传参方式`
   - 使用`params传参只能由name引入路由`，如果写成path页面会显示undefined报错。
   - 使用query传参的话可以使用path也可以使用name引入路由，不过建议使用path引入路由。
   - `params是路由的一部分`，`一定`要加路由后面添加参数，不添加刷新页面数据会丢失；而query是拼接在url后面的参数，路由后面不添加也没关系。