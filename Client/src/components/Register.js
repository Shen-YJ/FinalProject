import React from 'react';
import { connect } from 'react-redux';

import { Form, Message } from 'semantic-ui-react'

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import FilledInput from '@material-ui/core/FilledInput';
// import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';



import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    paddingTop: theme.spacing.unit * 6 ,    
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  a: {
    // marginTop: '40px',
  }
});

class SignIn extends React.Component {


  state = {
    emailAddress: '',
    passport: '',
    passportEnsure: '',
    errorMessage: '',
    error: false,
    success: '',
  }

  submitHandler = (event) => {
    event.preventDefault();
    console.log(this.state.passport);

    if (this.state.passport != this.state.passportEnsure) {
      this.setState({
        error: true,
        errorMessage: "请确认密码是否一致！",
      })
      console.log(this.state);
    } else {
      this.setState({
        error: false,
        errorMessage: "",
      })
    }
  }

  render() {

    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>

          <Avatar className={classes.avatar}>
            <PersonAddIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            账号注册
          </Typography>
          <form
            onSubmit={this.submitHandler}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">邮箱地址</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({ emailAddress: event.target.value });
                  console.log(this.state.emailAddress);
                }}
                id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">密码</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({ passport: event.target.value });
                  console.log(this.state.passport);
                }}
                name="password" type="password" id="password" autoComplete="current-password" />
            </FormControl>

            <FormControl
              error={this.state.error}
              margin="normal" required fullWidth>
              <InputLabel htmlFor="password">确认密码</InputLabel>
              <Input

                onChange={(event) => {
                  this.setState({ passportEnsure: event.target.value });
                  console.log(this.state.passportEnsure);
                }}
                name="password" type="password" id="passwordEnsure" autoComplete="current-password" />
              <Message
              error
              hidden={!this.state.error}
              header="Oh, something fucked!"
              content={this.state.errorMessage}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              确认注册
          </Button>
            <Button
              href="/signin"
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
            >
              已有账号？ 返回登录
          </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { auth: state.auth }
}

const SignInwithStyles = withStyles(styles)(SignIn);

export default connect(mapStateToProps)(SignInwithStyles)