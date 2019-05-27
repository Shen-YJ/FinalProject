import React from 'react';
import { Route, Redirect } from 'react-router'

import { connect } from 'react-redux';

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

import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';





import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';


import crypto from 'crypto';
import axios from 'axios';


const styles = theme => ({
  main: {
    // paddingTop: theme.spacing.unit * 6 ,    
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
  },


  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },



});

const ranges = [
  {
    value: '0-20',
    label: '0 to 20',
  },
  {
    value: '21-50',
    label: '21 to 50',
  },
  {
    value: '51-100',
    label: '51 to 100',
  },
];

class newAsset extends React.Component {

  state = {
    AssetName: '请先上传文件，文件名将作为资产名称',
    AssetType: '',
    AssetDescription: '',
    AssetPrice: 0,
    AccessPrice: 0,
    OwnerAddress: [],
    Share: [],
    redirect: false,
    success: false,
    DigitalAssetAdress: '',
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  }

  async componentDidMount() {
    // listen to the event _contribute
    console.log("create event");

    const _createDigitalAssetEvent = await factory.events._createDigitalAsset((error, event) => {
      if (!error) {
        this.setState({
          success: event.returnValues.status,
          DigitalAssetAdress: event.returnValues.DigitalAssetAdress,
        }
        )
      }
    });

    console.log("event finished");

  }

  SubmitHandler = async (event) => {
    event.preventDefault();
    console.log(this.state.AssetName);

    this.setState({
      Message: "请等待交易确认，大概需要20到30秒时间"
    })

    const md5 = crypto.createHash('md5');
    const AssetID = md5.update(this.state.AssetName).digest('hex');

    const accounts = await web3.eth.getAccounts();

    try {
      const result = await factory.methods
        .createDigitalAsset(
          this.state.AssetName,
          AssetID,
          this.state.AssetType,
          web3.utils.toWei(this.state.AssetPrice, "ether"),
          web3.utils.toWei(this.state.AccessPrice, "ether"),
          this.state.OwnerAddress,
          this.state.Share,
          this.state.AssetDescription
        )
        .send({
          from: accounts[0]
        })

      this.setState({
        Message: "资产创建成功！"
      })

      console.log(result);


      console.log("submit success!");

      // this.setState({
      //   redirect: true
      // })

    } catch (err) {
      console.log(err);
      this.setState({
        Message: err.message
      })
    };
  }


  fileHandler = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      AssetName: event.target.files[0].name,
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }

  uploadHandler = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);  //相当于 input:file 中的name属性

    axios.post("http://localhost:5000/upload", data, { // receive two parameter endpoint url ,form data 
    }).then(res => { // then print response status
        console.log(res);
        this.setState({
          Message: "文件上传成功！"
        })
      })

  };


  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };





  render() {
    const { classes } = this.props;

    if (this.state.success == true) {
      return (
        <Redirect to={`/digitalasset/${this.state.DigitalAssetAdress}`} />
      )
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            资产注册
          </Typography>
          {/* <div className={classes.root}>
        <TextField
          label="With normal TextField"
          id="simple-start-adornment"
          className={classNames(classes.margin, classes.textField)}
          InputProps={{
            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
          }}
        />

        <TextField
          select
          label="With Select"
          className={classNames(classes.margin, classes.textField)}
          value={this.state.weightRange}
          onChange={this.handleChange('weightRange')}
          InputProps={{
            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
          }}
        >
          {ranges.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControl fullWidth className={classes.margin}>
          <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
          <Input
            id="adornment-amount"
            value={this.state.amount}
            onChange={this.handleChange('amount')}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <FormControl
          className={classNames(classes.margin, classes.withoutLabel, classes.textField)}
        >
          <Input
            id="adornment-weight"
            value={this.state.weight}
            onChange={this.handleChange('weight')}
            aria-describedby="weight-helper-text"
            endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
            inputProps={{
              'aria-label': 'Weight',
            }}
          />

          <FormHelperText id="weight-helper-text">Weight</FormHelperText>
        </FormControl>
        <FormControl className={classNames(classes.margin, classes.textField)}>
          <InputLabel htmlFor="adornment-password">Password</InputLabel>
          <Input
            id="adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onChange={this.handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div> */}
          <form
            action="/upload"
            method="post"
            encType="multipart/form-data"
            className={classes.form}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel >资产名称</InputLabel>
              <Input
                value={this.state.AssetName}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >资产类型</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({
                    AssetType: event.target.value
                  })
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >资产描述</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({
                    AssetDescription: event.target.value
                  })
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >资产价格</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({
                    AssetPrice: event.target.value
                  })
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >使用价格</InputLabel>
              <Input
                onChange={(event) => {
                  this.setState({
                    AccessPrice: event.target.value
                  })
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >注册人地址，多个地址以","分割</InputLabel>
              <Input
                onChange={(event) => {
                  let addresses = event.target.value.split(",");
                  this.setState({
                    OwnerAddress: addresses
                  })
                }}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel >对应股份，多个股份以","分割</InputLabel>
              <Input
                onChange={(event) => {
                  let shares = event.target.value.split(",");
                  let shareNumber = shares.map(share => (
                    parseInt(share, 10)
                  ))
                  this.setState({
                    Share: shareNumber
                  })
                }}
              />
            </FormControl>

            <FormControlLabel
              required
              control={<Checkbox value="remember" color="primary" />}
              label="本人确保拥有该资产所有权，违者法律责任自负！"
            />

            <input type="file" name='file' onChange={this.fileHandler} />
            <p>
              {this.state.Message}
            </p>
            <p>
              {this.state.DigitalAssetAdress}
            </p>
            <Button
              onClick={this.uploadHandler}
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
              type="button"
            >
              上传文件
            </Button>

            <form action="http://127.0.0.1:5000/upload" method="post" enctype="multipart/form-data">

            </form>
            <Button
              onClick={this.SubmitHandler}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              确认注册
            </Button>

          </form>
        </Paper>
      </main>
    );
  }
}

newAsset.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { auth: state.auth }
}

