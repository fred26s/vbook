## Aptos

## 团队

2019 年 6 月，Libra 白皮书问世，计划发行全球流通的超主权数字货币，但最终因监管扼制被迫放弃。随后，Libra 更名为 Diem，也迫于监管最终被META出售。

不过，一些 **Diem 项目的原成员**并没有就此放弃，他们在离开 Meta 后重组，将新事业寄托在 Aptos 上。

Aptos 团队中的 Alden Hu、Dahlia Malkhi 等开发和研究人员大部分都参与了 Diem、Novi （Meta的加密钱包项目）的开发。

有 Diem 的前篇故事，Aptos 在创立后迅速获得一些顶级资本关注。

> 今年 3 月 15 日，Aptos 完成了 2 亿美元战略融资，该轮融资由 a16z 领投，参投名单上还有 Tiger Global、FTX Ventures 和 Coinbase Ventures 这些加密业内知名的机构。
>
> 3 月底，Binance Labs 也宣布战略投资 Aptos 的开发团队 Aptos Labs，将与 Aptos 在开发、代码审查、基础设施建设和黑客马拉松方面进行合作







## 空投

- Aptos 官方在北京時間 10 月 19 日 6：50 公佈了空投方案

- 總共有 20,076,150 枚 APT 代幣將空投給 110,235 名參與者。

- 未防女巫攻擊，羊毛黨 / 科學家大勝，

  每個測試網申請的帳戶可以獲得 300 個代幣，鑄造 NFT 的用戶有 150 個代幣

- 币安上線後一根針瞬間拉到 100 美元後就直接回到 10 美元附近，隨後又一路下跌到 6 美元左右

  一筆 13 美元的掛單賣出達到 189,567 個 APT，獲利金額達到 246 萬美元直接將 APT 價格由 15 美元砸至 13 美元以下。









## 代币

根据2022-10-18官方披露的信息， Aptos 代币分配如下：

- 51.02% 将分配给社区

- 16.5% 分配给基金会

- 19% 分配给核心贡献者

- 13.48% 分配给投资

  其中，**投资者们的份额会锁定一年，在第 13 个月开始解锁，每个月解锁 3/48 的代币直到第 18 个月，自第 19 个月起，每月解锁 1/48 的代币**。



根据官方表示，**开盘将会有 1.3 亿枚代币进入流通**，也就是总量的 13%。其中，1.25 亿枚来自于社区份额，另外的 500 万枚来自于基金会份额。



