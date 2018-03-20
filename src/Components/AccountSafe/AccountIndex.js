import React, {Component} from 'react'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {Link, hashHistory} from 'react-router'
import {UserIndexAPI, queryUserDefaultPwd} from '../../Stubs/API'
import {List} from 'antd-mobile'
import '../../Style/My/My_Center.css'
import '../../Style/accountSafe/account.css'

const Item = List.Item;

class Account extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userData: {},
      hasCard: '',
      hasPhone: '',
      pwdflag: ''
    }
    this.initialize = this.initialize.bind(this);
    this.checkIdAndPhone = this.checkIdAndPhone.bind(this);
  }

  componentWillMount() {
    this.initialize()
    this.checkDefaultPwd();
  }

  initialize() {
    const _this = this;
    if (!sessionStorage.getItem("userData")) {
      UserIndexAPI().then((data) => {
        if (data.code === '0') {
          this.checkIdAndPhone(data.user)
          this.setState({
            userData: data.user,
          });
        }
      }).catch((err) => {
        console.log(err);
      })
    } else {
      let userJsonStr = sessionStorage.getItem('userData');
      console.log(userJsonStr);
      let userData = JSON.parse(userJsonStr)
      this.checkIdAndPhone(userData)
      this.setState({
        userData: userData,
      });
    }
  }

  checkDefaultPwd() {
    queryUserDefaultPwd().then((res) => {
      if (res.code == '0') {
        this.setState({
          pwdflag: res.pwdflag.value
        })
      }
    })
  }

  checkIdAndPhone(data) {
    console.log('用户数据：', data)
    let idCard = data.idcard;
    let bindPhone = data.mobbind;
    if (idCard) {
      this.setState({
        hasCard: true
      })
    } else {
      this.setState({
        hasCard: false
      })
    }
    if (bindPhone === '0') {
      this.setState({
        hasPhone: false
      })
    } else {
      this.setState({
        hasPhone: true
      })
    }
  }

  render() {
    return (
      <div id="accountIndex">
        <CommonNavBar title="账户安全"/>
        <div className="div_45"></div>
        <List className="ListHeight">
          <Item activeStyle={{backgroundColor: '#fff'}} className={this.state.hasCard ? "" : "redColor"}
                extra={this.state.hasCard ? '已绑定' : "待完善"}
                arrow="horizontal" onClick={() => {
            if (this.state.hasCard) {
              hashHistory.push({
                pathname: '/accountSafe/idCardResult',
                state: {
                  userData: this.state.userData
                }
              })
            } else {
              hashHistory.push('/accountSafe/editIdCard')
            }

          }}>身份证</Item>
          <Item activeStyle={{backgroundColor: '#fff'}} className={this.state.hasPhone ? "" : "redColor"}
                extra={this.state.hasPhone ? '已绑定，可更换' : "待完善"}
                arrow="horizontal" onClick={() => {
            if (this.state.hasPhone) {
              hashHistory.push({
                  pathname: '/accountSafe/mobileResult',
                  state: {
                    userData: this.state.userData
                  }
                }
              )
            } else {
              hashHistory.push('/accountSafe/editMobile')

            }
          }}>手机号</Item>
        </List>
        <div className="div_45"></div>
        <List className="ListHeight">
          <Item
            activeStyle={{backgroundColor: '#fff'}}
            extra={""}
            arrow="horizontal"
            onClick={() => {
              let url = '/accountSafe/editPassword';
              if (this.state.pwdflag == '0') url = '/accountSafe/SetPassword'
              hashHistory.push({
                pathname: url,
                state: {
                  userData: this.state.userData
                }
              })
            }}
          >{this.state.pwdflag == '0' ? '设置密码' : '修改密码'}</Item>
        </List>
      </div>
    )

  }

}

class AccountIndex extends Component {

  render() {
    const {children} = this.props;
    let content = '';
    if (children) {
      content = children
    } else {
      content = <div>
        <Account/>
      </div>
    }
    return (
      <div id="MyCenter">
        {content}
      </div>
    )
  }
}

export default AccountIndex
