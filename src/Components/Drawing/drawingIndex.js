'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {createForm} from 'rc-form';

import {List, InputItem, Picker, Toast} from 'antd-mobile'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/Recharge/bankAdd.css'
import utils from '../../common/utils'

import {setpickerValue, setbandcardNum, setbankName} from '../../action/action.bankdraw'
import {checkBankBin, BankCardBind} from '../../Stubs/API'
import {Region} from '../../config/region'

const Item = List.Item;

class InputList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      district: [{label: '北京市', value: '北京市', children: [{label: '北京市', value: '北京市'}]}],
      pickerValue: [],
      bankCode: null
    }
    this.MapRegion = this.MapRegion.bind(this);
    this.stateBranch = this.stateBranch.bind(this);
    this.CheckBankCode = this.CheckBankCode.bind(this);
    this.bankOpen = this.bankOpen.bind(this);
  }

  componentWillMount() {
    this.MapRegion();
  }

  componentWillUnmount() {
    document.activeElement.blur();
  }


  /* 遍历省市地址,修改数据结构 */
  MapRegion() {
    let total = [];
    /* map遍历方法在部分华为手机浏览器不兼容 */
    for (let index in Region) {
      total[index] = {label: Region[index].province, value: Region[index].province, children: []};
      let cities = Region[index].cities
      for (let i in cities) {
        total[index].children.push({label: cities[i], value: cities[i]});
      }
    }
    this.setState({
      district: total
    }, () => {
    })
  }

  /* 支行输入框状态判断 */
  stateBranch(state) {
    switch (state) {
      case 'YES':
        return true;
        break;
      case 'NO':
        return false;
        break;
      default:
        return false;
    }
  }

  /* 校验银行卡信息
  * v 输入的银行卡号
  * */
  CheckBankCode(v) {
    const {bankName} = this.props;
    v = v.replace(/\s/g, '');
    if (v.length === 9) {
      const D = utils.aesEnCode(v);
      checkBankBin({bankCard: D}).then(res => {
        if (res.code === "0") {
          if (bankName.name && res.bankcard.bankName !== bankName.name) {
            Toast.info('您的卡号与所选银行不一致', 2, null, false);
          }
        } else if (res.code === '1') {
          utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
            hashHistory.push('loginIndex')
          })
        }
      })
    }
  }

  bankOpen() {
    hashHistory.push('/drawing/bankOpen');
  }

  render() {
    const {getFieldProps} = this.props.form || null;
    const {dispatch, bankName, bankRegion, transmitData, bankCardNum} = this.props;
    const stateBranch = bankName.needbranch
    return (
      <div>
        <List className="bankAddBox m_b40">
          <div onClick={this.bankOpen}>
            <Item extra={bankName.name ? bankName.name : '请选择开户银行'}>
              开户银行
            </Item>
          </div>
          <InputItem className=""
                     clear
                     {...getFieldProps('bankCard', {
                       onChange: (value) => {
                         const a = value;
                         if (a.length < 32) {
                           dispatch(setbandcardNum(a))
                           transmitData(a, 'CardNum');
                           this.CheckBankCode(a);
                           return a
                         }
                       }
                     })}
                     id="cardNo"
                     placeholder="请输入卡号"
                     value={bankCardNum}
                     type="bankCard"
          >卡号</InputItem>
          <Picker
            data={this.state.district}
            title="开户城市"
            cascade={true}
            extra="请选择开户城市"
            value={bankRegion}
            onChange={v => this.setState({pickerValue: bankRegion}, () => {
              dispatch(setpickerValue(this.state.pickerValue));
            })}
            onOk={v => this.setState({pickerValue: v})}
            cols={2}
          >
            <Item>开户城市</Item>
          </Picker>
          <InputItem
            placeholder="请选择开户支行"
            type="text"
            onChange={v => transmitData(v, 'BranchName')}
            style={{display: ((this.stateBranch(stateBranch)) ? '' : 'none')}}
          >开户支行</InputItem>
        </List>
      </div>
    )
  }
}

