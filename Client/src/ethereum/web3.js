import Web3 from 'web3'; //引入web3模块

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // 如果当前浏览器安装有Metamask,将会在window对象中添加web对象，通过这个web3对象的Provider可以进行账户交易操作
    web3 = new Web3(window.web3.currentProvider);
    console.log("Metamask installed!");
    
} else {
    // 当前浏览器未安装Metamask，需要连接其他节点提供的API作为Provider，这种方式只能读取合约数据，而无法进行任何交易。
    const provider = new Web3(new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/c41969c6ec9c4f719a4b87bec30f28ed'
    ));
    
    web3 = new Web3(provider);
    console.log("You have not install MeataMask!");
}

export default web3;

// 'https://rinkeby.infura.io/v3/15cddac9c13945ddacad93d708c672b5'