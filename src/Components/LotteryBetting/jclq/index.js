'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast} from 'antd-mobile'
import CommonNavBar from '../../CommonComts/CommonNavBar'

import {jclqSellList, userBasicInfo} from '../../../Stubs/API'
import utils from '../../../common/utils'
import _ from 'lodash'
import betConfig from '../../../config/betConfig'
import '../../../Style/lotteryBetting/index.less'
import {ShengPingList} from './sf/ShengPing'
import {MixedBetsList} from './mixedBets/mixedBets'

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
      read: true,
      noResult: false
    }
    this.switchType = this.switchType.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.toggle = this.toggle.bind(this);
    this.doOrder = this.doOrder.bind(this);
    this.receiveRead = this.receiveRead.bind(this);
  }

  switchType(key) {
    this.setState({
      active: key
    })
    let url = utils.setUrlHash('active', key)
    hashHistory.replace(url)
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

  receiveRead(read) {
    this.setState({
      read: read
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
          pathname: '/jclqBet/login',
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
            pathname: 'jclqBet/editMobile',
            query: {
              needBack: true
            }
          })
        })
      } else if (!idCard) {
        utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
          hashHistory.push({
            pathname: 'jclqBet/editIdCard',
            query: {
              needBack: true
            }
          })
        })
      } else {
        let imoney = params.imoney
        if (imoney > betConfig.buyLimit.jclq) {
          Toast.info('最高投注金额' + betConfig.buyLimit.jclq + '元', 1, null, false)
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
          case '1': //胜负
            gid = betConfig.jclq.sf.gid
            codes = 'SF|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].spfchoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '2':
            gid = betConfig.jclq.hh.gid;
            codes = 'HH|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              let arr = []
              let choose = chooseInfo[i]
              let chooseWF = _.cloneDeep(choose.chooseWF)
              let str = choose.itemid + '>';
              let arr0 = utils.removeEmpty(chooseWF[0])
              let arr1 = utils.removeEmpty(chooseWF[1])
              let arr2 = utils.removeEmpty(chooseWF[2])
              let arr3 = utils.removeEmpty(chooseWF[3])
              if (arr0.length > 0) {
                arr.push('SF=' + arr0.join('/'))
              }
              if (arr1.join('').length > 0) {
                arr.push('RFSF=' + arr1.join('/'))
              }
              if (arr2.length > 0) {
                arr.push('DXF=' + arr2.join('/'))
              }
              if (arr3.length > 0) {
                arr.push('SFC=' + arr3.join('/'))
              }
              let s = arr.join('+') + ',';
              str = str + s
              codes = codes + str
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          default:
            return false;
            break
        }
        console.log('投注内容：', codes)
        if (codes) {
          params.gid = gid;
          params.items = items;
          params.newcodes = newcodes;
          params.ppcodes = ppcodes;
          params.zxcodes = zxcodes;
          params.codes = codes;
          hashHistory.push({
            pathname: '/jclqBet/order',
            state: {
              params: params
            }
          })
        }
      }
    }
  }

  //点击显隐列表
  toggleList(e) {
    let target = e.target;
    let rid = 'jclq_' + target.dataset.type + '_list_' + target.dataset.id;
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
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  componentWillMount() {
    let cid = Math.random()
    jclqSellList(cid).then(result => {
      if (result && result.rows) {
        let rows = result.rows;
        if (utils.checkIsArr(rows)) {
          console.log(rows)
          this.setState({
            dataList: rows
          })
        } else {
          this.setState({
            dataList: [rows]
          })
        }
      } else {
        this.setState({
          noResult: true
        })
      }
    })
  }

  componentDidMount() {
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
          <CommonNavBar title="竞彩篮球"/>
          <Tabs activeKey={this.state.active} onTabClick={this.switchType} swipeable={false} animated={false}
                className="mar_b98">
            {/*胜负*/}

            <TabPane tab='胜负' key="1">
              <div className="lotteryBettingList">
                {
                  this.state.active === '1' &&
                  <ShengPingList
                    listHeight={this.state.listHeight}
                    dataList={this.state.dataList}
                    doOrder={this.doOrder}
                    toggleList={this.toggleList}
                    toggle={this.toggle}
                    receiveRead={this.receiveRead}
                    read={this.state.read}
                  />
                }
              </div>
            </TabPane>

            {/*混合投注*/}

            <TabPane tab='混合投注' key="2">
              <div className="lotteryBettingList">
                {
                  this.state.active === '2' &&
                  <MixedBetsList
                    listHeight={this.state.listHeight}
                    dataList={this.state.dataList}
                    doOrder={this.doOrder}
                    toggleList={this.toggleList}
                    toggle={this.toggle}
                    receiveRead={this.receiveRead}
                    read={this.state.read}
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
      <div style={{height: '100%'}}>
        {children && content}
        <div style={{display: children ? 'none' : '', height: '100%'}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
