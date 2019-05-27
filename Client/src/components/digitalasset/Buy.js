import React from 'react';
import { Route, Redirect } from 'react-router'


import DigitalAsset from '../../ethereum/DigitalAsset'
import web3 from '../../ethereum/web3';
import axios from 'axios';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    // marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  Button: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Buy extends React.Component {

  state = {
    AssetPrice: 0,
    AccessPrice: 0,
    BuyMessage: '',
    AccessMessage: ''
  };

  async componentDidMount() {
    const address = this.props.address;

    // 实例化合约,获取当前账号
    const contract = DigitalAsset(address);

    // 拿到summary
    const summary = await contract.methods.getSummary().call();

    this.setState({
      AssetPrice: summary[3],
      AccessPrice: summary[4],
      AssetName: summary[0],
      download: false
    })
  }

  BuyHandler = async () => {
    console.log("Buy submit");

    const contract = DigitalAsset(this.props.address);
    const accounts = await web3.eth.getAccounts();

    const BuyPrice = this.state.AssetPrice * this.state.share / 100;

    try {
      await contract.methods.ownershipTransaction(
        this.state.BuyUsage,
        this.state.seller,
        this.state.share
      ).send({
        from: accounts[0],
        value: BuyPrice
      })
    } catch (err) {
      console.log(err);
      this.setState({
        BuyMessage: err.message
      })
    }
  }

  AccessHandler = async () => {
    console.log("Access submit");

    const contract = DigitalAsset(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await contract.methods.accessTransaction(
        this.state.AccessUsage
      ).send({
        from: accounts[0],
        value: this.state.AccessPrice
      });

      // this.setState({
      //   download: true
      // })
      window.location.href = `http://localhost:5000/download/${this.state.AssetName}`;

    } catch (err) {
      console.log(err);
      this.setState({
        AccessMessage: err.message
      })
    }
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
        <Grid container spacing={24}>
          {/* <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid> */}
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              
              <Typography component="h1" variant="h5">
                购买股权
              </Typography>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel >用途</InputLabel>
                  <Input
                    onChange={(event) => {
                      this.setState({
                        BuyUsage: event.target.value
                      })
                    }}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel >卖家</InputLabel>
                  <Input
                    onChange={(event) => {
                      this.setState({
                        seller: event.target.value
                      })
                    }}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel >股份</InputLabel>
                  <Input
                    onChange={(event) => {
                      this.setState({
                        share: parseInt(event.target.value, 10)
                      })
                    }}
                  />
                </FormControl>

                <p>
                  {this.state.BuyMessage}
                </p>

                <Button
                  onClick={this.BuyHandler}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  交易确认
                </Button>
              
            </Paper>
          </Grid>



          <Grid item xs={6}>
            <Paper className={classes.paper}>
            

              <Typography component="h1" variant="h5">
                购买使用权
              </Typography>

              <FormControl margin="normal" required fullWidth>
                <InputLabel >资产用途</InputLabel>
                <Input
                  onChange={(event) => {
                    this.setState({
                      AccessUsage: event.target.value
                    })
                  }}
                />
              </FormControl>

              <p>
                {this.state.AccessMessage}
              </p>

              <Button
                onClick={this.AccessHandler}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                交易确认
            </Button>
            
            </Paper>
          </Grid>
        </Grid>

      </div>
    )
  }
}
Buy.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Buy);
// export default Buy;