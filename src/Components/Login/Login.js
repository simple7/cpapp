'use strict'
import React, {Component} from 'react'

import {Link, hashHistory} from 'react-router'
import {Toast, Popup} from 'antd-mobile'
import {userLogin} from '../../Stubs/API'
import utils from '../../common/utils'
import {saveUserName} from './loginUtils'
import commonConfig from '../../config/commonConfig'
import '../../Style/login/LoginIndex.css'
import CommonNavBar from "../CommonComts/CommonNavBar";

class LoginIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cache: false,
      rexpShow: false,
      userX: false,
      passwordX: false,
      btnLight: false,
      passwordShow: false,
      rexpArr: [],
    }
    this.flag = '';
    this.userRexp = this.userRexp.bind(this);
    this.delLocal = this.delLocal.bind(this);
    this.initialize = this.initialize.bind(this);
    this.delUserName = this.delUserName.bind(this);
    this.passwordInput = this.passwordInput.bind(this);
    this.delPassword = this.delPassword.bind(this);
    this.loginBtn = this.loginBtn.bind(this);
    this.login = this.login.bind(this);
    this.hasProblem = this.hasProblem.bind(this);
    this.fogetPassword = this.fogetPassword.bind(this);
    this.focusX = this.focusX.bind(this);
  }

  componentWillMount() {
    let query = this.props.location.query;
    if (query && query.flag) {
      this.flag = query.flag
    }
    this.initialize()
  }

  initialize() {
    let userLocal = localStorage.getItem('userName')
    if (userLocal && JSON.parse(userLocal).length > 0) {
      let userCache = JSON.parse(userLocal);
      this.setState({
        cache: true,
        rexpArr: userCache
      })
    }
  }

  componentDidMount() {
    if (document.getElementById('userName') && document.getElementById('password')) {
      if(this.state.rexpArr[0]){
        document.getElementById('userName').value = this.state.rexpArr[0];
        document.getElementById('password').focus();
      }else{
        document.getElementById('userName').focus();
      }
    }
  }

  userRexp(e) {
    let value = e.target.value;
    if (value) {
      this.setState({
        userX: true,
        rexpShow: false
      })
    } else {
      this.setState({
        userX: false,
      })
    }
    this.loginBtn()
  }

  passwordInput(e) {
    let value = e.target.value;
    if (value) {
      this.setState({
        passwordX: true,
      })
    } else {
      this.setState({
        passwordX: false,
      })
    }
    this.loginBtn()
  }


  loginBtn() {
    let userName = document.getElementById('userName').value
    let password = document.getElementById('password').value
    if (userName.trim().length > 0 && password.trim().length > 0) {
      this.setState({
        btnLight: true
      })
    } else {
      this.setState({
        btnLight: false
      })
    }
  }

  delLocal(e) {
    let userInput = document.getElementById('userName')
    let value = e.target.dataset.value
    let arr = this.state.rexpArr
    let first = arr.splice(0, arr.indexOf(value))
    let last = arr.splice(arr.indexOf(value) + 1)
    let newArr = first.concat(last)
    if (newArr[0]) {
      userInput.value = newArr[0]
    } else {
      userInput.value = ''
      this.setState({
        rexpShow: false
      })
      userInput.focus();
    }
    localStorage.setItem('userName', JSON.stringify(newArr))
    this.setState({
      rexpArr: newArr
    })
    if (newArr.length == 0) {
      this.setState({
        cache: false,
      })
    }

  }

  // 点击提示选中用户名
  setValue(e) {
    let value = e.target.dataset.value;
    let userInput = document.getElementById('userName')
    userInput.value = value
    document.getElementById('password').focus();
    this.setState({
      rexpShow: false,
    })
  }

  delUserName() {
    let userName = document.getElementById('userName');
    document.getElementById('password').value = '';
    userName.value = '';
    userName.focus()
    this.setState({
      userX: false
    })
    this.loginBtn()
  }

  delPassword() {
    let password = document.getElementById('password');
    password.value = '';
    password.focus();
    this.setState({
      passwordX: false
    })
    this.loginBtn()
  }

  fogetPassword() {
    Popup.hide();
    hashHistory.push('login/forgetPassword')
  }

  login() {
    let userName = document.getElementById('userName').value
    let password = document.getElementById('password').value
    let params = {
      uid: utils.aesEnCode(userName),
      pwd: utils.aesEnCode(password),
      source: 3000
    }
    userLogin(params).then(result => {
      if (result.code === '0') {
        saveUserName(userName)
        sessionStorage.removeItem('userData')
        if (this.flag === 'needBack') {
          hashHistory.goBack()
        } else {
          hashHistory.push('my')
        }
      } else {
        if (result.desc.indexOf('用户') > -1 || result.desc.indexOf('密码') > -1 || result.desc.indexOf('alipay') > -1) {
          Toast.info('用户名或密码错误', 1, null, false);
          this.setState({
            passwordShow: true
          })
        } else {
          Toast.info(result.desc, 1, null, false)
        }
        document.getElementById('password').focus()
      }
    })
  }

  hasProblem() {
    Popup.show(
      <div className="popContext">
        <div className="title">若忘记用户名，您可以联系在线客服进行处理</div>
        <div className="popBtn" onClick={this.fogetPassword}>忘记密码</div>
        <div className="popBtn" onClick={() => {
          Popup.hide();
          hashHistory.push({
            pathname: 'linkPage',
            query: {
              url: commonConfig.domain + 'help/',
              title: '帮助中心'
            }
          })
          // location.href = 'https://chat8.live800.com/live800/chatClient/chatbox.jsp?companyID=152373&configID=126236&jid=4543042755'
        }}>联系客服
        </div>
        <div className="popBtn" onClick={() => {
          Popup.hide()
        }}>取消
        </div>
      </div>,
      {animationType: 'slide-up'}
    )
  }

  focusX(param, state) {
    let value = document.getElementById(param).value;
    if (value.length > 0) {
      this.setState({
        [state]: true
      })
    }
  }

  render() {
    const _this = this;
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content =
        <div id="loginBox">
          <CommonNavBar
            onLeftClick={() => hashHistory.goBack()} title="登录"
          />
          <div className="padd_Left30">
            <div className="inputBox">
              <div className="inputName">账号</div>
              <input className="inpt" type="text" id="userName" maxLength="32"
                     onFocus={this.focusX.bind(this, 'userName', 'userX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({userX: false})
                       }, 0)
                     }}
                     onChange={this.userRexp} placeholder="请输入手机号或用户名"/>
              <span className="downSpan"
                    style={{display: this.state.cache ? '' : 'none'}}
                    onClick={() => {
                      this.setState({rexpShow: !this.state.rexpShow})
                    }}/>
              <span
                className="delSpan"
                style={{display: this.state.userX ? '' : 'none'}}
                onClick={this.delUserName}/>{/*删除符号*/}
              <ul className="selectUl" style={{display: this.state.rexpShow ? '' : 'none'}}>
                {this.state.rexpArr.map((item, index) => {
                  return (
                    <li key={index}>
                    <span className="liSpan" data-value={item}
                          onClick={this.setValue.bind(this)}>{item}
                          </span>
                      <span className="delSpan1"
                            data-value={item}
                            onClick={this.delLocal}>

                    </span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="inputBox">
              <div className="inputName">密码</div>
              <input className="inpt" id="password" maxLength="32" type={this.state.passwordShow ? "text" : "password"}
                     onFocus={this.focusX.bind(this, 'password', 'passwordX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({passwordX: false})
                       }, 0)
                     }}
                     onChange={this.passwordInput} placeholder="请输入登录密码"/>
              <span className="delSpan" style={{display: this.state.passwordX ? '' : 'none'}}
                    onClick={this.delPassword}/>{/*删除符号*/}
              <span
                onClick={
                  () => {
                    this.setState({passwordShow: !this.state.passwordShow}, () => {
                      document.getElementById('password').focus()
                    })
                  }}
                className={this.state.passwordShow ? "eyeSpan eyeClose" : "eyeSpan eyeOpen"}/>
            </div>
            <div className="padd_right30">
              <a onClick={this.state.btnLight ? this.login : ''}
                 className={this.state.btnLight ? "loginBtn bgOrange" : "loginBtn"}>登录</a>
            </div>
            <div className="troubleDiv clearfix">
              <a onClick={this.hasProblem} className="troubleLink1">登录遇到问题</a>
              <Link className="troubleLink2" to="/login/registerTel">立即注册</Link>
            </div>
          </div>

        </div>

    }
    return (
      <div id="loginBox" tabIndex="0">
        {content}
      </div>
    )
  }
}


export default LoginIndex
