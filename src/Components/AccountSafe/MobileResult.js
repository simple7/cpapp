'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import '../../Style/Recharge/bankAdd.css'

import {NavBar, List, InputItem} from 'antd-mobile'

const Item = List.Item;

class Tel1 extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      userData: this.props.location.state.userData || '',
      phone: this.props.location.state.phone || '',
      mobile: ''
    }
  }

  componentWillMount() {
    let userDate = this.state.userData
    if (userDate) {
      let mobile = userDate.mobile
      mobile = utils.aesCode(mobile)
      let mobileHide = mobile.slice(3, -4)
      mobileHide = mobileHide.replace(/\S/g, '*')
      mobile = mobile.slice(0, 3) + mobileHide + mobile.slice(-4)
      this.setState({
        mobile: mobile,
      })
    }else if(this.state.phone){
      let mobile = this.state.phone
      let mobileHide = mobile.slice(3, -4)
      mobileHide = mobileHide.replace(/\S/g, '*')
      mobile = mobile.slice(0, 3) + mobileHide + mobile.slice(-4)
      this.setState({
        mobile: mobile,
      })
    }
  }

  render() {
    return (
      <div id="bankAdd">
        <CommonNavBar title="手机号"/>
        <div className="TelImg">
          <p>手机号已绑定</p>
        </div>

        <List className="bankAddBox">
          <InputItem
            type="money"
            editable={false}
            placeholder={this.state.mobile}
          >手机号</InputItem>
        </List>

        <div className="rechargeBtn m_t60"><Link to='/accountSafe/replaceMobile' className="rechargeBtn1">更换手机号码</Link></div>

      </div>
    )
  }
}

export default Tel1
