'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Badge} from 'antd-mobile'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/Find/lotteryResults.css'
import {LotteryResultListAPI} from '../../Stubs/API'
import {lotteryIdDes} from '../../common/LotType'
import {NumLotteryList} from './lotteryIndexComponent/NumLotteryList'
import {CompLotteryList} from './lotteryIndexComponent/CompLotteryList'
import {HighLotteryList} from './lotteryIndexComponent/HighLottery'

const TabPane = Tabs.TabPane;

class Lottery extends Component {
  constructor() {
    super(...arguments);
    console.log(123);
    this.state = {
      dataList: null,
      NumLottery: [],
      CompLottery: [],
      HighLottery: [],
      currentTab: '1',
      listHeight: '',
      szc: [],
      kpc: [],
      jjc: []
    }
    this.clickTab = this.clickTab.bind(this);
    this.initialize = this.initialize.bind(this);
    this.LotteryListSort = this.LotteryListSort.bind(this);
    this.ClickHashGoto = this.ClickHashGoto.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  /* 数据获取 */
  initialize() {
    LotteryResultListAPI().then(res=> {
      this.setState({
        dataList: res.result.data
      },()=> {
        const {dataList} = this.state;
        this.LotteryListSort(dataList)
      });
    })
  }

  /* 点击哈希地址跳转 */
  ClickHashGoto(d) {
    const gid = d.gid;
    const pid = d.pid;
    const code = d.code;
    const awardtime = d.awardtime;

    const endtime = d.endtime;
    const state = d.state;
    hashHistory.push({
      pathname: lotteryIdDes[gid][3],
      query: {
        gid: gid,
        pid: pid,
        code: encodeURIComponent(code),
        awardtime: encodeURIComponent(awardtime),
        endtime: encodeURIComponent(endtime),
        state: state
      }
    })
  }

  /* 数据拆分 */
  LotteryListSort(dataList) {
    let num = [];
    let comp = [];
    let high = [];
    for(let i in dataList){
      let lot = dataList[i];
      let index = lotteryIdDes[lot.gid][2];
      if(index === 1) { // 数字彩
        num.push(lot);
      }else if(index === 2){ // 竞技彩
        comp.push(lot);
        if(lot.gid === '80'){
          let lott = JSON.parse(JSON.stringify(lot));
          lott.gid = '81';
          comp.push(lott);
        }
      }else if(index === 3){ // 高频彩
        /*由于快乐扑克停售，因此将其过滤
        * 同时即使开售，其高频中的结构待定
        * */
        if(lot.gid!== '58'){
          high.push(lot);
        }
      }
    }
    this.setState({
      NumLottery: num,
      CompLottery: comp,
      HighLottery: high,
    })
  }

  clickTab(key) {
    this.setState({
      currentTab: key
    })
  }

  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let ambarHeight = document.getElementsByClassName('am-tabs-bar')[0]
      if (this.state.listHeight === '' && ambarHeight && ambarHeight.offsetHeight !== 0) {
        let gettableHeight = w - ambarHeight.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      let ambarHeight = document.getElementsByClassName('am-tabs-bar')[0]
      if (this.state.listHeight === '' && myNavHeight && myNavHeight.offsetHeight !== 0 && ambarHeight) {
        let gettableHeight = w - myNavHeight.offsetHeight - ambarHeight.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  render() {
    const {NumLottery, CompLottery, HighLottery} = this.state;
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content=<div id="lotteryResults">
        <CommonNavBar title="开奖结果"/>
        <Tabs activeKey= {this.state.currentTab} swipeable={false} onTabClick={this.clickTab} animated={false}>
          {/*数字彩*/}
          <TabPane tab={<Badge>数字彩</Badge>} key="1">
            <div className="lottery_list listDivView" style={{height: this.state.listHeight + 'px'}}>
              <NumLotteryList ClickHashGoto={this.ClickHashGoto}  NumLottery={NumLottery}></NumLotteryList>
            </div>
          </TabPane>
          {/*竞技彩*/}
          <TabPane tab={<Badge>竞技彩</Badge>} key="2">
            <div className="lottery_list listDivView" style={{height: this.state.listHeight + 'px'}}>
              <CompLotteryList ClickHashGoto={this.ClickHashGoto}  CompLottery={CompLottery}></CompLotteryList>
            </div>
          </TabPane>
          {/*高频彩*/}
          <TabPane tab={<Badge>高频彩</Badge>} key="3">
            <div className="lottery_list listDivView" style={{height: this.state.listHeight + 'px'}}>
              <HighLotteryList ClickHashGoto={this.ClickHashGoto}  HighLottery={HighLottery}></HighLotteryList>
            </div>
          </TabPane>
        </Tabs>
      </div>
    }
    return(
      <div id="LotteryResults">
        {content}
      </div>
    )
  }
}

export default Lottery
