/**
 * Created by Administrator on 2017/11/14.
 */
'use strict'
import React, {Component} from 'react'
import {awardList} from '../../../Stubs/API'
import utils from '../../../common/utils'
import LotteryPop from '../../../common/lotteryPop'
import {StickyContainer} from 'react-sticky';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import questionIcon from "../../../Img/Find/questionIcon.png"
import CommonNavBar from '../../CommonComts/CommonNavBar'
import '../../../Style/Find/lotteryResults.css'

class ShengFuGuoGuan extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      date: [],
      datainit: [],
      questionPosition: {top: '44px'},
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
    this.transition = this.transition.bind(this)
  }

  componentWillMount() {
    this.getData(this.pn)
  }

  getData(pn) {
    let _this = this
    if (pn <= _this.tp) {
      awardList(84,pn).then(result => {
        if (result) {
          let data = result.result.data;
          this.tp = parseInt(result.result.tp);
          _this.setState({
            datainit: pn == 1 ? data : _this.state.datainit.concat(data),
          })
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
          top: 0
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

  transition(result) {
    const ms = result.ms;
    const ss = result.ss;
    const lose = result.lose;
    const lms = Number(ms) - Number(lose);
    if(lms > ss){
      return '主胜'
    }else{
      return '客胜'
    }
  }

  render() {
    let _this = this;
    function Template() {
      let arr = [];
      _this.state.datainit && _this.state.datainit.map((data, index) => {
        let result = data,
          odds = data.odds,
          spf = [],
          spfColor = [];
        arr.push(
          <StickyContainer key={`zqdcList${index}`}>
            <div key={`zqdcChild${index}`} className="lanqiuBox">
              <div className="box3">
                <p className="p13">{result.mid +' '+result.mname}
                  {result.halfsc &&
                  <span className="span12">{'半场' + result.halfsc}</span>
                  }
                </p>
                <p className="p20">
                  <span className="span5">{result.mn.substr(0, 5)}</span>
                  <span className="span7">{result.ms + '-' + result.ss}</span>
                  <span className="span9">{result.sn.substr(0, 5)}</span>
                </p>
                <p className="p21">{(result.lose)+' '+_this.transition(result)}</p>
              </div>
            </div>
          </StickyContainer>)
       })
      return arr
    }

    return (
      <div id="lotteryResults" style={{position: 'relative'}}>
        <CommonNavBar title="胜负过关"/>
        {this.state.popShow &&
        <LotteryPop hidePop={this.hidePop}/>
        }
        {/*<div className="questionTips" onClick={() => {
          this.setState({popShow: true})
        }}><img src={questionIcon}/></div>*/}
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

export default ShengFuGuoGuan
