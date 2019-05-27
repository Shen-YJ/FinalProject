import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import DigitalAsset from '../../ethereum/DigitalAsset';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from 'semantic-ui-react';

// import { Button, Table } from 'semantic-ui-react';
// import RequestRow from './TransactionsRow';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    padding: 10,

  },
  body: {
    fontSize: 14,
    padding: 10,

  },
}))(TableCell);

const styles = theme => ({
  root: {
    // width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    // Width: 500,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  Button: {
    marginTop: 50
  }
});



class Transactions extends React.Component {

  state = {
    transactions: []
  }

  componentDidMount = async () => {
    const contract = DigitalAsset(this.props.address);

    const transactionsCount = await contract.methods.getTransactionsCount().call();

    // 智能合约的返回值全部是string?
    console.log(typeof(transactionsCount));
    


    const transactions = await Promise.all(
      Array(parseInt(transactionsCount)).fill().map((element, index) => {
        return contract.methods.transactions(index).call()
      })
    );

    console.log(transactions);
    

    this.setState({
      transactions: transactions
    })
  }

  checkHandler = async () => {
    const contract = DigitalAsset(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await contract.methods.checkTransaction()
        .send({
          from: accounts[0]
        })
    } catch (err) {
      console.log(err);
      this.setState({
        Message: err.message
      })
    }

  }

  cancelHandler = async () => {
    const contract = DigitalAsset(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await contract.methods.cancelTransaction()
        .send({
          from: accounts[0]
        })
    } catch (err) {
      console.log(err);
      this.setState({
        Message: err.message
      })
    }
  }

  takeOutMoney = async () => {
    const contract = DigitalAsset(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await contract.methods.takeOutMoney()
        .send({
          from: accounts[0]
        })
    } catch (err) {
      console.log(err);
      this.setState({
        Message: err.message
      })
    }
  }



  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Type</CustomTableCell>
                  <CustomTableCell align="left">Status</CustomTableCell>
                  <CustomTableCell align="left">Usage</CustomTableCell>
                  <CustomTableCell align="left">Price(ether)</CustomTableCell>
                  <CustomTableCell align="left">Share</CustomTableCell>
                  <CustomTableCell align="left">Buyer</CustomTableCell>
                  {/* <CustomTableCell align="left">Seller</CustomTableCell> */}
                  <CustomTableCell align="left">transactionTime</CustomTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {this.state.transactions.map((transaction, index) => (

                  <TableRow className={classes.row} key={index}>
                    <CustomTableCell component="th" scope="row">{transaction.transactionType}</CustomTableCell>
                    <CustomTableCell align="left">{transaction.status}</CustomTableCell>
                    <CustomTableCell align="left">{transaction.usage}</CustomTableCell>

                    <CustomTableCell align="left">{web3.utils.fromWei(transaction.transactionPrice, 'ether')}</CustomTableCell>
                    <CustomTableCell align="left">{transaction.transactionShare}</CustomTableCell>
                    <CustomTableCell align="left">
                    from:<br/> 
                    {transaction.buyer} <br/>
                    to: <br/>
                    {transaction.seller}</CustomTableCell>
                    {/* <CustomTableCell align="left">{transaction.seller}</CustomTableCell> */}
                    <CustomTableCell align="left">{new Date(transaction.transactionTime * 1000).toLocaleString()}</CustomTableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>


      <div className={classes.Button}>
        <Button onClick={this.checkHandler}>确认待定交易</Button>
        <Button onClick={this.cancelHandler}>取消待定交易</Button>
        <Button onClick={this.takeOutMoney}>提取合约利润</Button>
      </div>

    </div>




    )
  }

}

Transactions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Transactions);




// import React from 'react'
// import { Header, Table, Rating } from 'semantic-ui-react'

// const TableExamplePadded = () => (
//   <Table celled padded>
//     <Table.Header>
//       <Table.Row>
//         <Table.HeaderCell singleLine>Evidence Rating</Table.HeaderCell>
//         <Table.HeaderCell>Effect</Table.HeaderCell>
//         <Table.HeaderCell>Efficacy</Table.HeaderCell>
//         <Table.HeaderCell>Consensus</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>

//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>
//         <Table.HeaderCell>Comments</Table.HeaderCell>

//       </Table.Row>
//     </Table.Header>

//     <Table.Body>
//       <Table.Row>
//         <Table.Cell>
//           <Header as='h2' textAlign='center'>
//             A
//           </Header>
//         </Table.Cell>
//         <Table.Cell singleLine>Power Output</Table.Cell>
//         <Table.Cell>
//           <Rating icon='star' defaultRating={3} maxRating={3} />
//           0x8E82466d5ddE6B24Baf6090F323988860E9181b7
//         </Table.Cell>
//         <Table.Cell textAlign='right'>
//           80% <br />
//           <a href='#'></a>
//         </Table.Cell>
//         <Table.Cell>
//           Creatine supplementation is the reference compound for increasing muscular creatine
//           levels; there is variability in this increase, however, with some nonresponders.
//         </Table.Cell>
//         <Table.Cell singleLine>Weight</Table.Cell>
//         <Table.Cell>scsc
//         </Table.Cell>
//         <Table.Cell singleLine>Weight</Table.Cell>
//         <Table.Cell>csc
//         </Table.Cell>
//         <Table.Cell singleLine>Weight</Table.Cell>
//         <Table.Cell>cscsc
//         </Table.Cell>
//         <Table.Cell singleLine>Weight</Table.Cell>
//       </Table.Row>


//       <Table.Row>
//         <Table.Cell>
//           <Header as='h2' textAlign='center'>
//             A
//           </Header>
//         </Table.Cell>
//         <Table.Cell singleLine>Weight</Table.Cell>
//         <Table.Cell>
//           <Rating icon='star' defaultRating={3} maxRating={3} />
//         </Table.Cell>
//         <Table.Cell textAlign='right'>
//           100% <br />
//           <a href='#'>65 studies</a>
//         </Table.Cell>
//         <Table.Cell>
//           Creatine is the reference compound for power improvement, with numbers from one
//           meta-analysis to assess potency
//         </Table.Cell>
//       </Table.Row>
//     </Table.Body>
//   </Table>
// )

// export default TableExamplePadded