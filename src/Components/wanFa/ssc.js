'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/wanFa.less"

class WanFaSSC extends Component {

  render() {
    return (
      <div className="xlsj qxcDiv">
        <div className="titleDiv">玩法说明</div>
        <p>每期开出一个5位数作为开奖号码，万、千、百、十、个位,每位号码的范围为0~9</p>
        <div className="titleDiv">开奖时间</div>
        <p>每天共120期 <br />
          白天10:00-22:00开奖，10分钟一期，共72期<br />
          夜场22:00-01:55开奖，5分钟一期，共48期
        </p>
        <div className="titleDiv">中奖规则</div>
        <table className="xl_ta fc3DTable" cellSpacing="0" cellPadding="0">
          <tbody><tr>
            <td className="it-col1">玩法</td>
            <td className="it-col2">中奖条件</td>
            <td className="it-col3">奖金</td>
          </tr>
          <tr>
            <td>一星直选</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中开奖号码的最后1位 </div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">7</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">6</div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>10元</td>
          </tr>
          <tr>
            <td>二星直选</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中开奖号码的后2位</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">9</b><b className="em">7</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>7</b><b>9</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>100元</td>
          </tr>
          <tr>
            <td>二星组选</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中开奖号码后2位，顺序不限（对子不中奖）</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">9</b><b className="em">7</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">7</b><b className="em">9</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>6</b><b>1</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>50元</td>
          </tr>
          <tr>
            <td>二星组选和值</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中后2位开奖号码的数字之和</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">16</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">10</div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>50元(对子奖金100元)</td>
          </tr>
          <tr>
            <td>三星直选</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中开奖号码的后3位</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>7</b>
                      <b>0</b>
                      <b>9</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>1000元</td>
          </tr>
          <tr>
            <td>三星组三</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中开奖号码后3位且为组三，顺序不限（组三指3个号码中有2个相同）</div>
                  <div>开奖：<b className="em">6 1 0 9 9</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">9</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">9</b>
                      <b className="em">9</b>
                      <b className="em">0</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">9</b>
                      <b className="em">0</b>
                      <b className="em">9</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>0</b>
                      <b>0</b>
                      <b>9</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>320元</td>
          </tr>
          <tr>
            <td>三星组六</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>猜中开奖号码后3位且为组六，顺序不限（组六指3个号码各不相同）</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">7</b>
                      <b className="em">9</b>
                      <b className="em">0</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">0</b>
                      <b className="em">7</b>
                      <b className="em">9</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>7</b><b>7</b><b>9</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>160元</td>
          </tr>
          <tr>
            <td>五星直选</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中全部5位开奖号码</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">6</b>
                      <b className="em">1</b>
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>7</b>
                      <b>1</b>
                      <b>0</b>
                      <b>9</b>
                      <b>7</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>100000元</td>
          </tr>

          <tr>
            <td>五星通选<br/>一等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中全部5位开奖号码</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">6</b>
                      <b className="em">1</b>
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>7</b>
                      <b>1</b>
                      <b>0</b>
                      <b>9</b>
                      <b>7</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>20440元</td>
          </tr>
          <tr>
            <td>五星通选<br/>二等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中开奖号码的前3或后3位</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">6</b>
                      <b className="em">1</b>
                      <b className="em">0</b>
                      <b className="em">5</b>
                      <b className="em">2</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">5</b>
                      <b className="em">5</b>
                      <b className="em">0</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>7</b>
                      <b>1</b>
                      <b>0</b>
                      <b>9</b>
                      <b>9</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>220元</td>
          </tr>

          <tr>
            <td>五星通选<br/>三等奖</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中开奖号码的前2或后2位</div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">6</b>
                      <b className="em">1</b>
                      <b className="em">1</b>
                      <b className="em">5</b>
                      <b className="em">2</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b className="em">5</b>
                      <b className="em">5</b>
                      <b className="em">5</b>
                      <b className="em">9</b>
                      <b className="em">7</b>
                    </div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1">
                      <b>7</b>
                      <b>1</b>
                      <b>0</b>
                      <b>9</b>
                      <b>9</b>
                    </div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>20元</td>
          </tr>

          <tr>
            <td>大小单双</td>
            <td>
              <div className="it-info">
                <div className="it-state">
                  <div>按位猜中开奖号码后2位的大小单双属性 </div>
                  <div>开奖：<b className="em">6 1 0 9 7</b></div>
                </div>

                <ul className="it-example">
                  <li className="qcfd">
                    <div className="ite-col1">投注</div>
                    <div className="ite-col2">状态</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">大</b><b className="em">大</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">大</b><b className="em">单</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">单</b><b className="em">大</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b className="em">单</b><b className="em">单</b></div>
                    <div className="ite-col2"><b className="em">中奖</b></div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>大</b><b>双</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                  <li className="qcfd">
                    <div className="ite-col1"><b>小</b><b>单</b></div>
                    <div className="ite-col2">未中奖</div>
                  </li>
                </ul>
              </div>

            </td>
            <td>4元</td>
          </tr>
          </tbody></table>
        <div className="titleDiv">限号</div>
        <p>在销售过程中，彩票中心对每种投注方式对应的投注号码允许销售的最大投注注数(倍数)进行动态限制。您发起的方案（包括追号方案）中若包含被限号的号码，该方案将因限号无法出票，平台会在开奖前做撤单返款处理。</p>
      </div>
    )
  }
}

export default WanFaSSC

