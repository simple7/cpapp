'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Recharge/bankAdd.css'

import {List, InputItem, Picker, Toast} from 'antd-mobile'
import {setbankCardInformation, setbankName, setpickerValue} from '../../action/action.bankdraw'
import {connect} from 'react-redux'
import {BankCardInformation, BankCardBind} from '../../Stubs/API'
import utils from '../../common/utils'
import {Region} from '../../config/region'
import {createForm} from 'rc-form';
import CommonNavBar from '../CommonComts/CommonNavBar'

const Item = List.Item;
class BankEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnState1: false,
      btnState2: false,
      btnState3: false,
      pickerValue: null,
      branchName: null,
      branchInputState: false,
      name:''
    }
    this.initialize = this.initialize.bind(this);
    this.dataChangeBankname = this.dataChangeBankname.bind(this);
    this.MapRegion = this.MapRegion.bind(this);
    this.checkStateRegion = this.checkStateRegion.bind(this);
    this.submitData = this.submitData.bind(this);
    this.branchName = this.branchName.bind(this);
    this.bankOpen = this.bankOpen.bind(this);
  }

  componentWillMount() {
    this.initialize();
    this.dataChangeBankname();
    this.MapRegion();
    this.checkBranchInput();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bankName) {
      this.setState({
        name: nextProps.bankName
      },()=> {
        this.dataChangeBankname();
      })
    }
  }

  /* 数据初始化 */
  initialize() {
    const {bankCardInformation, bankName, bankRegion, dispatch} = this.props;
    const {name} = this.state;
    if(!bankName.name){ //若不存在开户银行名称
      dispatch(setbankName(bankCardInformation));
    }
    if(bankRegion.length != 2){  //若不存在开户城市
        dispatch(setpickerValue([bankCardInformation.prov,bankCardInformation.city]));
    }
    if (!bankCardInformation.rname) {
      BankCardInformation().then(res => {
        if (res.code === '0') {
          dispatch(setbankCardInformation(res.row));
          dispatch(setbankName(res.row));
          if(res.row.prov == '北京' ||
          res.row.prov == '重庆' ||
          res.row.prov == '天津' ||
          res.row.prov == '上海'){
            dispatch(setpickerValue([res.row.prov+'市', res.row.city+'市']));
          }else{
            dispatch(setpickerValue([res.row.prov, res.row.city]));
          }
          this.setState({
            branchName: res.row.bankbranch
          })
          this.dataChangeBankname();
          this.checkBranchInput();
        } else if (res.code === '1') {
          utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
            hashHistory.push('loginIndex')
          })
        }
      })
    }
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

  /* 检查 是否修改开户银行 */
  dataChangeBankname() {
    const {bankCardInformation, dispatch, bankName} = this.props;
    const {name} = this.state;
    if (name.bankname === bankCardInformation.bankname ||
      name.name === bankCardInformation.bankname ||
      bankName.bankname === bankCardInformation.bankname ||
      bankName.name === bankCardInformation.bankname) {
      this.setState({
        btnState1: false
      })
    } else {
      this.setState({
        btnState1: true
      })
    }
  }

  /* 检查 是否修改开户城市 */
  checkStateRegion(V) {
    const {bankCardInformation} = this.props;
    if (V[0] !== bankCardInformation.prov || V[1] !== bankCardInformation.city) {
      this.setState({
        btnState2: true
      })
    } else {
      this.setState({
        btnState2: false
      })
    }

  }

  /* 检测支行输入框是否显示 */
  checkBranchInput() {
    const {bankCardInformation, bankName} = this.props;
    //((bankName.needbranch=='YES') || bankCardInformation.bankbranch
    if (bankCardInformation.bankbranch && !bankName.needbranch) {
      this.setState({
        branchInputState: true
      })
    } else if (!bankCardInformation.bankbranch && !bankName.needbranch) {
      this.setState({
        branchInputState: false
      })
    } else if (bankName.needbranch == 'YES') {
      this.setState({
        branchInputState: true
      })
    }
  }

  /* 获取支行修改信息 */
  branchName(v) {
    const {bankCardInformation} = this.props;
    this.setState({
      branchName: v
    }, () => {
      if (bankCardInformation.bankbranch !== this.state.branchName
        && this.state.branchName) {
        this.setState({
          btnState3: true
        })
      } else {
        this.setState({
          btnState3: false
        })
      }
    })
  }

  /* 提交数据 */
  submitData() {
    const {bankCardInformation, dispatch, bankName, bankRegion} = this.props;
    if (this.state.btnState1 || this.state.btnState2 || this.state.btnState3) {
      const params = {
        flag: 2,//	 操作类型	 1- 初次绑定银行卡 2– 只修改银行卡开户行
        bankCode: bankName.bCode || bankCardInformation.bcode,	 //银行代码(规定的提款银行码)	 no	 绑定银行卡或修改开户行时才传此参数
        bankName: (this.state.branchInputState ?
          (this.state.branchName || bankCardInformation.bankbranch) : ''), //支行名称	 yes	 绑定银行卡或修改开户行时才传此参数
        cityid: bankRegion[1] || bankCardInformation.city, //市	 no	 绑定银行卡或修改开户行时才传此参数
        provid: bankRegion[0] || bankCardInformation.prov, //省	 no	 绑定银行卡或修改开户行时才传此参数
        mobileNo: this.state.mobile || '', //电话号码	 no
        realBankCode: bankName.code || "NOCHECK"
      }
      BankCardBind(params).then(res => {
        if (res.code === '0') {
          hashHistory.go(-1);
        } else {
          Toast.info(res.desc, 1, null, false);
          return false;
        }
      })
    }
  }

  bankOpen() {
    hashHistory.push('/drawing/bankOpen');
  }

  render() {
    const {getFieldProps} = this.props.form;
    const {bankCardInformation, dispatch, bankName, bankRegion} = this.props;
    const card =  bankCardInformation.card.replace(/^\d{4}/g,'****');
    return (
      <div id="bankAdd" className="drawingIndex">
        <CommonNavBar title="修改银行卡信息" />
        <List className="bankAddBox m_b40">
          <InputItem
            type="money"
            editable={false}
            placeholder={bankCardInformation.rname}
          >持卡人</InputItem>
          <InputItem
            type="money"
            placeholder={card}
            editable={false}
          >卡号</InputItem>
        </List>
        <List className="bankAddBox">
          <div onClick={this.bankOpen} className='bankEdit'>
            <InputItem
              className="blueInput blueInputRight"
              type="text"
              onChange={v => console.log(v)}
              value={bankName.bankname || bankName.name}
            >开户银行</InputItem>
          </div>
          <Picker
            data={this.state.district}
            title="开户城市"
            cascade={true}
            extra="请选择开户城市"
            value={bankRegion}
            onChange={v => this.setState({pickerValue: bankRegion}, () => {
              dispatch(setpickerValue(this.state.pickerValue));
              this.checkStateRegion(this.state.pickerValue);
            })}
            onOk={v => this.setState({pickerValue: v})}
            cols={2}
          >
            <Item arrow="horizontal">开户城市</Item>
          </Picker>
          <div className="bankEdit">
          <InputItem
            {...getFieldProps('inputclear', {
              onChange: (value) => {
                this.branchName(value)
              }
            })}
            editable={true}
            style={{display: (this.state.branchInputState ? '-webkit-box' : 'none')}}
            placeholder={bankCardInformation.bankbranch ? bankCardInformation.bankbranch : '请选择开户支行'}
          >开户支行</InputItem>
          </div>
        </List>
        <div className="rechargeBtn m_t60">
          <a onClick={this.submitData} className={(this.state.btnState1
          || this.state.btnState2
          || this.state.btnState3) ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>保存</a>
        </div>
      </div>
    )
  }
}

function select(state) {
  return {
    bankCardInformation: state.BankCardInformation,
    bankName: state.BankName,
    bankRegion: state.BankRegion
  }
}

export default connect(select)(createForm()(BankEdit))
