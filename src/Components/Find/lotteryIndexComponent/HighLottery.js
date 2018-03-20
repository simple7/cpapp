/**
 * Created by Administrator on 2017/11/7.
 * liuheng
 */
/**
 * Created by Administrator on 2017/11/7.
 * liuheng
 */

import React, {Component} from 'react'
import {lotteryIdDes} from '../../../common/LotType'
import {NumLotteryList} from './NumLotteryList'

/* 高频彩列表组件 */
export class HighLotteryList extends Component {
  constructor(props) {
    super(props);
    this.PidSbuString = this.PidSbuString.bind(this);
    this.StructureLottery = this.StructureLottery.bind(this);
  }

  /* 期数截取 */
  PidSbuString(pid,gid) {
    const len = pid.length;
    if(gid === '04'){
      return pid
    }
    return pid.substring(2, len);
  }

  /* 彩种结构区别判断 */
  StructureLottery(gid) {
    switch(gid){
      case '56':
      case '57':
      case '54':
      case '04':
      case '59':
      case '55':
        return true;
        break;
      case '06':
      case '09':
      case '08':
      case '10':
      case '58':
        return false;
        break;
    }
  }

  render() {
    const {HighLottery, ClickHashGoto} = this.props;
    return (
      <div>
        {
          HighLottery.map((item, index)=> {
            const gid = item.gid;
            const pid = item.pid;
            const awardtime = item.awardtime;
            const awarlen = awardtime.length;
            const ArrayCode = item.code.split(',');
            let StructureLottery = this.StructureLottery(gid);
            const total = Number(ArrayCode[0])+Number(ArrayCode[1])+Number(ArrayCode[2])
            return (
              <a key={index} onClick={()=> {ClickHashGoto(item)}} className="lotteryA">
                <p className="p1">
                  <span className="span1">{lotteryIdDes[gid][1]}</span>
                  <span className="span2">{this.PidSbuString(pid,gid)}期</span>
                  <span className="span2">{awardtime.substring(5,awarlen-9)}</span>
                  <span className="span2">{awardtime.substring(11,awarlen-3)}</span>
                </p>
                <p className="p2">
                  {
                    /* 排除快乐扑克 */
                    gid!== '58' && ArrayCode.map((item, index)=> {
                      return (
                        <span key={index} className={StructureLottery?
                          "ballSpan ballRed":`iconSpan iconSpan_${item}`}>{StructureLottery?item:''}</span>
                      )
                    })
                  }
                  {
                    /* 排除快乐扑克 */
                    (gid !== '58'&& !StructureLottery)?<span className="span3">和值:{total}</span>:''
                  }
                </p>
              </a>
            )}
          )
        }
      </div>
    )
  }
}
/* 高频彩列表组件 */
