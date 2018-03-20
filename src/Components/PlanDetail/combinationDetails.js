'use strict'
import React, {Component} from 'react'
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
    const {data, isflag} = this.props;
    const code = data && data.d_code.replace(/\s/g, '<br/>');
    const mul = data && data.d_mul;
    const gg = data && data.d_gg;
    const bonus = data && Number(data.d_bonus);
    const zjState = this.isFlag(isflag, bonus);
    return (
      <tr>
        <td className="td2 td21">
          {
            <p dangerouslySetInnerHTML={{__html: code}}></p>
          }
          <p className="grayColor">{mul}倍;{gg}</p>
        </td>
        <td className={bonus >0?"td3 redColor":"td3"}>{zjState}</td>
      </tr>
    )
  }
}

class CombinationDetails extends Component {
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
    const {hid, gid, index, isflag} = this.props.location.query;
    cpmxTicket(hid, gid).then(res => {
      this.setState({
        data: res.row[index] || res.row
      })
    })
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
    return (
        <div className="ticketDetails" style={{height: ConHeight, overflow: 'auto'}}>
          <table cellPadding={0} cellSpacing={0}>
            <thead>
            <tr>
              <th className="th2 th21">投注内容</th>
              <th className="th3">奖金</th>
            </tr>
            </thead>
            <tbody>
            {
              data && data instanceof Array ?
                data.detail.map((item, index) => {
                  return (
                    <ChildComponent data={item} key={index} isflag={isflag}/>
                  )
                })
                : data && data.detail.map((item, index) => {
                  return (
                    <ChildComponent data={item} key={index} isflag={isflag}/>
                  )
              })
            }
            </tbody>
          </table>
        </div>
    )
  }
}

export default CombinationDetails