const MoneyInputCom = createForm()(InputList);

class Drawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      realname: '***',
      branchname: null,
      btnState: false
    }
    this.transmitData = this.transmitData.bind(this);
    this.sessionStorage = this.sessionStorage.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(setpickerValue([]));
    dispatch(setbandcardNum(''));
    dispatch(setbankName(''));
    this.sessionStorage();
  }

  /* 接收子组件的传递卡号和支行名称 */
  transmitData(a, type) {
    if (type === 'CardNum') {
      let num = a.replace(/\s/g, '');
      if (num.length > 0) {
        this.setState({
          btnState: true
        })
      } else {
        this.setState({
          btnState: false
        })
      }
    } else if (type === 'BranchName') {
      this.setState({
        branchname: a
      })
    }
  }

  /* 获取session中的数据 */
  sessionStorage() {
    let userData = sessionStorage.userData;
    userData = JSON.parse(userData);
    let mobile = utils.aesCode(userData.mobile);
    this.setState({
      realname: userData.realname,
      mobile: mobile
    })
  }

  /* 提交绑卡数据 */
  submitData() {
    const {bankRegion, bankName, bankCardNum, dispatch} = this.props;
    const BankRegion = bankRegion;
    const BankName = bankName;
    let BankCardNum = bankCardNum;
    BankCardNum = BankCardNum.replace(/\s/g, '')
    const bankcode = utils.aesEnCode(BankCardNum);
    if (this.state.btnState) {
      const params = {
        flag: 1,//	 操作类型	 1- 初次绑定银行卡 2– 只修改银行卡开户行
        bankCard: bankcode,//卡号	 no	 绑定银行卡时才传此参数
        bankCode: BankName.bCode,	 //银行代码(规定的提款银行码)	 no	 绑定银行卡或修改开户行时才传此参数
        bankName: this.state.branchname, //支行名称	 yes	 绑定银行卡或修改开户行时才传此参数
        cityid: BankRegion[1], //市	 no	 绑定银行卡或修改开户行时才传此参数
        provid: BankRegion[0], //省	 no	 绑定银行卡或修改开户行时才传此参数
        mobileNo: this.state.mobile, //电话号码	 no
        realBankCode: BankName.code
      }
      if (BankCardNum.length >= 9) {
        if (BankName.bCode) {
          if (BankRegion.length == 2) {
            BankCardBind(params).then(res => {
              if (res.code === '0') {
                dispatch(setpickerValue([]));
                dispatch(setbandcardNum({}));
                hashHistory.push({pathname: "/drawing/bankInfo"})
              } else {
                Toast.info(res.desc, 1, null, false);
                return false;
              }
            })
          } else {
            Toast.info('请选择开户城市', 1, null, false);
            return false;
          }
        } else {
          Toast.info('请选择开户银行', 1, null, false);
          return false;
        }
      } else {
        Toast.info('请输入正确的银行卡号', 1, null, false);
        return false;
      }
    }
  }

  render() {
    let {children, dispatch, bankName, bankRegion, bankCardNum} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content = <div id="bankAdd" className="drawingIndex">
        <CommonNavBar title="绑定银行卡"/>
        <div className="codeTips">提款前，请先绑定
          <span className="redColor">{this.state.realname}</span>
          的银行卡<span className="tipsPop"></span>
        </div>
        <MoneyInputCom transmitData={this.transmitData} dispatch={dispatch}
                       bankName={bankName} bankRegion={bankRegion} bankCardNum={bankCardNum}/>
        <div className="rechargeBtn m_t60">
          <a className={this.state.btnState ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}
             onClick={this.submitData}>确认</a>
        </div>
      </div>
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

function select(state) {
  //console.log(state);
  return {
    bankName: state.BankName,
    bankRegion: state.BankRegion,
    bankCardNum: state.BankCardNum
  }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Drawing)
