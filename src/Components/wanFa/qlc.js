'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaQLC extends Component {

  render() {
    return (
      <div className="xlsj h_all">
        <div className="titleDiv">玩法说明</div>
        <p>每期开出<b className="em">7</b>个基本号码+<b className="em1">1</b>个特别号码作为开奖号码，每位号码的范围为01~30，顺序不限</p>
        <p>特别号码参与二等奖、四等奖和六等奖的奖级分配</p>
        <div className="titleDiv">开奖时间</div>
        <p>每周一、三、五21:15开奖</p>
        <div className="titleDiv">中奖规则</div>
        <table className="xl_ta"  cellSpacing="0" cellPadding="0">
          <tbody>
          <tr>
            <td className="it-col1">奖级</td>
            <td className="it-col2">中奖条件</td>
            <td className="it-col3">奖金</td>
          </tr>
          <tr>
            <td>一等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em></em><em></em></div></td>
            <td>最高500万</td></tr>
          <tr>
            <td>二等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
            <td>浮动</td></tr>
          <tr>
            <td>三等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em></em></div></td>
            <td>浮动</td></tr>
          <tr>
            <td>四等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
            <td>200元</td></tr>
          <tr>
            <td>五等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em></div></td>
            <td>50元</td></tr>
          <tr>
            <td>六等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
            <td>10元</td></tr>
          <tr>
            <td>七等奖</td>
            <td><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em></div></td>
            <td>5元</td></tr></tbody></table></div>
    )
  }
}

export default WanFaQLC

