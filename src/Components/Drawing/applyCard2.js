'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Drawing/applyCard.css'

import resultSuccess from "../../Img/Drawing/successIcon.png"

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

        <div className="applySuccess">
          <img src={resultSuccess}/>
          <p className="p1">申请提交成功</p>
          <p className="p2">我们会在1个工作日内完成审核，请</p>
          <p className="p2">您耐心等待</p>
        </div>

        <div className="applyTips">
          <p>*注：审核状态下将无法进行提款操作</p>
          <p>审核完成系统会发送短信通知您审核结果</p>
        </div>
      </div>
    )
  }
}

export default ApplyCard
