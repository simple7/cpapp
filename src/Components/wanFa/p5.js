'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaP5 extends Component {

  render() {
    return (
      <div className="xlsj qxcDiv h_all">
        <div className="titleDiv">玩法说明</div>
        <p>每期开出5位数作为开奖号码，每位号码的范围为0~9</p>
        <div className="titleDiv">开奖时间</div>
        <p>每天晚上20:30开奖</p>
        <div className="titleDiv">中奖规则</div>
        <table className="xl_ta" cellSpacing="0" cellPadding="0">
          <tbody><tr>
            <td className="it-col1">玩法</td>
            <td className="it-col2">中奖条件</td>
            <td className="it-col3">奖金</td>
          </tr>
          <tr>
            <td rowSpan="2">直选</td>
            <td>
              <div className="it-state">按位猜中全部5位开奖号码</div>
            </td>
            <td rowSpan="2">10万元</td>
          </tr>
          <tr>
            <td><div className="it-info">
              <div className="it-compare it-compare-number">
                <div className="itc-line">
                  <span className="itc-caption">开奖</span>
                  <div className="it-ball"><b>4</b><b>5</b><b>1</b><b>1</b><b>9</b></div>
                </div>

                <div className="itc-line">
                  <span className="itc-caption">投注</span>
                  <div className="it-ball"><b>4</b><b>5</b><b>1</b><b>1</b><b>9</b></div>
                </div>

                <div className="it-arrow"><span></span><span></span><span></span><span></span><span></span></div>
              </div>


            </div></td>
          </tr>
          </tbody></table></div>
    )
  }
}

export default WanFaP5

