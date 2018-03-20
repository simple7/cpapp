import React, {Component} from 'react'
import utils from '../../common/utils'
import {Toast, Popup} from 'antd-mobile'
import commonConfig from '../../config/commonConfig'
import rechargeConfig from '../../config/rechargeConfig'
import {hashHistory} from 'react-router'
import {browser, AppJiek} from '../../common/AppApi'
import _ from 'lodash'
import {recharge, checkSetPassword, userBasicInfo} from '../../Stubs/API'

export default class RechargeCommon extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      bankList: [],
      uid: '',
      idCard: '',
      phone: '',
    }
    this.desc = {
      Y: 1,
      N: 0
    }
    this.doCharge = this.doCharge.bind(this)
    this.doBindRecharge = this.doBindRecharge.bind(this)
    this.getDesc = this.getDesc.bind(this)
  }

  componentWillMount() {
    let rechargeWay = this.props.rechargeWay;
    let bankList = []
    if (rechargeWay && rechargeWay.length > 0) {
      _.each(rechargeWay, item => {
        if (item.id === '1' && item.item) {
          let bindCard = item.item
          if (!_.isArray(bindCard)) {
            bindCard = [bindCard]
          }
          _.each(bindCard, it => {
            it.bindCard = true;
            bankList.push(it)
          })
        } else if (item.id !== '1') {
          bankList.push(item)
        }
      })
      bankList.sort((a, b) => {
        return this.desc[a['banStatus']] - this.desc[b['banStatus']]
      })
      this.setState({
        bankList: bankList,
      })
    }
    userBasicInfo().then(result => {
      if (result.code === '0') {
        let row = result.row;
        this.setState({
          uid: row.nickid,
          idCard: row.idcard,
          phone: row.mobbind
        })
      }
    })
  }

  componentWillUnmount() {
    AppJiek.hideDownload();
  }

  //获取充值渠道描述
  getDesc(item) {
    if (item.bindCard) {
      return item.bankName + (item.cardtype === '0' ? '借记卡' : '信用卡') + '(' + utils.aesCode(item.cardno).substr(-4) + ')'
    } else {
      return item.name
    }
  }

  // 已绑定银行卡充值
  doBindRecharge(item) {
    let params = {
      addmoney: this.props.payMoney,
      mobile: item.mobile,
      bankid: item.cardtype === '0' ? item.h5_dbankid : item.h5_cbankid,
      bankCode: item.bankcode,
      cardtype: item.cardtype,
      cardno: item.cardno,
      channel: item.channel,
      product: item.product,
      key: item.key,
      cardPass: '1', // 0:未绑定 1:已绑定
      rectype: item.rectype,
    }
    if (item.cardtype === '1') {
      hashHistory.push({
        pathname: '/recharge/creditInfo',
        query: {
          state: JSON.stringify({params: params})
        }
      })
    } else {
      recharge(params).then(result => {
        if (result.code === '0') {
          let row = result.row;
          hashHistory.push({
            pathname: '/recharge/rechageConfirm',
            query: {
              state: JSON.stringify({
                first: params,
                addmoney: params.addmoney,
                applyid: row.applyid || '',
                bankCode: params.bankCode,
                bankid: params.bankid,
                cardno: params.cardno,
                cardtype: params.cardtype,
                cvv: '',
                mobile: params.mobile,
                realCardNo: utils.aesCode(params.cardno),
                rectype: params.rectype,
                sessionToken: row.sessionToken || '',
                tradeno: row.tradeno || '',
                validDate: ''
              })
            }
          })
        } else {
          utils.wxMessage('', result.desc, null)
        }
      })
    }

  }

  /**
   * 点击盛付通充值
   * type:  7：银行卡-盛付通支付 18：支付宝new   19:微信支付   21：京东钱包   25：qq钱包  26:银行卡-一键支付
   */
  doCharge(item) {
    Popup.hide();
    let _this = this;
    let type = rechargeConfig.id[item.id]
    console.log('类型', type)
    console.log('222', item)
    let from = this.props.type;
    let hash = this.props.hash;
    let source = localStorage.getItem('agent');
    if (this.state.uid) {
      if (type === 'alipay'
        || type === 'jdzf'
        || type === 'weixin'
        || type === 'qq') {
        let bankId = item['h5_bankid'];
        if (type === rechargeConfig.recType.weixin &&
          (browser.versions._weixin || commonConfig.source.alipay == source)) {
          AppJiek.WeiXinAppOpenTip()
          return
        }
        let params = {
          addmoney: _this.props.payMoney,
          bankid: bankId,
          channel: item.channel,
          product: item.product,
          key: item.key,
        }
        console.log(params)
        //微信充值回调不支持带参数
        // let href = location.href.substring(0, location.href.indexOf('#/'))
        let href = commonConfig.domain+'new/'
        if (from === '0') {
          params.webcallbackurl = href + '#/my'
        } else if (from === '1') (
          params.webcallbackurl = href + hash
        )
        console.log(params.webcallbackurl)
        recharge(params).then(result => {
          console.log('返回结果：', result)
          if (result.code === '0') {
            let applyid = result.applyid.value
            let row = result.row;
            let payParam = '';
            console.log('===', type)
            if (type === 'jdzf') {
              payParam = decodeURIComponent(row.payParam.replace(/\+/g, '%20'));
              document.write(payParam);
            } else {
              if (type === 'alipay') {
                payParam = decodeURIComponent(row.payParam.replace(/\+/g, '%20'));
              } else if (type === 'weixin' || type === 'qq') {
                payParam = decodeURIComponent(row.prepay_url);
              }
              window.location.href = payParam;
            }

          }
        })
      } else {
        //保存充值前来源信息
        let params = {
          from: from,
        }
        if (from === '1') {
          params.hash = hash
        }
        sessionStorage.setItem('rechargeSession', JSON.stringify(params));

        //点击已经绑定的银行卡
        if (item.bindCard) {
          this.doBindRecharge(item)
          return;
        }

        checkSetPassword({uid: this.state.uid}).then(result => {
          console.log(result);
          if (result.code !== '0') {
            Toast.info(result.desc, 2, null, false)
          } else {
            let row = result.row;
            if (row.pwdflag === '0') {
              utils.showAlert('温馨提示', '该账户未设置密码', '去设置', () => {
                hashHistory.push('accountSafe/editPassword')
              })
            } else {
              if (this.state.phone === '0' || !this.state.phone) {
                utils.showAlert('温馨提示', '该账户未绑定手机号', '去绑定', () => {
                  hashHistory.push('accountSafe/editMobile')
                })
              } else if (utils.checkIsNull(this.state.idCard)) {
                utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
                  hashHistory.push('accountSafe/editIdCard')
                })
              } else {
                if (type === 'new') {
                  console.log(444)
                  hashHistory.push({
                    pathname: 'recharge/addBank',
                    query: {
                      addmoney: this.props.payMoney,
                      routeAdd: true,
                    }
                  })

                  // Popup.hide();
                  return
                }
                //单渠道充值
                let singlParams = {
                  h5_cbankid: item.h5_cbankid,
                  h5_dbankid: item.h5_dbankid,
                  key: item.key,
                  product: item.product,
                  rechargeType: item.rechargeType,
                  channel: item.channel,
                  rectype: item.rectype
                }
                hashHistory.push({
                  pathname: '/recharge/addBank',
                  query: {
                    addmoney: this.props.payMoney,
                    singlParams: JSON.stringify(singlParams)
                  }
                })
              }
            }

          }
        })
        // Popup.hide();
      }
    } else {
      utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
        // Popup.hide();
        hashHistory.push('loginIndex')
      })
    }
  }

  render() {
    return (
      <div className="CZPOP listDivView">
        <div className="title" style={{position: 'relative'}}>选择支付方式
          <span className="closedSpan" onClick={Popup.hide}>
      </span></div>
        <div className="popAll">
          {this.state.bankList.map((item, index) => {
            if (item.rectype !== '2') {
              return (
                <div
                  className={(+this.props.payMoney > +item.maxrecharge || item.banStatus === 'Y') ? 'popBtn twoLine' : 'popBtn'}
                  key={index}
                  onClick={(+this.props.payMoney > +item.maxrecharge || item.banStatus === 'Y') ? '' : () => {
                    this.doCharge(item)
                  }}>
                  <img src={item.linkimg} className="popImg"/>
                  {((+this.props.payMoney > +item.maxrecharge) || item.banStatus === 'Y') &&
                  <div className="popzz"/>
                  }
                  <p className="firstLine">{this.getDesc(item)}</p>
                  {item.banStatus === 'Y' &&
                  <p className="secondLine">{item.banContent}</p>
                  }
                  {
                    (+this.props.payMoney > +item.maxrecharge && item.banStatus === 'N') &&
                    <p className="secondLine">{`单笔交易上限为${item.maxrecharge}元`}</p>
                  }

                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }
}
