'use strict'
import React, {Component} from 'react'
import {Link} from 'react-router'
import {awardList} from '../../../Stubs/API'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment'
import lotteryInfo from '../../../config/lotteryInfo'
import utils from '../../../common/utils'
import '../../../Style/Find/lotteryResults.css'

class Kuai3 extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      list: [],
      hasMore: true,
      listHeight: '',
      noResult: false
    }
    this.gid = '06';  //彩种id
    this.pid = '';    //期次id
    this.pn = 1;      //页数
    this.tp = '';     //总页数
    this.getData = this.getData.bind(this);
    this.getMore = this.getMore.bind(this);
  }

  componentWillMount() {
    let query = this.props.location.query;
    console.log(this.props)
    if (query.gid && query.pid) {
      this.gid = query.gid
      this.pid = query.pid
    }
    this.getData(this.gid, this.pn, 1)
  }

  //组件挂载之后设置高度
  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  // 请求数据列表
  getData(gid, pn, flag) {
    if (flag !== 1 && pn > this.tp) {
      this.setState({
        hasMore: false
      })
      return;
    }
    awardList(gid, pn).then(data => {
      let result = data.result;
      if (result && result.status === '1') {
        let data = result.data;
        if (flag === 1) {
          this.tp = parseInt(result.tp);
        }
        if (utils.checkIsArr(data)) {
          this.setState({
            list: flag === 1 ? data : this.state.list.concat(data)
          })
        } else {
          this.setState({
            list: flag === 1 ? [data] : this.state.list.concat([data])
          })
        }
      } else {
        this.setState({
          noResult: true
        })
      }

    })
  }

  // 上滑加载更多
  getMore() {
    console.log('=========sh=============')
    this.pn = this.pn + 1;
    this.getData(this.gid, this.pn)
  }

  render() {
    let _this = this;

    function template() {
      let arr = [];
      _this.state.list.map((item, itNo) => {
        let code = item.acode.split(',');
        arr.push(
          <Link to="" className="lotteryA arrowNo" key={`result${itNo}`}>
            <p className="p1">
              <span className="span1">{`${item.pid.slice(-5)}期`}</span>
              <span className="span4">{moment(item.atime).format('MM-DD HH:mm')}</span>
            </p>
            <p className="p2">
              {code.map((item, index) => {
                return (
                  <span key={`code${index}`}
                        className={'iconSpan ' + (itNo === 0 ? `iconSpan_${item}` : '')}>{itNo === 0 ? '' : item}</span>
                )
              })}
              <span className="span3">{'和值:' + code.reduce((partial, value) => {
                return parseInt(partial) + parseInt(value)
              })}</span>
            </p>
          </Link>
        )
      })
      return arr;
    }

    return (
      <div id="lotteryResults">
        <CommonNavBar title={lotteryInfo.lot(_this.gid)}/>
        {!this.state.noResult ?
          <InfiniteScroll
            height={_this.state.listHeight || 524}
            next={_this.getMore}
            hasMore={_this.state.hasMore}
            endMessage={
              <div className="end_div">
                <p className="end_p1">没有更多数据了</p>
              </div>
            }
          >
            {template()}
          </InfiniteScroll> :
          <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
        }
      </div>
    )
  }
}

export default Kuai3
