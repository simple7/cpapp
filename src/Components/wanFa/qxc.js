'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaQXC extends Component {

  render() {
    return (
      <div className="xlsj qxcDiv">
        <div className="titleDiv">玩法说明</div>
        <p>每期开出一个7位数作为开奖号码，第一至七位每位号码的范围为0~9</p>
        <div className="titleDiv">开奖时间</div>
        <p>每周二、五、日20:30开奖</p>
        <div className="titleDiv">中奖规则</div>
        <table className="xl_ta fc3DTable" cellSpacing="0" cellPadding="0">
          <tbody><tr>
            <td className="it-col1">奖级</td>
            <td className="it-col2">中奖条件</td>
            <td className="it-col3">奖金</td>
          </tr>
          <tr>
            <td rowSpan="2">一等奖</td>
            <td>
              <div className="it-state">按位猜中全部7位开奖号码</div>
            </td>
            <td rowSpan="2">最高500万</td>
          </tr>
          <tr><td><div className="it-info it-info_1">
            <div className="it-compare">
              <div className="itc-line">
                <span className="itc-caption">开奖</span>
                <div className="it-ball"><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div>
              </div>

              <div className="itc-line">
                <span className="itc-caption">投注</span>
                <div className="it-ball"><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div>
              </div>

              <div className="it-arrow_1"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
            </div>
          </div></td></tr>
          <tr>
            <td>二等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中连续6位开奖号码 </div>
                  <div>例如投注：<b className="em">2 3 6 1 7 6 2</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">2</b><b className="em">3</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b className="em">6</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b className="em">3</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b className="em">6</b><b className="em">2</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>2</b><b>6</b><b>3</b><b>1</b><b>6</b><b>7</b><b>2</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>最高500万</td>
          </tr>
          <tr>
            <td>三等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中连续5位开奖号码 </div>
                  <div>例如投注：<b className="em">2 3 6 1 7 6 2</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">2</b><b className="em">3</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b className="em">3</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b className="em">6</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>2</b><b>6</b><b>3</b><b>1</b><b>6</b><b>7</b><b>2</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>1800元</td>
          </tr>
          <tr>
            <td>四等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中连续4位开奖号码 </div>
                  <div>例如投注：<b className="em">2 3 6 1 7 6 2</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">2</b><b className="em">3</b><b className="em">6</b><b className="em">1</b><b>8</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b>8</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b className="em">6</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>2</b><b>6</b><b>3</b><b>1</b><b>6</b><b>7</b><b>2</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>300元</td>
          </tr>
          <tr>
            <td>五等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中连续3位开奖号码 </div>
                  <div>例如投注：<b className="em">2 3 6 1 7 6 2</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">2</b><b className="em">3</b><b className="em">6</b><b>8</b><b>8</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b>8</b><b className="em">6</b><b className="em">1</b><b className="em">7</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>2</b><b>6</b><b>3</b><b>1</b><b>6</b><b>7</b><b>2</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>20元</td>
          </tr>
          <tr>
            <td>六等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中连续2位开奖号码 </div>
                  <div>例如投注：<b className="em">2 3 6 1 7 6 2</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">开奖</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">2</b><b className="em">3</b><b>8</b><b>8</b><b>8</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>8</b><b>8</b><b>8</b><b className="em">1</b><b className="em">7</b><b>8</b><b>8</b></div>
                    <div className="ite-col2 em">中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>2</b><b>6</b><b>3</b><b>1</b><b>6</b><b>7</b><b>2</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>
            </td>
            <td>5元</td>
          </tr>
          </tbody></table>
      </div>
    )
  }
}

export default WanFaQXC

