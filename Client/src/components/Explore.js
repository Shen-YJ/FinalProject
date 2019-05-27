import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';



import factory from '../ethereum/factory';
import DigitalAsset from '../ethereum/DigitalAsset';
import web3 from 'web3';


// import Card from './modules/Card';


const styles = {
  card: {
    marginTop: 25,
    marginLeft: 10,
    minWidth: 250,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};


class Explore extends React.Component {

  state = {
    DigitalAssets: [],
    AssetName: '',
    AssetID: '',
    AssetType: '',
    AssetPriceWei: 0,
    creationTime: 0,
    AssetOwner: '',
    Assets: []
  }

  componentDidMount = async () => {
    const DigitalAssets = await factory.methods.getDeployedDigitalAssets().call();

    console.log(typeof (DigitalAssets));
    console.log(DigitalAssets);

    const Assets = await Promise.all(
      DigitalAssets.map((asset, index) => {
        return (
          factory.methods.Assets(index).call()
        )
      })
    )
    console.log(DigitalAssets);

    this.setState({
      DigitalAssets,
      Assets
    })


    // this.state.DigitalAssets.map(
    //   async (address) => {
    //     let digitalasset = DigitalAsset(address);
    //     let summary = await digitalasset.methods.getSummary().call();
    //     this.setState({
    //       address: summary
    //     });
    //     console.log(summary);

    //   })
  }


  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (

      <React.Fragment >
        <CssBaseline />
        <main>
          {/* Hero unit */}
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40}>
              {
                this.state.Assets.map((asset, index) => {
                  return (
                    <Grid item key={index} sm={6} md={4} lg={3}>
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {asset.AssetAddress}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            {asset.name}
                        </Typography>
                          <Typography className={classes.pos} color="textSecondary">
                            {asset.AssetType}
                          </Typography>
                          <Typography component="p">
                            资产总价： {web3.utils.fromWei(asset.price,'ether')} ether
                          </Typography>
                          <Typography component="p">
                            描述： {asset.Description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                          href={`/digitalasset/${asset.AssetAddress}`}
                          size="small">了解详情</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                }
                )}
            </Grid>
          </div>
        </main>
        {/* Footer */}
        {/* <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
      </footer> */}
        {/* End footer */}
      </React.Fragment >
    )
  }
}

Explore.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Explore);