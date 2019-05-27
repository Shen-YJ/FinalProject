import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import DigitalAsset from '../ethereum/DigitalAsset';


// Component
import Summary from './digitalasset/Summary';
import Transactions from './digitalasset/Transactions'
import Buy from './digitalasset/Buy';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class AssetDetail extends React.Component {

  state = {
    value: 0,
    summary: {}
  };

  async componentDidMount() {
    const { address } = this.props.match.params;
    console.log(address);

    let digitalasset = DigitalAsset(address);

    let summary = await digitalasset.methods.getSummary().call();

    this.setState({
      summary
    })

  }


  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="资产简介" />
            <Tab label="资产交易记录" />
            <Tab label="资产购买" />
          </Tabs>
        </AppBar>

        {value === 0 && 
        <TabContainer>
          <Summary address={this.props.match.params.address}/>
        </TabContainer>}

        {value === 1 && 
        <TabContainer>
          <Transactions address={this.props.match.params.address} />
        </TabContainer>}

        {value === 2 && 
        <TabContainer>
          <Buy address={this.props.match.params.address} />
        </TabContainer>}
      </div>
    );
  }
}

AssetDetail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssetDetail);