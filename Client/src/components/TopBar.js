import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';




const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class ButtonAppBar extends React.Component {

  renderContent() {
    switch (this.props.auth) {
      case null:
        return (
          <h4>登陆中...</h4>
        );
      case false:
        return (
            <Button href="/signin" variant="outlined" color="inherit">
              登录
             </Button>
        );
      default:
        console.log(this.props.auth);
        return (
          <a href="/api/logout"
            style={{ textDecoration: 'none', color: 'white' }}>
            <Button variant="outlined" color="inherit">
              注销 {this.props.auth.username}
            </Button>
          </a>
        )
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton 
            href="/"
            className={classes.menuButton} color="inherit" aria-label="Menu">
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Button href="/explore" color="inherit">
                发现
              </Button>
              <Button href="/newAsset" color="inherit">
                创建资产
              </Button>
            </Typography>

            {/* {this.renderContent()} */}

            {/* <Button color="inherit">Login</Button> */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { auth: state.auth }
}



const BarwithStyles = withStyles(styles)(ButtonAppBar);

export default connect(mapStateToProps)(BarwithStyles);