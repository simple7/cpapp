'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {getUserCardList, recharge} from '../../Stubs/API'
import utils from '../../common/utils'
import rechargeConfig from '../../config/rechargeConfig'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/Recharge/bankCard.css'

import {Icon} from 'antd-mobile'

class BankCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      money: this.props.location.query.addmoney,
      czfs: this.props.location.query.czfs,
      rechargeName: this.props.location.query.rechargeName,
      cardList: []
    }
    this.initialize = this.initialize.bind(this);
    this.addCard = this.addCard.bind(this);
    this.gotoManger = this.gotoManger.bind(this);
    this.doRecharge = this.doRecharge.bind(this);
  }



  initialize() {
    let czfs = this.state.czfs
    let verifycode = ''
    switch (czfs) {
      case 'ldys':
        verifycode = '';
        break;
      case 'jdzf':
        verifycode = '';
        break;
      case 'sft':
        verifycode = '2';
        break;
    }
    let params = {
      verifycode: verifycode,
      addmoney: this.state.money,
      mtype: 4
    }
    // 查询用户绑定银行卡列表
    if(czfs !=='ldys'){
      getUserCardList(params, 'noLoad').then(result => {
        if (result.code === '0') {
          if (result.row) {
            if (utils.checkIsArr(result.row) && result.row.length > 0) {
              this.setState({
                cardList: result.row
              })
            } else {
              this.setState({
                cardList: new Array(result.row)
              })
            }
          }
        } else if (result.code === '1') {
          hashHistory.push('loginIndex')
        }
      })
    }
  }

  //添加银行卡
  addCard() {
    hashHistory.push({
      pathname: 'recharge/addBank',
      state: {
        addmoney: this.state.money,
        czfs: this.state.czfs
      }
    })
  }

  gotoManger(item) {
    console.log(hashHistory)
    hashHistory.push({
      pathname: 'recharge/cardManage',
      state: {
        bankCode: item.bankid,
        cardtype: item.cardtype,
        cardno: utils.aesCode(item.cardno),
        bankname: item.bankname,
        userpayid: item.userpayid,
        linkimg: item.linkimg,
        cardtypename: item.cardtypename
      }
    })
  }

  // 已绑定银行卡充值
  doRecharge(item) {
    let czfs = this.state.czfs;
    console.log(czfs)
    let params = {
      addmoney: this.state.money,
      cardno: item.cardno,
      mobile: utils.aesCode(item.mobile),
      bankid: rechargeConfig.gateway[czfs].jjk,
      bankCode: item.bankid,
      cardtype: item.cardtype,
    }
    if (czfs === 'ldys') {
      params.handleflag = '2'
    }
    if (item.cardtype === '1') {
      params.bankid = rechargeConfig.gateway[czfs].xyk;
      params.czfs = this.state.czfs;
      hashHistory.push({
        pathname: '/recharge/creditInfo',
        state: {
          params: params,
        }
      })
    } else {
      recharge(params).then(result => {
        if (result.code === '0') {
          let row = result.row;
          hashHistory.push({
            pathname: '/recharge/rechageConfirm',
            state: {
              first: params,
              addmoney: this.state.money,
              czfs: this.state.czfs,
              cardtype: item.cardtype,
              cardno: item.cardno,
              realCardNo: utils.aesCode(item.cardno),
              bankCode: item.bankid,
              mtype: '4',
              applyid: row.applyid,
              sessionToken: row.sessionToken,
            }
          })
        } else {
          utils.wxMessage('', result.desc, null)
        }
      })
    }

  }

  render() {
    const _this = this;
    console.log(_this);
    return (
      <div id="bankCard">
        <CommonNavBar
          title={this.state.rechargeName}
        />
        <div className="bankBox">
          <div className="tips1">本次充值{this.state.money}元</div>
          <div className="bankCardEmpty">
            <p onClick={this.addCard}><span></span>添加银行卡</p>
          </div>
          {
            this.state.cardList.map((item, index) => {
              console.log(item)
              return (
                <div key={index} className={item.cardtype === '0' ? "bankCard bankCardRed" : "bankCard bankCardBlue"}>
                  <div onClick={() => this.doRecharge(item)} className="clearfix" style={{marginRight: '35px'}}>
                    <div className="bankCardFl">
                      <img src={item.linkimg}/>
                    </div>
                    <div className="bankCardFr">
                      <p className="p1">{item.bankname}</p>
                      <p className="p2">{item.cardtypename}</p>
                      <p className="p3"><span>****</span><span>****</span><span>****</span><span
                        className="span1">{utils.aesCode(item.cardno).substr(-4)}</span>
                      </p>
                    </div>
                  </div>
                  <Icon key="0" type="ellipsis" onClick={() => {
                    _this.gotoManger(item)
                  }}/>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default BankCard
