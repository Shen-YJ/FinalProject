const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../build/DigitalAssetFactory.json');
const compiledDigitalAsset = require('../build/DigitalAsset.json');

let accounts;
let factory;
let DigitalAssetAddress;
let DigitalAsset;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '5000000' });

  await factory.methods.createDigitalAsset(
    '江山美如画.jpg',
    '6324',
    '图片',
    3000000000000000000,
    100000000000000000,
    [accounts[0],accounts[1]],
    [40,60],
    '一张非常酷炫的风景照'
    ).send({
    from: accounts[0],
    gas: '3000000'
  });

  [DigitalAssetAddress] = await factory.methods.getDeployedDigitalAssets().call();
  DigitalAsset = await new web3.eth.Contract(
    JSON.parse(compiledDigitalAsset.interface),
    DigitalAssetAddress
  );
});

describe('合约测试', () => {
  it('资产注册', () => {
    assert.ok(factory.options.address);
    assert.ok(DigitalAsset.options.address);
  });

  it('获取资产简介', async () => {
    const DigitalAssets = await factory.methods.getDeployedDigitalAssets().call();
    const Assets = await Promise.all(
      DigitalAssets.map((asset, index) => {
        return (
          factory.methods.Assets(index).call()
        )
      })
    );
    assert.equal(Assets[0].name, '江山美如画.jpg');
  });



  it('获取资产详情', async () => {
    const summary = await DigitalAsset.methods.getSummary().call();
    assert.equal(summary[1], '6324');
  });


  it('发起股权交易', async () => {
    const BuyPrice = (3000000000000000000/100)*30;

    await DigitalAsset.methods.ownershipTransaction(
      '买来好玩',
      accounts[0],
      30
    ).send({
      from: accounts[2],
      value: BuyPrice,
      gas: '3000000'
    })

    const transaction = await DigitalAsset.methods.transactions(0).call();
    assert.equal(transaction.status, 'Pending');
  });




  it('确认交易', async () => {
    const BuyPrice = (3000000000000000000/100)*30;
    await DigitalAsset.methods.ownershipTransaction(
      '买来好玩',
      accounts[0],
      30
    ).send({
      from: accounts[2],
      value: BuyPrice,
      gas: '3000000'
    })

    await DigitalAsset.methods.checkTransaction().send({
      from: accounts[0],
      gas: '3000000'
    })

    const transaction = await DigitalAsset.methods.transactions(0).call();
    assert.equal(transaction.status, 'Success');
  });

  it('取消交易', async () => {
    const BuyPrice = (3000000000000000000/100)*30;
    await DigitalAsset.methods.ownershipTransaction(
      '买来好玩',
      accounts[0],
      30
    ).send({
      from: accounts[2],
      value: BuyPrice,
      gas: '3000000'
    })

    await DigitalAsset.methods.cancelTransaction().send({
      from: accounts[0],
      gas: '3000000'
    })

    const transaction = await DigitalAsset.methods.transactions(0).call();
    assert.equal(transaction.status, 'Cancelled');
  });

  it('访问授权交易', async () => {
    const BuyPrice = 100000000000000000;
    await DigitalAsset.methods.accessTransaction(
      '用来好玩'
    ).send({
      from: accounts[3],
      value: BuyPrice,
      gas: '3000000'
    })

    const user = await DigitalAsset.methods.accessUser(0).call();
    assert(user, accounts[3]);
  });

  it('获取交易数据', async ()=>{
    const BuyPrice = 100000000000000000;
    await DigitalAsset.methods.accessTransaction(
      '用来好玩'
    ).send({
      from: accounts[3],
      value: BuyPrice,
      gas: '3000000'
    })

    const transaction = await DigitalAsset.methods.transactions(0).call();
    assert(transaction.status, 'Success');
  })
});
