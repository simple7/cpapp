'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {recharge} from '../../Stubs/API'
import moment from 'moment';
import 'moment/locale/zh-cn';
import utils from '../../common/utils'
import {createForm} from 'rc-form';
import rechargeConfig from '../../config/rechargeConfig'
import CommonNavBar from '../CommonComts/CommonNavBar'
import InfoPop from './popImg'
import '../../Style/Recharge/bankAdd.css'

import {NavBar, List, InputItem, DatePicker} from 'antd-mobile'

const Item = List.Item;
const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment().utcOffset(8).add(50,'years');

class childComponent extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      params: {},
      validDate: '',
      validDateDesc:'',
      cvv: '',
      showConfirm: false,
      cvvIcon:true,
      phonePopShow: false,
      showType:''
    }
    this.inputCVV = this.inputCVV.bind(this);
    this.cvvDate = this.cvvDate.bind(this);
    this.confirm = this.confirm.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.hidePop = this.hidePop.bind(this);
  }

  cvvDate(v) {
    let {params} = this.state
    let date = ''
    if(params.rectype === rechargeConfig.recType.jdzf){
      date= moment(v).format('YYMM')
    }else{
      date= moment(v).format('YY/MM')
    }
    let validDateDesc = moment(v).format('YY/MM')
    this.setState({
      validDate:date,
      validDateDesc:validDateDesc
    },()=>{
      this.showConfirm()
    })
    let a = document.getElementsByClassName('validateInput')[0].childNodes;
    a[2].style.display = 'none'
  }

  inputCVV(value) {
    if(value.trim().length>0){
      this.setState({
        cvvIcon: false
      })
    }else{
      this.setState({
        cvvIcon: true
      })
    }
    this.setState({
      cvv: value.replace(/\D/g, '')
    },()=>{
      this.showConfirm()
    })
  }

  componentWillMount() {
    let state = this.props.location.state
    if(state){
      let params = state.params;
      if (params) {
        this.setState({
          params: params
        })
      }
    }else{
      let state = this.props.location.query.state
      if(state){
        this.setState({
          params: JSON.parse(state).params
        })
      }
    }

  }

  confirm() {
    let params = this.state.params;
    params.validDate = this.state.validDate;
    console.log('===',this.state.validDate)
    params.cvv = this.state.cvv;
    recharge(params).then(result => {
      if (result.code === '0') {
        let row = result.row;
        hashHistory.push({
          pathname: '/recharge/rechageConfirm',
          state: {
            first: params,
            addmoney:params.addmoney,
            applyid: row.applyid,
            bankCode: params.bankCode,
            bankid:params.bankid,
            cardno: params.cardno,
            cardtype:params.cardtype,
            cvv:params.cvv,
            mobile: params.mobile,
            realCardNo: utils.aesCode(params.cardno),
            rectype:params.rectype,
            sessionToken: row.sessionToken || '',
            tradeno:row.tradeno || '',
            validDate:params.validDate
          }
        })
      } else {
        utils.wxMessage('', result.desc)
      }
    })
  }
  showConfirm(){
    if(this.state.validDate !== '' && this.state.cvv !== ''){
      this.setState({
        showConfirm: true
      })
    }else{
      this.setState({
        showConfirm: false
      })
    }
  }

  showInfo(type) {
    switch (type) {
      case 'cardInfo':
        utils.wxMessage('持卡人说明', '为了你的账户资金安全，只能绑定账户本人的银行卡。')
        break;
      case 'phoneInfo':
        this.setState({
          phonePopShow: true,
          showType:'phone'
        })
        break;
      case 'validate':
        this.setState({
          phonePopShow: true,
          showType:'validate'
        })
        break;
      case 'cvv':
        this.setState({
          phonePopShow: true,
          showType:'cvv'
        })
        break;
    }
  }

  hidePop() {
    this.setState({
      phonePopShow: false
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div id="bankAdd">
        <CommonNavBar
          title="填写银行卡信息"
        />
        <List className="bankAddBox m_b40">
          <DatePicker
            mode="date"
            className="cvvPick"
            title="选择日期"
            {...getFieldProps('date1', {
              onChange: v => {
                this.cvvDate(v)
              }
            })}
            minDate={zhNow}
            maxDate={maxDate}
            extra={<div onClick={() => this.showInfo('validate')} className="blueIcon"/>}
          >
            <InputItem className="blueInput validateInput"
                       id="validDate"
                       maxLength={6}
                       editable={false}
                       value = {this.state.validDateDesc}
                       clear
                       placeholder="请选择年份/月份"
            >有效期</InputItem>
          </DatePicker>
          <InputItem
                     id="CVV"
                     onChange={value => {
                       this.inputCVV(value)
                     }}
                     value={this.state.cvv}
                     type="tel"
                     maxLength={3}
                     clear
                     extra={this.state.cvvIcon?<div onClick={()=>this.showInfo('cvv')} className="blueIcon"/>:''}
                     placeholder="请输入卡背后三位"
          >CVV</InputItem>
        </List>
        <div className="rechargeBtn m_t60">
          <a onClick={this.state.showConfirm?this.confirm:''} className={this.state.showConfirm?"rechargeBtn1":"rechargeBtn1 disabledBtn"}>确定</a>
        </div>
        {this.state.phonePopShow &&
          <InfoPop hidePop={this.hidePop}  showType={this.state.showType}/>
        }
      </div>
    )
  }
}
const CreditInfo  = createForm()(childComponent)
export default CreditInfo
