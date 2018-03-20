'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import utils from '../../../common/utils'
import LotteryPop from '../../../common/lotteryPop'
import {jclqList} from '../../../Stubs/API'
import questionIcon from "../../../Img/Find/questionIcon.png"
import CommonNavBar from '../../CommonComts/CommonNavBar'
import commonConfig from '../../../config/commonConfig'
import {StickyContainer, Sticky} from 'react-sticky';
import moment from 'moment';


class Lanqiu extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      date: [],
      data: {},
      questionPosition: {top: 0},
      popShow: false,
      noResult: false,
      isRender:false
    }
    this.getDateDesc = this.getDateDesc.bind(this)
    this.hidePop = this.hidePop.bind(this)
  }

  componentWillMount() {
    jclqList().then(result => {
      if (result) {
        let keys = Object.keys(result).reverse()
        this.setState({
          date: keys,
          data: result
        })
      } else {
        this.setState({
          noResult: true
        })
      }
    })
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
    if (sessionStorage.getItem('headFlag')) {
      this.setState({
        questionPosition: {
          top: 0,
        }
      })
    }else{
      let myNav = document.getElementsByClassName('myNav');
      let myNavHeight = 0
      if(myNav){
        myNavHeight = myNav[0].style.height;
      }
      this.setState({
        questionPosition: {
          top: parseInt(myNavHeight)-1,
        }
      })
    }
  }
  componentDidUpdate() {
    if (this.state.date.length > 0 && !this.state.isRender) {
      this.setState({
        isRender: true
      })
    }
  }
  getDateDesc(date) {
    let fromNow = moment(date).valueOf() - (moment(moment().format('YYYYMMDD')).valueOf());
    let fromYesDay = moment(date).valueOf() - moment(moment().subtract(1, 'days').format('YYYYMMDD')).valueOf();
    if (fromNow >= 0) {
      return "今天" + moment(date).format('MM月DD日');
    } else if (fromYesDay >= 0) {
      return "昨天" + moment(date).format('MM月DD日');
    }
    return moment(date).format('MM月DD日')
  }

  hidePop() {
    this.setState({
      popShow: false
    })
  }

  render() {
    let _this = this
    return (
      <div id="lotteryResults" style={{position: 'relative'}}>
        <CommonNavBar title="竞彩篮球"/>
        {this.state.popShow &&
        <LotteryPop hidePop={this.hidePop}/>
        }
        <div className="questionTips" onClick={() => {
          this.setState({popShow: true})
        }} style={this.state.questionPosition}><img src={questionIcon}/></div>
        {!this.state.noResult ?
          <div className="listDivView" style={{height: this.state.listHeight}}>
            {
              this.state.date.map((item, index) => {
                return (
                  <div key={`jclq${index}`}>
                    <div className="lanqiuTime">{this.getDateDesc(item)}</div>
                    {_this.state.data[item].map((data, index) => {
                      let result = data.result,
                        odds = data.odds,
                        sf = [],
                        rfsf = [],
                        sfColor = [],
                        rfspColor = [];
                      if (odds) {
                        sf = odds.sf.split(',');
                        rfsf = odds.rfsf.split(',')
                        sfColor = odds.sfColor.split(',')
                        rfspColor = odds.rfspColor.split(',')
                      }
                      return (
                        <div key={`jclqChild${index}`}
                             className="lanqiuBox">
                          <div className="box1">
                            <p className="p13">{result.jcn + ' ' + result.matchName}</p>
                            <p className="p14">
                              <span className="span5">{result.gn.substr(0, 5)}</span>
                              <span className="span6">
                                <img src={_this.state.isRender?
                                  `${commonConfig.mobileDomain}/lqzlk/img/team/mobile/${result.guestTeamId}.png`
                                  :require('../../../Img/Find/teamDefault.png')}/>
                              </span>
                              <span className="span7">{result.gsc + '-' + result.hsc}</span>
                              <span className="span8">
                                <img src={_this.state.isRender?
                                  `${commonConfig.mobileDomain}/lqzlk/img/team/mobile/${result.homeTeamId}.png`
                                  :require('../../../Img/Find/teamDefault.png')}/>
                              </span>
                              <span className="span9">{result.hn.substr(0, 5)}</span>
                            </p>
                            {odds ?
                              <ul className='lanqiuUl'>
                                <li className="lanqiuUl_li1 grayBg line_b">0</li>
                                <li
                                  className={"lanqiuUl_li2 line_b line_r " + (sfColor[0] === 'lose' ? sfColor[1] + 'Color' : '')}>
                                  <span className="span10">客胜</span>
                                  <span className="span11">{sf[0] || '-'}</span></li>
                                <li
                                  className={"lanqiuUl_li2 line_b " + (sfColor[0] === 'win' ? sfColor[1] + 'Color' : '')}>
                                  <span className="span10">主胜</span>
                                  <span className="span11">{sf[1] || '-'}</span>
                                </li>
                                <li
                                  className={"lanqiuUl_li1 " + (odds.rf.indexOf('-') !== -1 ? 'greenBg' : 'redBg')}>{odds.rf}</li>
                                <li
                                  className={"lanqiuUl_li2 line_r " + (rfspColor[0] === 'lose' ? rfspColor[1] + 'Color' : '')}>
                                  <span className="span10">客胜</span>
                                  <span className="span11">{rfsf[0] || '-'}</span>
                                </li>
                                <li
                                  className={"lanqiuUl_li2 " + (rfspColor[0] === 'win' ? rfspColor[1] + 'Color' : '')}>
                                  <span className="span10">主胜</span>
                                  <span className="span11">{rfsf[1] || '-'}</span></li>

                              </ul> :
                              <div className="lotteryEmpty">待竞彩官方公布开奖结果</div>
                            }
                          </div>
                        </div>
                      )
                    })}

                  </div>
                )
              })
            }
          </div>
          :
          <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
        }
      </div>
    )
  }
}

export default Lanqiu
