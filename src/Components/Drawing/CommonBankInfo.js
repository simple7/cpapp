/**
 * Created by Administrator on 2017/10/26.
 * liuheng
 */
'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'

import {List, InputItem, Modal } from 'antd-mobile'
import {setbankCardInformation} from '../../action/action.bankdraw'
import {BankCardInformation, CheckBankCardAPI} from '../../Stubs/API'
import utils from '../../common/utils'
import CommonNavBar from '../CommonComts/CommonNavBar'

const prompt = Modal.prompt;

class CommonBankInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      bankCardInf: {
        city: '**',
        prov: '**',
        card: '*****************',
        rname: '***',
        bankbranch: ''
      }
    };
    this.initialize = this.initialize.bind(this);
    this.checkBankcCard = this.checkBankcCard.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  /* 初始化数据
   * 获取银狐银行卡信息
    * */
  initialize() {
    const {bankCardInformation, dispatch} = this.props;
      BankCardInformation().then(res => {
        if(res.code === '0'){
          dispatch(setbankCardInformation(res.row));
        }else if(res.code === '1'){
          utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
            hashHistory.push('loginIndex')
          })
        }
      })
  }

  /* 银行卡号检测 */
  checkBankcCard(a) {
    if(a){
      const candno = utils.aesEnCode(a);
      CheckBankCardAPI({cardno: candno}).then(res=> {
        utils.showAlert('温馨提示', res.desc, '确定', () => {})
      })
    }
  }

  render() {
    const {bankCardInformation, dispatch} = this.props;
    const card = bankCardInformation.card.replace(/^\d{4}/g,'****');
    return (
      <div>
        <CommonNavBar title="银行卡信息"/>
        <div className="bankInfoImg">
          <p>提款银行卡已绑定</p>
        </div>
        <List className="bankAddBox m_b40">
          <InputItem
            type="money"
            editable={false}
            placeholder={bankCardInformation.rname}
          >持卡人</InputItem>
          <InputItem className="checkInput"
                     type="money"
                     placeholder={card}
                     editable={false}
                     extra={<p style={{marginTop:'5px'}} onClick={() =>
                       prompt('核对卡号', '卡号: '+card, [
                       { text: '取消' },
                       { text: '确认', onPress: value => this.checkBankcCard(value)},
                     ],  'default', null, ['请输入您的银行卡号'])}
                     >核对卡号</p>}
          >卡号</InputItem>
        </List>
        <List className="bankAddBox">
          <InputItem
            type="money"
            editable={false}
            placeholder={bankCardInformation.bankname}
          >开户银行</InputItem>
          <InputItem
            type="money"
            editable={false}
            placeholder={bankCardInformation.prov+' '+ bankCardInformation.city}
          >开户城市</InputItem>
          <InputItem
            type="money"
            editable={false}
            style={{display:(bankCardInformation.bankbranch?'-webkit-box':'none')}}
            placeholder={bankCardInformation.bankbranch}
          >开户支行</InputItem>
        </List>
      </div>
    )
  }
}

function select (state){
  //console.log(state.BankCardInformation);
  return {
    bankCardInformation: state.BankCardInformation
  }
}

export default connect(select)(CommonBankInfo)
