## arduino 介绍

Arduino 是一种开发工具软件，不是一种芯片，也不是一种电路板。

它可以支持很多种处理器芯片的开发，内部有很多库，软件和硬件开发方式具有很明显的搭积木方式，开发应用，简单、方便、快捷。

Arduino 只是一个用 java 和 gnu 实现的、**开源**的**开发平台**，其结构源于艺术爱好者做的 Processing 软件开发工具。

当前已经支持有名的 ESP8266,ESP32 等比 ARM 还高级的内核板。

## 周边名词概念

### ARM

ARM 是英国的一个公司，主要设计 ARM 系列的中央处理器(CPU)。

ARM 系列处理器是 32 位或 64 位处理器，是芯片，不是软件，是很流行的芯片。

三星，苹果等很多公司都买 ARM 公司的授权，开发出自己特色的微控制器(MCU)。

### 树莓派

树莓派是一种电路板子。

它使用 ARM 微控制器芯片，和 linux 操作系统或 windows 操作系统，连接上显示器、键盘、网络(网口或 wifi)就可以组成是一个很小体积的桌面电脑。

### 单片机

单片机是指中央处理器内核加了一些外围接口电路，做到一个芯片中，也叫微控制器 MCU 或 SOC，单片机。

8051 芯片、avr 芯片、arm 芯片...都叫单片机、微控制器，而英特尔的 80x86 系列是中央处理器 CPU，不能叫单片机。

### 总结四种名词的比喻

- ARDUINO

  就好比一个汽车品牌 有高端车也有低端车。买来就能开，你能让车跑起来不代表你了解发动机是怎么工作的。

- ARM

  类似于一类汽油发动机，有性能好的有性能差的，但是总之他们都是烧汽油的。(arduino 的有些“车”也用这种发动机)

- 树莓派
  和 arduino 类似 它家的车用的是 ARM 的高端发动机
- 单片机
  好比动力输出装置。。有烧汽油的汽油机(ARM 的很多芯片也可以划在单片机里)，也有很多用蒸汽的蒸汽机(比如最常见的 mega.8051 等等)，还有很多还不如蒸汽机的(比如 8031..)

## 软件开发准备

选择对应的开发板 ： 【UNO】

选择对应的端口： 例如【COM3】

编写程序，上传至 UNO 板

## 入门介绍

### arduino 版 IO 口

> 参考：https://zhuanlan.zhihu.com/p/51756186

![1](//img.callbackhell.xyz/vuepress/arduino/1.png)

### 1.VCC 和 GND

要让 Arduino 实现各种功能，只有一个主控板是不够的，还要连接其他电子元件。**大多数情况下，Arduino 将作为电源向这些元件供电**，如同电池有正负极，Arduino 的正负极就是 VCC 和 GND。

GND 即上图中的地，也就是电线接地，具体为什么叫接地大家可以参考我下面给出的维基百科（需科学上网）或百度百科，我们简单理解成负极就可以了。**注意，电路中所有元件的 GND 要连接在一起，简称共地。**

**Arduino Uno 有 3 个 GND 接口。**

### 2.I/O 接口

在 Arduino 的电子电路中，Arduino 就如同大脑负责运行程序处理信息，大多数时候信息需要经由输入设备（如传感器、键鼠）来获取，然后 Arduino 再将信息处理完成后传递给输出设备从而完成某些功能（如电机、灯泡、显示器）。

Arduino 信息与其他设备信息交流就通过 I/O 接口完成，即上图中的数字端口和模拟端口。

从输入设备接收数据称为输入（I 接口），把数据传递给输出设备称为输出（O 接口），数字端口和模拟端口都可以实现输入和输出，具体的区别我们在以后会聊。

## 其他元件

### 面包板

我们前面说了，几乎所有元件都有 GND 接口，但是 Arduino 只有 3 个 GND 接口，当使用元件很多的时候就不够用了；VCC 也有同样的问题，这个时候我们就需要使用面包板了。

![2](//img.callbackhell.xyz/vuepress/arduino/2.jpg)

我们观察上面的图示，上下四排插孔，每一排插孔由导线内部连接，中间每一列插孔也是内部连接（中间断开）。

比如我们把 Arduino 的 GND 用跳线连接到最上排的某个插孔中，那么整个一排都可以视作 GND。

## 软件开发

### 参数

- ### 模拟接口

  模拟接口用的是 10 位二进制空间来进行模数转换，它的范围就是 0 ～ 1023

- ### 调制模拟信号

  用的是 8 位二进制空间进行模拟，它的范围是 0 ～ 255

### 常用函数

> 语法参考：https://mc.dfrobot.com.cn/thread-10940-1-1.html
>
> 模拟输入输出参考：https://zhuanlan.zhihu.com/p/42173759

### void setup

初始化函数，只执行一次

### void Loop

供电期间无限循环执行的函数；

### void pinMode

配置引脚为输出或输出模式.

### analogRead

模拟输入电压
