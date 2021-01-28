## echarts地图

地图常见的渲染实现方式：

1. GeoJSON/registerMap的方式

   这种方式底图数据以json（Geojson）格式存储，具体geojson的格式（参考http://geojson.org/）及转换为geojson的方法（可采用Mapshaper ）

   > 这里简单介绍下Geo JSON；
   >
   > **GeoJSON**是一种基于[JSON]的地理空间数据交换格式，它定义了几种类型JSON对象以及它们组合在一起的方法，以表示有关地理要素、属性和它们的空间范围的数据。
   >
   > GeoJSON使用唯一地理坐标参考系统WGS1984和十进制度单位，一个GeoJSON对象可以是Geometry, Feature或者FeatureCollection.
   >
   > 其几何对象包括有点（表示地理位置）、线（表示街道、公路、边界）、[多边形](https://zh.wikipedia.org/wiki/多边形)（表示国家、省、领土），以及由以上类型组合成的复合几何图形。

   在获取json格式的数据后，采用registerMap进行手动注册；

   EChart中使用的方法，可参考官方示例（http://echarts.baidu.com/examples/editor.html?c=map-usa）

   ```
   -----示例-----
   import chinaMap from "./mapGeo/china.json";
   ECharts.registerMap("china", chinaMap);
   
   <1>可以使用series，定义type=map，来使用
   series: [
             {
               type: "map",
               map: "china",
               ....
             }
   ]
   
   <2>也可以直接在geo中定义，map=china来使用
   geo: {
             map: "china",
             zoom: 1,
             animation: false,
   }
   ```

2. 百度地图渲染

   需要引入百度地图API，具体使用方法参见[官方示例](https://echarts.apache.org/examples/zh/editor.html?c=lines-bmap-effect)

上述两种地图渲染，其余的点/线渲染使用 `series: {type: lines}`和``series: {type: scatter或effectScatter}``即可；

需要注意在地图上画点/线时，需要将`coordinateSystem`字段设置为对应的`bmap（百度地图）、geo或registerMap`等；

## dataset数据集

echart做图虽然方便，但是如果是多维数据，数据处理起来就比较麻烦。

所以echart4 出来了dataset，用于单独的数据集声明，从而数据可以单独管理，被多个组件复用，并且可以基于数据指定数据到视觉的映射。

### 示例1

使用Encode映射x和y轴

```
var option = {
    dataset: {
        source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
        ]
    },
    grid: {containLabel: true},
    xAxis: {},
    yAxis: {type: 'category'},
    series: [
        {
            type: 'bar',
            encode: {
                // 将 "amount" 列映射到 X 轴。
                x: 'amount',
                // 将 "product" 列映射到 Y 轴。
                y: 'product'
            }
        }
    ]
};
```

### 示例2

dataset同样可以使用更常用的**对象数组**形式，用encode映射即可；

```
var option = {
    dataset: {
        source: [
            {key: '2020-1-1', value: '66'},
            {key: '2020-1-2', value: '77'},
            {key: '2020-1-3', value: '88'},
        ]
    },
    grid: {containLabel: true},
    xAxis: {},
    yAxis: {type: 'category'},
    series: [
        {
            type: 'line',
            encode: {
                // 将 "key" 列映射到 X 轴。
                x: 'key',
                // 将 "value" 列映射到 Y 轴。
                y: 'value'
            }
        }
    ]
};
```



## 问题处理

- ### 取消折线图内部距离Y轴的预设padding

  echart默认渲染的图表，例如Line折线图，都会在第一个点左侧距离Y轴有一个预留距离

  可以通过属性`xAxis.boundaryGap = false`来取消；

  ```
  const option = {
  	xAxis: {
  		boundaryGap: false // 取消内部padding
  	}
  }
  ```

- ### 带有粗边框地图效果

  使用两个地图叠加实现；

- ### 两个地图叠加时，解决拖拽/缩放不同步问题

  使用`georoam`事件监听拖拽/缩放事件

  ```
  const chart = this.$refs.vcharts.chart;
        chart.on("georoam", function(params) {
          var option = chart.getOption(); //获得option对象
          if (params.zoom != null && params.zoom != undefined) {
            //捕捉到缩放时
            option.geo[0].zoom = option.series[0].zoom; //下层geo的缩放等级跟着上层的geo一起改变
            option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
          } else {
            //捕捉到拖曳时
            option.geo[0].center = option.series[0].center; //下层的geo的中心位置随着上层geo一起改变
          }
          chart.setOption(option); //设置option
  });
  ```

  这里使用了`vue-echarts / 5.0.0-beta.0`版本，实测`echarts / 4.X `版本针对`georoam`的拖拽监听事件，不能实时的更改地图中心位置； 故升级至`echarts / 5.0.0`版本即解决；



## vue-echarts

个人觉得这个组件最大封装便利是，对传入的echarts设置项进行了响应式watch；

所以我们只需要在组件外修改传入的数据，内部会自动调用ECharts 原生实例的 `setOption` 方法，省去了手动刷新的步骤；

[vue-echarts GITHUB文档](https://github.com/ecomfe/vue-echarts/blob/master/README.zh_CN.md)

### 依赖引入

vue-echarts默认为按需引入，所以用到的具体图例需要单独手动引入！

如果没引入所需的模块，你按照文档配出来的图表可能就掉入了深坑。。

例如：

```
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/map";
import "echarts/lib/chart/radar";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/polar";
import "echarts/lib/component/geo";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/dataset";
import "echarts/lib/component/markLine";    // 基准线
```

