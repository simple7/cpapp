'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Recharge/bankAdd.css'

import resultSuccess from "../../Img/MyIndex/result_success.png"

import {NavBar,List, InputItem} from 'antd-mobile'
const Item = List.Item;
class BankInfo extends Component {

  render() {
    return (
      <div id="bankAdd">
        <NavBar leftContent=""
                mode="dark"
                onLeftClick={() => hashHistory.go(-1)}
                rightContent={[
      ]}
        >银行卡信息</NavBar>
        <div className="bankChangeImg">
          <p>银行卡信息审核中</p>
        </div>
        <List className="bankAddBox m_b40">
          <InputItem
            type="money"
            editable={false}
            placeholder="*墨"
          >持卡人</InputItem>
          <InputItem className="checkInput"
            type="money"
            placeholder="6222 **** **** 7378 "
            editable={false}
            extra="核对卡号"
          >卡号</InputItem>
        </List>
        <List className="bankAddBox">
          <InputItem
            type="money"
            editable={false}
            placeholder="建设银行"
          >开户银行</InputItem>
          <InputItem
            type="money"
            editable={false}
            placeholder="上海"
          >开户城市</InputItem>
        </List>

      </div>
    )
  }
}

export default BankInfo
