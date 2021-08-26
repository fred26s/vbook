# 单向数据流

数据又父组件传入子组件，子组件想要修改数据，需要调用父组件传入的方法，数据修改过程仍在父组件进行。



# JSX

JSX，是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。

在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

也就是说，你可以在 `if` 语句和 `for` 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX;

Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。



# 元素和组件

组件

- 函数组件

  接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。

  这类组件被称为“函数组件”，因为它本质上就是 JavaScript 函数

- class组件

- 渲染组件

  React 元素也可以是用户自定义的组件，当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象props传递给组件。

  > **注意：** 自定义组件名称必须以大写字母开头。
  >
  > React 会将以小写字母开头的组件视为原生 DOM 标签。例如，`<div />` 代表 HTML 的 div 标签，而 `<Welcome />` 则代表一个组件，并且需在作用域内使用 `Welcome`。

单向数据流

**所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。**

state

- state只能定义在构造函数中

- state只能通过`setState()`来修改赋值

  否则不会同步组件DOM

- setState()的更新可能是异步的

  React 可能会把多个 `setState()` 调用合并成一个调用，类似于vue中修改了data并不会立即修改DOM，而是在下一个tick中统一处理；

  ```
  // 可以使用回调函数，来解决异步调用问题 
  // * 这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：
  this.setState((state, props) => ({
    counter: state.counter + props.increment
  }));
  ```

  

  



# 生命周期

需要写在class类组件中；

- componentDidMount

  组件已经被渲染到 DOM 中后运行

- componentWillUnmount

  组件从 DOM 中被移除时运行

- componentDidUpdate

  更新发生后立即调用。 初始渲染不调用此方法。 当组件已更新时，可借此机会在DOM上进行操作

```
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
// 写在class中
  componentDidMount() {
    ...
  }
// 写在class中
  componentWillUnmount() {
    ...
  }
}
```



# 事件处理

jsx中传入的方法需要手动处理this指向；

解决方法如下：

1. 使用箭头函数，在回调函数中调用实际事件函数；

   ```
   class LoggingButton extends React.Component {
     handleClick() {
       console.log('this is:', this);
     }
   
     render() {
       // 此语法确保 `handleClick` 内的 `this` 已被绑定。
       return (
         <button onClick={() => this.handleClick()}>
           Click me
         </button>
       );
     }
   }
   ```

2. 使用bind绑定this

   ```
   class Toggle extends React.Component {
     constructor(props) {
       super(props);
       this.state = {isToggleOn: true};
   
       // 为了在回调中使用 `this`，这个绑定是必不可少的
       this.handleClick = this.handleClick.bind(this);
     }
   
     handleClick() {
       this.setState(prevState => ({
         isToggleOn: !prevState.isToggleOn
       }));
     }
   
     render() {
       return (
         <button onClick={this.handleClick}>
           {this.state.isToggleOn ? 'ON' : 'OFF'}
         </button>
       );
     }
   }
   ```

   ### 参数传递

   在循环中，通常我们会为事件处理函数传递额外的参数。例如，若 `id` 是你要删除那一行的 ID，以下两种方式都可以向事件处理函数传递参数：

   ```
   <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
   <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
   ```

# .jsx和.js差异

其实二者用来写react是”没有”差异的，

- .JSX后缀的文件只是方便一眼看出里面有用JSX语法而已，并且支持编辑器的样式高亮

  打包后，JSX文件仍需要编译为.js文件后才能在浏览器运行



插槽slot

react中的插槽操作，可以通过默认属性`props.children`来实现；

- 默认插槽：

  `props.children`相当于vue中的默认插槽

- 命名插槽：

  仍然可以通过自定义`props.customComponents`，传入组件的自定义插槽



# hook

Hook 是一些可以让你在**函数组件**里“钩入” React state 及生命周期等特性的函数。

Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React，但Hook 覆盖所有 class 组件的使用场景，

本质可以用Hook来代替class写法，优化class的写法；

## 好处：

- 组件之间复用状态逻辑

  **Hook 使你在无需修改组件结构的情况下复用状态逻辑**

- 简化复杂组件

  **Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。

- 替代难以理解的 class

  **Hook 使你在非 class 的情况下可以使用更多的 React 特性**

  class的this指向复杂、需要绑定事件处理器等问题很冗余；

## 内置Hook

- useState

  在函数组件中也可以定义使用state

  ```
  function ExampleWithManyStates() {
    // 声明多个 state 变量！
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
    // ...
  }
  ```

- useEffect

  类似与生命周期函数的执行回调， 可类比与vue中的`this.$nextTick(() => {})`
  
  ```
  function FriendStatusWithCounter(props) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      document.title = `You clicked ${count} times`;
    });
  
    const [isOnline, setIsOnline] = useState(null);
    useEffect(() => {
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      };
    });
  
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    // ...
  ```
  
  
  
  > - [基础 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#basic-hooks)
  >   - [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)
  >   - [`useEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useeffect)
  >   - [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
  > - [额外的 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#additional-hooks)
  >   - [`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)
  >   - [`useCallback`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)
  >   - [`useMemo`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)
  >   - [`useRef`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)
  >   - [`useImperativeHandle`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
  >   - [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
  >   - [`useDebugValue`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedebugvalue)

使用规则

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。

- 只能在 **React 的函数组件**中调用 Hook。不要在其他 JavaScript 函数中调用。

  （还有一个地方可以调用 Hook —— 就是自定义的 Hook 中）



## 自定义Hook

> 什么是自定义hook？
>
> 如果函数的名字以 `use` 开头，并且调用了其他的 `Hook` ，则就称其为一个自定义 `Hook` 。

自定义 Hook 更像是一种约定而不是功能。如果函数的名字以 “`use`” 开头并调用其他 Hook，我们就说这是一个自定义 Hook；

`Hook` **是一种复用状态逻辑的方式，它不复用 `state` 本身，事实上 `Hook` 的每次调用都有一个完全独立的 `state` 。**



