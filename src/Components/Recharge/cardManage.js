'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {bankCardLimitInfo, unBindbankCard} from '../../Stubs/API'
import {NavBar, Icon, List, InputItem, Popup} from 'antd-mobile'
const Item = List.Item;
import utils from '../../common/utils'
import CommonNavBar from "../CommonComts/CommonNavBar";
import '../../Style/Recharge/cardManage.css'

class CardManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankCode: this.props.location.state.bankCode,
      cardtype: this.props.location.state.cardtype,
      userpayid: this.props.location.state.userpayid,
      cardno: this.props.location.state.cardno,
      bankname: this.props.location.state.bankname,
      linkimg: this.props.location.state.linkimg,
      limitData: {
        maxlimit: 1000,
        daylimit: 1000
      }
    }
    this.initialize = this.initialize.bind(this);
    this.doUnbind = this.doUnbind.bind(this);
    this.reBindCard = this.reBindCard.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  doUnbind() {
    const _this = this;
    Popup.show(
      <div className="JBPOP">
        <div onClick={() => {
          _this.reBindCard()
        }}>解除绑定
        </div>
        <div onClick={() => {
          Popup.hide()
        }}>取消
        </div>
      </div>,
      {animationType: 'slide-up'}
    )
  }

  initialize() {
    const _this = this;
    bankCardLimitInfo({
      bankCode: _this.state.bankCode,
      cardtype: _this.state.cardtype
    }).then(result => {
      if (result.code === '0') {
        console.log(result)
        _this.setState({
          limitData: result.info
        })
        console.log(_this.state)
      } else if (result.code === '1') {

      }
    })
  }

  reBindCard() {
    const _this = this;
    console.log(_this)
    unBindbankCard(
      {
        cardtype: _this.state.cardtype,
        bankCode: _this.state.bankCode,
        cardno: utils.aesEnCode(_this.state.cardno)
      }
    ).then(result => {
      console.log(result)
      if (result.code === '0') {
        Popup.hide()
        _this.props.router.goBack()
      } else if (result.code === '1') {

      }
    })
  }

  render() {
    const _this = this;
    return (
      <div id="cardManage">
        <CommonNavBar
          title="银行卡管理"
        />
        <div className="resultImg">
          <img src={_this.state.linkimg}/>{/*银行图标*/}
          <p className="p1"><span>{_this.state.bankname}</span><span>{_this.state.cardtypename}</span></p>
          <p className="p2">
            <span>****</span><span>****</span><span>****</span><span>{(_this.state.cardno).substr(-4)}</span>{/*<a>核对卡号</a>*/}
          </p>
        </div>
        <List className="my-list resultList">
          <Item className="cardFont">银行卡支付限额</Item>
          <Item extra={'￥'+_this.state.limitData.maxlimit}>单笔限额</Item>
          <Item extra={'￥'+_this.state.limitData.daylimit}>每日限额</Item>
        </List>
        <div className="div_68"/>
        <List className="ListHeight ListHeight1">
          <Item activeStyle={{backgroundColor: '#fff'}} onClick={this.doUnbind}>解绑</Item>
        </List>
      </div>
    )
  }
}

export default CardManage
