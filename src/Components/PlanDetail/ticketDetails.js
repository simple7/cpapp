'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import {cpmxTicket} from '../../Stubs/API'
import utils from "../../common/fangAnUtils";

import '../../Style/PlanDetail/ticketDetails.less'

class ChildComponent extends Component {
  constructor(props) {
    super(props);
  }

  isFlag(f,rmoney) {
    if(f){
      const isFlag = f;
      const mo = rmoney;
      if(isFlag == 1 || isFlag == 2 || isFlag == 3 || isFlag == 5){ //约单中
        return '待开奖'
      }else if(rmoney) {
        return mo
      }else {
        return '未中奖'
      }
    }
  }

  render() {
    const {data, hid, gid, index, isflag} = this.props;
    const time = data && data.ticketDate.split(' ');
    const code = data && data.code.replace(/\s/g, '<br/>');
    const mul = data && data.mul;
    const gg = data && data.gg;
    const gglen = gg && gg.split(',').length;
    const bonus = data && Number(data.bonus);
    const zjState = this.isFlag(isflag, bonus);
    return (
      <tr>
        <td className="td1">
          <p>{time[0]}</p>
          <p>{time[1]}</p>
        </td>
        <td className="td2">
          <p dangerouslySetInnerHTML={{__html: code}}></p>
          <p className="grayColor">{mul}倍;{gg}</p>
          {gglen>1 && <p className="lookP"><Link to={`/planDetail/cpxq?gid=${gid}&hid=${hid}&index=${index}&isflag=${isflag}`} >查看详情</Link></p>}
        </td>
        <td className={bonus > 0 ? "td3 redColor" : "td3"}>{zjState}</td>
      </tr>
    )
  }
}

class TicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isflag: '',
      ConHeight: 0
    }
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  componentDidMount() {
    this.setState({
      ConHeight : utils.setHeight()
    })
  }

  initialize() {
    const {hid, gid, isflag} = this.props.location.query;
    cpmxTicket(hid, gid).then(res => {
      this.setState({
        data: res.row
      })
    });
    this.setState({
      isflag: isflag
    })
  }

  TotalCom(data) {
    let total = 0;
    if (data) {
      if (data instanceof Array) {
        data.map((item, index) => {
          total += item.bonus
        })
      } else {
        total = data.bonus
      }
      return total
    }
    return false
  }

  render() {
    const {data, ConHeight, isflag} = this.state;
    const {hid, gid} = this.props.location.query;
    const total = this.TotalCom(data);
    console.log(isflag);
    return (
        <div className="ticketDetails" style={{height: ConHeight, overflow: 'auto'}}>
          <table cellPadding={0} cellSpacing={0}>
            <thead>
            <tr>
              <th className="th1">出票时间</th>
              <th className="th2">投注内容</th>
              <th className="th3">奖金</th>
            </tr>
            </thead>
            <tbody>
            {
              data && data instanceof Array ?
                data.map((item, index) => {
                  return (
                    <ChildComponent data={item} key={index} gid={gid} hid={hid} index={index} isflag={isflag}/>
                  )
                }) : data && <ChildComponent data={data} gid={gid} hid={hid} index={0} isflag={isflag}/>
            }
            <tr >
              {total&& total>0 && <td className="td4" colSpan="3">合计<span>{total}元</span></td>}
              </tr>
            </tbody>
          </table>
          <ul className="ticketDetailsUl">
            <li>出票明细的赔率为实际出票赔率</li>
            <li>比赛场次取消时，算奖赔率值按1.0计算</li>
            <li>算奖规则：计算单注的奖金，根据“四舍六入五成双”的原则保留2位小数，再乘以倍数即为总奖金</li>
          </ul>
        </div>
    )
  }
}

export default TicketDetails
