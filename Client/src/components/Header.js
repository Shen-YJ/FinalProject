import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';


class Header extends Component {
renderContent(){
  switch(this.props.auth){
    case null:
      return 
    case false:
     return(
       <li><a href="auth/github">Login With Github</a></li>
     );
    default: 
      return(
        <li><a href="api/logout">Logout</a></li>
      )
  }
}

  render(){
    console.log(this.props);
    return(
      <nav>
      <div className="nav-wrapper">
        <Link
         to={this.props.auth ? '/surveys' : '/'} 
         className="brand-logo left">
        Logo
        </Link>
        <ul id="nav-mobile" className="right">
          {this.renderContent()}
          {/* <li><a href="api/logout">logout</a></li> */}
        </ul>
      </div>
    </nav>
    )
  }
}

function mapStateToProps(state){
  return{auth: state.auth}
}

export default connect(mapStateToProps)(Header);