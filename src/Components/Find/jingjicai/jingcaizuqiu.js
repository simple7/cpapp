'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import {jczqList} from '../../../Stubs/API'
import utils from '../../../common/utils'
import questionIcon from "../../../Img/Find/questionIcon.png"
import CommonNavBar from '../../CommonComts/CommonNavBar'
import LotteryPop from '../../../common/lotteryPop'
import {StickyContainer, Sticky} from 'react-sticky';
import commonConfig from '../../../config/commonConfig'
import moment from 'moment';
import '../../../Style/Find/lotteryResults.css'

class ZuqiuJingcai extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      date: [],
      data: {},
      questionPosition: {top: 0},
      popShow: false,
      noResult: false,
      isRender: false
    }
    this.getDateDesc = this.getDateDesc.bind(this)
    this.hidePop = this.hidePop.bind(this)
  }

  componentWillMount() {
    jczqList().then(result => {
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
    } else {
      let myNav = document.getElementsByClassName('myNav');
      let myNavHeight = 0
      if (myNav) {
        myNavHeight = myNav[0].style.height;
      }
      this.setState({
        questionPosition: {
          top: parseInt(myNavHeight) - 1,
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

//'http://mobile.9188.com/newzlk/img/team/team_' + result.hid + '.jpg'
  render() {
    let _this = this
    return (
      <div id="lotteryResults" style={{position: 'relative'}}>
        <CommonNavBar title="竞彩足球"/>
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
                  <div key={`jczq${index}`}>
                    <div className="lanqiuTime">{this.getDateDesc(item)}</div>
                    <div style={{zIndex: 10}}>
                      {_this.state.data[item].map((data, index) => {
                        let result = data.result,
                          odds = data.odds,
                          spf = [],
                          rqspf = [],
                          spfColor = [],
                          rqspfColor = [];
                        if (odds) {
                          spf = odds.spf.split(',');
                          rqspf = odds.rqspf.split(',')
                          spfColor = odds.spfColor.split(',')
                          rqspfColor = odds.rqspfColor.split(',')
                        }
                        return (
                          <div key={`jczqChild${index}`}
                               onClick={() => {
                                 location.href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${result.itemId}&type=${result.type}&flag=sk&rid=${result.id}&qc=${result.qc}`
                               }}
                               className="lanqiuBox">
                            <div className="box1">
                              <p className="p13">{result.jn + ' ' + result.ln}
                                {result.halfsc &&
                                <span className="span12">{'半场' + result.halfsc}</span>
                                }
                              </p>
                              <p className="p14">
                                <span className="span5">{result.hn.substr(0, 5)}</span>
                                <span className="span6">
                                  <img src={_this.state.isRender ?
                                    `${commonConfig.mobileDomain}/newzlk/img/team/team_${result.hid}.jpg`
                                    : require('../../../Img/Find/teamDefault.png')}/>
                              </span>
                                <span className="span7">{result.hsc + '-' + result.gsc}</span>
                                <span className="span8">
                               <img src={_this.state.isRender ?
                                 `${commonConfig.mobileDomain}/newzlk/img/team/team_${result.gid}.jpg`
                                 : require('../../../Img/Find/teamDefault.png')}/>
                              </span>
                                <span className="span9">{result.gn.substr(0, 5)}</span>
                              </p>
                              {odds ?
                                <div className="lanqiuUlPadd33">
                                  <ul className='lanqiuUl'>
                                    <li className="lanqiuUl_li1 grayBg line_b">0</li>
                                    <li
                                      className={"lanqiuUl_li3 line_b line_r " + (spfColor[0] === 'win' ? spfColor[1] + 'Color' : '')}>
                                      <span className="span10">主胜</span><span
                                      className="span11">{spf[0] || '-'}</span></li>
                                    <li
                                      className={"lanqiuUl_li3 line_b line_r " + (spfColor[0] === 'draw' ? spfColor[1] + 'Color' : '')}>
                                      <span className="span10">平</span><span
                                      className="span11">{spf[1] || '-'}</span></li>
                                    <li
                                      className={"lanqiuUl_li3 line_b " + (spfColor[0] === 'lose' ? spfColor[1] + 'Color' : '')}>
                                      <span className="span10">客胜</span><span
                                      className="span11">{spf[2] || '-'}</span>
                                    </li>

                                    {
                                      odds.rq &&
                                      <li className={"lanqiuUl_li1 " + (odds.rq.indexOf('-') !== -1 ? 'greenBg' : 'redBg')}>{odds.rq}</li>
                                    }
                                    {
                                      odds.rq &&
                                      <li className={"lanqiuUl_li3 line_r " + (rqspfColor[0] === 'win' ? rqspfColor[1] + 'Color' : '')}>
                                        <span className="span10">主胜</span><span
                                        className="span11">{rqspf[0] || '-'}</span>
                                      </li>
                                    }
                                    {
                                      odds.rq &&
                                      <li
                                        className={"lanqiuUl_li3 line_r " + (rqspfColor[0] === 'draw' ? rqspfColor[1] + 'Color' : '')}>
                                        <span className="span10">平</span><span
                                        className="span11">{rqspf[1] || '-'}</span>
                                      </li>
                                    }
                                    {
                                      odds.rq &&
                                      <li
                                        className={"lanqiuUl_li3 " + (rqspfColor[0] === 'lose' ? rqspfColor[1] + 'Color' : '')}>
                                        <span className="span10">客胜</span><span
                                        className="span11">{rqspf[2] || '-'}</span></li>
                                    }
                                    {!odds.rq &&
                                    <li className='lanqiuUl_li4'>未开售胜平负玩法</li>
                                    }

                                  </ul>
                                </div> :
                                <div className="lotteryEmpty">待竞彩官方公布开奖结果</div>
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
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

export default ZuqiuJingcai
