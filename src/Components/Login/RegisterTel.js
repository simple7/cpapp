import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {Modal, Toast} from 'antd-mobile'
import utils from '../../common/utils'
import {sendSMS, verifySms, mobRegister} from '../../Stubs/API'
import {phoneCheck, userPassCheck} from './loginUtils'
import PhoneTemplate from './PhoneTemplate'
import UserNameTemplate from './UserNameTemplate'
import Pop from './Pop'
import {saveUserName} from './loginUtils'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/login/LoginIndex.css'

const prompt = Modal.prompt;

class RegisterTel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneIsOk: false,
      btnLight: false,
      registerLight: false,
      random: '',
      sendSmsBtn: true,
      popShow: false,
      // phoneX: false,
      // codeX: false,
      popData: {},
      phone: '',
    }
    this.getCode = this.getCode.bind(this)
    this.countDown = this.countDown.bind(this)
    this.btnClose = this.btnClose.bind(this)
    this.btnLight = this.btnLight.bind(this)
    this.registerClose = this.registerClose.bind(this)
    this.registerLight = this.registerLight.bind(this)
    this.checkCode = this.checkCode.bind(this)
    this.register = this.register.bind(this)
    this.doSendSms = this.doSendSms.bind(this)
    this.hidePop = this.hidePop.bind(this)

  }

  /**
   *  点击获取图片验证码
   */
  getCode() {
    let _this = this;
    let phone = document.getElementById('phoneNumber')
    if (phoneCheck(phone)) {
      _this.setState({
        popShow: true,
        random: Math.random(),
        popData: {
          mobileNo: phone.value,
          newValue: 1,
          flag: 2,
          func: 'mobRegister',
          imNo: phone.value,
          stime: new Date().getTime(),
          source: localStorage.getItem('agent') || '3002'
        }
      })
    }
  }

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

  /**
   *  点击下一步校验手机短信验证码
   */
  checkCode() {
    let code = document.getElementById('verfCode'),
      phone = document.getElementById('phoneNumber'),
      phoneV = phone.value.replace(/\D/g, '')
    if (phoneCheck(phone)) {
      verifySms(phoneV, code.value, 2).then(result => {
        if (result.code !== '0') {
          Toast.info(result.desc, 1, null, false)
          code.focus()
        } else {
          this.setState({
            phoneIsOk: true,
            phone: phoneV
          })
        }
      })
    }

  }


  /**
   *  注册用户
   */
  register() {
    let userName = document.getElementById('userName').value,
      password = document.getElementById('password').value;
    if (userPassCheck(userName, password)) {
      let params = {
        uid: userName,
        pwd: password,
        source: localStorage.getItem('agent') || '3002',
        mobileNo: this.state.phone
      }
      mobRegister(params).then(result => {
        if (result.code !== '0') {
          Toast.info(result.desc, 1, null, false)
        } else {
          saveUserName(this.state.phone)
          sessionStorage.removeItem('userData')
          Toast.info('注册成功', 1, ()=>{
            hashHistory.push('my')
          }, false)
        }
      })
    }
  }

  // 调用发送验证码api
  doSendSms(params) {
    sendSMS(params).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 1, null, true);
      } else {
        this.setState({
          sendSmsBtn: false
        })
        document.getElementById('verfCode').focus();
        let codeButton = document.getElementById('codeButton');
        Toast.info('验证码已发送至您的手机，请查收', 1, null, false);
        this.countDown(60, '重新发送', codeButton)
      }
    })
  }

  btnClose() {
    this.setState({
      btnLight: false
    })

  }

  btnLight() {
    this.setState({
      btnLight: true
    })
  }

  registerClose() {
    this.setState({
      registerLight: false
    })
  }

  registerLight() {
    this.setState({
      registerLight: true
    })
  }

  hidePop() {
    this.setState({
      popShow: false
    })
  }

  render() {
    return (
      <div id="loginBox">
        {this.state.popShow &&
        <Pop phoneData={this.state.popData} sendSms={this.doSendSms} hidePop={this.hidePop} random={this.state.random}/>
        }
        <CommonNavBar  title="手机号注册"/>
        <div style={{display: this.state.phoneIsOk ? 'none' : ''}}>

          <div className="padd_Left30">

            <PhoneTemplate btnClose={this.btnClose}
                           btnLight={this.btnLight}
                           sendSmsBtn={this.state.sendSmsBtn}
                           getCode={this.getCode}/>


            <div className="padd_right30"><a onClick={this.state.btnLight ? this.checkCode : ''}
                                             className={this.state.btnLight ? 'loginBtn bgOrange' : 'loginBtn'}
                                             id="next">下一步</a></div>
          </div>
          <p className="tipsP"><Link to="/login/protocol">注册即代表您已满18周岁并同意《用户服务协议》</Link></p>
          {/*用户注册*/}
          {/*<Link className="registerBtn1" to="/login/registerUser">用户名注册</Link>*/}

        </div>

        <div style={{display: this.state.phoneIsOk ? '' : 'none'}}>

          <div className="padd_Left30">

            <UserNameTemplate btnClose={this.registerClose} btnLight={this.registerLight}/>

            <div className="padd_right30">
              <div onClick={this.state.registerLight ? this.register : ""}
                   className={this.state.registerLight ? "loginBtn bgOrange" : "loginBtn"}>注册
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterTel
