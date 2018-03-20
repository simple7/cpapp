'use strict'
import React, {Component} from 'react'

import {Link, hashHistory} from 'react-router'
import {Toast} from 'antd-mobile'
import {sendSMS, verifySms, fogetPwd, setNewPwd} from '../../Stubs/API'
import Pop from './Pop'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/login/LoginIndex.css'
import md5 from 'md5'

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextLight: false,
      userX: false,
      phoneX: false,
      verfCodeX: false,
      popShow: false,
      random: '',
      sendSmsBtn: true,
      popData: {},
      canChange: false,
      passwordOk: false,
      passwordX: false,
      rePasswordX: false,
      userName: ''
    }
    this.inputCash = '';
    this.commonInput = this.commonInput.bind(this);
    this.nextLight = this.nextLight.bind(this);
    this.nextClose = this.nextClose.bind(this);
    this.reInput = this.reInput.bind(this);
    this.delCommon = this.delCommon.bind(this);
    this.focusX = this.focusX.bind(this);
    this.hidePop = this.hidePop.bind(this);
    this.doSendSms = this.doSendSms.bind(this);
    this.checkUserForm = this.checkUserForm.bind(this);
    this.getCode = this.getCode.bind(this);
    this.countDown = this.countDown.bind(this);
    this.verfSms = this.verfSms.bind(this);
    this.changePwd = this.changePwd.bind(this);
    this.passwordInput = this.passwordInput.bind(this);
  }

  // 输入框后的X
  commonInput(id, self, type, flag) {
    let value = document.getElementById(id).value
    if (value.length > 0) {
      this.setState({
        [self]: true
      })
    }
    // type = 1 输入验证码下一步按钮  type=2提交新密码
    if (type == 2) {
      this.passwordInput()
    } else if (type == 1) {
      if (flag === 'phone') {
        let phone = document.getElementById('phone').value;
        if (phone.length === 11) {
          this.inputCash = phone
        }
        if (phone.length > 11) {
          document.getElementById('phone').value = this.inputCash
        }
      }else if(flag === 'code'){
        let code = document.getElementById('verfCode').value;
        if (code.length === 8) {
          this.inputCash = code
        }
        if (code.length > 8) {
          document.getElementById('verfCode').value = this.inputCash
        }
      }
      this.reInput()
    }
  }

  passwordInput() {
    let newPassword = document.getElementById('newPassword').value.trim(),
      rePassword = document.getElementById('rePassword').value.trim();
    if (newPassword.length > 0 && rePassword.length > 0) {
      this.setState({
        passwordOk: true
      });
    } else {
      this.setState({
        passwordOk: false
      });
    }
  }

  reInput() {
    let userName = document.getElementById('userName').value.trim(),
      phone = document.getElementById('phone').value.trim(),
      verfCode = document.getElementById('verfCode').value.trim();
    if (userName.length > 0 && phone.length > 0 && verfCode.length > 0) {
      this.nextLight();
    } else {
      this.nextClose();
    }
  }

  nextLight() {
    this.setState({
      nextLight: true
    })
  }

  nextClose() {
    this.setState({
      nextLight: false
    })
  }

  delCommon(id, self, type) {
    let target = document.getElementById(id);
    target.value = '';
    target.focus()
    if (type == 2) {
      this.setState({
        passwordOk: false
      })
    } else if (type == 1) {
      this.nextClose();
    }
    this.setState({
      [self]: false
    })
  }

  getCode() {
    let userName = document.getElementById('userName')
    let phone = document.getElementById('phone')
    if (this.checkUserForm(userName, phone)) {
      let params = {
        uid: userName.value,
        mobileNo: phone.value,
        mtype: '4',
        appversion: '4.0.0',
        source: '3002'
      }
      fogetPwd(params).then(result => {
        if (result.code === '0') {
          this.setState({
            popShow: true,
            popData: {
              mobileNo: phone.value,
              newValue: 1,
              flag: 1,
              uid: userName.value,
              imNo: phone.value,
              stime: new Date().getTime(),
              source: 3002
            },
            random: Math.random()
          })
        } else {
          Toast.info('您的用户名与手机号不匹配，请检查后重新输入', 1, null, false)
          document.getElementById('phone').focus();
        }
      })
    }
  }

  doSendSms(params) {
    sendSMS(params).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 1, null, false);
      } else {
        this.setState({
          sendSmsBtn: false
        })
        let codeButton = document.getElementById('codeButton');
        document.getElementById('verfCode').focus();
        Toast.info('验证码已发送至您的手机，请查收', 1, null, false);
        this.countDown(60, '重新发送', codeButton)
      }
    })
  }

  // 倒计时
  countDown(time, word, e) {
    if (time >= 0) {
      setTimeout(() => {
        e.innerHTML = word + '(' + time + ')';
        this.countDown(--time, word, e)
      }, 1000)
    } else {
      e.innerHTML = word;
      this.setState({
        sendSmsBtn: true
      })
    }
  }

  // 校验表单
  checkUserForm(userName, phone) {
    if (userName.value.trim().length === 0) {
      Toast.info('用户名不可为空', 1, () => {
      }, false)
      userName.focus();
      return false;
    } else if (phone.value.trim().length === 0) {
      Toast.info(
        '请输入绑定的手机号', 1, () => {
        }, false)
      phone.focus();
      return false;
    }
    let mobile = phone.value.replace(/['\t]/g, '').replace(/\s*/g, '');
    if (!(/^1[34578]\d{9}$/.test(mobile))) {
      Toast.info(
        '手机号码格式不正确', 1, null, false)
      phone.focus();
      return false;
    }
    return true;
  }

  focusX(param, state) {
    let value = document.getElementById(param).value;
    if (value.trim().length > 0) {
      this.setState({
        [state]: true
      })
    }
  }

  hidePop() {
    this.setState({
      popShow: false
    })
  }

  verfSms() {
    let code = document.getElementById('verfCode'),
      userName = document.getElementById('userName'),
      phone = document.getElementById('phone');
    verifySms(phone.value, code.value, 1).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 1, function () {
          code.focus()
        }, false)
      } else {
        this.setState({
          userName: userName.value,
          canChange: true,
        })
      }
    })
  }

  changePwd() {
    var pw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g;
    let newPassword = document.getElementById('newPassword'),
      rePassword = document.getElementById('rePassword');
    if (newPassword.value !== rePassword.value) {
      Toast.info('两次输入的密码不一致', 1, null, false)
      newPassword.value = rePassword.value = '';
    } else {
      if (!pw.test(newPassword.value)) {
        Toast.info('密码6-20位字母、数字的组合', 1, null, false)
      } else if (newPassword.value === this.state.userName) {
        Toast.info('用户名和密码不可以一致', 1, null, false)
        newPassword.value = rePassword.value = '';
      } else {
        let jmyz = 'http://www.9188.com/'
        let params = {
          pwd: md5(newPassword.value + jmyz),
          confupwd: md5(rePassword.value + jmyz),
          mtype: 4,
          source: 3002,
          logintype: 'session',
          uid: this.state.userName,
          flag: 0,
          signmsg: md5(md5(rePassword.value + jmyz) + 'A9FK25RHT487ULMI'),
        }
        setNewPwd(params).then(result => {
          if (result.code === '0') {
            Toast.info('密码修改成功', 1, null, false);
            hashHistory.push('loginIndex')
          } else {
            Toast.info(result.desc, 1, null, false);
            newPassword.value = rePassword.value = '';
          }
        })
      }
    }
  }

  render() {
    return (
      <div id="loginBox">
        {this.state.popShow &&
        <Pop phoneData={this.state.popData} sendSms={this.doSendSms} hidePop={this.hidePop} random={this.state.random}/>
        }
        <CommonNavBar title="忘记密码"/>
        <div style={{display: this.state.canChange ? "none" : ""}}>
          <div className="padd_Left30">
            <div className="inputBox">
              <div className="inputName">用户名</div>
              <input className="inpt" type="text" id="userName" autoFocus={true}
                     onChange={this.commonInput.bind(this, 'userName', 'userX', 1)}
                     onFocus={this.focusX.bind(this, 'userName', 'userX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({userX: false})
                       })
                     }}
                     placeholder="请输入用户名"/>
              <span className="delSpan3" style={{display: this.state.userX ? "" : "none"}}
                    onClick={this.delCommon.bind(this, 'userName', 'userX', 1)}/>{/*删除符号*/}
            </div>
            <div className="inputBox">
              <div className="inputName">手机号</div>
              <input className="inpt" type="number" pattern="[0-9]*" id="phone" maxLength="13"
                     onChange={this.commonInput.bind(this, 'phone', 'phoneX', 1, 'phone')}
                     onFocus={this.focusX.bind(this, 'phone', 'phoneX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({phoneX: false})
                       })
                     }}
                     placeholder="输入该用户名绑定的手机号码"/>
              <span className="delSpan3" style={{display: this.state.phoneX ? "" : "none"}}
                    onClick={this.delCommon.bind(this, 'phone', 'phoneX', 1)}/>{/*删除符号*/}
            </div>
            <div className="inputBox">
              <div className="inputName">验证码</div>
              <input className="inpt" type="number" pattern="[0-9]*" id="verfCode" maxLength="8"
                     onChange={this.commonInput.bind(this, 'verfCode', 'verfCodeX', 1,'code')}
                     onFocus={this.focusX.bind(this, 'verfCode', 'verfCodeX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({verfCodeX: false})
                       })
                     }}
                     placeholder="请输入验证码"/>
              <a className="codeSpan" id="codeButton" onClick={this.state.sendSmsBtn ? this.getCode : ''}>获取验证码</a>
              <span className="delSpan4" style={{display: this.state.verfCodeX ? "" : "none"}}
                    onClick={this.delCommon.bind(this, 'verfCode', 'verfCodeX', 1)}/>{/*删除符号*/}
            </div>
            <div className="padd_right30"><a onClick={this.state.nextLight ? this.verfSms : ''}
                                             className={this.state.nextLight ? "loginBtn bgOrange" : "loginBtn"}>下一步</a>{/*背景变为可点击 加class bgOrange */}
            </div>
          </div>
        </div>
        <div style={{display: this.state.canChange ? "" : "none"}}>
          <div className="padd_Left30">
            <div className="inputBox">
              <div className="inputName">新密码</div>
              <input className="inpt" type="password" id="newPassword" maxLength="20"
                     onChange={this.commonInput.bind(this, 'newPassword', 'passwordX', 2)}
                     onFocus={this.focusX.bind(this, 'newPassword', 'passwordX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({passwordX: false})
                       })
                     }}
                     placeholder="输入新密码"/>
              <span className="delSpan3" style={{display: this.state.passwordX ? "" : "none"}}
                    onClick={this.delCommon.bind(this, 'newPassword', 'passwordX', 2)}></span>{/*删除符号*/}
            </div>
            <div className="inputBox">
              <div className="inputName">重复密码</div>
              <input className="inpt" type="password" id="rePassword" maxLength="20"
                     onChange={this.commonInput.bind(this, 'rePassword', 'rePasswordX', 2)}
                     onFocus={this.focusX.bind(this, 'rePassword', 'rePasswordX')}
                     onBlur={() => {
                       setTimeout(() => {
                         this.setState({rePasswordX: false})
                       })
                     }}
                     placeholder="重复新密码"/>
              <span className="delSpan3" style={{display: this.state.rePasswordX ? "" : "none"}}
                    onClick={this.delCommon.bind(this, 'rePassword', 'rePasswordX', 2)}></span>{/*删除符号*/}
            </div>
            <div className="padd_right30"><a onClick={this.state.passwordOk ? this.changePwd : ''}
                                             className={this.state.passwordOk ? "loginBtn bgOrange" : "loginBtn"}>完成</a>{/*背景变为可点击 加class bgOrange */}
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default RegisterUser