![Aptos代币分配](http://img.callbackhell.xyz/vuepress/funs/Aptos%E4%BB%A3%E5%B8%81%E5%88%86%E9%85%8D.png)









### 质押

> 8 月 2 日，Raft Labs（@Raft_Move）在推文中提到，Aptos 在 Layer1 和 Move 语言的基础上，为 APT 设计了一个区别于其他 Layer1 的 Staking 机制，可能会为质押者带来高额的复合收益率。于是，**Raft Labs 将其比作 OlympusDAO。**

当前，APT 质押奖励的基础是 7%，基础奖励百分比会随着时间的推移而下降，每年下降 1.5%，直至 3.25% 。

Aptos 在质押模型的设计中参考了 OlympusDAO 的设计，每 epoch（1 小时）分配一次奖励，区**块奖励不固定，与质押者的代币锁定期成正比，锁仓时间越长，奖励越高。**





### 生态

Aptos 测试网已集结上百个应用。**生态的发展决定了一条 Layer1 代币的增长空间。**

纵览 Aptos生态 ，共有 215 个项目即将在 Aptos 生态部署。对于 Mova 语言的开发者而言，这并非难事，前人已经为 Aptos 生态开发者们明晰了项目部署路径。

因此，如今 Aptos 生态中即将上线的项目已经涵盖了 DeFi、基础设施、聚合器、游戏、发行平台、NFT、NFT 市场、工具、钱包，甚至是 Meme 等各赛道。







## 结论

**「短期看炒作，中期看叙事和预期，长期看生态和采用」。**





> 参考资料：
>
> [Aptos首发详解](https://news.marsbit.co/20221018114102604701.html)
>
> [解读Aptos代币经济学](https://www.binance.com/zh-CN/news/top/7240623)







### 

## Move 

> Move 是一种用于编写安全智能合约的编程语言，最初由 Facebook 开发，用于为 Libra 区块链提供支持。

Aptos爆火就是因为以 Move 编程语言为核心编写的高性能新公链。

Move是因为声称解决了solidity的安全性问题且降低开发门槛而出现在大众视野。



### 语言特性

- **纯静态语言**

  动态调用是 Solidity 的基石，所有的跨合约调用都要通过动态调用来实现，例如 DelegateCall，但是也是大部分安全漏洞的入口，例如 TheDAO 攻击、PolyNetwork 跨链攻击等等。

  鉴于 Solidity 的真实经验，Move 采用了完全纯静态的实现，更好的保障链上资产安全。

-  **形式化验证**

  形式化验证是 FV(formal verification) 是指使用数学工具分析设计可能行为的空间，而不是计算特定值的结果。也就是说，通过数学的手段证明程序的安全性。

  Move 自带形式化验证的工具，我们可以使用数学的手段来测试和证明合约的可靠性，这是 Solidity 不可比拟的优势。

-  **分散存储**

  Web3 时代，用户掌握数据是所有权。Solidity 是通过 Map 的形式，集中存储合约数据，在合约出现漏洞的时候，例如获取到了合约 Owner 权限，所有用户数据都将遭受攻击。

  Move 巧用 Resource，能够将数据分散的存储到每个用户自己的 Account 下，既保证了数据的安全，又真正的做到了数据的所有权归用户所有，合约的 Owner 没有修改数据的权限。

-  **面向泛型编程**

  出于安全的考虑，Move 设计成了纯静态语言， 但是灵活性并没有因此而减少，Move 通过面向泛型编程，保障了合约的扩展性，增加了代码的复用能力。

  
  

  









> 参考资料：
>
> [官方Aptos开发者文档](https://aptos.dev/)
>
> [为什么是 Move 之编程语言的生态构建](https://mirror.xyz/jolestar.eth/sQ0nMCO3eNig6gCzqQO7xew1mn8oUi1-rKtfZKmGlNI)
>
> [Move编程语言开发指南](https://move-book.com/cn/syntax-basics/concept.html)



## move开发

1. [安装 Aptos CLI](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli/)

   直接下载预编译文件

2. 安装开发依赖

   macOS 和 Ubuntu Linux可以通过 Aptos [`dev_setup.sh`](https://github.com/aptos-labs/aptos-core/blob/main/scripts/dev_setup.sh)Bash 脚本或手动安装所有依赖项来执行此操作

   windows系统的话，请手动安装这些软件包： 

   - [锈](https://www.rust-lang.org/tools/install)
   - [吉特](https://git-scm.com/download)
   - [制作](https://cmake.org/download/)
   - [LLVM](https://releases.llvm.org/)
   - 仅限 Linux - [libssl-dev](https://packages.ubuntu.com/bionic/libssl-dev)和[libclang-dev](https://packages.ubuntu.com/bionic/libclang-dev)
   - 仅限 Windows - [C++ 构建工具](https://visualstudio.microsoft.com/downloads/#microsoft-visual-c-redistributable-for-visual-studio-2022)

3. 安装rust，rustup

   [windows环境使用rustup安装](https://www.rust-lang.org/tools/install)

   - 点击rustup安装包
   - 命令行内按`1` 回车即可
   - 自动安装c++相关依赖

   当在`CMD`中执行`cargo --version`，看到版本信息打印时

4. 使用cargo安装 move-analyzer

   ``cargo install --git https://github.com/move-language/move move-analyzer`安装 语言服务器`

5. 





















