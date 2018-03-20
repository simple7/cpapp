'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

import '../../Style/Drawing/success.css'

import CommonNavBar from '../CommonComts/CommonNavBar'

import {NavBar,List, InputItem} from 'antd-mobile'
const Item = List.Item;
class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initData: {
                cashdate: '****',
                cpredicttime:'****'
            }
        }
        this.initialize = this.initialize.bind(this);
    }

    componentWillMount() {
        this.initialize();
    }

    initialize() {
        let {state} = this.props.location;
        this.setState({
            initData: state
        }, ()=> {console.log(this.state.initData)})

    }

    render() {
        const {initData} = this.state;
        const len = initData.cashdate.length
        const nowTime = initData.cashdate.substring(len-8, len-3)
        const endTime = initData.cpredicttime.substring(len-8, len-3)
    return (
      <div id="drawSuccess">
        <CommonNavBar title="提款详情" />
        <div className="DrawingMoney">
          <p className="p1">提款金额</p>
          <p className="p2">{initData.money+'.00'}</p>
        </div>
        <div className="successProgress">
            <div className="progressStep progressStep1">
                <div className="stepBox">
                    <div><p className="p3 active">申请成功</p><p className="p4">订单号:{initData.cashid}</p></div>
                    <div><p className="p5">今天 {nowTime}</p></div>
                </div>
            </div>
            <div className="progressStep progressStep2">
                <div className="stepBox">
                    <div><p className="p6">银行处理中</p></div>
                </div>
            </div>
            <div className="progressStep progressStep3">
                <div className="stepBox">
                    <div><p className="p6">提款成功</p></div>
                    <div><p className="p7">预计今天{endTime}</p></div>
                </div>
            </div>
        </div>
        <div className="successBtn">
          <a href="" className="kefuA">对此单有疑问？联系在线客服</a>
        </div>
      </div>
    )
  }
}

export default Success
