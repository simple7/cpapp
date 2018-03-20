'use strict'
import React, {Component} from 'react'

import {Link, hashHistory} from 'react-router'
import {Toast} from 'antd-mobile'
import {sendSMS,checkUserExist, userRegister} from '../../Stubs/API'
import PhoneTemplate from './PhoneTemplate'
import UserNameTemplate from './UserNameTemplate'
import Pop from './Pop'
import {saveUserName} from './loginUtils'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {phoneCheck, userPassCheck} from './loginUtils'
import '../../Style/login/LoginIndex.css'

class RegisterUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popShow: false,
      popData:{},
      nextBtn: false,
      userNameOk: false,
      registerLight: false,
      sendSmsBtn: true,
      getCode: true,
      userName:'',
      password:'',
      random:''
    }
    this.nextClose = this.nextClose.bind(this)
    this.nextLight = this.nextLight.bind(this)
    this.doPhone = this.doPhone.bind(this)
    this.doSendSms = this.doSendSms.bind(this)
    this.registerClose = this.registerClose.bind(this)
    this.registerLight = this.registerLight.bind(this)
    this.getCode = this.getCode.bind(this)
    this.register = this.register.bind(this)
    this.countDown = this.countDown.bind(this)
    this.hidePop = this.hidePop.bind(this)
  }

  nextClose() {
    this.setState({
      nextBtn: false
    })
  }

  nextLight() {
    this.setState({
      nextBtn: true
    })
  }
  registerClose(){
    this.setState({
      registerLight: false
    })
  }
  registerLight(){
    this.setState({
      registerLight: true
    })
  }
  // 点击下一步注册手机号信息
  doPhone() {
    let userName = document.getElementById('userName').value
    let password = document.getElementById('password').value
    if(userPassCheck(userName,password)){
      checkUserExist({uid:userName}).then(result=>{
        if(result.code === '0'){
          this.setState({
            userNameOk: true,
            userName: userName,
            password: password
          })
        }else{
          Toast.info(result.desc,1,null,false)
        }
      })
    }
  }
  /**
   *  点击获取手机验证码
   */
  getCode() {
    let phone = document.getElementById('phoneNumber')
    if (phoneCheck(phone)) {
      this.setState({
        popShow: true,
        random: Math.random(),
        popData: {
          mobileNo: phone.value,
          newValue: 1,
          flag: 2,
          imNo: phone.value,
          stime: new Date().getTime(),
          source: localStorage.getItem('agent')||'3002'
        }
      })
    }
  }
  // 调用发送验证码api
  doSendSms(params) {
    sendSMS(params).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 1,null,false);
      } else {
        this.setState({
          sendSmsBtn: false
        })
        let codeButton = document.getElementById('codeButton');
        document.getElementById('verfCode').focus();
        Toast.info('验证码已发送至您的手机，请查收', 1,null,false);
        this.countDown(60, '重新发送', codeButton)
      }
    })
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
  // 用户注册
  register(){
    let phone = document.getElementById('phoneNumber')
    let yzm = document.getElementById('verfCode')
    let params = {
      uid: this.state.userName,
      pwd: this.state.password,
      source: localStorage.getItem('agent')||'3002',
      mobileNo:phone.value,
      func: 'phone_register',
      yzm:yzm.value,
      tid: '2'
    }
    if(phoneCheck(phone)){
      userRegister(params).then(result=>{
        if(result.code === '0'){
          saveUserName(this.state.userName)
          //绑定手机号成功
          sessionStorage.removeItem('userData')
          Toast.info('注册成功',1,()=>{
            hashHistory.push('my')
          },false)
        }else{
          Toast.info(result.desc,1,null,false)
          yzm.focus()
        }
      })
    }

  }
  hidePop(){
    this.setState({
      popShow:false
    })
  }
  render() {
    return (
      <div id="loginBox">
        {this.state.popShow &&
        <Pop phoneData={this.state.popData} sendSms={this.doSendSms} random={this.state.random} hidePop={this.hidePop}/>
        }
        <CommonNavBar   title="用户名注册"/>
        <div style={{display: this.state.userNameOk ? "none" : ""}}>

          <div className="padd_Left30">
            <UserNameTemplate
              btnClose={this.nextClose}
              btnLight={this.nextLight}/>

          <div className="padd_right30">  <a onClick={this.state.nextBtn ? this.doPhone : ''}
          className={this.state.nextBtn ? "loginBtn bgOrange" : "loginBtn"}>下一步</a></div>
          </div>
          <p className="tipsP"><Link to="/login/protocol">注册即代表您已满18周岁并同意《用户服务协议》</Link></p>


          {/*手机号注册*/}
          <Link className="registerBtn1" to="/login/registerTel">手机号注册</Link>
        </div>
        <div style={{display: this.state.userNameOk ? "" : "none"}}>

          <div className="padd_Left30">

            <PhoneTemplate btnClose={this.registerClose}
                           btnLight={this.registerLight}
                           sendSmsBtn={this.state.sendSmsBtn}
                           getCode={this.getCode}/>

            <div className="padd_right30"><a onClick={this.state.registerLight?this.register:''} className={this.state.registerLight ? 'loginBtn bgOrange' : 'loginBtn'}
            id="next">注册</a></div>
          </div>
        </div>
      </div>
    )
  }
}

export default RegisterUser
