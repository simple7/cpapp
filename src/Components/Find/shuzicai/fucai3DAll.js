'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'

import '../../../Style/Find/lotteryResults.css'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {NumLotteryList} from '../lotteryIndexComponent/NumLotteryList'
import {awardList} from '../../../Stubs/API'
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../../../common/utils'
import SsqAll from './ssqAll'

class Fucai3DAll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initData: [{
        acode: "01,07,10,11,26,27|11",
        atime: "2017-11-07 21:15:00",
        pid: "2017131",
        trycode: ""
      }],
      gid: '',
      pid: '',
      listHeight: '',
      pn: 1,
      tp: '',
      hasMore: true
    };
    this.initialize = this.initialize.bind(this);
    this.DateSubstring = this.DateSubstring.bind(this);
    this.ClickHashGoto = this.ClickHashGoto.bind(this);
    this.loadMoreAction = this.loadMoreAction.bind(this);
  }

  componentWillMount() {
    const {gid, pid} = this.props.location.query;
    const {pn} = this.state;
    this.setState({
      gid: gid,
      pid: pid
    }, () => {
      this.initialize(pn);
    })
  }

  //组件挂载之后设置高度
  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  initialize(num) {
    const {gid, initData, pn, tp} = this.state;
    if (tp && pn && pn > tp) {
      this.setState({
        hasMore: false
      });
      return false;
    }
    awardList(gid, num).then(res => {
      if (initData.length > 1) {
        let arr = initData;
        this.setState({
          initData: arr.concat(res.result.data),
          pn: res.result.pn,
          tp: res.result.tp
        })
      } else {
        this.setState({
          initData: res.result.data,
          pn: res.result.pn,
          tp: res.result.tp
        })
      }
    })
  }

  DateSubstring(d) {
    let D = new NumLotteryList();
    return D.subDate(d)
  }

  /**
   * 上拉加载更多动作
   * */
  loadMoreAction() {
    let pnn = Number(this.state.pn) + 1;
    this.setState({
      pn: pnn
    }, () => {
      this.initialize(this.state.pn);
    })
  }

  ClickHashGoto(gid, pid) {
    hashHistory.push({
      pathname: "/lotteryResults/fc3d",
      query: {
        gid: gid,
        pid: pid,
        flag: true
      }
    })
  }

  titleDes(gid) {
    switch (gid) {
      case '01':
        return "双色球历史开奖";
        break;
      case "03":
        return "福彩3D历史开奖";
        break;
      case "50":
        return "大乐透历史开奖";
        break;
      case '53':
        return "排列三历史开奖";
        break;
      case '52':
        return "排列五历史开奖";
        break;
      case "51":
        return '七星彩历史开奖';
        break;
      case "07":
        return "七乐彩历史开奖";
        break;
    }
  }


  render() {
    const {initData, pid, gid} = this.state;
    let title = this.titleDes(gid);
    return (
      <div id="lotteryResults">
        <CommonNavBar title={title}/>
        <div>
          <InfiniteScroll
            height={this.state.listHeight || 524}
            next={this.loadMoreAction}
            scrollThreshold={0.7}
            hasMore={this.state.hasMore}
            endMessage={
              <div className="end_div">
                <p className="end_p1">没有更多数据了</p>
                {/*<p className="end_p2">最多展示近80期数据</p>*/}
              </div>
            }
          >
            {
              initData.map((item, index) => {
                const code = item.acode.split(',');
                const judge = (item.pid === pid);
                return (
                  <a key={item.pid} onClick={() => {
                    this.ClickHashGoto(gid, item.pid)
                  }} className="lotteryA">
                    <p className="p1">
                      <span className="span1">{item.pid.substring(2)}期</span>
                      <span className="span4">{this.DateSubstring(item.atime)}</span>
                    </p>
                    <p className="p2">
                      {
                        code.map((it, index) => {
                          return (
                            judge ? <span key={index} className="ballSpan ballRed">{it}</span> :
                              <span key={index} className="ballSpan redColor">{it}</span>
                          )
                        })
                      }
                      {
                        initData.trycode && <span className="span3">试机号:{initData.trycode.replace(/\,/g, '')}</span>
                      }
                    </p>
                  </a>
                )
              })
            }
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default Fucai3DAll
