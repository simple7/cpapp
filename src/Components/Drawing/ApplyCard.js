'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Drawing/applyCard.css'

import resultSuccess from "../../Img/MyIndex/result_success.png"

import {NavBar,List, InputItem} from 'antd-mobile'
const Item = List.Item;
class ApplyCard extends Component {

  render() {
    return (
      <div id="applyCard">
        <NavBar leftContent=""
                mode="dark"
                onLeftClick={() => hashHistory.go(-1)}
                rightContent=""
        >申请换卡</NavBar>

        <div className="bankBox">
          <div className="changeTips">请提交持卡人*墨的身份证正反面的照片</div>
          <div className="changeCard changeId1"></div>
          <div className="changeCard changeId2"></div>
        </div>
        <div className="rechargeBtn bankInfoBtn">
          <Link to="/recharge/bankCard" className="rechargeBtn1 disabledBtn">下一步</Link>
        </div>
      </div>
    )
  }
}

export default ApplyCard
