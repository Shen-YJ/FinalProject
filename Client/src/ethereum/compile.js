const path = require('path');// 引入路径模块
const solc = require('solc');// 引入编译器模块
const fs = require('fs-extra');// 引入文件读取模块
const buildPath = path.resolve(__dirname,'build');// 设置编译输出文件夹

fs.removeSync(buildPath);// 清除旧的编译数据

const contractPath = path.resolve(__dirname, 'contracts', 'DigitalAsset.sol');// 获取合约路径
const source = fs.readFileSync(contractPath,'utf8');// 读取合约数据
const output = solc.compile(source, 1).contracts;// 编译合约

console.log(typeof(output));

fs.ensureDirSync(buildPath);// 确定编译输出文件夹存在，如不存在创建该文件夹

// 合约内包含工厂合约以及资产合约，编译后将输出两份合约二进制代码
for (let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    );
    console.log(contract + "deployed success!");
}