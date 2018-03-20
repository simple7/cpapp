'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaDLT extends Component {

  render() {
    return (
      <div className="xlsj">
        <div className="titleDiv">玩法说明</div>
        <p><b className="em">5</b>个前区号码+<b className="em1">2</b>个后区号码组成1注，单注2元</p>
        <p>追加投注：对每注号码追加1元进行投注，如中奖可获得额外追加部分奖金</p>
        <div className="titleDiv">开奖时间</div>
        <p>每周一、三、六20:30开奖</p>
        <div className="titleDiv">中奖规则</div>
        <table width="100%" style={{border:0}} cellSpacing="0" cellPadding="0" className="xl_ta arial">
          <tbody>
          <tr>
            <td>奖级</td>
            <td>中奖条件</td>
            <td>奖金</td>
            <td>追加奖金</td></tr>
          <tr>
            <td>一等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
            <td>最高1000万</td>
            <td>最高600万</td>
          </tr>
          <tr>
            <td>二等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
            <td>最高500万</td>
            <td>最高300万</td>
          </tr>
          <tr>
            <td rowSpan="2">三等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em></em></div></td>
            <td rowSpan="2">最高500万</td>
            <td rowSpan="2">最高300万</td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td rowSpan="2">四等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
            <td rowSpan="2">200元</td>
            <td rowSpan="2">100元</td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td rowSpan="3">五等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em></em></div></td>
            <td rowSpan="3">10元</td>
            <td rowSpan="3">5元</td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td rowSpan="4">六等奖</td>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em></em></div></td>
            <td rowSpan="4">5元</td>
            <td rowSpan="4">--</td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em></em><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
          </tr>
          <tr>
            <td className="cm_fontsize"><div className="it-ball it-ball-line"><em className="it-ball-blue"></em><em className="it-ball-blue"></em></div></td>
          </tr>

          </tbody>
        </table>
        <div className="titleDiv">追加奖金计算</div>
        <p>追加投注仅参与一至五等奖的奖金分配。追加投注一、二、三等奖为浮动奖，四至五等奖为固定奖。如追加投注中得浮动奖，则追加投注奖金为当期基本投注对应单注奖金的60%。如追加投注中得固定奖，则追加投注奖金为当期基本投注对应单注奖金的50%。
        </p>

      </div>
    )
  }
}

export default WanFaDLT

