import React, {Component} from 'react'
import {List, Tabs, Badge} from 'antd-mobile'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {hashHistory} from 'react-router'
import {queryAccount} from '../../Stubs/API'
import utils from '../../common/utils'
import '../../Style/MyAccount.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import CP from '../../common/LotType'
import Lottery from '../../config/lotteryInfo'
import DownComt from '../LotteryBetting/common/downComt'


const TabPane = Tabs.TabPane;
const Item = List.Item;
const Brief = Item.Brief;

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: '3002',
      ps: 20,
      allList: [],
      czList: [],
      tkList: [],
      gcList: [],
      dsList: [],
      zjList: [],
      fkList: [],
      allPn: 1,
      czPn: 1,
      gcPn: 1,
      dsPn: 1,
      fkPn: 1,
      zjPn: 1,
      tkPn: 1,
      type: {
        'zh': ['账户明细', 0, 13],
        'cz': ['充值明细', 1, 14],
        'tk': ['提款明细', 2, 15],
        'gc': ['购彩明细', 3, 16],
        'zj': ['中奖明细', 4, 17]
      },
      listHeight: '',
      addmoneytype: {
        '1': '快钱支付',
        '2': '财付通支付',
        '3': '支付宝支付',
        '4': '百付宝支付',
        '5': '手机充值卡(易宝)',
        '6': '银联手机支付',
        '9': '19pay手机充值卡',
        '10': '支付宝快捷支付',
        '11': '盛付通支付',
        '12': '联动优势信用卡',
        '13': '上海导购预付卡',
        '14': '支付宝扫码',
        '15': 'mo9先玩后付',
        '19': '建行支付',
        '20': '兴业银行支付',
        '24': '支付宝转账',
        '25': '支付宝转账',
        '27': '支付宝转账',
        '28': '支付宝转账',
        '30': '微信支付',
        '31': '微信支付',
        '32': '微信支付',
        '40': '微信支付',
        '41': '微信支付',
        '42': '微信扫码支付',
        '43': '微信支付',
        '44': '支付宝扫码支付',
        '45': '支付宝支付',
        '46': '支付宝支付',
        '47': '支付宝支付',
        '50': '微信支付',
        '51': '微信支付',
        '60': '支付宝支付',
        '61': '支付宝支付',
        '62': '支付宝支付',
        '97': '提款失败转款',
        '98': '购彩返利',
        '99': '手工加款',
        '998': '红包派送',
        '999': '网吧充值',
        '9000': '支付宝(安卓)',
        '9001': '支付宝(苹果)',
        '9002': '支付宝wap(苹果)',
        '9003': '联动优势(苹果)',
        '9004': '联动优势(安卓)',
        '9005': '支付宝wap(安卓)',
        '9006': '银联手机(苹果)',
        '9007': '银联手机(安卓)',
        '9008': '手机充值卡(苹果)',
        '9009': '手机充值卡(安卓)',
        '9010': '联通华建(苹果)',
        '9011': '联通华建(安卓)',
        '2003': '支付宝(东方网)',
        '2010': '支付宝扫码(东方网)',
        '2014': '支付宝快捷(东方网)',
        '2015': '银联手机(3g触屏)',
        '2016': '19pay充值卡(3g触屏)',
        '2017': '支付宝(3g触屏)',
        '3000': '微信支付(4g&触屏)',
        '3014': '支付宝(4g&触屏)'
      },
      buyType: {
        '89': '积分充值',
        '113': '打赏发单人',
        '200': '用户充值',
        '201': '自购中奖',
        '202': '跟单中奖',
        '203': '中奖提成',
        '204': '追号中奖',
        '210': '自购撤单返款',
        '211': '认购撤单返款',
        '212': '追号撤销返款',
        '213': '提现撤销返款',
        '214': '提款失败转款',
        '215': '保底返款',
        '216': '红包派送',
        '300': '转款',
        '100': '自购',
        '101': '认购',
        '102': '追号',
        '103': '保底认购',
        '104': '提现',
        '109': '退款',
        '105': '保底冻结',
        '99': '转账',
        '98': '套餐追号',
        '255': '天天分钱',
        '256': '跟买中奖',
        '257': '收到打赏'
      },
      pn: 1,
      active: '',
      menuShow: false
    }
    this.tabsData = [
      {title: "全部", key: '1'},
      {title: "充值", key: '2'},
      {title: "提款", key: '3'},
      {title: "购彩", key: '4'},
      {title: "中奖", key: '5'},
      {title: "打赏", key: '6'},
      {title: "返款", key: '7'},
    ]
    this.initialize = this.initialize.bind(this);
    this.MoneyFomate = this.MoneyFomate.bind(this);
    this.addMoneyContent = this.addMoneyContent.bind(this);
    this.Template = this.Template.bind(this);
    this.switchType = this.switchType.bind(this);
    this.getQueryList = this.getQueryList.bind(this);
    this.loadMoreAction = this.loadMoreAction.bind(this);
    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
  }

  addMoneyContent(ibiztype, wf) {
    const _this = this;
    var memo = '';
    ibiztype = parseInt(ibiztype);
    switch (ibiztype) {
      case 200:
        /***
         switch(wf){
        case '26':
          memo='宝币兑换彩金';
          break;
        case '9014':
          memo='充值';
          break;
        case '2070':
          memo='安智充值';
          break;
        case '2056':
          memo = '快捷支付';
          break;
        case '2057':
          memo = '快捷支付';
          break;
        default:
          memo = g.addmoneytype[wf];
          break;
      }
         ***/
        memo = '用户充值';
        break;
      case 117:
        memo = '彩金兑换宝币';
        break;
      case 100:
      case 101:
      case 103:
      case 105:
      case 201:
      case 202:
      case 203:
      case 210:
      case 211:
      case 252:
      case 253:
      case 215:
      case 98:
      case 102:
      case 212:
      case 254:
      case 113:
      case 256:
      case 257:
      case 204:
        //拼接描述
        memo = _this.state.buyType[ibiztype] || '';
        if (!!wf) {
          memo += '-' + CP.lot(wf)
        }
        break;
      case 300:
        memo = "转款";
        break;
      case 255:
        memo = wf;
        break;
      case 303:
        memo = "补派奖金";
        break;
      case 107:
      case 216:
      case 213:
      default:
        memo = _this.state.buyType[ibiztype] || '';
        break;
    }
    return memo;
  }

  componentDidMount() {
    this.initialize()
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

  initialize() {
    let active = this.props.location.query.active;
    if (active) {
      this.switchType(active)
    } else {
      this.switchType('1')
    }
  }

  getQueryList(type, params, pn, state) {
    let _this = this
    if (type === 'refresh') {
      params.pn = 1;
    } else {
      params.pn = pn;
    }
    queryAccount(params).then(result => {
      if (result.code == undefined) {
        //呵呵 竟然有的有code有的没code
        let row = result.row;
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
      } else if (result.code === '1') {
        if (type === 'refresh') {
          utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
            _this.props.router.push('login')
          })
        }
      } else if (result.code === '2000') {
        if (type === 'refresh') {
          this.setState({
            noResult: true
          })
        } else {
          this.setState({
            hasMore: false
          })
        }
      }
    })
  }

  MoneyFomate(itype, imoney) {
    let result = '';
    let money = imoney;
    if (itype == 0) {
      result = '+' + money;
    } else if (itype == 1) {
      result = '-' + money;
    }
    return result
  }

  //nav切换
  switchType(key) {
    console.log(key);
    let _this = this
    switch (key) {
      //全部
      case '1':
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'allList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '13'
          }
        }, () => {
          if (_this.state.allList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.allPn, 'allList');
          }
        })
        break;
      //充值
      case '2':
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'czList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '14'
          }
        }, () => {
          if (_this.state.czList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.czPn, 'czList');
          }
        })
        break
      case '3':
        //提款
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'tkList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '15'
          }
        }, () => {
          if (_this.state.tkList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.tkPn, 'tkList');
          }
        })
        break
      case '4':
        //购彩
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'gcList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '16'
          }
        }, () => {
          if (_this.state.gcList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.gcPn, 'gcList');
          }
        })
        break;
      case '5':
        //中奖
        console.log('zhongjiang')
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'zjList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '17'
          }
        }, () => {
          if (_this.state.zjList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.zjPn, 'zjList');
          }
        })
        break;
      case '6':
        //打赏
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'dsList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '37',
          }
        }, () => {
          if (_this.state.dsList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.dsPn, 'dsList');
          }
        })
        break;
      case '7':
        //返款
        _this.setState({
          active: key,
          pn: '1',
          hasMore: 'true',
          nowListName: 'fkList',
          params: {
            source: _this.state.source,
            ps: _this.state.ps,
            flag: '38',
          }
        }, () => {
          if (_this.state.fkList.length === 0) {
            _this.getQueryList('refresh', _this.state.params, _this.state.fkPn, 'fkList');
          }
        })
        break;
    }
  }

  //下拉加载
  loadMoreAction() {
    let listName = this.state.nowListName
    this.setState({
      pn: parseInt(this.state.pn) + 1
    }, () => {
      this.getQueryList('load', this.state.params, this.state.pn, listName);
    })
  }

  // 数据渲染
  Template(list, listname) {
    let _this = this;
    const items = [];
    switch (listname) {
      case "allList":
        list.map(function (i, v) {
          items.push(
            <Item key={`all_${v}`} multipleLine extra={_this.MoneyFomate(i.itype, i.imoney)}
                  className={i.itype == 0 ? 'colorRed' : 'colorGreen'}>
              {_this.addMoneyContent(i.ibiztype, i.wf) == '' ? '   ' : _this.addMoneyContent(i.ibiztype, i.wf)}<Brief>{i.cadddate}</Brief>
            </Item>
          )
        })
        break;
      case "czList":
        list.map(function (i, v) {
          items.push(
            <Item key={`cz_${v}`} multipleLine extra={_this.MoneyFomate(0, i.money)} className={'colorRed'}>
              {i.type}<Brief>{i.confdate}</Brief>
            </Item>
          )
        })
        break;
      case "tkList":
        list.map(function (i, v) {
          items.push(
            <Item key={`tk_${v}`} multipleLine extra={_this.MoneyFomate(1, i.money)} className={'colorGreen'}>
              {i.state}<Brief>{i.cashdate}</Brief>
            </Item>
          )
        })
        break;
      case "gcList":
        list.map(function (i, v) {
          items.push(
            <Item key={`gc_${v}`} multipleLine extra={_this.MoneyFomate(1, i.money)} className={'colorGreen'}>
              {i.memo}<Brief>{i.cadddate}</Brief>
            </Item>
          )
        })
        break;
      case "zjList":
        console.log(list)
        list.map(function (i, v) {
          items.push(
            <Item key={`zj_${v}`} multipleLine extra={_this.MoneyFomate(0, i.money)} className={'colorRed'}>
              {i.type + '-' + Lottery.lot(i.gid)}<Brief>{i.cadddate}</Brief>
            </Item>
          )
        })
        break;
      case "dsList":
        list.map(function (i, v) {
          items.push(
            <Item key={`ds_${v}`} multipleLine extra={_this.MoneyFomate(1, i.money)} className={'colorGreen'}>
              {i.memo}<Brief>{i.cadddate}</Brief>
            </Item>
          )
        })
        break;
      case "fkList":
        list.map(function (i, v) {
          console.log(i)
          items.push(
            <Item key={`fk_${v}`} multipleLine extra={_this.MoneyFomate(0, i.money)} className={'colorRed'}>
              {i.memo}<Brief>{i.cadddate}</Brief>
            </Item>
          )
        })
        break;
    }
    return items;
  }

  menuPop(flag) {
    this.setState({
      menuShow: flag,
    });
  }

  clickWF(key) {
    this.setState({
      active: key,
      menuShow: false
    }, () => {
      let url = utils.setUrlHash('active', key)
      hashHistory.replace(url)
    })
  }

  render() {
    const _this = this;
    let {menuShow, active} = this.state
    return (
      <div id="MyAccount">
        <CommonNavBar title="账户明细"/>
        <div className={sessionStorage.getItem("headFlag") ? "Newarrow1" : "Newarrow"}
             onClick={() => this.menuPop(true)}><span/></div>
        {/*Newarrow有头部 Newarrow1没有头部*/}
        {menuShow ?
          <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData}/> : null}
        {menuShow ? <div className="menu-mask" onClick={() => this.menuPop(false)}/> : null}
        <Tabs
          activeKey={_this.state.active}
          pageSize={3}
          speed="3"
          onTabClick={this.switchType}
          swipeable={false}
          animated={false}>
          <TabPane tab={<Badge>全部</Badge>} key="1">
            {
              _this.state.allList.length > 0 ?
                <List>
                  {!_this.state.noResult &&
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.allList, 'allList')}
                  </InfiniteScroll>
                  }
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }

          </TabPane>
          <TabPane tab={<Badge>充值</Badge>} key="2">
            {
              _this.state.czList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.czList, 'czList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }

          </TabPane>
          <TabPane tab={<Badge>提款</Badge>} key="3">
            {
              _this.state.tkList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.tkList, 'tkList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>购彩</Badge>} key="4">
            {
              _this.state.gcList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.gcList, 'gcList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>中奖</Badge>} key="5">
            {
              _this.state.zjList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.zjList, 'zjList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>打赏</Badge>} key="6">
            {
              _this.state.dsList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.dsList, 'dsList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </TabPane>
          <TabPane tab={<Badge>返款</Badge>} key="7">
            {
              _this.state.fkList.length > 0 ?
                <List>
                  <InfiniteScroll
                    height={_this.state.listHeight || 540}
                    next={_this.loadMoreAction}
                    scrollThreshold={0.7}
                    hasMore={_this.state.hasMore}
                    endMessage={
                      <div className="end_div">
                        <p className="end_p1">没有更多数据了</p>
                        <p className="end_p2">最多展示近60日数据</p>
                      </div>
                    }>
                    {_this.Template(_this.state.fkList, 'fkList')}
                  </InfiniteScroll>
                </List> :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }

          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default AccountDetails
