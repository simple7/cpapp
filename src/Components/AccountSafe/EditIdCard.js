'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {bindIdCard, queryUserDefaultPwd} from '../../Stubs/API'
import NeedPasswordPop from '../CommonComts/NeedPasswordPop'
import SetPassword from '../CommonComts/SetNewPwd'
import {List, InputItem, Toast} from 'antd-mobile'
import Regx from '../../common/Regx'
import utils from '../../common/utils'
import '../../Style/Recharge/bankAdd.css'

const Item = List.Item;

class Password extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      popShow: false,
      btnShow: false,
      setPwdPop: true,
      name: '',
      idCard: '',
      needBack: false,
      pwdflag: ''
    }
    this.inputPassword = this.inputPassword.bind(this);
    this.showBtn = this.showBtn.bind(this);
    this.hidePop = this.hidePop.bind(this);
    this.popConfirm = this.popConfirm.bind(this);
    this.setShowType = this.setShowType.bind(this);
    this.checkDefaultPwd = this.checkDefaultPwd.bind(this);
  }

  componentWillMount() {
    let query = this.props.location.query
    if (query && query.needBack) {
      this.setState({
        needBack: true
      })
    }
  }

  checkDefaultPwd() {
    return new Promise((resolve, reject) => {
      queryUserDefaultPwd().then((res) => {
        if (res.code == '0') {
          this.setState({
            pwdflag: res.pwdflag.value
          }, () => resolve())
        }
      })
    })
  }

  async inputPassword() {
    let name = this.state.name,
      idCard = this.state.idCard;
    if (name.trim() === '') {
      Toast.info('请输入姓名', 1, null, false)
    } else if (!Regx.checkName(name)) {
      Toast.info('姓名格式有误，请重新输入', 1, null, false)
    } else if (idCard.trim() === '') {
      Toast.info('请输入身份证号', 1, null, false)
    } else if (!Regx.checkIdCardNo(idCard)) {
      Toast.info('请输入正确的身份证号', 1, null, false)
    } else {
      this.checkDefaultPwd().then(() => {
        if (this.state.pwdflag == '0') {
          utils.showAlert("温馨提示", "该账户未设置密码", "去设置", () => {
            this.setShowType();
          });
        } else {
          this.setState({
            popShow: true
          })
        }
      }).catch((err) => {
        alert(err);
      });
    }
  }

  hidePop() {
    this.setState({
      popShow: false
    })
  }

  popConfirm(code) {
    let params = {
      flag: '7',
      realName: this.state.name,
      upwd: code,
      idCardNo: this.state.idCard
    }
    bindIdCard(params).then(result => {
      if (result.code === '0') {
        Toast.info('绑定成功', 1, null, false)
        if (this.state.needBack) {
          hashHistory.goBack()
        } else {
          hashHistory.push({
            pathname: '/accountSafe/idCardResult',
            state: {
              name: this.state.name,
              idCard: this.state.idCard
            }
          });
        }
      } else {
        Toast.info(result.desc, 1, null, false)
      }
    })
  }

  showBtn() {
    if (this.state.name.trim().length > 0 && this.state.idCard.trim().length > 0) {
      this.setState({
        btnShow: true
      })
    } else {
      this.setState({
        btnShow: false
      })
    }
  }

  setShowType() {
    const {setPwdPop} = this.state;
    this.setState({
      setPwdPop: !setPwdPop
    })
  }

  render() {
    return (
      <div>
        {this.state.setPwdPop && <div id="bankAdd">
          <CommonNavBar title='身份证'/>
          <div>
            {this.state.popShow &&
            <NeedPasswordPop hidePop={this.hidePop} confirm={this.popConfirm} title="绑定身份证验证"/>
            }
            <div className="tips1">
              <span className="tip"/>
              <span className="word">身份信息绑定后不得修改，请慎重操作</span>
            </div>
            <List className="bankAddBox m_bt40">
              <InputItem
                onChange={(v) => {
                  this.setState({
                    name: v
                  }, () => this.showBtn())
                }}
                clear
                value={this.state.name}
                maxLength='20'
                placeholder="请输入真实姓名"
                type="text"
                extra=""
              >姓名</InputItem>
              <InputItem
                onChange={(v) => {
                  this.setState({
                    idCard: v
                  }, () => this.showBtn())
                }}
                clear
                value={this.state.idCard}
                maxLength='19'
                placeholder="请输入身份证号"
                type="text"
                extra=""
              >身份证</InputItem>
            </List>
            <div className="rechargeBtn m_t60">
              <a onClick={this.state.btnShow ? this.inputPassword : null}
                 className={this.state.btnShow ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>确定</a>{/*disabledBtn为不可点击*/}
            </div>
          </div>
        </div>}
        {
          !this.state.setPwdPop && <SetPassword setShowType={this.setShowType}/>
        }
      </div>
    )
  }
}


export default Password
