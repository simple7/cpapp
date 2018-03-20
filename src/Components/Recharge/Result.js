'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {queryOrderStatus} from '../../Stubs/API'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {List, InputItem} from 'antd-mobile'
import '../../Style/Recharge/Result.css'

const Item = List.Item;

class Result extends Component {
  constructor() {
    super(...arguments);
    this.state = ({
      applyid: this.props.location.query.applyid || '',
      addmoney: this.props.location.query.addmoney || '0',
      cardTypeCode: this.props.location.query.cardTypeCode || '0',   //0：借记卡 1：信用卡
      status: '等待处理',
      rechargeFlag: 'wait',
      desc: '',
      getData:false
    })
  }

  componentWillMount() {
    let params = {
      applyid: this.state.applyid
    }
    queryOrderStatus(params).then(result => {
      console.log(result)
      if (result.code === '0') {
        let status = '',
          rechargeFlag = '';
        let row = result.row;
        if (row.value === '0') {
          status = '等待处理'
          rechargeFlag = 'wait'
        } else if (row.value === '1') {
          status = '充值成功'
          rechargeFlag = 'success'
        } else {
          status = '充值失败'
          rechargeFlag = 'fail'
        }
        this.setState({
          desc: row.rechargeWay,
          status: status,
          rechargeFlag: rechargeFlag,
          getData:true
        })
      }
    })
  }


  render() {
    return (
      <div id="resultBox">
        <CommonNavBar onLeftClick={() => hashHistory.push('my')} title='充值结果'/>
        {
          this.state.getData &&
          <div>
            <div className="resultImg">
              <img
                src={require('../../Img/MyIndex/result_' + this.state.rechargeFlag + '.png')}/>{/*resultFail失败图片  resultWait等待图片*/}
              <p className="p1">{this.state.status}</p>
              {/*<p className="p2">系统正在升级，请稍后重试</p>*/}
            </div>
            <List className="my-list resultList">
              <Item className="moneyItem" extra={'¥ ' + this.state.addmoney}>充值金额</Item>
              <Item className="rechargeType" extra={this.state.desc}>充值方式</Item>
              <Item extra={this.state.applyid}>订单号</Item>
            </List>
            <div className="rechargeBtn m_t60"><Link to="my" className="rechargeBtn1">确定</Link></div>
          </div>
        }
      </div>
    )
  }
}

export default Result
