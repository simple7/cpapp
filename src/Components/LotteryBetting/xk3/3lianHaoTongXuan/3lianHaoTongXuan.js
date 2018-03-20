'use strict'
import React, {Component} from 'react'

export class ThreelianHaoTongXuan extends Component {

  render() {
    const {ConHeight} = this.props;
    return (
      <div className="xk3Betting"  style={{height: ConHeight,overflow: 'auto'}}>
        <div>
          {/*下拉往期*/}
          <section className="beforePeriods" style={{display:"block"}}>
            <ul className="ul_1 clearfix">
              <li className="li_1">038期</li>
              <li className="li_2">
                <span>06</span><span>06</span><span>06</span>
                <span className="color999">三不同号</span>
              </li>
            </ul>
            <ul className="ul_1 clearfix">
              <li className="li_1">038期</li>
              <li className="li_2">
                <span>06</span><span>06</span><span>06</span>
                <span className="color999">二同号</span>
              </li>
            </ul>
            <ul className="ul_1 clearfix">
              <li className="li_1">038期</li>
              <li className="li_2">
                <span>06</span><span>06</span><span>06</span>
                <span className="color999">三不同号</span>
              </li>
            </ul>
            <ul className="ul_1 clearfix">
              <li className="li_1">038期</li>
              <li className="li_2">
                <span className="color78">02:34后开奖</span>
              </li>
            </ul>
            <ul className="ul_1 clearfix">
              <li className="li_1">038期</li>
              <li className="li_2">
                <span className="color78">02:34后开奖</span>
              </li>
            </ul>

          </section>
          <section className="currentPeriods">
            <p className="arrowP"></p>{/* 加上 up 箭头向上*/}
          </section>

        </div>
        {/*猜中开奖号码即可中奖*/}
        <div className="xk3Title_1">
          <p className="p1">猜中开奖号码即中奖<span>10</span>元</p>
          <div className="redBallTitle_position clearfix">
            <p className="MissingP">遗漏</p>
          </div>
        </div>
        {/*选号*/}
        <div className="NumChoice">
          <div className="column column1">
            <div className="">{/*class redBg 选中*/}
              <p className="p4">
                <span>123</span>
                <span>234</span>
                <span>345</span>
                <span>456</span>
              </p>
            </div>
          </div>
          <div className="column_missing column_missing1">
            <div className="redColor">1</div>
          </div>

        </div>

        {/*下一步  参照 和值*/}

      </div>
    )
  }
}

