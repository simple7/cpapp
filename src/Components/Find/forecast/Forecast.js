import React, {Component} from 'react'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {hashHistory} from 'react-router'
import {Tabs, Badge} from 'antd-mobile'
import moment from 'moment'
import commonConfig from '../../../config/commonConfig'
import {forecastList, hotNewList} from '../../../Stubs/API'
import utils from '../../../common/utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import '../../../Style/Find/forecast.less'

const TabPane = Tabs.TabPane;

class Forecast extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      forecastList: [],
      height: '',
      hotNewList: [],
      forecastNoResult: false,
      hotNoResult: false,
      active: '1',
      hasMore: true
    }
    this.pn = 1;
    this.totalPage = 0;
    this.tabClick = this.tabClick.bind(this)
    this.loadMoreHot = this.loadMoreHot.bind(this)
    this.getHotList = this.getHotList.bind(this)
    this.Template = this.Template.bind(this)
  }

  componentDidMount() {
    // 获取分析预测列表
    forecastList().then(result => {
      if (result && result.code === '0') {
        let row = result.rows.row;
        if (row) {
          if (utils.checkIsArr(row)) {
            this.setState({
              forecastList: row,
              forecastNoResult:false
            })
          } else {
            this.setState({
              forecastList: [row],
              forecastNoResult:false
            })
          }
        }
      }else{
        this.setState({
          forecastNoResult: true
        })
      }
    })
    // 获取热点资讯列表
    this.getHotList(this.pn)
  }

  loadMoreHot() {
    this.pn += 1;
    this.getHotList(this.pn)
  }

  getHotList(pn) {
    let params = {
      pn: pn
    }
    console.log(pn)
    if (this.totalPage !== 0) {
      if (pn > this.totalPage) {
        this.setState({
          hasMore: false
        })
      } else {
        hotNewList(params).then(result => {
          if (result.code === '0') {
            let row = result.rows.row;
            let pageList = result.pagelist;
            if (pageList && pageList.totalpage) {
              this.totalPage = parseInt(pageList.totalpage)
            }
            if (row) {
              if (utils.checkIsArr(row)) {
                this.setState({
                  hotNewList: this.state.hotNewList.concat(row),
                })
              } else {
                this.setState({
                  hotNewList: this.state.hotNewList.concat([row]),
                })
              }
            }
          }
        })
      }
    } else {
      hotNewList(params).then(result => {
        if (result.code === '0') {
          let row = result.rows.row;
          let pageList = result.pagelist;
          if (pageList && pageList.totalpage) {
            this.totalPage = parseInt(pageList.totalpage)
          }
          if (row) {
            if (utils.checkIsArr(row)) {
              this.setState({
                hotNewList: row,
                hotNoResult:false
              })
            } else {
              this.setState({
                hotNewList: [row],
                hotNoResult:false
              })
            }
          }
        }else{
          this.setState({
            hotNoResult:true
          })
        }
      })
    }


  }

  // 设置高度
  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let tabHeight = document.getElementsByClassName('am-tabs-bar')[0]
      if (this.state.height === '' && tabHeight && tabHeight.offsetHeight !== 0) {
        let gettableHeight = w - tabHeight.offsetHeight;
        this.setState({
          height: gettableHeight - 5,
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      let tabHeight = document.getElementsByClassName('am-tabs-bar')[0];
      if (this.state.height === '' && myNavHeight && myNavHeight.offsetHeight !== 0 && tabHeight) {
        let gettableHeight = w - myNavHeight.offsetHeight - tabHeight.offsetHeight;
        this.setState({
          height: gettableHeight - 5,
        })
      }
    }

  }

  //点击tab
  tabClick(key) {
    this.setState({
      active: key
    })
  }

  Template(list) {
    let arr = []
    if (list) {
      list.map((item, index) => {
        arr.push(
          <a className="child"
             key={index}
             onClick={() => {
               hashHistory.push({
                 pathname: 'forecast/artile',
                 query: {
                   url: commonConfig.mobileDomain + item.arcurl,
                   title: '热点彩讯'
                 }
               })
             }}
          >
            <span className="left_span">{item.ntitle}</span>
            <span className="right_span">{moment(parseInt(item.ndate) * 1000).format('MM-DD')}</span>
          </a>
        )
      })
    }
    return arr;
  }

  render() {
    let _this = this;
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content = <div>
        <CommonNavBar title="预测与分析"/>
        <Tabs defaultActiveKey={this.state.active} swipeable={false} onTabClick={this.tabClick} animated={false}>
          <TabPane tab='分析预测' key="1">
            {!this.state.forecastNoResult ?
              <div className="yuceList listDivView" style={{height: this.state.height + 'px'}}>
                {this.state.forecastList.map((item, index) => {
                  return (
                    <a onClick={() => {
                      hashHistory.push({
                        pathname: 'forecast/lotteryInfo',
                        query: {
                          gid: item.gid
                        }
                      })
                    }} key={index}>
                      <dl>
                        <dt className={"icoLogo Logo_" + item.gid}/>
                        <dd>
                          <h2>{item.name}</h2>
                          <p>{item.title}</p>
                        </dd>
                      </dl>
                    </a>
                  )
                })}
              </div>
              :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }

          </TabPane>
          <TabPane tab='热点彩讯' key="2">
            {
              !_this.state.hotNoResult ?
                <div className="hotNew">
                  <InfiniteScroll
                    height={_this.state.height - 30 || 548}
                    next={_this.loadMoreHot}
                    hasMore={_this.state.hasMore}
                    // loader={<h4>Loading...</h4>}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                      </div>
                    }>
                    {_this.Template(_this.state.hotNewList)}
                  </InfiniteScroll>
                </div>
                :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }

          </TabPane>
        </Tabs>
      </div>
    }
    return (
      <div id="forecast">
        {content}
      </div>
    )
  }
}

export default Forecast
