'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import {bjdcList} from '../../../Stubs/API'
import utils from '../../../common/utils'
import LotteryPop from '../../../common/lotteryPop'
import {StickyContainer, Sticky} from 'react-sticky';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import CommonNavBar from '../../CommonComts/CommonNavBar'
import _ from 'lodash'
import commonConfig from '../../../config/commonConfig'
import questionIcon from "../../../Img/Find/questionIcon.png"
import '../../../Style/Find/lotteryResults.css'


class ZuqiuDanchang extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      date: [],
      data: {},
      questionPosition: {top: 0},
      popShow: false,
      noResult: false,
      hasMore: true,
      isRender: false
    }
    this.pn = 1;
    this.tp = 1;
    this.getDateDesc = this.getDateDesc.bind(this)
    this.hidePop = this.hidePop.bind(this)
    this.getData = this.getData.bind(this)
    this.getMore = this.getMore.bind(this)
  }

  componentWillMount() {
    this.getData(this.pn)
  }

  getData(pn) {
    let _this = this
    if (pn <= _this.tp) {
      bjdcList(pn).then(result => {
        if (result) {
          let page = result.page;
          this.tp = parseInt(page.tp);
          let keys = Object.keys(result);
          for (let k in keys) {
            if (keys[k] !== 'page') {
              let obj = {};
              obj[keys[k]] = result[keys[k]];
              let a = _this.state.date
              _this.setState({
                date: pn === 1 ? new Array(keys[k]) : a.concat(new Array(keys[k])),
                data: pn === 1 ? obj : _.assign(_this.state.data,obj)
              })
            }
          }
        } else {
          this.setState({
            noResult: true
          })
        }
      })
    } else {
      this.setState({
        hasMore: false
      })
    }
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

  getMore() {
    this.pn = this.pn + 1
    this.getData(this.pn)
  }

  render() {
    let _this = this;
    function Template() {
      let arr = [];
      _this.state.date.map((item, index) => {
        arr.push(
          <div key={`zqdcList${index}`}>
            <div className="lanqiuTime">{_this.getDateDesc(item)}</div>
            <div>
              {_this.state.data[item] &&
                _this.state.data[item].map((data, index) => {
                let result = data.result,
                  odds = data.odds,
                  spf = [],
                  spfColor = [];
                if (odds) {
                  spf = odds.spf.split(',');
                  spfColor = odds.spfColor.split(',')
                }
                return (
                  <div key={`zqdcChild${index}`}
                       className="lanqiuBox">
                    <div className="box1">
                      <p className="p13">{result.ln}
                        {result.halfsc &&
                        <span className="span12">{'半场' + result.halfsc}</span>
                        }
                      </p>
                      <p className="p14">
                        <span className="span5">{result.hn.substr(0, 5)}</span>
                        <span className="span6">
                          <img src={_this.state.isRender?
                            `${commonConfig.mobileDomain}/newzlk/img/team/team_${result.hid}.jpg`
                            :require('../../../Img/Find/teamDefault.png')}/>
                        </span>
                        <span className="span7">{result.hsc + '-' + result.gsc}</span>
                        <span className="span8">
                          <img src={_this.state.isRender?
                            `${commonConfig.mobileDomain}/newzlk/img/team/team_${result.gid}.jpg`
                            :require('../../../Img/Find/teamDefault.png')}/>
                        </span>
                        <span className="span9">{result.gn.substr(0, 5)}</span>
                      </p>
                      {odds ?
                        <div className="lanqiuUlPadd33">
                          <ul className='lanqiuUl'>
                            <li className="lanqiuUl_li1 grayBg line_b">0</li>
                            <li
                              className={"lanqiuUl_li3 line_r " + (spfColor[0] === 'win' ? spfColor[1] + 'Color' : '')}>
                              <span className="span10">主胜</span><span
                              className="span11">{spf[0] === '0' ? '-' : parseFloat(spf[0]).toFixed(2)}</span>
                            </li>
                            <li
                              className={"lanqiuUl_li3 line_r " + (spfColor[0] === 'draw' ? spfColor[1] + 'Color' : '')}>
                              <span className="span10">平</span><span
                              className="span11">{spf[1] === '0' ? '-' : parseFloat(spf[1]).toFixed(2)}</span>
                            </li>
                            <li
                              className={"lanqiuUl_li3 " + (spfColor[0] === 'lose' ? spfColor[1] + 'Color' : '')}>
                              <span className="span10">客胜</span><span
                              className="span11">{spf[2] === '0' ? '-' : parseFloat(spf[2]).toFixed(2)}</span>
                            </li>
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
      return arr
    }

    return (
      <div id="lotteryResults" style={{position: 'relative'}}>
        <CommonNavBar title="足球单场"/>
        {this.state.popShow &&
        <LotteryPop hidePop={this.hidePop}/>
        }
        <div className="questionTips" onClick={() => {
          this.setState({popShow: true})
        }} style={this.state.questionPosition}><img src={questionIcon}/></div>
        {!this.state.noResult ?
          <InfiniteScroll
            height={_this.state.listHeight || 524}
            next={_this.getMore}
            hasMore={_this.state.hasMore}
            scrollThreshold={0.7}
            endMessage={
              <div className="end_div">
                <p className="end_p1">没有更多数据了</p>
              </div>
            }
          >
              {Template()}

          </InfiniteScroll>

          :
          <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
        }
      </div>
    )
  }
}

export default ZuqiuDanchang
