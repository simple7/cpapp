import React,{Component,PropTypes } from 'react'
import '../Style/Pop.css'
import { Popaction } from '../action/action.pop'
import { connect } from 'react-redux'

import pop1 from "../Img/Find/questionIcon1.png"
import pop2 from "../Img/Find/questionIcon2.png"
import pop3 from "../Img/Find/questionIcon3.png"


class LotteryPop extends Component {
  constructor(){
    super(...arguments)
  }
  render() {
    return (
      <div id="Pop2">
        <div className="maskPop"></div>
        <div className="pop">
          <div className="popBody">
            <div className="closed" onClick={()=>{this.props.hidePop()}}></div>
            <div className="clearfix lotteryPop">
                <img src={pop1} className="margin_r20" />
                <div className="">
                  <p className="p20">官方开奖</p>
                  <p className="p21">本页面数据均来源于竞彩官方,赔率为官方公布的最终赔率</p>
                </div>
            </div>
            <div className="clearfix lotteryPop">
              <div className="margin_l40">
                <p className="p20">命中说明</p>
                <p className="p21"><span className="span20"></span>首赔，即最低赔率</p>
                <p className="p21"><span className="span21"></span>次赔，即次低赔率</p>
                <p className="p21"><span className="span22"></span>末赔，即最高赔率</p>
              </div>
              <img src={pop2} className="img1" />
            </div>
            <div className="clearfix lotteryPop">
              <img src={pop3} className="margin_r20"/>
              <div className="">
                <p className="p20">玩法技巧</p>
                <p className="p21">结合让球与非让球玩法，通过标色来观察比赛的冷热状况</p>
              </div>
            </div>
          </div>
          <div className="popFoot">
            <a className="btn1" onClick={()=>{this.props.hidePop()}}>我知道了</a>
          </div>
        </div>
      </div>
    )
  }
}



export default LotteryPop










