# 使用说明文档

## 使用说明

1. 安装Chrome浏览器
2. 安装NodeJS

### 浏览资产详情

1. 解压文档
2. 打开Powershell, 并cd到解压的当前文件夹
   1. cd client
   2. npm start //运行前端页面,浏览器中输入"loaclhost:3000"打开页面
   3. cd ../Server
   4. node index.js //打开后端接口，处理文件上传
3. 页面中点击发现,可浏览我预先注册的两个数字资产,并可查看详情信息。
4. 如需进行资产相关操作，需要安装浏览器钱包

### 进行资产注册交易操作

1. 安装MetaMask浏览器钱包
   - 可以科学上网的情况下进入Chrome扩展程序页面搜索"MetaMask"进行安装,否则按以下步骤
   - 点击下载链接[Github下载地址](https://github.com/MetaMask/metamask-extension/releases/download/v6.5.3/metamask-chrome-6.5.3.zip),并解压。
   - Chrome浏览器中输入"chrome://extensions", 右上角打开开发者模式。
   - 点击"加载已解压的扩展程序", 选择刚解压出的文件夹。
   - 安装完毕
2. 导入测试钱包
   - 选择Import Wallet
   - 在钱包助记词中添入"sense wrong cross promote rate elite account security aware okay raise replace",这是我自己的测试钱包.
   - 自己设置一个8位数密码,为方便可输入12345678
   - 进入钱包页面, 右上角选择以太坊网络,从默认的"以太坊主网络"切换到"Rinkeby测试网络"
   - 发现钱包显示有15.6ETH余额时表示账户导入成功
   - 点击三次Create Account, 新添加的三个账户都有余额
3. 资产注册
   1. 操作前先点开MetaMask插件页面,确保当前为Rinkeby Test Network
   2. 点击创建资产
   3. 选择文件,并点击上传文件,显示上传成功
   4. 填入相关资产信息,注册人填写当前钱包账户的地址,可在MetaMask中查看复制,股份填入100
   5. 确认注册,MetaMask会弹出交易界面,如无报错点击Confirm,等待20秒,如成功页面将自动跳转到该资产详解界面。
   6. 其他相关操作可自行摸索。