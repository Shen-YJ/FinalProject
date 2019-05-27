import React, { Component } from 'react';

import factory from '../ethereum/factory';

import axios from 'axios';


import { Card, Button } from 'semantic-ui-react';

// import Layout from '../components/Layout.js';

// import { Link } from '../routes';


class CampaignIndex extends Component {


  state = {
    data:[1,2],
    datas:[]
  }

  // factory.methods.getDeployedCampaigns().call()



  // componentDidMount(){
  //   axios.get('/web3/all')
  //     .then(res=>{
  //       this.setState({datas: res.data})
  //       console.log(res);
  //     })
  // }

  async componentDidMount(){
    const DigitalAssets = await factory.methods.getDeployedDigitalAssets().call()
      .then(res=>{
        this.setState({
          datas: res
        })
        console.log(res);
      })
  }


  render(){
    return(
      <div>
        <ul>
          {this.state.datas.map(address=>{
            console.log(address);
            
            return(
              <li>
                {address}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }


}


export default CampaignIndex;
