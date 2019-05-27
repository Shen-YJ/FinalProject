pragma solidity ~0.4.25;

// 工厂合约，预先部署该合约，并通过调用函数createDigitalAsset来创建模板资产合约
contract DigitalAssetFactory{
    address[] public deployedDigitalAssets;
    struct Asset{
      address AssetAddress;
      string name;
      string AssetType;
      uint price;
      string Description;
    }

    Asset[] public Assets; 


    event _createDigitalAsset(bool status, address DigitalAssetAdress);
    // 记住输入地址数组每个地址要加双引号!
    function createDigitalAsset(
        string initialName,
        string initialID, 
        string initialType, 
        uint initialPrice,
        uint initialAccessPrice, 
        address[] initialOwnerAddress,
        uint[] initialShare,
        string initialDescription
        ) public{
        address newDigitalAsset = new DigitalAsset(
          initialName,
          initialID, 
          initialType, 
          initialPrice,
          initialAccessPrice, 
          initialOwnerAddress, 
          initialShare,
          initialDescription
        );

        Asset memory newAsset = Asset({
          AssetAddress: newDigitalAsset,
          name: initialName,
          AssetType: initialType,
          price:initialPrice,
          Description:initialDescription
      });
        Assets.push(newAsset);

        deployedDigitalAssets.push(newDigitalAsset);

        emit _createDigitalAsset(true, newDigitalAsset);
    }
    
    function getDeployedDigitalAssets() public view returns(address[]){
        return deployedDigitalAssets;
    }

}

