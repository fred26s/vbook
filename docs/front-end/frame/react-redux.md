概念

`Redux`是一款状态管理库，并且提供了`react-redux`库来与`React`亲密配合

**Redux是针对JavaScript应用的可预测状态容器**

包含了以下几个含义：

- **可预测性(predictable)**: 

  因为Redux用了reducer与纯函数(pure function)的概念，每个新的state都会由旧的state建来一个全新的state。因而所有的状态修改都是”可预测的”。

- **状态容器**(state container): 

  state是集中在单一个对象树状结构下的单一store，store即是应用程序领域(app domain)的状态集合。

- **JavaScript应用**: 

  这说明Redux并不是单指设计给React用的，它是独立的一个函数库，可通用于各种JavaScript应用。

Redux基于简化版本的Flux框架，Flux是Facebook开发的一个框架。在标准的MVC框架中，数据可以在UI组件和存储之间双向流动，而Redux严格限制了数据只能在一个方向上流动。