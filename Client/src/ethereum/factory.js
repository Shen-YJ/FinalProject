import web3 from './web3';// 引入web3实例
import DigitalAssetFactory from './build/DigitalAssetFactory.json'; //引入合约ABI
// 
// 调用Contract方法，传入工厂合约ABI以及已部署的合约地址
const instance = new web3.eth.Contract(
    JSON.parse(DigitalAssetFactory.interface),
    '0x25627d503efB5F6A75b7455edbD51B213AD33BDE'
);

console.log(instance);


export default instance;