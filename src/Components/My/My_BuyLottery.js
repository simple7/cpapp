import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router'
import {List, Tabs, Badge, Toast, NavBar, Icon} from 'antd-mobile'
import {getBuyList} from '../../Stubs/API'
import CommonNavBar from "../CommonComts/CommonNavBar";
import utils from '../../common/utils'
import {PlanNumber} from '../../common/LotType'
import moment from 'moment'
import Lottery from '../../config/lotteryInfo'
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../Style/My/MyBuyList.less'

const TabPane = Tabs.TabPane;

class BuyLottery extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      source: '3002',
      gid: '',  //彩种id
      pn: '1',  //页数
      allPn: 1,
      dkjPn: 1,
      ykjPn: 1,
      zjPn: 1,
      zhPn: 1,
      ps: '20',  //每页10条
      hasZH: true,
      isZH: false,
      active: '',
      params: {},
      allNoResult: false,
      dkjNoResult: false,
      ykjNoResult: false,
      zjNoResult: false,
      zhNoResult: false,
      allList: [],
      dkjList: [],
      ykjList: [],
      zjList: [],
      zhList: [],
      nowListName: '',
      allHasMore: true,
      dkjHasMore: true,
      ykjHasMore: true,
      zjHasMore: true,
      zhHasMore: true,
      listHeight: ''
    }
    this.switchBuyType = this.switchBuyType.bind(this);
    this.switchZhType = this.switchZhType.bind(this);
    this.getQueryList = this.getQueryList.bind(this);
    this.Template = this.Template.bind(this);
    this.switchType = this.switchType.bind(this);
    this.pullRefreshAction = this.pullRefreshAction.bind(this);
    this.loadMoreAction = this.loadMoreAction.bind(this);
    this.switchList = this.switchList.bind(this);
  }

  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let ambarHeight = document.getElementsByClassName('am-tabs-bar')[0].offsetHeight
      if (this.state.listHeight === '' && ambarHeight !== 0) {
        let gettableHeight = w - ambarHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
      if (this.state.listHeight === '' && myNavHeight !== 0) {
        let gettableHeight = w - myNavHeight - document.getElementsByClassName('am-tabs-bar')[0].offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  componentDidMount() {
    let query = this.props.location.query
    let active = '1'
    if (query && query.active) {
      active = query.active
    }
    this.setState({
      active: active
    }, () => {
      this.switchType(active)
    })
  }


  // 判断购买类型
  switchBuyType(v) {
    switch (v) {
      case '0':
        return '自购'
      case '1':
        return '发起合买'
      case '2':
        return '合买跟单'
      case '3':
        return '神单'
      case '4':
        return '跟买'
    }
  }

  // 判断追号状态
  switchZhType(v) {
    switch (v) {
      case '0':
        return '进行中'
        break
      case '1':
        return '已完成'
        break
      case '2':
        return '中奖停止'
        break
      case '3':
        return '已停止'
        break
    }
  }

  //点击tab页切换显示页 由于接口传参不同返回字段不同 需先设state标记当前返回数据类型
  switchType(key) {
    /*let scrollTop = document.documentElement.scrollTop;
     if (scrollTop > 0) {
     document.documentElement.scrollTop = 0;
     }*/
    let _this = this
    switch (key) {
      //全部
      case '1':
        _this.setState({
          active: key,
          hasZH: true,
          isZH: false,
          nowListName: 'allList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '3'
          }
        }, () => {
          if (_this.state.allList.length == 0) {
            _this.getQueryList('load', _this.state.params, _this.state.allPn, 'allList');
          }
        })
        break;
      case '2':
        //待开奖
        _this.setState({
          active: key,
          isZH: false,
          hasZH: false,
          nowListName: 'dkjList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '1',
            rid: '2'
          }
        }, () => {
          if (_this.state.dkjList.length == 0) {
            _this.getQueryList('load', _this.state.params, _this.state.dkjPn, 'dkjList');
          }
        })
        break
      case '3':
        //已开奖
        _this.setState({
          active: key,
          isZH: false,
          hasZH: false,
          nowListName: 'ykjList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '1',
            tid: '1'
          }
        }, () => {
          if (_this.state.ykjList.length == 0) {
            _this.getQueryList('load', _this.state.params, _this.state.ykjPn, 'ykjList');
          }
        })
        break
      case '4':
        //中奖
        _this.setState({
          active: key,
          isZH: false,
          hasZH: false,
          nowListName: 'zjList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '1',
            aid: '0'
          }
        }, () => {
          if (_this.state.zjList.length == 0) {
            _this.getQueryList('load', _this.state.params, _this.state.zjPn, 'zjList');
          }
        })
        break
      case '5':
        //追号
        _this.setState({
          active: key,
          hasZH: false,
          isZH: true,
          nowListName: 'zhList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '2',
          }
        }, () => {
          if (_this.state.zhList.length == 0) {
            _this.getQueryList('load', _this.state.params, _this.state.zhPn, 'zhList');
          }
        })
        break
    }
    let url = utils.setUrlHash('active', key)
    hashHistory.replace(url)
  }

  // 获取数据
  getQueryList(type, params, pn, state) {
    let _this = this
    if (type === 'refresh') {
    } else {
      params.pn = pn;
    }
    getBuyList(params).then(result => {
      if (result.code === '0') {
        let row = result.rows.row;
        if (row) {
          if (utils.checkIsArr(row)) {
            this.setState({
              [state]: type === 'refresh' ? row : this.state[state].concat(row),
              noResult: false
            })
          } else {
            this.setState({
              noResult: false,
              [state]: type === 'refresh' ? [row] : this.state[state].concat([row])
            })
          }
        }

      } else if (result.code === '1') {
        utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
          hashHistory.push('loginIndex')
        })
      } else if (result.code === '2000') {
        let params = _this.switchList(state);
        let noResult = params.noResult
        if (_this.state[state].length === 0) {
          _this.setState({
            [noResult]: true
          })
        } else {
          let hasMore = params.hasMoreName
          _this.setState({
            [hasMore]: false
          })
        }
      }

    })
  }

  /**
   * 下拉刷新动作
   * */
  pullRefreshAction() {
    console.log('下拉')
    let listName = this.state.nowListName
    this.setState({
      pn: 1
    }, () => {
      this.getQueryList('refresh', this.state.params, this.state.pn, listName);
    });

  }

  // 判断当前渲染列表
  switchList(list) {
    let params = {};
    switch (list) {
      case 'allList':
        params.pnName = 'allPn'
        params.hasMoreName = 'allHasMore'
        params.noResult = 'allNoResult'
        break;
      case 'dkjList':
        params.pnName = 'dkjPn'
        params.hasMoreName = 'dkjHasMore'
        params.noResult = 'dkjNoResult'
        break;
      case 'ykjList':
        params.pnName = 'ykjPn'
        params.hasMoreName = 'ykjHasMore'
        params.noResult = 'ykjNoResult'
        break;
      case 'zjList':
        params.pnName = 'zjPn'
        params.hasMoreName = 'zjHasMore'
        params.noResult = 'zjNoResult'
        break;
      case 'zhList':
        params.pnName = 'zhPn'
        params.hasMoreName = 'zhHasMore'
        params.noResult = 'zhNoResult'
        break;
    }
    return params;
  }

  /**
   * 上拉加载更多动作
   * */
  loadMoreAction() {
    let _this = this;
    let listName = this.state.nowListName
    let params = _this.switchList(listName)
    let pnName = params.pnName;
    let pn = _this.state[pnName] + 1;
    this.setState({
      [pnName]: pn
    }, () => {
      this.getQueryList('load', this.state.params, this.state[pnName], listName);
    })
  }

  // 数据渲染
  Template(list) {
    let _this = this;
    const items = [];
    list.map(function (item, index) {
      items.push(
        <a className="caizhong_a" key={index}
           onClick={() => {
             let pathname = '';
             let query = '';
             if (item.zhid || item.iszh === '1') {
               pathname = "/plandetail/zhxq";
               query = {
                 gid: item.gid,
                 tid: item.zhid || item.projid
               };
             } else if (!item.zhid || item.iszh === '0'){
               pathname = PlanNumber[item.gid][3];
               query = {
                 gid: item.gid,
                 hid: item.projid
               };
             }
             hashHistory.push({
               pathname: pathname,
               query: query
             })
           }}>
          <div className="clearfix caizhong_box">
            <div className="div10">
              <p
                className="p6">{_this.state.isZH ? utils.getDateDesc(item.adddate, 'MM-DD') : utils.getDateDesc(item.buydate, 'MM-DD')}</p>
              <p
                className="p7">{_this.state.isZH ? moment(item.adddate).format('HH:mm') : moment(item.buydate).format('HH:mm')}</p>
            </div>
            <div className="div11"><img
              src={require("../../Img/caizhongIcon/" + Lottery.lot(item.gid, 1) + "@3x.png")}/></div>
            <div className="div12">
              {/*前方代码高能。。。没办法，同一个接口请求参数不同返回的字段***不同，不同也就算了，还**要在一起处理这些数据。。。。，有些接口真的是无力吐槽*/}
              <p className="p8">{item.money || item.tmoney}元
                {_this.state.hasZH && item.iszh === '0' &&
                (parseFloat(item.rmoney) > 0 ? (
                  <span className="orange_color">{'中奖' + item.rmoney + '元'}</span>
                ) : (<span>{item.state}</span>))
                }
                {_this.state.hasZH && item.iszh === '1' &&
                <span>{_this.switchZhType(item.reason)}</span>
                }
                {!_this.state.hasZH && !_this.state.isZH &&
                (parseFloat(item.rmoney) > 0 ?
                  (<span className="orange_color">{'中奖' + item.rmoney + '元'}</span>
                  ) : (<span>{item.state}</span>))
                }
                {_this.state.isZH &&
                <span>{_this.switchZhType(item.reason)}</span>
                }
              </p>
              <p className="p9">{Lottery.lot(item.gid, 3)}
                {_this.state.hasZH &&
                (item.iszh === '1' ? (
                  <span className="p9_child"
                        style={{marginLeft: '10px'}}>共{item.pnums}期 / 已追{item.success}期</span>) : (
                  <span className="p9_child"> | <span>{_this.switchBuyType(item.ty)}</span>
                    {Lottery.exceptJJC.indexOf(item.gid) === -1 && <span className="period">第{item.pid}期</span>}
                      </span>))}
                {!_this.state.hasZH && !_this.state.isZH &&
                <span className="p9_child"> | <span>{_this.switchBuyType(item.ty)}</span>
                  {Lottery.exceptJJC.indexOf(item.gid) === -1 && <span className="period">第{item.pid}期</span>}
                    </span>}
                {_this.state.isZH &&
                <span className="p9_child" style={{marginLeft: '10px'}}>共{item.pnums}期 / 已追{item.success}期</span>
                }
              </p>
            </div>
          </div>
        </a>
      )
    })
    return items;
  }

  render() {
    let _this = this;
    return (
      <div id="myBuyList">
        <CommonNavBar title="我的购彩"/>
        <Tabs activeKey={_this.state.active} onTabClick={this.switchType} swipeable={false} animated={false}>
          <TabPane tab={<Badge>全部</Badge>} key="1">
            {!_this.state.allNoResult ?
              <div ref="allList" className="buyList">
                <InfiniteScroll
                  height={_this.state.listHeight || 548}
                  next={_this.loadMoreAction}
                  scrollThreshold={0.7}
                  hasMore={_this.state.allHasMore}
                  endMessage={
                    <div className="end_div">
                      <p className="end_p1">没有更多数据了</p>
                      <p className="end_p2">最多展示近60日数据</p>
                    </div>
                  }>
                  {_this.Template(_this.state.allList)}
                </InfiniteScroll>
              </div> :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>待开奖</Badge>} key="2">
            {!_this.state.dkjNoResult ?
              <div ref="dkjList" className="buyList">
                <InfiniteScroll
                  height={_this.state.listHeight || 548}
                  next={_this.loadMoreAction}
                  hasMore={_this.state.dkjHasMore}
                  scrollThreshold={0.7}
                  endMessage={
                    <div className="end_div">
                      <p className="end_p1">没有更多数据了</p>
                      <p className="end_p2">最多展示近60日数据</p>
                    </div>
                  }>
                  {_this.Template(_this.state.dkjList)}
                </InfiniteScroll>
              </div> :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>已开奖</Badge>} key="3">
            {!_this.state.ykjNoResult ?
              <div ref="ykjList" className="buyList">
                <InfiniteScroll
                  height={_this.state.listHeight || 548}
                  next={_this.loadMoreAction}
                  hasMore={_this.state.ykjHasMore}
                  scrollThreshold={0.7}
                  endMessage={
                    <div className="end_div">
                      <p className="end_p1">没有更多数据了</p>
                      <p className="end_p2">最多展示近60日数据</p>
                    </div>
                  }>
                  {_this.Template(_this.state.ykjList)}
                </InfiniteScroll>
              </div> :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>中奖</Badge>} key="4">
            {!_this.state.zjNoResult ?
              <div className="buyList">
                <InfiniteScroll
                  height={_this.state.listHeight || 548}
                  next={_this.loadMoreAction}
                  hasMore={_this.state.zjHasMore}
                  scrollThreshold={0.7}
                  endMessage={
                    <div className="end_div">
                      <p className="end_p1">没有更多数据了</p>
                      <p className="end_p2">最多展示近60日数据</p>
                    </div>
                  }>
                  {_this.Template(_this.state.zjList)}
                </InfiniteScroll>
              </div> :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>追号</Badge>} key="5">
            {!_this.state.zhNoResult ?
              <div className="buyList">
                <InfiniteScroll
                  height={_this.state.listHeight || 548}
                  next={_this.loadMoreAction}
                  hasMore={_this.state.zhHasMore}
                  scrollThreshold={0.7}
                  endMessage={
                    <div className="end_div">
                      <p className="end_p1">没有更多数据了</p>
                      <p className="end_p2">最多展示近60日数据</p>
                    </div>
                  }>
                  {_this.Template(_this.state.zhList)}
                </InfiniteScroll>
              </div> :
              <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}


export default BuyLottery
