## BTC

### 单位

比特币最小单位Satoshi 聪，1聪=0.00000001比特币，1Satoshi = 0.00000001 BTC。 



## ETH

### ERC20标准

ERC20 Token

ERC20和代币一同出现， ERC20是以太坊定义的一个[代币标准](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md)是一种发行代币合约必须要遵守的协议，该协议规定了几个参数\*\*——发行货币的名称，简称，发行量，要支持的函数等，只有支持了该协议才会被以太坊所认同。

erc20标准代码如下

```html
// https://github.com/ethereum/EIPs/issues/20

  contract ERC20 {
      function totalSupply() constant returns (uint totalSupply);
      function balanceOf(address _owner) constant returns (uint balance);
      function transfer(address _to, uint _value) returns (bool success);
      function transferFrom(address _from, address _to, uint _value) returns (bool success);
      function approve(address _spender, uint _value) returns (bool success);
      function allowance(address _owner, address _spender) constant returns (uint remaining);
      event Transfer(address indexed _from, address indexed _to, uint _value);
      event Approval(address indexed _owner, address indexed _spender, uint _value);
    }
```

> totalSupply: 代表的是代币发行总量  totalSupply():该方法可以返回代币的总数量
>
> name: 发行代币的名称            dicimals: 发行代币以后，代币交易的最小单位
>
> balanceOf(): 该方法返回的是输入钱包地址后，该钱包的代币余额
>
> tansferFrom() :从一个地址向另一个地址发送余额
>
> approve(): 允许_spender从你的账户转出_value余额
>
> allowance(): 允许_spender从你的账户转出_value的余额，调用多次会覆盖可用量。某些DEX功能需要此功能
>
> event Transfer():  token转移完成后出发
>
> event Approval():  approve(address _spender, uint256 _value)调用后触发



### 主网与测试网

首先需要了解ETH网络概念；

以太坊存在测试网络，

- 主网好比我们做传统互联网项目开发的prd环境.

  绝大多数人在使用的网络被称为**主网络(Mainnet)**，用户在其上交易、构建智能合约，矿工在其上挖矿。由于使用的人数众多，主网络的鲁棒性很强，能够对抗攻击，区块链也不易被篡改，因此主网络是具有功能的，其上的以太币是有价值的。

- 而以太坊的测试网络好比dev环境. 

  *测试网的重要用途:*在无需真金白银的情况下,部署合约,玩转测试网下的dapp. 当前以太坊测试网,有:kovan, ropsten,rinkeby.

  以太坊也可以搭建私有的测试网络，不过由于以太坊是一个去中心化的平台，需要较多节点共同运作才能得到理想的测试效果，因此并不推荐自行搭建测试网络。

