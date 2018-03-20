'use strict'
import React, {Component} from 'react'

export class TwotongHaoDanXuan extends Component {

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
        {/*与开奖号码按位相符即中奖1040元*/}

        <div className="xk3Title_1">
          <p className="p1">猜中开奖号码即可中奖<span>80</span>元</p>
          <div className="redBallTitle_position clearfix">
            <p className="MissingP">遗漏</p>
          </div>
        </div>
        {/*同号位*/}
        <div className="sameNumTitle">
          <span>同号位</span>
        </div>
        {/*选号*/}
        <div className="NumChoice">
          <div className="column column3">
            <div><p className="p3"><span>1</span><span>1</span></p></div>
            <div><p className="p3"><span>2</span><span>2</span></p></div>
            <div className="redBg"><p className="p3"><span>3</span><span>3</span></p></div>
          </div>
          <div className="column_missing column_missing3">
            <div className="redColor">1</div>
            <div>2</div>
            <div>3</div>
          </div>
          <div className="column column3">
            <div><p className="p3"><span>4</span><span>4</span></p></div>
            <div><p className="p3"><span>5</span><span>5</span></p></div>
            <div><p className="p3"><span>6</span><span>6</span></p></div>
          </div>
          <div className="column_missing column_missing3">
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
        {/*不同号位*/}
        <div className="sameNumTitle_1">
          <span>不同号位</span>
        </div>
        {/*选号*/}
        <div className="NumChoice">
          <div className="column column3">
            <div><p className="p3">1</p></div>
            <div><p className="p3">2</p></div>
            <div className="redBg"><p className="p3">3</p></div>
          </div>
          <div className="column_missing column_missing3">
            <div className="redColor">1</div>
            <div>2</div>
            <div>3</div>
          </div>
          <div className="column column3">
            <div><p className="p3">4</p></div>
            <div><p className="p3">5</p></div>
            <div><p className="p3">6</p></div>
          </div>
          <div className="column_missing column_missing3">
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>

        {/*下一步  参照 和值*/}

      </div>
    )
  }
}

