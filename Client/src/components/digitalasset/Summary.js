import React, { Component } from 'react';
import { Card, Grid, Button, GridRow } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import DigitalAsset from '../../ethereum/DigitalAsset';

class Summary extends Component {

  state = ({
    summary: {},
    Message: '',
    OwnerAddress: [],
    accessUser: []
  })

  async componentDidMount() {
    const address = this.props.address;
    console.log("Asset Adress: " + address);

    // 实例化合约
    const contract = DigitalAsset(address);
    // const accounts = await web3.eth.getAccounts();

    // 拿到summary
    const summary = await contract.methods.getSummary().call();

    // 拿到 Description
    const Description = await contract.methods.Description().call()

    // 拿到各地址对应股权数
    const OwnerShare = await Promise.all(
      summary[6].map((address, index) => {
        return contract.methods.OwnerShare(address).call()
      })
    );

    console.log("Get summary: ");
    console.log(summary);
    console.log(OwnerShare);


    // unix时间戳转换为本地时间显示
    let creationTime = new Date(summary[5] * 1000);
    creationTime = creationTime.toLocaleString();

    console.log(creationTime);

    this.setState({
      AssetName: summary[0],
      AssetID: summary[1],
      AssetType: summary[2],
      AssetPrice: web3.utils.fromWei(summary[3].toString(10), "ether"),
      AccessPrice: web3.utils.fromWei(summary[4].toString(10), "ether"),
      creationTime: creationTime,
      OwnerAddress: summary[6],
      OwnerShare: OwnerShare,
      accessUser: summary[7],
      Description: Description
      // AssetOwner: summary[5]
    })
  }

  // renderCards() {
  //   const owner = this.state.OwnerAddress.map((address, index) => {
  //     return `账户地址：${address}所持股份：${this.state.OwnerShare[index]}`;
  //   })
  //   const items = [
  //     {
  //       header: "名称",
  //       meta: '',
  //       description: this.state.AssetName,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },
  //     {
  //       header: "编号",
  //       meta: '',
  //       description: this.state.AssetID
  //     },
  //     {
  //       header: "类型",
  //       meta: '',
  //       description: this.state.AssetType
  //     },

  //     {
  //       header: "注册时间",
  //       meta: '',
  //       description: this.state.creationTime,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },

  //     {
  //       header: "资产价格(Ether)",
  //       meta: '',
  //       description: this.state.AssetPrice,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },
  //     {
  //       header: "使用价格(Ether)",
  //       meta: '',
  //       description: this.state.AccessPrice,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },
  //     {
  //       header: "所有者",
  //       meta: '',
  //       description: owner.map((add) => {
  //         return (`${add}`)
  //       }),
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },
  //     {
  //       header: "授权使用者",
  //       meta: '',
  //       description: this.state.accessUser,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     },


  //     {
  //       header: "资产描述",
  //       meta: '',
  //       description: this.state.Description,
  //       style: {
  //         overflowWrap: 'break-word'
  //       }
  //     }
  //   ];

  //   return <Card.Group items={items} />
  // }




  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group>
              <Card>
                <Card.Content>
                  <Card.Header>名称</Card.Header>
                  <Card.Description>{this.state.AssetName}</Card.Description>
                </Card.Content>
              </Card>

              <Card>
                <Card.Content>
                  <Card.Header content='编号' />
                  <Card.Description content={this.state.AssetID} />
                </Card.Content>
              </Card>

              <Card>
                <Card.Content
                  header='类型'
                  description={this.state.AssetType}
                />
              </Card>

              <Card
                header='注册时间'
                description={this.state.creationTime}
              />

              <Card
                header='资产价格(Ether)'
                description={this.state.AssetPrice}
              />

              <Card
                header='使用价格(Ether)'
                description={this.state.AccessPrice}
              />

            </Card.Group>
            <Card
                header='资产描述'
                description={this.state.Description}
              />

          </Grid.Column>

          <Grid.Column width={6}>
            <Card.Group>
              {this.state.OwnerAddress.map((address, index) => {
                return (
                  <Card
                    header='股东信息'
                    description={`账户地址：${address}所持股份：${this.state.OwnerShare[index]}`}
                  />
                )
              }
              )}

              {this.state.accessUser.map((address, index) => {
                return (
                  <Card
                    header='授权使用者'
                    description={`账户地址：${address} `}
                  />
                )
              }
              )}
              
            </Card.Group>
          </Grid.Column>

          {/* <Grid.Column width={6}>
            <Grid.Row>
              <Button>
                <a href={`http://localhost:5000/download/${this.state.AssetName}`}>
                下载该资产文件
                </a>
              </Button>
            </Grid.Row>

          </Grid.Column> */}

        </Grid.Row>
      </Grid>
    )
  }
}

export default Summary;