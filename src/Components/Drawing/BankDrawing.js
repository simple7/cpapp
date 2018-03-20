'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Recharge/bankAdd.css'
import md5 from 'md5'
import CommonNavBar from '../CommonComts/CommonNavBar'

import {List, InputItem, Toast} from 'antd-mobile'
import {createForm} from 'rc-form';
import {BankCardInformation, DrawMoneyAPI, checkDrawMoneyValidity} from '../../Stubs/API'
import utils from '../../common/utils'
import commonConfig from '../../config/commonConfig'
import config from '../../common/config'
import NeedPasswordPop from '../CommonComts/NeedPasswordPop'

const Item = List.Item;
const Brief = Item.Brief;

class BankDrawing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initData: {
        tkMoneyDesc: '',
        linkimg: "https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png",
        card: '****',
        bankname: '****'
      },
      value: null,
      btnState: false,
      password: '',
      popShow: false
    }
    this.SAlert = null;
    this.submitClick = this.submitClick.bind(this);
    this.initialize = this.initialize.bind(this);
    this.btnStateValue = this.btnStateValue.bind(this);
    this.submitDraw = this.submitDraw.bind(this);
    this.checkDrawMoneyValidity = this.checkDrawMoneyValidity.bind(this);
    this.hidePop = this.hidePop.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentWillUnmount() {
    if (this.SAlert) {
      this.SAlert.close();
    }
  }

  /* 初始化数据 */
  initialize() {
    BankCardInformation().then(res => {
      if (res.code === '0') {
        this.setState({
          initData: res.row
        })
      } else if (res.code === '1') {
        utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
          hashHistory.push('loginIndex')
        })
      }
    })
  }

  /* 点击立即提款 */
  submitClick() {
    const {btnState, value, initData} = this.state;
    if (!btnState) {
      return false;
    }
    if (value < 10) {
      Toast.info('提款金额不能小于10元', 1.5, null, false);
      return false;
    }
    if (initData.dmoney < 10) {
      Toast.info('可提现金额小于10元，不能进行提款，若有疑问，可联系在线客服', 1.5, null, false);
      return false;
    }
    if (initData.drawNum <= 0) {
      Toast.info('今日提款次数小于1次，不能进行提款，若有疑问，可联系在线客服', 1.5, null, false);
      return false;
    }
    this.setState({
      popShow: true
    })
  }

  /* 提交提款数据 */
  submitDraw(p) {
    const password = p;
    const {value} = this.state;
    const params = {
      contents: md5(config.md5Constant),	//用户输入的密码	no
      tkMoney: value, //提款金额 	no
      tkType: 0,
      mtype: 4,
      logintype: 0
    };
    DrawMoneyAPI(params).then(res => {
      if (res.code === '0') {
        let data = res.row;
        hashHistory.push({
          pathname: '/drawing/success',
          state: {
            cashid: data.cashid,
            cashdate: data.cashdate,
            cpredicttime: data.cpredicttime,
            money: data.money,
            memo: data.memo,
            cconfdate: data.cconfdate,
            state: data.state,
            success: data.success
          }
        })
      } else {
        //Toast.info(res.desc)
        utils.wxMessage('', res.desc, null, '');
      }
    })
  }

  /* 检测提款 */
  checkDrawMoneyValidity(p) {
    const password = p;
    const {value} = this.state;
    const params = {
      contents: md5(password + config.md5Constant),	//用户输入的密码	no
      tkMoney: value, //提款金额 	no
      tkType: 0,
      mtype: 4,
      logintype: 0
    };
    return new Promise((resolve, reject) => {
      checkDrawMoneyValidity(params).then(res => {
        if (res.code == '0') {
          resolve();
        } else {
          utils.wxMessage('', res.desc, null, '');
        }
      })
    })
  }

  /* 按钮状态 接收输入金额 */
  btnStateValue(v) {
    this.setState({value: v})
    if (v) {
      this.setState({
        btnState: true
      })
    } else {
      this.setState({
        btnState: false
      })
    }
    return v
  }

  /* NeedPasswordPop子组件方法 点击弹出层隐藏 */
  hidePop() {
    this.setState({
      popShow: false
    })
  }

  /* NeedPasswordPop子组件方法 */
  confirm(code) {
    this.checkDrawMoneyValidity(code).then(() => {
      this.submitDraw(code);
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    const {btnState, initData} = this.state;
    const len = initData.card.length;
    let CardNum = initData.card.substring(len - 4, len);
    return (
      <div id="bankAdd">
        <CommonNavBar title="提款"/>
        <div className="topContent">
          <div className="drawingTips">{initData.tkMoneyDesc}</div>
          <List className="my-list m_b40">
            <Link to="/drawing/bankInfo1">
              <Item
                arrow="horizontal"
                thumb={initData.linkimg}
                multipleLine
                onClick={() => {
                }}
              >{initData.bankname}<Brief>尾号 {CardNum}</Brief>
              </Item>
            </Link>
          </List>
          <List className="bankAddBox m_b40">
            <InputItem
              {...getFieldProps('number', {
                normalize: (v) => {
                  if (v && (v.charAt(0) === '0' || v.indexOf('.') >= 0 || v.length > 8)) {
                    if (v.length < 8) {
                      this.btnStateValue(v.replace(/^0*(\d*).*$/, '$1'))
                      return v.replace(/^0*(\d*).*$/, '$1');
                    } else {
                      this.btnStateValue(v.substring(0, 8));
                      return v.substring(0, 8);
                    }
                  }
                  this.btnStateValue(v);
                  return v;
                }
              })}
              clear
              type="number"
              placeholder={"最少提款10元,可提现金额" + initData.dmoney + "元"}
            >金额</InputItem>
          </List>
          <div className="bankTips">{
            initData.drawNum > 0 ?
              `今日还可提款${initData.drawNum}次` :
              '今日提款次数已用完，请明日再使用'
          }</div>
          <div className="rechargeBtn">
            {/* to="/Drawing/success"  */}
            <a onClick={this.submitClick} className={btnState ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>立即提款</a>
          </div>
          {
            this.state.popShow && <NeedPasswordPop hidePop={this.hidePop} confirm={this.confirm} title="提款验证"/>
          }
          {/**/}
        </div>
        <div className="drawingWord"><Link to="/drawing/rules">提款规则</Link><a onClick={() => {
          hashHistory.push({
            pathname: 'linkPage',
            query: {
              url: commonConfig.domain+'help/',
              title: '帮助中心'
            }
          })
        }}>联系客服</a></div>
      </div>
    )
  }
}

export default createForm()(BankDrawing)