> 引用文档介绍：
>
> [测试网区别](https://ethluz.github.io/blog/eth/eth-use-all-test-network/)
>
> [ETH测试网详解](https://zhuanlan.zhihu.com/p/29010231)





### 智能合约

举个例子，来明白什么是ETH智能合约；

比特币存在一些问题，也是所有第一代区块链都存在的问题。**他们只允许货币交易，没有办法为这些交易添加条件。**

Alice可以发送Bob 5 BTC，但她不能对这些交易施加条件。例如。她不能告诉鲍勃，只有当他执行某些任务时他才能拿到钱。

这些条件将需要非常复杂的脚本，需要一种“东西”使流程更加无缝。...这个“东西”是就是以太坊的**智能合约**。



开发智能合约IDE

[Remix Solidity IDE 快速入门](https://blog.51cto.com/zero01/2366173)

以太坊的开发remix下运行环境的三种选项

常见我们使用Injected Web3环境结合MetaMask浏览器插件即可使用；

> - ### JavaScript VM:
>
>   这是Remix自己的内部沙箱。 **它不连接到MainNet，TestNet或任何专用网络**。这是一个内存中的区块链，可用于简单测试和快速挖掘。
>
> - ### Injected Web3:
>
>   这是用于浏览器插件（MetaMask）的选项。在这里，您要告诉Remix将对区块链集成的所有控制权交给MetaMask插件。
>
>   此时，MetaMask控制您要连接到的网络。 
>
>   在该插件中，您可以通过Infura的节点网络连接到MainNet，Ropsten，Rinkeby等。在这种情况下，您不是在本地运行节点。 MetaMask还具有localhost选项，您可以在其中本地运行自己的节点，MetaMask将向其发送所有事务（此本地网络可以是使用任何节点客户端的专用网络，也可以使用TestRPC等测试区块链）。
>
> - ### Web3 Provider:
>
>   **这允许您在Remix中输入URL以连接到区块链。**此处最常见的设置是运行本地节点并通过其IP /端口连接到本地节点。 **这与使用MetaMask的localhost选项几乎相同，但是您只是要使插件不再是中间人。**就像选项＃2一样，您连接的网络取决于您配置本地计算机的方式。节点（可以是主节点，测试节点，私有节点等）。

### 以太坊GAS

gas翻译成中文就是天然气的意思，见名知意；

Gas是一个单位，用于测量执行某些操作所需的计算量。gas度量的最小单位是wei，所以，如果我们在操作过程中花费1个gas单位，我们称它为1 wei。

以太坊虚拟机（EVM）中运行的所有智能合约都使用 solidity进行编码（以太坊计划未来将从Solidity转移到Viper。）每一行代码都需要一定量的gas来计算，就好比汽车要用汽油。

所以，Gas机制的存在，就是为了**激励**；

像任何工作对等系统一样，以太坊严重依赖矿工的哈希效率：更多的矿工，更多的哈希效率，更安全和快速的系统。

所以，gas和以太币不是一回事，就如燃料（gas）和费用（fee）不是同一回事一般。

gas是需要的计算能力的数量，而以太币是价格，也就是人们必须为这种gas支付的费用。

> [GAS详解](https://zhuanlan.zhihu.com/p/34960267)



### DeFi

DeFi是**Decentralized Finance（去中心化金融）**的缩写，也被称做Open Finance。它实际是指用来构建开放式金融系统的去中心化协议，旨在让世界上任何一个人都可以随时随地进行金融活动。

在现有的金融系统中，金融服务主要由中央系统控制和调节，无论是最基本的存取转账、还是贷款或衍生品交易。DeFi则希望通过分布式开源协议建立一套具有透明度、可访问性和包容性的点对点金融系统，将信任风险最小化，让参与者更轻松便捷地获得融资。

相比传统的中心化金融系统，这些DeFi平台具有三大优势：

a. 有资产管理需求的个人无需信任任何中介机构新的信任在机器和代码上重建；

b. 任何人都有访问权限，没人有中央控制权；

c. 所有协议都是开源的，因此任何人都可以在协议上合作构建新的金融产品，并在网络效应下加速金融创新。



### 流动性挖矿

流动性挖矿是一种通过质押您的加密货币，来获取更多加密货币的方法。

它是通过计算机程序将您的资金质押给别人，这种计算机程序就是所谓的智能合约；

[流动性挖矿详解](https://academy.binance.com/zh/articles/what-is-yield-farming-in-decentralized-finance-defi)



### DAI币

> Dai是一种稳定币(stablecoin)。稳定币的概念非常简单– 和比特币和以太币一样是区块链上的一种Token。
>
> *关于稳定币，有usdt、maker和basecoin，其中三个的机制各不相同，usdt锚定美元，maker用以太抵押，basecoin完全通过去中心化的智能合约控制价格。三个代表都在实践自己的模型*
>
> 但和比特币或以太币不一样的是，Dai没有波动性。“有什么东西没有波动性的？波动性是相对的！”嗯。Dai是与美元挂钩的相对稳定的资产。所以，总而言之，1Dai 等于 1 USD。Dai将成为第一个消费级稳定币。

Maker智能合约的核心是CDP。我们用一个类比来描述。例如你在银行要求用房屋净值来抵押贷款。你把你的房子当作抵押品，他们给你发放现金贷款。如果你的房子市值下降，他们会要求你偿还贷款。

如果你不能偿还贷款，他们会拿你的房子拍卖。为了让这件事回到Maker身上，只需用ether代替你的房子，用智能合约代替银行，并以Dai代替贷款。当您把ether（抵押品）交给Maker的CDP智能合约（银行）时，系统向你发放Dai（贷款）。如果您的ether币值低于某个值时，您必须像偿还银行贷款一样偿还智能合约Dai，否则它会将您的ether将被拍卖。

总之，CDP只是Maker系统中存放抵押品（ether）的地方。

> [DAI详解](https://zhuanlan.zhihu.com/p/35416373)
>
> [DAI的用途场景](https://ethfans.org/posts/top-10-use-cases-and-benefits-of-the-dai-stablecoin)





### 空气币上交易所

> [造币指南](https://www.physixfan.com/xiangxituwenjiaochengruhe10fenzhongchengweishijieshoufu/)
>
> [制作ETH代币](https://blog.csdn.net/JAVA_HHHH/article/details/79771752)
>
> 如何制作空气币，这里有详解介绍；只要5分钟，ERC20代币就是这么简单！