'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {bindIdCard, } from '../../Stubs/API'
import {List, InputItem, Toast, NavBar} from 'antd-mobile'
import {setNewPwd} from '../../Stubs/API'
import '../../Style/Recharge/bankAdd.css'
import md5 from 'md5'

const Item = List.Item;

class SetPassword extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      btnShow: false
    }
    this.password = '';
    this.repassword = '';
    this.userName = localStorage.userName?JSON.parse(localStorage.userName)[0]:JSON.parse(sessionStorage.userData).uid
    this.inputPassword = this.inputPassword.bind(this);
    this.showBtn = this.showBtn.bind(this);
  }

  inputPassword() {
    var pw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g;
    let password = this.password,
      repassword = this.repassword;
    if (password !== repassword) {
      Toast.info('两次输入的密码不一致', 1, null, false)
      this.password = this.repassword = '';
    } else {
      if (!pw.test(password)) {
        Toast.info('密码6-20位字母、数字的组合', 1, null, false)
      } else {
        let jmyz = 'http://www.9188.com/';
        let params = {
          pwd: md5(password + jmyz),
          confupwd: md5(repassword + jmyz),
          mtype: 4,
          source: 3002,
          logintype: 'session',
          uid: this.userName,
          flag: 1,
          signmsg: md5(md5(repassword + jmyz) + 'A9FK25RHT487ULMI'),
        }
        setNewPwd(params).then(result => {
          if (result.code === '0') {
            Toast.info('设置密码成功', 1, null, false);
            if (this.props.setShowType) {
              this.props.setShowType();
            } else {
              hashHistory.push('/accountSafe');
            }
          } else {
            Toast.info(result.desc, 1, null, false);
            password.value = repassword.value = '';
          }
        })
      }
    }
  }

  showBtn() {
    if (this.password.trim().length > 0 && this.repassword.trim().length > 0) {
      this.setState({
        btnShow: true
      })
    } else {
      this.setState({
        btnShow: false
      })
    }
  }

  render() {
    return (
      <div id="bankAdd">
        <NavBar
          className="myNav"
          mode="dark"
          onLeftClick={() => {
            if (this.props.setShowType) {
              this.props.setShowType();
            } else {
              hashHistory.push('/accountSafe');
            }
          }}
          rightContent={
            <div
              onClick={() => hashHistory.push("/index")}
              className="home"
            />
          }
          style={{
            position: "relative",
            height: "44px",
            zIndex: 2,
            backgroundColor: "#FC5638"
          }}
        >
          设置密码
        </NavBar>
        <div>
          <List className="bankAddBox m_bt40">
            <InputItem
              onChange={(v) => {
                this.password = v
                this.showBtn()
              }}
              clear
              maxLength='20'
              placeholder="请输入密码"
              type="password"
              extra=""
              ref="password"
            >设置密码</InputItem>
            <InputItem
              onChange={(v) => {
                this.repassword = v
                this.showBtn()
              }}
              clear
              maxLength='19'
              placeholder="请再次输入密码"
              type="password"
              extra=""
              ref="repassword"
            >重复密码</InputItem>
          </List>
          <p className="passwordP">密码6-20位字母、数字的组合</p>
          <div className="rechargeBtn m_t60">
            <a onClick={this.state.btnShow ? this.inputPassword : null}
               className={this.state.btnShow ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>确定</a>{/*disabledBtn为不可点击*/}
          </div>
        </div>
      </div>
    )
  }
}

export default SetPassword