const SignInwithStyles = withStyles(styles)(newAsset);

export default connect(mapStateToProps)(SignInwithStyles)








// -----------------------------------
// import React from 'react';
// import {
//   Form, Select, InputNumber, Switch, Radio,
//   Slider, Button, Upload, Icon, Rate, Checkbox,
//   Row, Col,
// } from 'antd';

// const { Option } = Select;

// class Demo extends React.Component {
//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   }

//   normFile = (e) => {
//     console.log('Upload event:', e);
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e && e.fileList;
//   }

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const formItemLayout = {
//       labelCol: { span: 6 },
//       wrapperCol: { span: 14 },
//     };
//     return (
//       <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//         <Form.Item
//           label="Plain Text"
//         >
//           <span className="ant-form-text">China</span>
//         </Form.Item>
//         <Form.Item
//           label="Select"
//           hasFeedback
//         >
//           {getFieldDecorator('select', {
//             rules: [
//               { required: true, message: 'Please select your country!' },
//             ],
//           })(
//             <Select placeholder="Please select a country">
//               <Option value="china">China</Option>
//               <Option value="usa">U.S.A</Option>
//             </Select>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Select[multiple]"
//         >
//           {getFieldDecorator('select-multiple', {
//             rules: [
//               { required: true, message: 'Please select your favourite colors!', type: 'array' },
//             ],
//           })(
//             <Select mode="multiple" placeholder="Please select favourite colors">
//               <Option value="red">Red</Option>
//               <Option value="green">Green</Option>
//               <Option value="blue">Blue</Option>
//             </Select>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="InputNumber"
//         >
//           {getFieldDecorator('input-number', { initialValue: 3 })(
//             <InputNumber min={1} max={10} />
//           )}
//           <span className="ant-form-text"> machines</span>
//         </Form.Item>

//         <Form.Item
//           label="Switch"
//         >
//           {getFieldDecorator('switch', { valuePropName: 'checked' })(
//             <Switch />
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Slider"
//         >
//           {getFieldDecorator('slider')(
//             <Slider marks={{
//               0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F',
//             }}
//             />
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Radio.Group"
//         >
//           {getFieldDecorator('radio-group')(
//             <Radio.Group>
//               <Radio value="a">item 1</Radio>
//               <Radio value="b">item 2</Radio>
//               <Radio value="c">item 3</Radio>
//             </Radio.Group>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Radio.Button"
//         >
//           {getFieldDecorator('radio-button')(
//             <Radio.Group>
//               <Radio.Button value="a">item 1</Radio.Button>
//               <Radio.Button value="b">item 2</Radio.Button>
//               <Radio.Button value="c">item 3</Radio.Button>
//             </Radio.Group>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Checkbox.Group"
//         >
//           {getFieldDecorator("checkbox-group", {
//             initialValue: ["A", "B"],
//           })(
//             <Checkbox.Group style={{ width: "100%" }}>
//               <Row>
//                 <Col span={8}><Checkbox value="A">A</Checkbox></Col>
//                 <Col span={8}><Checkbox disabled value="B">B</Checkbox></Col>
//                 <Col span={8}><Checkbox value="C">C</Checkbox></Col>
//                 <Col span={8}><Checkbox value="D">D</Checkbox></Col>
//                 <Col span={8}><Checkbox value="E">E</Checkbox></Col>
//               </Row>
//             </Checkbox.Group>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Rate"
//         >
//           {getFieldDecorator('rate', {
//             initialValue: 3.5,
//           })(
//             <Rate />
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Upload"
//           extra="longgggggggggggggggggggggggggggggggggg"
//         >
//           {getFieldDecorator('upload', {
//             valuePropName: 'fileList',
//             getValueFromEvent: this.normFile,
//           })(
//             <Upload name="logo" action="/upload.do" listType="picture">
//               <Button>
//                 <Icon type="upload" /> Click to upload
//               </Button>
//             </Upload>
//           )}
//         </Form.Item>

//         <Form.Item
//           label="Dragger"
//         >
//           <div className="dropbox">
//             {getFieldDecorator('dragger', {
//               valuePropName: 'fileList',
//               getValueFromEvent: this.normFile,
//             })(
//               <Upload.Dragger name="files" action="/upload.do">
//                 <p className="ant-upload-drag-icon">
//                   <Icon type="inbox" />
//                 </p>
//                 <p className="ant-upload-text">Click or drag file to this area to upload</p>
//                 <p className="ant-upload-hint">Support for a single or bulk upload.</p>
//               </Upload.Dragger>
//             )}
//           </div>
//         </Form.Item>

//         <Form.Item
//           wrapperCol={{ span: 12, offset: 6 }}
//         >
//           <Button type="primary" htmlType="submit">Submit</Button>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const WrappedDemo = Form.create({ name: 'validate_other' })(Demo);

// // ReactDOM.render(<WrappedDemo />, mountNode);
// export default WrappedDemo;