'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaFC3D extends Component {

  render() {
    return (
      <div className="xlsj qxcDiv">
        <div className="titleDiv">玩法说明</div>
        <p>每期开出一个3位数作为开奖号码，百、十、个位号码的范围为0～9</p>
        <div className="titleDiv">开奖时间</div>
        <p>每天晚上21:15开奖</p>
        <div className="titleDiv">中奖规则</div>
        <table className="xl_ta fc3DTable" cellSpacing="0" cellPadding="0">
          <tbody><tr>
            <td className="it-col1">玩法</td>
            <td className="it-col2">中奖条件</td>
            <td className="it-col3">奖金</td>
          </tr>
          <tr>
            <td rowSpan="2">直选</td>
            <td>
              <div className="it-state">按位猜中全部3位开奖号码</div>
            </td>
            <td rowSpan="2">1040元</td>
          </tr>
          <tr>
            <td><div className="it-info it-info_1">
              <div className="it-compare it-compare-number">
                <div className="itc-line">
                  <span className="itc-caption">开奖</span>
                  <div className="it-ball"><b>4</b><b>5</b><b>1</b></div>
                </div>

                <div className="itc-line">
                  <span className="itc-caption">投注</span>
                  <div className="it-ball"><b>4</b><b>5</b><b>1</b></div>
                </div>

                <div className="it-arrow"><span></span><span></span><span></span></div>
              </div>
            </div></td>
          </tr>
          <tr>
            <td>组三</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中组三的开奖号码，顺序不限（组三指3个开奖号码有2个相同）</div>
                  <div>例如投注：<b className="em">6 8</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd em">
                    <div className="ite-col1"><b>6</b><b>6</b><b>8</b></div>
                    <div className="ite-col2">中奖</div>
                  </li>
                  <li className="qcfd em">
                    <div className="ite-col1"><b>8</b><b>6</b><b>8</b></div>
                    <div className="ite-col2">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>6</b><b>1</b><b>8</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>6</b><b>6</b><b>6</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>346元</td>
          </tr>
          <tr>
            <td>组六</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中组六的开奖号码，顺序不限（组六指3个开奖号码各不相同）</div>
                  <div>例如投注：<b className="em">1 6 8</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd em">
                    <div className="ite-col1"><b>6</b><b>1</b><b>8</b></div>
                    <div className="ite-col2">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>6</b><b>6</b><b>8</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b>6</b><b>8</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>6</b><b>6</b><b>6</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>173元</td>
          </tr>
          </tbody></table>
      </div>
    )
  }
}

export default WanFaFC3D

