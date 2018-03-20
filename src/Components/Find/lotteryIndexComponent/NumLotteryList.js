/**
 * Created by Administrator on 2017/11/7.
 * liuheng
 */
import React, {Component} from 'react'
import {lotteryIdDes} from '../../../common/LotType'
import Fucai from '../../../Img/Find/fucai@3x.png'
import Tiyu from '../../../Img/Find/tiyu@3x.png'

const fontColor = {
  color: 'red'
};

const Spacing = {
  margin: '17px 0px 5px 0px'
}

/* 数字彩列表组件 */
export class NumLotteryList extends Component {
  constructor(props) {
    super(props);
    this.subDate = this.subDate.bind(this);
    this.weekDecide = this.weekDecide.bind(this);
  }

  weekDecide(d) {
    let dd = d;
    let index = '';
    const nUAnce = navigator.userAgent;
    if(!!nUAnce.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
      dd = dd.replace(/\-/g,'/');
    }else{
      dd = dd;
    }
    if(new Date(dd) == 'Invalid Date'){
      dd = dd.replace(/\-/g,'/');
    }
    index = new Date(dd).getDay();
    switch(index){
      case 1:
        return `周一`;
        break;
      case 2:
        return `周二`;
        break;
      case 3:
        return `周三`;
        break;
      case 4:
        return `周四`;
        break;
      case 5:
        return `周五`;
        break;
      case 6:
        return `周六`;
        break;
      case 0:
        return `周日`;
        break;
    }
  }

  subDate(d) {
    let dd = d;
    let week= this.weekDecide(d);
    dd = dd.substring(5,dd.length-9);
    return `${dd}（${week}）`
  }

  render() {
    const {NumLottery, ClickHashGoto} = this.props;

    return (
      <div>
        <div className="lotteryB">
          <p className="p1">
            <span className="span1">开奖结果</span>
          </p>
          <div className="div12">
            <a href="http://www.cwl.gov.cn/kjxx/" target="_blank" className="div1 divImg">
              <div className="divMark" ></div>
              <img src={Fucai} alt=""/>
              <div className="divbtn"><span>福彩开奖 每日21:15直播</span></div>
              <div className="divFont">双色球 福彩3D 七乐彩</div>
            </a>
            <a href="http://www.lottery.gov.cn/ygkj/index.html" target="_blank" className="div2 divImg">
              <div className="divMark"></div>
              <img src={Tiyu} alt=""/>
              <div className="divbtn"><span>体彩开奖 每日20:25直播</span></div>
              <div className="divFont">大乐透 七星彩 排列三/五</div>
            </a>
          </div>
        </div>
        {
          NumLottery.map((item,index)=>{
            let gid = item.gid;
            const endtime =item.endtime.substring(11, item.endtime.length-3)
            return (
              <a key={item.gid} onClick={()=> {ClickHashGoto(item)}} className="lotteryA">
                <p className="p1">
                  <span className="span1">{lotteryIdDes[gid][1]}</span>
                  <span className="span2">{item.pid.substring(2,item.pid.length)}期</span>
                  <span className="span2">{this.subDate(item.awardtime)}</span>
                </p>
                {
                  item.code ?  <NumLottryGlobe NumLottery={item}/>:
                  <p style={Spacing}>
                    <span>今日 <em style={fontColor}>{endtime}</em> 开奖</span>
                  </p>}
              </a>
            )
          })
        }
      </div>
    )
  }
}
/* 数字彩列表组件 */

/* 数字彩球体组件 */
class NumLottryGlobe extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {NumLottery} = this.props;
    let code = NumLottery.code;
    let trycode = NumLottery.trycode;
    let redCode,blueCode;
    code = code.split('|');
    if(code.length === 1){
      redCode = code[0].split(',');
    }else{
      redCode = code[0].split(',');
      blueCode = code[1].split(',');
    }
    return (
      <p className="p2">
        {redCode && redCode.map((item,index)=> {
          return (
            <span key={index} className="ballSpan ballRed">{item}</span>
          )
        })}
        {blueCode && blueCode.map((item,index)=> {
          return (
            <span key={index} className="ballSpan ballBlue">{item}</span>
          )
        })}
        {
          trycode && <span className="span3">试机号:{trycode}</span>
        }
      </p>
    )
  }
}
/* 数字彩球体组件 */
