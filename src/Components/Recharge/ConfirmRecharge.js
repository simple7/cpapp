'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Toast, List, InputItem} from 'antd-mobile'
import {recharge, sftRechargeConfirm, ldysRechargeConfirm, jdzfRechargeConfirm} from '../../Stubs/API'
import rechargeConfig from '../../config/rechargeConfig'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import '../../Style/Recharge/bankAdd.css'


class ConfirmRecharge extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      sendCode: true,
      verifycode: '',
      codeOk: false,
      rechargeData: {},
      realCardNo: '',
      applyid: '',
      cardTypeCode: '',
      addmoney: '',
      sessionToken: '',
      tradeno: '',
      first: {},
      bankCode: '',
      cardno: '',
      cvv: '',
      mobile: '',
      rectype: '',
      validDate: '',
      bankid: '',
    }
    this.initialize = this.initialize.bind(this)
    this.countDown = this.countDown.bind(this)
    this.inputCode = this.inputCode.bind(this)
    this.reSend = this.reSend.bind(this)
    this.rechargeCheck = this.rechargeCheck.bind(this)
    this.rechargeCallBack = this.rechargeCallBack.bind(this)
  }

  componentWillMount() {
    this.initialize()
  }

  componentDidMount() {
    this.countDown('60', document.getElementById('reSendBtn'))
  }

  initialize() {
    let rechargeData = this.props.location.state
    console.log('充值信息', rechargeData)
    if (rechargeData) {
      this.setState({
        first: rechargeData.first,
        addmoney: rechargeData.addmoney,
        applyid: rechargeData.applyid,
        bankCode: rechargeData.bankCode,
        bankid: rechargeData.bankid,
        cardno: rechargeData.cardno,
        cardTypeCode: rechargeData.cardtype,
        cvv: rechargeData.cvv,
        mobile: rechargeData.mobile,
        realCardNo: rechargeData.realCardNo,
        rectype: rechargeData.rectype,
        sessionToken: rechargeData.sessionToken,
        tradeno: rechargeData.tradeno,
        validDate: rechargeData.validDate,
      })
    } else {
      let state = this.props.location.query.state
      if (state) {
        let rechargeData = JSON.parse(state)
        console.log(1111,rechargeData)
        this.setState({
          first: rechargeData.first,
          addmoney: rechargeData.addmoney,
          applyid: rechargeData.applyid,
          bankCode: rechargeData.bankCode,
          bankid: rechargeData.bankid,
          cardno: rechargeData.cardno,
          cardTypeCode: rechargeData.cardtype,
          cvv: rechargeData.cvv,
          mobile: rechargeData.mobile,
          realCardNo: rechargeData.realCardNo,
          rectype: rechargeData.rectype,
          sessionToken: rechargeData.sessionToken,
          tradeno: rechargeData.tradeno,
          validDate: rechargeData.validDate,
        })
      } else {
        hashHistory.push('recharge')
      }
    }
  }

  // 短信验证码倒计时
  countDown(time, e) {
    if (time >= 0) {
      setTimeout(() => {
        e.innerHTML = time + ' s';
        this.countDown(--time, e)
      }, 1000)
    } else {
      e.innerHTML = '重新发送';
      this.setState({
        sendCode: false
      })
    }
  }

  // 验证码输入
  inputCode(value) {
    let code = value.replace(/\D/g, '');
    document.getElementById('smsCode').value = code;
    if (!utils.checkIsNull(code)) {
      this.setState({
        codeOk: true,
        verifycode: code
      })
    } else {
      this.setState({
        codeOk: false,
        verifycode: code
      })
    }
  }

  // 重新发送验证码
  reSend() {
    this.setState({
      sendCode: true
    }, () => {
      let first = this.state.first;
      recharge(first).then(result => {
        console.log(result)
        if (result.code === '0') {
          let row = result.row;
          this.setState({
            applyid: row.applyid || '',
            sessionToken: row.sessionToken || '',
            tradeno: row.tradeno || '',
          })
        } else {
          Toast.info(result.desc, 1, null, false)
        }
      })
      document.getElementById('reSendBtn').innerHTML = '60 s';
      this.countDown('59', document.getElementById('reSendBtn'))
    })
  }

  rechargeCheck() {
    let {mobile, addmoney, tradeno, bankCode, bankid, cardTypeCode, cardno, verifycode, applyid, validDate, cvv, rectype, sessionToken} = this.state
    this.setState({
      codeOk: false
    }, () => {
      let params = {
        addmoney: addmoney,
        bankid: bankid,
        mobile: mobile,
        tradeno: tradeno,
        bankCode: bankCode,
        cardtype: cardTypeCode,
        cardno: cardno,
        verifycode: verifycode,
        applyid: applyid,
        validDate: validDate,
        cvv: cvv,
        sessionToken: sessionToken
      }
      switch (rectype) {
        case rechargeConfig.recType.sft:
          sftRechargeConfirm(params).then(res => {
            this.rechargeCallBack(res)
          })
          break;
        case rechargeConfig.recType.ldys:
          ldysRechargeConfirm(params).then(res => {
            this.rechargeCallBack(res)
          })
          break;
        case rechargeConfig.recType.jdzf:
          jdzfRechargeConfirm(params).then(res => {
            this.rechargeCallBack(res)
          })
          break;
        default:
          Toast.info('该渠道暂不可用，请稍后再试！', 2, null, false)
          break;
      }
    })

  }

  //充值接口回调
  rechargeCallBack(result) {
    let _this = this;
    if (result && result.code === '0') {
      let rechargeSession = sessionStorage.getItem('rechargeSession')
      if (rechargeSession) {
        rechargeSession = JSON.parse(rechargeSession)
        let from = rechargeSession.from
        if (from && from === '0') {
          hashHistory.push({
            pathname: 'recharge/result',
            query: {
              applyid: this.state.applyid,
              addmoney: this.state.addmoney,
              czfs: this.state.czfs,
              cardTypeCode: this.state.cardTypeCode
            }
          })
        } else if (from && from === '1') {
          let hash = rechargeSession.hash;
          window.location.hash = hash
        }
      }

    } else {
      Toast.info(result.desc, 1, () => {
        _this.customFocusInst.focus()
      })
      this.setState({
        codeOk: true
      })
    }

  }

  render() {
    return (
      <div id="bankAdd">
        <CommonNavBar
          title="充值确认"
        />
        <div className="clearfix posRe">
          <div className="codeTips">请输入尾号 {this.state.realCardNo.substr(-4)} ，银行预留手机号收到的验证码</div>
          <List className="bankAddBox m_b40">
            <InputItem className="codeInput"
                       id="smsCode"
                       maxLength={8}
                       type="tel"
                       clear
                       onChange={value => this.inputCode(value)}
                       placeholder="请输入6位验证码"
                       ref={el => this.customFocusInst = el}
            >验证码</InputItem>
          </List>
          {/*class添加grayColor1按钮文字变灰色*/}
          <button className={this.state.sendCode ? "sendBtn grayColor1" : "sendBtn"}
                  onClick={this.state.sendCode ? '' : this.reSend}
                  id="reSendBtn">60 s
          </button>
        </div>
        <div className="rechargeBtn m_t60">
          <a onClick={this.state.codeOk ? this.rechargeCheck : ''}
             className={this.state.codeOk ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>确定</a>
        </div>
      </div>
    )
  }
}


export default ConfirmRecharge
