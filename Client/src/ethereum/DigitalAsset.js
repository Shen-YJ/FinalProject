import web3 from './web3';
import DigitalAsset from './build/DigitalAsset';

// 定义创建合约实例的方法
const createContract = (address) => {
  return new web3.eth.Contract(
    JSON.parse(DigitalAsset.interface),
    address
  )
}

export default createContract;