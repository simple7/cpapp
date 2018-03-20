'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import  CommonBankInfo from './CommonBankInfo'

import resultSuccess from "../../Img/MyIndex/result_success.png"

import {NavBar,List, InputItem} from 'antd-mobile'
const Item = List.Item;

class BankInfo extends Component {

  render() {
    return (
      <div id="bankAdd">
        <CommonBankInfo></CommonBankInfo>
        <div className="rechargeBtn bankInfoBtn">
          <Link to="/Drawing/BankDrawing" className="rechargeBtn1">立即提款</Link>
        </div>
      </div>
    )
  }
}

export default BankInfo
