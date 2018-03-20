import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import '../../Style/login/LoginIndex.css'

//新登录页面
class LoginIndex extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      flag: '',
      path: 'login',
      render: false
    }

  }

  componentDidMount() {
    let flag = this.props.location.query.flag
    console.log('===', flag)
    console.log(this.props)
    if (flag && flag === 'needBack') {
      let path = this.props.location.pathname
      path = path.substring(0, path.indexOf('login')) + 'loginChild'
      this.setState({
        path: path,
        flag: flag,
        render: true
      })
    } else {
      this.setState({
        render: true
      })
    }
  }

  render() {
    let {flag, path, render} = this.state
    let userStorage = localStorage.getItem('userName');
    if (render) {
      if (userStorage && JSON.parse(userStorage).length !== 0) {
        hashHistory.replace({
          pathname: path,
          query: flag ? {
            flag: flag
          } : {}
        });
        return null;
      } else {
        return (
          <div id="loginBoxbg">
            <div>
              <img src={require('../../Img/Login/logo.png')} className="logo"/>
              <Link className="loginBtn1" to="login/registerTel">注册</Link>
              <a className="loginBtn2" onClick={() => {
                hashHistory.replace({
                  pathname: path,
                  query: flag ? {
                    flag: flag
                  } : {}
                });
              }}>登录</a>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div></div>
      )
    }

  }

}

export default LoginIndex
