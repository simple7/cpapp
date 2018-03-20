'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast} from 'antd-mobile'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {bjdcSellList,userBasicInfo} from '../../../Stubs/API'
import betConfig from '../../../config/betConfig'
import utils from '../../../common/utils'
import RangQiuList from './rangQiu/rangQiu'
import BiFenList from './biFen/biFen'
import BanquanChangList from './banquanChang/banquanChang'
import ShangXiaList from './shangXia/shangXia'
import ZongjinQiuList from './zongjinQiu/zongjinQiu'
import DownComt from '../common/downComt'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/programContent.less'
import {AppJiek} from '../../../common/AppApi'

const TabPane = Tabs.TabPane;

class LotteryBetting extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      active: '',
      dataList: [],
      pid: '',
      read:true,
      noResult: false,
      menuShow:false,
    }
    this.tabsData = [
      {title: "让球胜平负", key: '1'},
      {title: "比分", key: '2'},
      {title: "半全场", key: '3'},
      {title: "上下单双", key: '4'},
      {title: "总进球", key: '5'},
    ];
    this.switchType = this.switchType.bind(this)
    this.doOrder = this.doOrder.bind(this)
    this.toggle = this.toggle.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.receiveRead = this.receiveRead.bind(this)
    this.menuPop = this.menuPop.bind(this)
    this.clickWF = this.clickWF.bind(this)
  }
  receiveRead(read) {
    this.setState({
      read: read
    })
  }
  switchType(key) {
    this.setState({
      active: key
    }, () => {
      let url = utils.setUrlHash('active', key)
      hashHistory.replace(url)
    })

  }

  // 预约
  async doOrder(params, type) {
    if (!this.state.read) {
      Toast.info('请阅读并同意《用户服务协议》', 1, null, false)
      return;
    }
    let flag = await utils.checkLogin()
    if (!flag) {
      AppJiek.thirdAppLoginCheck(()=> {
        hashHistory.push({
          pathname: '/bjdcBet/login',
          query: {
            flag: type
          }
        })
      }, flag)
    } else {
      let phone = '';
      let idCard = ''
      await userBasicInfo().then(result => {
        if (result.code === '0') {
          let row = result.row;
          phone = row.mobbind;
          idCard = row.idcard;
        }
      })
      if (!phone || phone === '0') {
        utils.showAlert('温馨提示', '该账户未绑定手机号', '去绑定', () => {
          hashHistory.push({
            pathname: 'bjdcBet/editMobile',
            query: {
              needBack: true
            }
          })
        })
      } else if (!idCard) {
        utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
          hashHistory.push({
            pathname: 'bjdcBet/editIdCard',
            query: {
              needBack: true
            }
          })
        })
      } else {
        let imoney = params.imoney
        if (imoney > betConfig.buyLimit.zqdc) {
          Toast.info('最高投注金额' + betConfig.buyLimit.zqdc + '元', 1, null, false)
          return
        }
        console.log('params:', params)
        let active = this.state.active
        let gid = ''
        let codes = '';
        let newcodes = '';
        let zxcodes = '';
        let ppcodes = '';
        let items = '';
        let chooseInfo = params.chooseInfo;
        switch (active) {
          case '1': //胜平负
            gid = betConfig.bjdc.spf.gid
            // codes='SPF|171129018=3,171129001=3/0,171129002=1|2*1'
            codes = 'SPF|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].spfchoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '2':
            gid = betConfig.bjdc.bf.gid;
            // "CBF|12=2:2/4:0,13=2:2/2:4|2*1"
            codes = 'CBF|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].realChoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '3':
            gid = betConfig.bjdc.bqc.gid;
            // "BQC|12=1-1/3-3,13=0-1|2*1"
            codes = 'BQC|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].realChoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '4':
            gid = betConfig.bjdc.sxds.gid;
            // "SXP|12=3/2/1/0|1*1"
            codes = 'SXP|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].spfchoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '5':
            gid = betConfig.bjdc.jq.gid;
            // "JQS|12=1,13=2,14=0|3*1"
            codes = 'JQS|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].spfchoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
        }
        console.log('投注内容：', codes)
        let bonu = params.bonus;
        let bonus = {
          min: bonu.min * 0.65,
          max: bonu.max * 0.65
        }
        params.bonus = bonus;
        params.gid = gid;
        params.items = items;
        params.newcodes = newcodes;
        params.ppcodes = ppcodes;
        params.zxcodes = zxcodes;
        params.codes = codes;
        hashHistory.push({
          pathname: '/bjdcBet/order',
          state: {
            params: params
          }
        })
      }
    }
  }

  //比赛记录toggle
  toggle(itemid, type) {
    let boxClassList = document.getElementById(`${type}_${itemid}`).classList;
    let arrowClassList = document.getElementById(`${type}_arrow_${itemid}`).classList;
    if (boxClassList.value.indexOf('active') !== -1) {
      boxClassList.remove('active')
    } else {
      boxClassList.add('active')
    }
    if (arrowClassList.value.indexOf('down') !== -1) {
      arrowClassList.remove('down')
    } else {
      arrowClassList.add('down')
    }
  }

  //点击显隐列表
  toggleList(e) {
    let target = e.target;
    let rid = target.dataset.type + '_list_' + target.dataset.id;
    let display = document.getElementById(rid).style.display;
    if (display === 'none') {
      target.className = 'dateDiv down'
      document.getElementById(rid).style.display = ''
    } else {
      target.className = 'dateDiv'
      document.getElementById(rid).style.display = 'none'
    }
  }

  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let ambarHeight = document.getElementsByClassName('am-tabs-bar')[0].offsetHeight
      if (this.state.listHeight === '' && ambarHeight !== 0) {
        let bettingFooter = document.getElementsByClassName('bettingFooter')[0].offsetHeight
        let gettableHeight = w - ambarHeight - bettingFooter;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
      if (this.state.listHeight === '' && myNavHeight !== 0) {
        let bettingFooter = document.getElementsByClassName('bettingFooter')[0].offsetHeight
        let gettableHeight = w - myNavHeight - document.getElementsByClassName('am-tabs-bar')[0].offsetHeight - bettingFooter;
        console.log(gettableHeight)
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  componentWillMount() {
    let active = this.props.location.query.active
    if (active) {
      this.setState({
        active: active
      })
    } else {
      this.setState({
        active: '1'
      })
    }
    bjdcSellList().then(result => {
      if (result && result.rows) {
        let rows = result.rows;
        if (!utils.checkIsArr(rows)) {
          rows = [rows]
        }
        this.setState({
          dataList: rows,
          pid: result.pid
        })
      } else {
        this.setState({
          noResult:true
        })
      }
    })
  }

  menuPop(flag) {
    this.setState({
      menuShow: flag,
    });
  }

  clickWF(key) {
    this.setState({
      active:key,
      menuShow:false
    },()=>{
      let url = utils.setUrlHash('active', key)
      hashHistory.replace(url)
    })
  }

  render() {
    let {menuShow,active} = this.state
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 =!this.state.noResult ?
      <div id="lotteryBetting">
        <CommonNavBar title="北京单场"/>
        <div className={sessionStorage.getItem("headFlag")?"Newarrow1":"Newarrow"} onClick={()=>this.menuPop(true)}><span/></div>
        {/*Newarrow有头部 Newarrow1没有头部*/}
        {menuShow ? <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData} showType="3"/> : null}
        {menuShow ? <div className="menu-mask" onClick={()=>this.menuPop(false)}/> : null}
        <Tabs activeKey={this.state.active}
              onTabClick={this.switchType}
              pageSize={3}
              speed="3"
              className="mar_b98"
              swipeable={false}
              animated={false}>
          {/*让球胜平负*/}
          <TabPane tab='让球胜平负' key="1">
            <div className="lotteryBettingList">
              {this.state.active === '1' &&
              <RangQiuList
                listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggleList={this.toggleList}
                toggle={this.toggle}
                receiveRead={this.receiveRead}
              />
              }

            </div>
          </TabPane>
          {/*比分*/}
          <TabPane tab='比分' key="2">
            <div className="lotteryBettingList">
              {this.state.active === '2' &&
              <BiFenList
                listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggleList={this.toggleList}
                toggle={this.toggle}
                receiveRead={this.receiveRead}
              />
              }
            </div>
          </TabPane>
          {/*半全场*/}
          <TabPane tab='半全场' key="3">
            <div className="lotteryBettingList">
              {this.state.active === '3' &&
              <BanquanChangList
                listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggleList={this.toggleList}
                toggle={this.toggle}
                receiveRead={this.receiveRead}
              />
              }
            </div>
          </TabPane>
          {/*上下单双*/}
          <TabPane tab='上下单双' key="4">
            <div className="lotteryBettingList">
              {this.state.active === '4' &&
              <ShangXiaList
                listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggleList={this.toggleList}
                toggle={this.toggle}
                receiveRead={this.receiveRead}
              />
              }
            </div>
          </TabPane>
          {/*总进球*/}
          <TabPane tab='总进球' key="5">
            <div className="lotteryBettingList">
              {this.state.active === '5' &&
              <ZongjinQiuList
                listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggleList={this.toggleList}
                toggle={this.toggle}
                receiveRead={this.receiveRead}
              />
              }
            </div>
          </TabPane>
        </Tabs>
      </div>
      :
      <div id="lotteryBetting">
        <CommonNavBar title="竞彩足球"/>
        <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
      </div>

    return (
      <div style={{height:'100%'}}>
        {children && content}
        <div style={{display: children ? 'none' : '',height:'100%'}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
