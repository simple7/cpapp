'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {bindPhone, bindPhoneCheck} from '../../Stubs/API'
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
      verfCode: ''
    }
    this.needBack = false
    this.mobile = ''
    this.verfCode = ''
    this.intval = ''
    this.doSendSms = this.doSendSms.bind(this)
    this.hidePop = this.hidePop.bind(this)
    this.checkPhone = this.checkPhone.bind(this)
    this.countDown = this.countDown.bind(this)
    this.showBtnF = this.showBtnF.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  componentWillMount() {
    let query = this.props.location.query
    if (query && query.needBack) {
      this.needBack = true
    }
  }
  componentWillUnmount() {
    clearTimeout(this.intval)
  }
  doSendSms(params) {
    bindPhone(params).then(result => {
      if (result.code !== '0') {
        Toast.info(result.desc, 1, null, true);
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
      this.intval = setTimeout(() => {
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
    if (Regx.checkIsPhone(this.mobile, this.refs.phone)) {
      this.setState({
        random: Math.random(),
        popShow: true,
        popData: {
          flag: '1',
          newValue: this.mobile,
          hztype: '0',
          mtype: '4',
          appversion: commonConfig.appversion
        }
      })
    } else {
      this.refs.phone.focus()
    }
  }

  showBtnF() {
    let mobile = this.mobile;
    let verfCode = this.verfCode;
    if (mobile.trim().length > 0 && verfCode.trim().length > 0) {
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
    bindPhoneCheck(params).then(result => {
      if (result.code === '0') {
        Toast.info('绑定成功', 1, null, false)
        if (this.needBack) {
          hashHistory.goBack()
        } else {
          hashHistory.push({
            pathname: '/accountSafe/mobileResult',
            state: {
              phone: this.mobile
            }
          })
        }

      } else {
        Toast.info(result.desc, 1, null, false)
      }
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div id="bankAdd">
        <CommonNavBar title='绑定手机号'/>
        <div>
          {this.state.popShow &&
          <Pop phoneData={this.state.popData} sendSms={this.doSendSms} hidePop={this.hidePop}
               random={this.state.random}/>
          }
          <div className="tips1">
            <span className="tip"/>
            <span className="word">手机号将用于中奖通知，请填写本人手机</span>
          </div>
          <List className="bankAddBox m_bt40">
            <InputItem
              {...getFieldProps('phone', {
                onChange: value => {
                  this.mobile = value.replace(/\s/g, '');
                  this.showBtnF()
                }
              })}
              ref="phone"
              placeholder="请输入手机号"
              clear
              type='phone'
            >手机号</InputItem>
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
               onClick={this.state.showBtn ? this.confirm : null}>确定</a>{/*disabledBtn为不可点击*/}
          </div>
        </div>


      </div>
    )
  }
}

const editMobile = createForm()(childComponent);
export default editMobile
