/**
 * Created by Administrator on 2017/11/7.
 * liuheng
 */

import React, {Component} from 'react'
import {lotteryIdDes} from '../../../common/LotType'
import {NumLotteryList} from './NumLotteryList'

/* 竞技彩列表组件 */
export class CompLotteryList extends Component {
  constructor(props) {
    super(props);
    this.Data = this.Data.bind(this);
  }

  Data(d) {
    var DD = new NumLotteryList();
    return DD.subDate(d)
  }

  render() {
    const {CompLottery, ClickHashGoto} = this.props;
    return (
      <div>
        {
          CompLottery.map((item, index) => {
            const code = item.code.split(',');
            const pid = item.pid.split('|');
            return (
              <div key={index} onClick={() => {
                ClickHashGoto(item)
              }} className="lotteryA">
                <p className="p1">
                  <span className="span1">{lotteryIdDes[item.gid][1]}</span>
                  {
                    item.gid == '71' || item.gid == '70'
                      ? '' :
                      <span className="span2">{
                        (item.gid === '84' || item.gid === '71') ? pid[0] : pid[0].substring(2, item.pid.length)
                      }期</span>
                  }
                  <span className="span2">{this.Data(item.awardtime)}</span>
                </p>
                <p className={(item.gid == '80' || item.gid == '81') ? 'p2' : 'p3'}>
                  {
                    (item.gid == '80' || item.gid == '81') ?
                      code.map((item, index) => {
                        return (
                          <span className="greenSpan" key={index}>{item}</span>
                        )
                      }) :
                      <a>已开奖<span className="redColor">{code[0]}</span>场 主队<span className="redColor">{code[1]}胜</span>
                        {
                          item.gid == '71' || item.gid == '84' ?
                          <span className="greenColor">{code[2]}负</span> :
                          <span className="blueColor">{code[2]}平</span>
                        }
                        {code[3] && <span className="greenColor">{code[3] || 0}负</span>}</a>
                  }
                </p>
              </div>
            )
          })
        }
      </div>
    )
  }
}
/* 竞技彩列表组件 */
