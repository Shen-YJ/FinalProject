const HDWalletProvider = require('truffle-hdwallet-provider');// Provider模块
const Web3 = require('web3'); // Web3模块
const compiledFactory = require('./build/DigitalAssetFactory.json');// 工厂合约二进制代码

// 创建Provider
const provider = new HDWalletProvider(
    'sense wrong cross promote rate elite account security aware okay raise replace',
    'https://rinkeby.infura.io/v3/c41969c6ec9c4f719a4b87bec30f28ed'
);

// 通过添加Provider，实例化Web对象
const web3 = new Web3(provider);

// 部署函数
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();// 获取部署账户

    console.log('attempting to deploy from account', accounts[0]);

    const result = await new web3.eth
        .Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '3000000' });

    console.log('contract deployed to', result.options.address);
};
deploy();