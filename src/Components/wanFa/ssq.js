'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaSSQ extends Component {

render() {
  return (
    <div className="xlsj">
      <div className="titleDiv">玩法说明</div>
      <p><b className="em">6</b>个红球和<b className="em1">1</b>个蓝球组成1注，单注2元</p>
      <div className="titleDiv">开奖时间</div>
      <p>每周二、四、日21:15开奖</p>
      <div className="titleDiv">中奖规则</div>
      <table className="xl_ta" cellSpacing="0" cellPadding="0">
        <tbody>
        <tr>
          <td>奖级</td>
          <td>中奖条件</td>
          <td>中奖说明</td>
          <td>奖金</td>
        </tr>
        <tr>
          <td>一等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
          <td>中6+1</td>
          <td>最高1000万</td>
        </tr>
        <tr>
          <td>二等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em></em></div></td>
          <td>中6+0</td>
          <td>最高500万</td>
        </tr>
        <tr>
          <td>三等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
          <td>中5+1</td>
          <td>3000元</td>
        </tr>
        <tr>
          <td rowSpan="2">四等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em></div>
          </td>
          <td>中5+0</td>
          <td rowSpan="2">200元</td>
        </tr>
        <tr>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
          <td>中4+1</td>
        </tr>
        <tr>
          <td rowSpan="2">五等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em></div>
          </td>
          <td>中4+0</td>
          <td rowSpan="2">10元</td>
        </tr>
        <tr>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
          <td>中3+1</td>
        </tr>
        <tr rowSpan="3">
          <td rowSpan="3">六等奖</td>
          <td><div className="it-ball it-ball-line"><em></em><em></em><em className="it-ball-blue"></em></div></td>
          <td>中2+1</td>
          <td rowSpan="3">5元</td>
        </tr>
        <tr>
          <td><div className="it-ball it-ball-line"><em></em><em className="it-ball-blue"></em></div></td>
          <td>中1+1</td>
        </tr>
        <tr>
          <td><div className="it-ball it-ball-line"><em className="it-ball-blue"></em></div></td>
          <td>中1+0</td>
        </tr>

        </tbody>
      </table>
    </div>
  )
  }
  }

  export default WanFaSSQ

