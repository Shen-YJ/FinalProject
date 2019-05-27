pragma solidity ~0.4.25;

// 工厂合约，预先部署该合约，并通过调用函数createDigitalAsset来创建模板资产合约
contract DigitalAssetFactory{
    address[] public deployedDigitalAssets;

    event _createDigitalAsset(bool status, address DigitalAssetAdress);

    function createDigitalAsset( string initialName, string initialID, string initialType, uint initialPrice ) public{
        address newDigitalAsset = new DigitalAsset(initialName, initialID, initialType, initialPrice, msg.sender);
        deployedDigitalAssets.push(newDigitalAsset);

        emit _createDigitalAsset(true, newDigitalAsset);
    }
    
    function getDeployedDigitalAssets() public view returns(address[]){
        return deployedDigitalAssets;
    }

}

// 模板合约
contract DigitalAsset {

    // used to record the details of the transaction
    struct Transaction{
      // string transactionHash;
      string transactionType;
      string usage;
      uint priceEther;
      address buyer;
      address seller;
      uint transactionTime;
      string status;
    }

    // A transaction array used to store all transactions
    Transaction[] public transactions;
    string public AssetName;
    string public AssetID;
    string public AssetType;

    uint public AssetPriceWei;
    uint public AccessPrice;

    uint public creationTime;

    address public AssetOwner;

    // 真实身份信息
    string public realName; //姓名
    string public identification; //身份证等身份信息


    address Buyer = 0; // there is no 'undefined' in solidity, so use 0 as initial value



    // event 
    event _ownershipTransaction(bool _status, uint _price, string _ID);

    // modifier
    modifier restricted {
    require(msg.sender == AssetOwner);
    _;
    }

    // destroy the digital asset. hint: the transaction data will ramianed on blockchain
    function destroy() public restricted {
      selfdestruct(AssetOwner);
    }

    // contract initial constructor
    constructor (string initialName, string initialID, string initialType, uint initialPrice, address initialOwner) public {
      AssetName = initialName;
      AssetID = initialID;
      AssetType = initialType;
      AssetPriceWei = initialPrice;
      creationTime = block.timestamp;
      AssetOwner = initialOwner;
    }


    // 获取资产信息
    function getSummary() public view returns(string,string,string,uint,uint,address){
        return(
          AssetName,
          AssetID,
          AssetType,
          AssetPriceWei,
          creationTime,
          AssetOwner
        );
    }


    // 资产交易
    function ownershipTransaction(string usage) public payable{

      require(msg.value == AssetPriceWei);
      require(Buyer == 0);

      // 记录交易信息
      Transaction memory newTransaction = Transaction({
        // transactionHash: '',
        transactionType: "Ownership Transfer",
        usage: usage,
        priceEther: AssetPriceWei,
        buyer: msg.sender,
        seller: AssetOwner,
        transactionTime: block.timestamp,//stored in unix Epoch, but can be converted to readabel time in javascript latter
        status: "Pending"
      });

      Buyer = msg.sender;
      transactions.push(newTransaction);
      emit _ownershipTransaction(true, AssetPriceWei, AssetID);
    }

    // 确认交易
    function checkTransaction() public restricted{
      require(Buyer != 0);
      AssetOwner.transfer(address(this).balance); //transfer the balance to the asset owner
      AssetOwner = Buyer; // change the buyer to the asset owner
      Buyer = 0; // reset buyer
      transactions[transactions.length-1].status = "Success";
    }

    // 取消交易
    function cancelTransaction() public restricted{
      require(Buyer != 0);
      Buyer.transfer(address(this).balance);

      transactions[transactions.length-1].status = "Canceled";
      Buyer = 0;
    }


    function accessTransaction(string usage) public payable {
      require(msg.value == AccessPrice);
      // require(Buyer == 0);
      // 记录交易信息
      Transaction memory newTransaction = Transaction({
        // transactionHash: '',
        transactionType: "Access Authorization",
        usage: usage,
        priceEther: AccessPrice,
        buyer: msg.sender,
        seller: AssetOwner,
        transactionTime: block.timestamp,//stored in unix Epoch, but can be converted to readabel time in javascript latter
        status: "Success"
      });

      Buyer = msg.sender;
      transactions.push(newTransaction);
      // emit _ownershipTransaction(true, AssetPriceWei, AssetID);
    }



    // 获取交易的数量，为后续获取所有交易数据做准备
    function getTransactionsCount() public view returns(uint){
      return transactions.length;
    }

    // 修改资产价格
    function changePrice(uint setPrice) public restricted{
        AssetPriceWei = setPrice;
    }





}

