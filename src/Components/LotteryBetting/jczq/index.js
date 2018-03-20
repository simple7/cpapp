/*
* write on  2018 01 17
* 竞彩足球投注首页
* 四个子组件投注内容大致一致 注释参见混投
*
* */
'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast} from 'antd-mobile'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {jczqSellList, userBasicInfo} from '../../../Stubs/API'
import utils from '../../../common/utils'
import _ from 'lodash'
import betConfig from '../../../config/betConfig'
import {ShengPingList} from './shengPing/shengPing'
import {MixedBetsList} from './mixedBets/mixedBets'
import {OneWinnerList} from './oneWinner/oneWinner'
import {Choose2X1} from './2x1/Choose2X1'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/programContent.less'
import '../../../Style/lotteryBetting/matchingDetails.less'
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
    this.doOrder = this.doOrder.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.toggle = this.toggle.bind(this);
    this.receiveRead = this.receiveRead.bind(this);
  }

  /**
   * 点击tab栏修改url，避免刷新后又重置的情况
   * @param key
   */
  switchType(key) {
    this.setState({
      active: key
    })
    let url = utils.setUrlHash('active', key)
    hashHistory.replace(url)
  }

  /**
   * 子组件获取阅读协议状态，为选中状态时不可投注
   * @param read
   */
  receiveRead(read) {
    this.setState({
      read: read
    })
  }

  /**
   * 点击立即预约 优先判断是否阅读协议、登录状态、绑定信息
   * @param params  投注内容 形如：{
      allIsDG: this.allIsDG,
      betNum: this.state.betNum,
      realCG: this.state.realCG,
      chooseInfo: this.chooseInfo,
      bonus: this.state.bonus,
      beiNum: this.state.beiNum,
      imoney: this.state.betNum * this.state.beiNum * 2,
    }
   * @param type  是否需要登录后返回原页面 'needBack'
   * @returns {Promise.<void>}
   */
  async doOrder(params, type) {
    if (!this.state.read) {
      Toast.info('请阅读并同意《用户服务协议》', 1, null, false)
      return;
    }
    let flag = await utils.checkLogin()
    if (!flag) {
      AppJiek.thirdAppLoginCheck(()=> {
        hashHistory.push({
          pathname: '/jczqBet/login',
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
            pathname: 'jczqBet/editMobile',
            query: {
              needBack: true
            }
          })
        })
      } else if (!idCard) {
        utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
          hashHistory.push({
            pathname: 'jczqBet/editIdCard',
            query: {
              needBack: true
            }
          })
        })
      } else {
        let imoney = params.imoney
        if (imoney > betConfig.buyLimit.jczq) {
          Toast.info('最高投注金额' + betConfig.buyLimit.jczq + '元', 1, null, false)
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
        //以下部分是拼投注内容，不知哪个二货后台定的接口 每个彩种玩法拼法都有差异，后人保重
        switch (active) {
          case '1': //胜平负
            gid = betConfig.jczq.spf.gid
            // codes='SPF|171129018=3,171129001=3/0,171129002=1|2*1'
            codes = 'SPF|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              codes += chooseInfo[i].itemid + '=' + chooseInfo[i].spfchoose.join('/') + ','
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '2':
            gid = betConfig.jczq.hh.gid;
            // "HH|171206013>SPF=3/1+RQSPF=1+CBF=4:0/4:2/9:0+JQS=0+BQC=3-1/3-0,171206002>CBF=0:9/9:9/9:0+JQS=7|2*1"
            codes = 'HH|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              let arr = []
              let choose = chooseInfo[i]
              let chooseWF = _.cloneDeep(choose.chooseWF)
              let str = choose.itemid + '>';
              let arr0 = utils.removeEmpty(chooseWF[0])
              console.log(123, arr0)
              let arr1 = utils.removeEmpty(chooseWF[1])
              let arr2 = utils.removeEmpty(chooseWF[2])
              let arr3 = utils.removeEmpty(chooseWF[3])
              let arr4 = utils.removeEmpty(chooseWF[4])
              if (arr0.length > 0) {
                arr.push('SPF=' + arr0.join('/'))
              }
              if (arr1.join('').length > 0) {
                arr.push('RQSPF=' + arr1.join('/'))
              }
              if (arr2.length > 0) {
                arr.push('CBF=' + arr2.join('/'))
              }
              if (arr3.length > 0) {
                arr.push('JQS=' + arr3.join('/'))
              }
              if (arr4.length > 0) {
                arr.push('BQC=' + arr4.join('/'))
              }
              let s = arr.join('+') + ',';
              str = str + s
              codes = codes + str
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
          case '3':
            let matchDz = params.matchDz
            gid = betConfig.jczq.hh.gid;
            codes = '';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              let chooseWF = chooseInfo[i].chooseWF;
              items += chooseInfo[i].itemid + ',' + matchDz[i].match.itemid + ','
              let zxcode = '';
              if (chooseWF[0].join('').length > 0) {
                let a = chooseWF[0].join('').split('').join('/')
                zxcode = chooseInfo[i].itemid + '>SPF=' + a
                if (chooseWF[1].join('').length > 0) {
                  let c = chooseWF[1].join('').split('').join('/')
                  zxcode += '+RQSPF=' + c + ';'
                } else {
                  zxcode += ';'
                }
              } else {
                let b = chooseWF[1].join('').split('').join('/')
                zxcode = chooseInfo[i].itemid + '>RQSPF=' + b + ';'
              }
              zxcodes += zxcode
              _.map(chooseWF, (m, n) => {
                _.map(m, (j, k) => {
                  if (j) {
                    let realCode = '';
                    let code = '';
                    let ncode = '';
                    let newcode = '';
                    let ppcode = '';
                    if (n === 0) {
                      code = chooseInfo[i].itemid + '>SPF=' + j
                    } else {
                      code = chooseInfo[i].itemid + '>RQSPF=' + j
                    }
                    let betNum = chooseInfo[i].betNum[n][k];
                    let bet1 = '';
                    let bet2 = '';
                    if (betNum % 2 === 0) {
                      bet1 = bet2 = betNum / 2
                    } else {
                      bet1 = parseInt(betNum / 2) + 1;
                      bet2 = parseInt(betNum / 2);
                    }
                    let match = matchDz[i].match;
                    let close = parseInt(match.close);
                    let matchspf = match.spf.split(',')
                    let matchrqspf = match.rqspf.split(',')
                    if (close > 0) {
                      if (parseFloat(matchspf[2]) > parseFloat(matchrqspf[0])) {
                        realCode = 'HH|' + match.itemid + '>RQSPF=3,' + code + '|2*1_' + bet1 + ';' + 'HH|' + match.itemid + '>SPF=0,' + code + '|2*1_' + bet2 + ';'
                      } else {
                        realCode = 'HH|' + match.itemid + '>RQSPF=3,' + code + '|2*1_' + bet2 + ';' + 'HH|' + match.itemid + '>SPF=0,' + code + '|2*1_' + bet1 + ';'
                      }
                      ppcode = match.itemid + '>SPF=0+RQSPF=3;'
                      newcode = 'HH|' + code + ',' + match.itemid + '>SPF=0+RQSPF=3'
                    } else {
                      if (parseFloat(matchspf[0]) > parseFloat(matchrqspf[2])) {
                        realCode = 'HH|' + match.itemid + '>RQSPF=0,' + code + '|2*1_' + bet1 + ';' + 'HH|' + match.itemid + '>SPF=3,' + code + '|2*1_' + bet2 + ';'
                      } else {
                        realCode = 'HH|' + match.itemid + '>RQSPF=0,' + code + '|2*1_' + bet2 + ';' + 'HH|' + match.itemid + '>SPF=3,' + code + '|2*1_' + bet1 + ';'
                      }
                      newcode = 'HH|' + code + ',' + match.itemid + '>SPF=3+RQSPF=0'
                      ppcode = match.itemid + '>SPF=3+RQSPF=0;'
                    }
                    codes += realCode;
                    newcodes += newcode;
                    ppcodes += ppcode;
                  }
                })
              })
            }
            console.log('一场制胜codes：', codes)
            codes = codes.substring(0, codes.length - 1);
            if (newcodes) {
              newcodes = newcodes + ';0'
            }
            if (items) {
              items = items.substring(0, items.length - 1)
            }
            if (ppcodes) {
              ppcodes = ppcodes.substring(0, ppcodes.length - 1)
            }
            if (zxcodes) {
              zxcodes = zxcodes.substring(0, zxcodes.length - 1)
            }
            break;
          case '4':
            gid = betConfig.jczq.hh.gid;
            codes = 'HH|';
            for (let i = 0, len = chooseInfo.length; i < len; i++) {
              let arr = []
              let choose = chooseInfo[i]
              let chooseWF = _.cloneDeep(choose.spfchoose)
              let str = choose.itemid + '>';
              let arr0 = utils.removeEmpty(chooseWF[0])
              let arr1 = utils.removeEmpty(chooseWF[1])
              if (arr0.length > 0) {
                arr.push('SPF=' + arr0.join('/'))
              }
              if (arr1.join('').length > 0) {
                arr.push('RQSPF=' + arr1.join('/'))
              }
              let s = arr.join('+') + ',';
              str = str + s
              codes = codes + str
            }
            codes = codes.substr(0, codes.length - 1) + '|' + params.realCG.join('*1,') + '*1'
            break;
        }
        console.log('投注内容：', codes)
        params.gid = gid;
        params.items = items;
        params.newcodes = newcodes;
        params.ppcodes = ppcodes;
        params.zxcodes = zxcodes;
        params.codes = codes;
        hashHistory.push({
          pathname: '/jczqBet/order',
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
    let rid = 'jczq_' + target.dataset.type + '_list_' + target.dataset.id;
    let display = document.getElementById(rid).style.display;
    if (display === 'none') {
      target.className = 'dateDiv down'
      document.getElementById(rid).style.display = ''
    } else {
      target.className = 'dateDiv'
      document.getElementById(rid).style.display = 'none'
    }
  }
  // 动态计算高度
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
    let cid = Math.random()
    jczqSellList(cid).then(result => {
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
    let active = this.props.location.query.active || '1'
    this.setState({
      active: active
    })
  }


  render() {
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 = !this.state.noResult ?
      <div id="lotteryBetting">
        <CommonNavBar title="竞彩足球"/>
        <Tabs activeKey={this.state.active} onTabClick={this.switchType} className="mar_b98" swipeable={false}
              animated={false}>
          <TabPane tab='胜平负' key="1">
            <div className="lotteryBettingList">
              {
                this.state.active === '1' &&
                <ShengPingList listHeight={this.state.listHeight}
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
          <TabPane tab='一场制胜' key="3">
            <div className="lotteryBettingList">
              {
                this.state.active === '3' &&
                <OneWinnerList
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
          <TabPane tab='2选1' key="4">
            <div className="lotteryBettingList">
              {
                this.state.active === '4' &&
                <Choose2X1
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
        {children &&
        content
        }
        <div style={{display: children ? 'none' : '', height: '100%'}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
