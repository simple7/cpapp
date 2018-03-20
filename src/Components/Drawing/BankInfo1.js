'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import  CommonBankInfo from './CommonBankInfo'

import '../../Style/Recharge/bankAdd.css'

class BankInfo1 extends Component {
  render() {
    return (
      <div id="bankAdd">
        <CommonBankInfo />
        <div className="footerBtn">
          <Link to="/Drawing/bankEdit">修改卡信息</Link>
        </div>
      </div>
    )
  }
}

export default BankInfo1