// 模板合约
contract DigitalAsset {
    // 定义单笔交易记录
    struct Transaction{
      string transactionType; //交易类型
      string usage;// 资产用途
      uint transactionPrice; // 交易价格
      uint transactionShare; // 交易的股权份额
      address buyer;// 交易买家
      address seller;// 交易卖家
      uint transactionTime;// 交易时间，unix时间戳
      string status;// 交易状态
    }

    // 交易记录数组，用于存放所有交易记录
    Transaction[] public transactions;

    // 资产初始信息
    string public AssetName;
    string public AssetID;
    string public AssetType;
    uint public AssetPrice;// 资产总售价
    uint public AccessPrice;//资产使用价格
    uint public creationTime;
    string public Description;

    // 资产所有人，以及各自持有的股份
    address[] public OwnerAddress;
    mapping(address => uint) public OwnerShare;

    // 资产使用权所有者
    address[] public accessUser;



    address Buyer = 0; // 初始化买家
    address Seller = 0; // 初始化卖家

    // destroy the digital asset. hint: the transaction data will ramianed on blockchain
    // function destroy() public  {
    //   selfdestruct(AssetOwner);
    // }

    // 资产合约初始化函数
    constructor (
      string initialName, // 资产名称
      string initialID, // 注册编号
      string initialType, // 类型
      uint initialPrice, // 资产总价值
      uint initialAccessPrice, // 访问授权价格
      address[] initialOwnerAddress, // 资产所有者
      uint[] initialShare,// 每个所有者对应所持有股份
      string initialDescription // 描述信息
      ) public {
      // 将传递的所有参数写入合约存储变量中
      AssetName = initialName;
      AssetID = initialID;
      AssetType = initialType;
      AssetPrice = initialPrice;
      AccessPrice = initialAccessPrice;
      creationTime = now;
      OwnerAddress = initialOwnerAddress;
      Description = initialDescription;
      // 使用map结构（类似于哈希表），将所有者地址与所持股份相对应
      for (uint i=0; i<initialOwnerAddress.length; i++) {
        OwnerShare[initialOwnerAddress[i]] = initialShare[i];
      }
    }


    // 获取资产信息
    function getSummary() public view returns(string,string,string,uint,uint,uint,address[],address[]){
        return(
          AssetName,
          AssetID,
          AssetType,
          AssetPrice,
          AccessPrice,
          creationTime,
          OwnerAddress,
          accessUser
          // OwnerShare should be obtained after getSummary
        );
    }


    // 资产交易
    event _ownershipTransaction(bool status, address buyer, address seller, uint sharePrice, uint share, string AssetID);
    function ownershipTransaction(string usage, address seller, uint share) public payable{
      require(OwnerShare[seller] >= share); // 确保卖家股份大于等于买家购买股份
      require(seller != msg.sender); // 禁止
      uint sharePrice = (AssetPrice*share)/100; // 确定该股份售价
      require(msg.value == sharePrice); // 确定金额正确

      // 确定当前资产无待定交易
      require(Buyer == 0);
      require(Seller == 0);

      // 记录交易信息
      Transaction memory newTransaction = Transaction({
        transactionType: "OwnershipShare Transfer",
        usage: usage,
        transactionPrice: sharePrice,
        transactionShare: share,
        buyer: msg.sender,
        seller: seller,
        transactionTime: now, //stored in unix Epoch, but can be converted to readabel time in javascript latter
        status: "Pending"
      });

      // 设定买家和卖家
      Buyer = msg.sender;
      Seller = seller;
      transactions.push(newTransaction);// 添加交易到数组中
      emit _ownershipTransaction(true, Buyer, Seller, sharePrice, share, AssetID);
    }

    // 确认交易
    event _checkTransaction(bool status, uint price);
    function checkTransaction() public {
      require(Buyer != 0); // 要求当前存在待定交易
      require(msg.sender == Seller);// 要求该函数调用者为股权卖家
      
      Seller.transfer(transactions[transactions.length-1].transactionPrice); // 向卖家转账
      OwnerShare[Buyer] = OwnerShare[Buyer] + transactions[transactions.length-1].transactionShare; // 买家获得所售的股份
      OwnerShare[Seller] = OwnerShare[Seller] - transactions[transactions.length-1].transactionShare; // 卖家减去所售股份

      // 将买家加入股东数组中
      OwnerAddress.push(Buyer);
      Buyer = 0; // 清空当前买家
      Seller = 0; // 清空当前卖家

      transactions[transactions.length-1].status = "Success"; // 修改交易状态为成功

      emit _checkTransaction(true, transactions[transactions.length-1].transactionPrice);
    }

    // 取消交易
    event _cancelTransaction(bool status, uint price);
    function cancelTransaction() public {
      require(Buyer != 0);// 要求当前存在待定交易
      require(msg.sender == Seller);// 要求函数调用者为当前交易卖家

      Buyer.transfer(transactions[transactions.length-1].transactionPrice); // 将钱退回买家

      transactions[transactions.length-1].status = "Cancelled"; // 修改交易状态为取消

      Buyer = 0; // 清除交易双方地址信息
      Seller = 0; 

      emit _cancelTransaction(true, transactions[transactions.length-1].transactionPrice);
    }


    // 使用权授权交易
    event _accessTransaction(bool status, uint price);
    function accessTransaction(string usage) public payable{
      require(msg.value == AccessPrice);// 要求支付的金额与使用价格相等

      // 记录交易信息
      Transaction memory newTransaction = Transaction({
        transactionType: "Access Authorization",
        usage: usage,
        transactionPrice: AccessPrice,
        transactionShare: 0,
        buyer: msg.sender,
        seller: address(this),
        transactionTime: now, 
        status: "Success" // 交易状态为成功
      });

      transactions.push(newTransaction);
      accessUser.push(msg.sender);
      emit _accessTransaction(true, AccessPrice);
    }

    // 分配资产利润
    event _takeOutMoney(bool status);
    function takeOutMoney() public {
      // require(msg.sender == )
      uint total = address(this).balance; // 该合约利润总额

      // 根据各股东对应资产股权份额，转让对应利润
      for(uint i = 0; i<OwnerAddress.length; i++){
        address currentOwner = OwnerAddress[i];
        uint share = OwnerShare[currentOwner];
        currentOwner.transfer(total*share/100);
      }
      emit _takeOutMoney(true);
    }

    // 获取交易的数量，为后续获取所有交易数据做准备
    function getTransactionsCount() public view returns(uint){
      return transactions.length; // 返回到前端是string
    }
}

