import React, {Component} from 'react';
import {hashHistory} from 'react-router'
import {redUseDetail} from '../../Stubs/API'
import CommonNavBar from '../CommonComts/CommonNavBar'
import Lottery from '../../config/lotteryInfo'
import {PlanNumber} from '../../common/LotType'
import utils from '../../common/utils'
import moment from 'moment'
import _ from 'lodash'
import '../../Style/My/RedUse.css'

import EmptyImg from "../../Img/MyIndex/emptyImg.png"

class RedUse extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      data: {},
      useData: [],
      noResult: false
    }
    this.redConfig = {
      id: {
        200: "用户充值", 201: "自购中奖", 202: "跟单中奖", 203: "中奖提成", 204: "追号中奖", 210: "自购撤单返款", 211: "认购撤单返款",
        212: "追号撤销返款", 213: "提现撤销返款", 214: "提款失败转款", 215: "保底返款", 216: "红包派送", 300: "转款", 100: "自购",
        101: "认购", 102: "追号", 103: "保底认购", 104: "提现", 105: "保底冻结", 99: "转账", 98: "套餐追号"
      }
    }

  }


  componentWillMount() {
    let item = this.props.location.query.item || ''
    item = JSON.parse(item)
    this.setState({
      data: item
    })
    console.log(item)
    let param = {
      cupacketid: item.rpid || '',
      flag: 31,
      pn: 1,
      ps: 20
    }
    redUseDetail(param).then(result => {
      if (result.row) {
        let row = result.row;
        !_.isArray(row)
        {
          row = [row]
        }
        this.setState({
          useData: row
        })
      } else {
        this.setState({
          noResult: true
        })
      }
    })
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  render() {
    let data = this.state.data
    let scale = data.scale
    let arr = []
    if (scale.indexOf('/') !== -1) {
      arr = scale.split('/')
    }
    return (
      <div id="RedUse">
        <CommonNavBar title="红包使用明细"/>
        <div className="listDivView" style={{height: this.state.listHeight}}>
          <div className="mingxi_wrap">
            <p className="p6">{data.rpname + (arr.length > 0 ? '(每满' + arr[1] + '减' + arr[0] + ')' : '')}</p>
            <div className="clearfix">
              <p className="clearfix p7">{`有效期至${moment(data.deaddate).format('YYYY-MM-DD')}`}</p>
              <p className="p8">{`余额：${data.rmoney}元`}</p>
            </div>
          </div>
          {
            this.state.useData.length > 0 &&
            <div className="jilu_list">
              {
                this.state.useData.map((item, index) => {
                  return (
                    <a className="jilu_a"
                       key={"syhb_" + index}
                       onClick={() => {
                         const pathname = item.zhid ? "/plandetail/zhxq" : PlanNumber[item.gid][3];
                         const query = item.zhid ? {
                           gid: item.gid,
                           tid: item.zhid
                         } : {
                           gid: item.gid,
                           hid: item.hid
                         };
                         hashHistory.push({
                           pathname: pathname,
                           query: query
                         })
                       }}
                    >
                      <div className="lineDiv">
                        <div className="clearfix div5">
                          <p className="p9">{Lottery.lot(item.gid) + ' | ' + this.redConfig.id[item.ibiztype]}</p>
                          <p className="p11">{`-${item.ibmoney}`}</p>
                        </div>
                        <div className="clearfix div6">
                          <p className="p10">{item.cadddate}</p>
                          <p className="p12">{`余额：${item.ibalance}`}</p>
                        </div>
                      </div>
                    </a>
                  )
                })
              }
            </div>
          }
          {
            this.state.noResult &&
            <div className="empty_box">
              <img src={EmptyImg}/>
              <p>暂无消费记录</p>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default RedUse
