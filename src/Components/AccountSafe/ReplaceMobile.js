'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {bindPhone, bindPhoneCheck, UserIndexAPI, changeMobileCheck} from '../../Stubs/API'
import {createForm} from 'rc-form';
import {List, InputItem, Toast} from 'antd-mobile'
import Pop from '../Login/Pop'
import commonConfig from '../../config/commonConfig'
import Regx from '../../common/Regx'
import '../../Style/Recharge/bankAdd.css'

const Item = List.Item;


class childComponent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      popShow: false,
      popData: {},
      random: '',
      hasSendCode: false,
      mobile: '',
      reSend: '获取验证码',
      showBtn: false,
      verfCode: '',
      userData: {}
    }
    this.mobile = ''
    this.newMobile = ''
    this.verfCode = ''
    this.doSendSms = this.doSendSms.bind(this)
    this.hidePop = this.hidePop.bind(this)
    this.checkPhone = this.checkPhone.bind(this)
    this.countDown = this.countDown.bind(this)
    this.showBtnF = this.showBtnF.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  componentWillMount() {
    if (!sessionStorage.getItem("userData")) {
      UserIndexAPI().then((data) => {
        if (data.code === '0') {
          this.setState({
            userData: data.user,
          });
        } else {
          Toast.info(data.desc, 1, null, false)
        }
      })
    } else {
      let userJsonStr = sessionStorage.getItem('userData');
      console.log(userJsonStr);
      let userData = JSON.parse(userJsonStr)
      this.setState({
        userData: userData,
      });
    }
  }

  doSendSms(params) {
    console.log(params)
    bindPhone(params).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 2, null, true);
      } else {
        this.setState({
          hasSendCode: true
        })
        Toast.info('验证码已发送至您的手机，请查收', 1, null, false);
        this.countDown(60, '重新发送')
      }
    })
  }

  countDown(time, word) {
    if (time >= 0) {
      setTimeout(() => {
        this.setState({
          reSend: time + 's'
        }, () => {
          this.countDown(--time, word)
        });
      }, 1000)
    } else {
      this.setState({
        hasSendCode: false,
        reSend: word
      })
    }
  }

  hidePop() {
    this.setState({
      popShow: false
    })
  }

  checkPhone() {
    console.log(this.mobile, this.newMobile)
    if (Regx.checkIsPhone(this.mobile, this.refs.phone, 1, '请输入旧手机号', '旧手机号格式有误') && Regx.checkIsPhone(this.newMobile, this.refs.newPhone, 1, '请输入新手机号', '新手机号格式有误')) {
      if (this.mobile === this.newMobile) {
        Toast.info('新手机号不能和旧手机号相同', 1, null, false)
      } else {
        let params = {
          mobileNo: this.mobile,
          newValue: this.newMobile,
          uid: this.state.userData.uid
        }
        changeMobileCheck(params).then(result => {
          if (result.code === '0') {
            this.setState({
              random: Math.random(),
              popShow: true,
              popData: {
                flag: '1',
                newValue: this.newMobile,
                mobileNo:this.mobile,
                hztype: '0',
                mtype: '4',
                appversion: commonConfig.appversion
              }
            })
          } else {
            Toast.info(result.desc, 1, null, false)
          }
        })

      }

    }
  }

  showBtnF() {
    let mobile = this.mobile;
    let newMobile = this.newMobile;
    let verfCode = this.verfCode;
    if (mobile.trim().length > 0 && newMobile.trim().length > 0 && verfCode.trim().length > 0) {
      this.setState({
        showBtn: true
      })
    } else {
      this.setState({
        showBtn: false
      })
    }
  }

  confirm() {
    let verfCode = this.verfCode
    let params = {
      flag: '1',
      yzm: verfCode
    }
    console.log(params);
    bindPhoneCheck(params).then(result => {
      if (result.code === '0') {
        Toast.info('绑定成功', 1, null, false)
        hashHistory.push({
          pathname: '/accountSafe/mobileResult',
          state: {
            phone: this.newMobile
          }
        })
      } else {
        Toast.info(result.desc, 1, null, false)
      }
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div id="bankAdd">
        <CommonNavBar title='更换手机号'/>
        <div>
          {this.state.popShow &&
          <Pop phoneData={this.state.popData} sendSms={this.doSendSms} hidePop={this.hidePop}
               random={this.state.random}/>
          }
          <List className="bankAddBox m_bt40">
            <InputItem
              {...getFieldProps('phone', {
                onChange: value => {
                  this.mobile = value.replace(/\s/g, '');
                  this.showBtnF()
                }
              })}
              ref="phone"
              placeholder="请输入原来绑定的手机号"
              clear
              type='phone'
            />
            <InputItem
              {...getFieldProps('newPhone', {
                onChange: value => {
                  this.newMobile = value.replace(/\s/g, '');
                  this.showBtnF()
                }
              })}
              ref="newPhone"
              placeholder="请输入要更换的手机号"
              clear
              type='phone'
            />
            <InputItem className="codeInput"
                       {...getFieldProps('number', {
                         onChange: (v) => {
                           this.verfCode = v;
                           this.showBtnF()
                         }
                       })}
                       ref="verCode"
                       placeholder="请输入验证码"
                       type="number"
                       clear
                       pattern="[0-9]*"
                       maxLength='8'
                       onExtraClick={
                         this.state.hasSendCode ? null : this.checkPhone
                       }
                       extra={this.state.reSend}
            >验证码</InputItem>
          </List>
          <div className="rechargeBtn m_t60">
            <a className={this.state.showBtn ? 'rechargeBtn1' : "rechargeBtn1 disabledBtn"}
               onClick={this.state.showBtn ? this.confirm : null}>下一步</a>{/*disabledBtn为不可点击*/}
          </div>
        </div>


      </div>
    )
  }
}

const replaceMobile = createForm()(childComponent);
export default replaceMobile
