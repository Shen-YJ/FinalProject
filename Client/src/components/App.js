import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import HomePage from './HomePage';
import TopBar from './TopBar';
import SignIn from './SignIn';
import Register from './Register';
import Explore from './Explore';
import About from './blog/Blog';
import newAsset from './newAsset';
import newAS from './newAS';
import AssetDetail from './AssetDetail';


class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container">
        <BrowserRouter>
            <TopBar/>
            <Route path="/new" component={newAS} />
            <Route path="/signin" component={SignIn} />
            <Route path="/register" component={Register} />
            <Route exact path="/" component={HomePage} />
            <Route exact path="/explore" component={Explore} />
            <Route path="/about" component={About} />
            <Route path="/digitalasset/:address" component={AssetDetail} />
            <Route path="/newasset" component={newAsset} />
        </BrowserRouter>
      </div>
    )
  }
}

export default connect(null,actions)(App);