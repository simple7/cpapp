'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {changePassword, loginout} from '../../Stubs/API'
import Regx from '../../common/Regx'
import {createForm} from 'rc-form';
import {List, InputItem, Toast} from 'antd-mobile'

import '../../Style/Recharge/bankAdd.css'

class childComponent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
      showBtn: false,
      newPasswordF: false
    }
    this.userData = ''
    this.userName = ''
    this.oldPassword = ''
    this.showBtn = this.showBtn.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }

  componentWillMount() {
    if (this.props.location.state) {
      this.userDate = this.props.location.state.userDate
    }
  }

  showBtn() {
    if (this.state.oldPassword.trim().length > 0 && this.state.newPassword.trim().length > 0 && this.state.rePassword.trim().length > 0) {
      this.setState({
        showBtn: true
      })
    } else {
      this.setState({
        showBtn: false
      })
    }
  }

  // 点击确定修改密码
  changePassword() {
    let oldPassword = this.state.oldPassword
    let newPassword = this.state.newPassword
    let rePassword = this.state.rePassword
    if (oldPassword.trim().length > 0 &&
      Regx.checkPassword(newPassword, this.refs.newPassword) &&
      Regx.checkPassword(rePassword, this.refs.rePassword)) {
      if (oldPassword === newPassword) {
        Toast.info('新密码不能和老密码相同', 1, null, false)
      } else if (newPassword !== rePassword) {
        Toast.info('两次输入的新密码不一致，请重新输入', 1, null, false)
        this.setState({
          newPassword: '',
          rePassword: '',
          newPasswordF: true
        })
      } else {
        let params = {
          flag: '2',
          newValue: newPassword,
          upwd: oldPassword
        }
        changePassword(params).then(result => {
          if (result.code === '0') {
            Toast.info('密码修改成功', 1, null, false);
            const storage = window.localStorage
            for (let i = 0; i < storage.length; i++) {
              let key = storage.key(i);
              if (key !== 'userName') {
                localStorage.removeItem(key)
              }
            }
            sessionStorage.clear();
            loginout('').then((d) => {
              if (d.code === '0') {
                hashHistory.push('/loginIndex');
              } else {
                //todo
              }
            }).catch((e) => {
              console.log(e);
            })

          } else {
            Toast.info(result.desc, 1, null, false)
          }
        })
      }
    }
  }

  render() {
    let _this = this;
    const {getFieldProps} = this.props.form;
    return (
      <div id="bankAdd" ref="qwe">
        <CommonNavBar title='修改密码'/>
        <div>
          <List className="bankAddBox m_bt40">
            <InputItem
              {...getFieldProps('oldPassword', {
                onChange: v => {
                  this.setState({
                    oldPassword: v
                  }, () => {
                    this.showBtn()
                  })
                }
              })}
              maxLength={31}
              ref="oldPassword"
              clear
              type="password"
              placeholder="请输入原密码"
            >原密码</InputItem>
          </List>
          <List className="bankAddBox">
            <InputItem
              {...getFieldProps('newPassword', {
                onChange: v => {
                  this.setState({
                    newPassword: v
                  }, () => {
                    this.showBtn()
                  })
                }
              })}
              placeholder="请输入新密码"
              ref="newPassword"
              type="password"
              value={this.state.newPassword}
              onFocus={() => {
                this.setState({
                  newPasswordF: false
                })
              }}
              focused={this.state.newPasswordF}
              clear
              maxLength={20}
              extra=""
            >新密码</InputItem>
            <InputItem
              {...getFieldProps('rePassword', {
                onChange: v => {
                  this.setState({
                    rePassword: v
                  }, () => {
                    this.showBtn()
                  })
                }
              })}
              placeholder="请再次输入新密码"
              ref="rePassword"
              type="password"
              value={this.state.rePassword}
              clear
              maxLength={20}
              extra=""
            >确认密码</InputItem>
          </List>

          <p className="passwordP">密码6-20位字母、数字的组合</p>
          <div className="rechargeBtn m_t60">
            <a
              className={this.state.showBtn ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}
              onClick={this.state.showBtn ? this.changePassword : null}
            >确定</a>{/*disabledBtn为不可点击*/}
          </div>
        </div>


      </div>
    )
  }
}

const Password = createForm()(childComponent);

export default Password
