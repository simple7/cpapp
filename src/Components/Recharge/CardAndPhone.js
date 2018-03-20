'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import utils from '../../common/utils';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {List, InputItem, DatePicker} from 'antd-mobile'
import {createForm} from 'rc-form';
import rechargeConfig from '../../config/rechargeConfig'
import '../../Style/Recharge/bankAdd.css'

const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment().utcOffset(8).add(50, 'years');
console.log(zhNow, maxDate)

class ChildComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      validDate: '',
      validDateDesc:'',
      cvv: '',
      ownShow: false,
      cvvIcon: true,
      phoneIcon: true,
    }
    this.confirm = this.confirm.bind(this);
    this.inputPhone = this.inputPhone.bind(this);
    this.cvvDate = this.cvvDate.bind(this);
    this.inputCVV = this.inputCVV.bind(this);
  }

  confirm() {
    if (!utils.checkPhone(this.state.phone)) {
      utils.wxMessage('温馨提示', '手机卡格式有误', () => {
        setTimeout(()=>{
          document.getElementById('phone').focus()
        },0)
      }, '确定')
    } else {
      this.props.getPhone(this.state.phone, this.state.validDate, this.state.cvv)
    }
  }


  inputPhone(value) {
    let phoneNo = value.replace(/\s/g, '');
    if (phoneNo.length > 0) {
      this.setState({
        phoneIcon: false,
        ownShow: true,
        phone: phoneNo
      })
    } else {
      this.setState({
        phoneIcon: true,
        ownShow: false,
        phone: phoneNo
      })
    }
  }

  inputCVV(value) {

    if (value.trim().length > 0) {
      this.setState({
        cvvIcon: false
      })
    } else {
      this.setState({
        cvvIcon: true
      })
    }
    this.setState({
      cvv: value.replace(/\D/g, '')
    })


  }

  cvvDate(v) {
    let date = ''
    if(this.props.rectype === rechargeConfig.recType.jdzf){
      date= moment(v).format('YYMM')
    }else{
      date= moment(v).format('YY/MM')
    }
    this.setState({
      validDate: date,
      validDateDesc:moment(v).format('YY/MM')
    })
    let a = document.getElementsByClassName('validateInput')[0].childNodes;
    a[2].style.display = 'none'
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div>
        <List className="bankAddBox m_bt40">
          <InputItem className="grayColor"
                     clear
                     editable={false}
                     value={this.props.bankName + ' ' + this.props.cardType}
          >卡类型</InputItem>
        </List>
        <div style={{display: this.props.cardTypeCode === '1' ? '' : 'none'}}>
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
              extra={<div onClick={() => this.props.showInfo('validate')} className="blueIcon"/>}
            >
              <InputItem className="blueInput validateInput"
                         id="validDate"
                         editable={false}
                         value={this.state.validDateDesc}
                         maxLength={6}
                         clear
                         placeholder="请选择年份/月份"
              >有效期</InputItem>
            </DatePicker>
            <InputItem id="CVV"
                       {...getFieldProps('cvv', {
                         onChange: value => {
                           this.inputCVV(value)
                         }
                       })}
                       value={this.state.cvv}
                       type="tel"
                       maxLength={3}
                       clear
                       placeholder="请输入卡背后三位"
                       extra={this.state.cvvIcon ?
                         <div onClick={() => this.props.showInfo('cvv')} className="blueIcon"/> : ''}
            >CVV</InputItem>
          </List>
        </div>
        <List className="bankAddBox">
          <InputItem
            {...getFieldProps('bankCard', {
              onChange: value => this.inputPhone(value)
            })}
            clear
            id="phone"
            type="phone"
            placeholder="请输入银行卡预留手机号"
            extra={this.state.phoneIcon ?
              <div onClick={() => this.props.showInfo('phoneInfo')} className="blueIcon"/> : ''}
          >手机号</InputItem>
        </List>
        <div className="rechargeBtn m_t60">
          <a onClick={this.props.confirmShow && this.state.ownShow ? this.confirm : ''}
             className={this.props.confirmShow && this.state.ownShow ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>确定</a>
        </div>
      </div>
    )
  }
}

const CardAndPhone = createForm()(ChildComponent)

export default CardAndPhone
