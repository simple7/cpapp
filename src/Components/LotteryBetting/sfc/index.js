'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast} from 'antd-mobile'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {SF2R9, userBasicInfo} from '../../../Stubs/API'
import utils from '../../../common/utils'
import _ from 'lodash'
import betConfig from '../../../config/betConfig'
import SFR9 from '../common/SfR9_Template'
import '../../../Style/lotteryBetting/index.less'
import {AppJiek} from '../../../common/AppApi'

const TabPane = Tabs.TabPane;

class LotteryBetting extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      active: '',
      listHeight: '',
      dataList: [],
      dataList1: [],
      pids: [],
      pid: '',
      et: '',
      read: true,
      noResult:false,
      sale:'1'
    }
    this.doOrder = this.doOrder.bind(this);
    this.toggle = this.toggle.bind(this);
    this.receiveRead = this.receiveRead.bind(this);
  }

  receiveRead(read) {
    this.setState({
      read: read
    })
  }



  // 预约
  async doOrder(params, type) {
    if(this.state.sale ==='0'){
      Toast.info('当前对阵尚未确定，请稍后购买！',1,null,false)
      return;
    }
    if (!this.state.read) {
      Toast.info('请阅读并同意《用户服务协议》', 1, null, false)
      return;
    }
    let flag = await utils.checkLogin()
    if (!flag) {
      AppJiek.thirdAppLoginCheck(()=> {
        hashHistory.push({
          pathname: '/sfcBet/login',
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
            pathname: 'sfcBet/editMobile',
            query: {
              needBack: true
            }
          })
        })
      } else if (!idCard) {
        utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
          hashHistory.push({
            pathname: 'sfcBet/editIdCard',
            query: {
              needBack: true
            }
          })
        })
      } else {
        let imoney = params.imoney
        if (imoney > betConfig.buyLimit.zc) {
          Toast.info('最高投注金额' + betConfig.buyLimit.zc + '元', 1, null, false)
          return
        }
        console.log('params', params)
        let codes = '';
        let chooseInfo = params.chooseInfo;
        for (let i = 0, len = chooseInfo.length; i < len; i++) {
          let choose = chooseInfo[i].spfchoose.join('');
          codes += choose + ',';
        }
        codes = codes.substring(0, codes.length - 1) + ':1:1';
        let gid = betConfig.sfc.gid
        console.log('投注内容：', codes)
        /*let bonu = params.bonus;
        let bonus = {
          min: bonu.min * 0.65,
          max: bonu.max * 0.65
        }
        params.bonus = bonus;*/
        params.gid = gid;
        params.codes = codes;
        params.pid = this.state.pid;
        params.szc = true;
        hashHistory.push({
          pathname: '/sfcBet/order',
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


  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && ambarHeight && bettingFooter) {
        let gettableHeight = w - bettingFooter.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && myNavHeight && bettingFooter) {
        let gettableHeight = w - myNavHeight.offsetHeight - bettingFooter.offsetHeight;
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
    SF2R9().then(result => {
      if (result && result.row) {
        let row = result.row;
        let rowp = result.rowp;
        let pids = []
        if (rowp) {
          pids = rowp.pids.split(',')
        }
        this.setState({
          dataList: row,
          pids: pids,
          pid: result.pid,
          et: result.et,
          sale:result.sale
        })
      } else {
        this.setState({
          noResult: true
        })
      }
    })
  }


  render() {
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 =
      !this.state.noResult ?
      <div id="lotteryBetting">
        <CommonNavBar title="胜负彩"/>
        <div className="lotteryBettingList">
          <SFR9 listHeight={this.state.listHeight}
                dataList={this.state.dataList}
                doOrder={this.doOrder}
                toggle={this.toggle}
                pid={this.state.pid}
                et={this.state.et}
                type="sfc"
                receiveRead={this.receiveRead}
                read={this.state.read}
          />
        </div>
      </div>
        :
        <div id="lotteryBetting">
          <CommonNavBar title="竞彩足球"/>
          <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
        </div>

    return (
      <div style={{height:'100%'}}>
        {children &&
        content
        }
        <div style={{display: children ? 'none' : '',height:'100%'}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
