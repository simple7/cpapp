'use strict'
import React, {Component} from 'react'
import {Tabs, NavBar, Toast} from 'antd-mobile';
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {szcHistory, lotteryControl, userBasicInfo} from '../../../Stubs/API'
import _ from 'lodash'
import utils from '../../../common/utils'
import {hashHistory} from 'react-router'
import Pl3Foot2 from '../common/Pl3Foot2'
import UserProtocol from '../common/userProtocol'
import IndexChild from './indexChild'
import betConfig from '../../../config/betConfig'
import DownComt from '../common/downComt'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/fc3D.less'
import "../../../Style/lotteryBetting/mixedPop.less"
import DelIcon from '../../../Img/lotteryBetting/delIcon.png'

const TabPane = Tabs.TabPane;

import {Z6DS} from "./z6ds/Z6DS"
import {ZX} from "./zx/ZX"
import {HZ} from "./hz/HZ"
import {Z6FS} from "./z6fs/Z6FS"
import {Z3DS} from "./z3ds/Z3DS"
import {Z3FS} from "./z3fs/Z3FS"
import {AppJiek} from '../../../common/AppApi'

class LotteryBetting extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: '',
      popListHeight: '',
      active: '',
      pid: '2010000',
      atime: new Date(),
      yilou: {m0: [], m1: [], m2: [], m3: [], m4: [], m0Max: 0, m1Max: 0, m2Max: 0, m3Max: 0, m4Max: 0},
      lishi: [],
      read: true,
      maxBei: 0,
      maxQi: 10,
      showType: 1,
      choose: {
        data: {m0: [], m1: [], m2: []},
        zhushu: 0,
        type: '1'
      },
      buyQi: 1,
      beiNum: 1,
      money: 0,
      zongZhushu: 0,
      stopZh: false,
      chooseList: [],
      menuShow:false
    }
    this.type = {
      zx: '1',
      hz: '2',
      z3ds: '3',
      z3fs: '4',
      z6ds: '5',
      z6fs: '6'
    }
    let pathname = this.props.location.pathname;
    this.data = {
      gid: '03',
      name: '福彩3D',
      type: 'fc3d',
      childName: {
        '1': '直选',
        '2': '直选和值',
        '3': '组三单式',
        '4': '组三复式',
        '5': '组六单式',
        '6': '组六复式',
      },
      jx: {
        '1': {
          min: 0,
          max: 9,
          count: 3,
          repeat: true,
          order: false
        },
        '2': {
          min: 0,
          max: 27,
          count: 1,
          repeat: false,
          order: true
        },
        '3': {
          min: 0,
          max: 9,
          count: 2,
          repeat: false,
          order: false
        },
        '4': {
          min: 0,
          max: 9,
          count: 2,
          repeat: false,
          order: true
        },
        '5': {
          min: 0,
          max: 9,
          count: 3,
          repeat: false,
          order: false
        },
        '6': {
          min: 0,
          max: 9,
          count: 3,
          repeat: false,
          order: true
        }
      }
    }
    if (pathname.indexOf('pl3') !== -1) {
      this.data.gid = '53';
      this.data.name = '排列三';
      this.data.type = 'pl3';
    }
    this.currentChoose = {
      data: {m0: [], m1: [], m2: []},
      zhushu: 0,
      type: '1',
      index: ''
    }
    this.tabsData = [
      {title: "直选", key: '1'},
      {title: "直选和值", key: '2'},
      {title: "组三单式", key: '3'},
      {title: "组三复式", key: '4'},
      {title: "组六单式", key: '5'},
      {title: "组六复式", key: '6'},
    ];
    this.doOrder = this.doOrder.bind(this)
    this.receiveRead = this.receiveRead.bind(this)
    this.switchType = this.switchType.bind(this)
    this.jxNum = this.jxNum.bind(this)
    this.setShowType = this.setShowType.bind(this)
    this.clearAll = this.clearAll.bind(this)
    this.computeAll = this.computeAll.bind(this)
    this.beiNumBlur = this.beiNumBlur.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.setQiNum = this.setQiNum.bind(this)
    this.qiNumBlur = this.qiNumBlur.bind(this)
    this.doNext = this.doNext.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.delChoose = this.delChoose.bind(this)
    this.receive = this.receive.bind(this)
    this.creatOne = this.creatOne.bind(this)

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
  }

  componentWillMount() {
    let active = this.props.location.query.active
    if (!active) {
      active = '1'
    }
    this.setState({
      active: active
    })
    szcHistory(this.data.gid).then(result => {
      if (result) {
        let row = result.row
        let rowSet = Object.keys(row)
        let rowp = result.rowp;
        if (!_.isArray(rowp)) {
          rowp = [rowp]
        }
        let yilou = {m0: [], m1: [], m2: [], m3: [], m4: []}
        let lishi = []
        _.each(rowSet, item => {
          let arr = row[item].split(',')
          arr = _.map(arr, item => {
            return +item
          })
          yilou[item] = arr
          let maxDesc = item + 'Max'
          yilou[maxDesc] = _.max(arr)
        })
        rowp.map(item => {
          let code = item.acode.split(',')
          let t = '';
          if (code[0] == code[1] && code[0] == code[2] && code[1] == code[2]) {
            t = '豹子';
          } else if (code[0] == code[1] || code[0] == code[2] || code[1] == code[2]) {
            t = '组三';
          } else {
            t = '组六';
          }
          let param = {
            pid: item.pid,
            atime: item.atime,
            code: code,
            t: t
          }
          lishi.push(param)
        })

        this.setState({
          pid: result.pid,
          atime: result.atime,
          yilou: yilou,
          lishi: lishi.reverse()
        })
      } else {
        //todo
      }
    })
    lotteryControl(this.data.gid).then(result => {
      if (result && result.bs) {
        let bs = result.bs
        this.setState({
          minBei: parseInt(bs.min),
          maxBei: parseInt(bs.max)
        })
      }
    })
  }

  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && bettingFooter && bettingFooter.offsetHeight !== 0) {
        let tabBar = document.getElementsByClassName('am-tabs-bar')[0]
        let gettableHeight = w - bettingFooter.offsetHeight - tabBar.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && bettingFooter && bettingFooter.offsetHeight !== 0) {
        let myNavHeight = document.getElementsByClassName('myNav')[0];
        let tabBar = document.getElementsByClassName('am-tabs-bar')[0]
        let gettableHeight = w - myNavHeight.offsetHeight - bettingFooter.offsetHeight - tabBar.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
    let programList = document.getElementsByClassName('programList')[0];
    if (programList && this.state.popListHeight === '') {
      let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
      let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
      let bettingFooter = document.getElementsByClassName('programFooter')[0].offsetHeight;
      let listHeight = w - myNavHeight - bettingFooter - 80;
      this.setState({
        popListHeight: listHeight
      })
    }
  }

  //跳转预约页面
  async doOrder() {
    if (this.state.zongZhushu === 0 || this.state.chooseList.length === 0) {
      Toast.info('请至少选择一注', 1, null, false)
      return
    }
    if (!this.state.read) {
      Toast.info('请阅读并同意《用户服务协议》', 1, null, false)
      return;
    }
    let flag = await utils.checkLogin()
    if (!flag) {
      AppJiek.thirdAppLoginCheck(()=> {
        hashHistory.push({
          pathname: this.data.type + 'Bet/login',
          query: {
            flag: 'needBack'
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
            pathname: this.type + 'Bet/editMobile',
            query: {
              needBack: true
            }
          })
        })
      } else if (!idCard) {
        utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
          hashHistory.push({
            pathname: this.type + 'Bet/editIdCard',
            query: {
              needBack: true
            }
          })
        })
      } else {
        let params = {}
        let codes = '';
        let chooseList = _.cloneDeep(this.state.chooseList);
        console.log('----', chooseList)
        _.each(chooseList, item => {
          let code = ''
          let data = item.data
          switch (item.type) {
            case this.type.zx:
              code = data.m0.join('') + ',' + data.m1.join('') + ',' + data.m2.join('') + ':1:1;'
              break;
            case this.type.hz:
              code = data.m0.join(',') + ':1:4;'
              break;
            case this.type.z3ds:
              code = data.m0 + ',' + data.m1 + ',' + data.m2 + ':2:1;'
              break;
            case this.type.z3fs:
              code = data.m0.join(',') + ':2:3;'
              break;
            case this.type.z6ds:
              code = data.m0 + ',' + data.m1 + ',' + data.m2 + ':3:1;'
              break;
            case this.type.z6fs:
              code = data.m0.join(',') + (data.m0.length > 3 ? ':3:3;' : ':3:1;')
              break;
          }
          codes += code
        })
        codes = codes.substring(0, codes.length - 1)
        console.log('投注内容：', codes)
        params.gid = this.data.gid
        params.chooseList = chooseList;
        params.beiNum = this.state.beiNum;
        params.betNum = this.state.zongZhushu;
        params.buyQi = this.state.buyQi;
        params.imoney = this.state.money;
        params.stopZh = this.state.stopZh ? '1' : '0';
        params.codes = codes;
        if (params.buyQi > 1) {
          let pid = this.state.pid
          let mulitys = ''
          for (let i = 1; i <= params.buyQi; i++) {
            pid += ','
            mulitys += this.state.beiNum + ','
          }
          params.pid = pid.substring(0, pid.length - 1);
          params.mulitys = mulitys.substring(0, mulitys.length - 1);
        } else {
          params.pid = this.state.pid;
        }
        params.szc = true;
        hashHistory.push({
          pathname: this.data.type + 'Bet/order',
          state: {
            params: params
          }
        })
      }
    }
  }

  //用户协议勾选
  receiveRead(read) {
    this.setState({
      read: read
    })
  }

  //选择tab栏
  switchType(key) {
    this.setState({
      active: key
    }, () => {
      // this.clearAll()
      let url = utils.setUrlHash('active', key)
      hashHistory.replace(url)
    })
  }

  //接受弹框返回回来的数据
  receive(item, type, isAdd, active, ind) {
    console.log(item)
    let chooseList = _.cloneDeep(this.state.chooseList)
    let arr = []
    if (type === 'jx') {
      arr = _.concat(item, chooseList)
    } else if (type === 'zx') {
      _.each(chooseList, it => {
        if (it.index !== item.index) {
          arr.push(it)
        } else {
          arr.push(item)
        }
      })
      if (isAdd) {
        arr.unshift(item)
      }
    } else if (type === 'z3ds' || type === 'z6ds') {
      _.each(chooseList, it => {
        if (it.index !== ind) {
          arr.push(it)
        }
      })
      arr = _.concat(item, arr)
    }
    console.log('====', arr)
    this.setState({
      active: active,
      showType: 2,
      chooseList: arr
    }, () => {
      this.computeAll()
    })
  }

  /**
   * 机选
   * @param n 注数
   * @param type 类型 clear：清空已选
   */
  jxNum(n, type) {
    let active = this.state.active
    console.log('当前tab:', active)
    let chooseList = []
    if (type !== 'clear') {
      chooseList = _.cloneDeep(this.state.chooseList)
    }
    for (let i = 0; i < n; i++) {
      let red = utils.math.random(this.data.jx[active].min, this.data.jx[active].max, this.data.jx[active].count, this.data.jx[active].repeat)
      if (this.data.jx[active].order) {
        red = utils.math.sort(red)
      }
      let param = {
        type: active,
        index: chooseList.length + 1,
        zhushu: 1
      }
      if (active === this.type.hz) {
        param.data = {m0: [red[0]]}
        param.zhushu = betConfig.FAXQ.pl3.hz[red[0]]
      } else if (active === this.type.z3fs) {
        param.data = {
          m0: [red[0], red[1]]
        }
        param.zhushu = 2
      } else if (active === this.type.z3ds) {
        param.data = {
          m0: red[0],
          m1: red[1],
          m2: red[1]
        }
      } else if (active === this.type.z6fs) {
        param.data = {
          m0: [red[0], red[1], red[2]],
        }
      } else {
        param.data = {
          m0: [red[0]],
          m1: [red[1]],
          m2: [red[2]]
        }
      }
      chooseList.unshift(param)
    }
    this.setState({
      buyQi: 1,
      beiNum: 1,
      chooseList: chooseList,
      showType: 2
    }, () => {
      this.computeAll()
    })
  }

  //设置弹框显示
  setShowType(type) {
    this.setState({
      showType: type
    })
  }

  //清空选中项
  clearAll() {
    this.setState({
      buyQi: 1,
      beiNum: 1,
      zongZhushu: 0,
      zhushu: 0,
      money: 0,
      chooseList: [],
      choose: {
        m0: [], m1: [], m2: []
      }
    })
  }

  //删除单条数据
  delChoose(id) {
    let chooseList = _.cloneDeep(this.state.chooseList);
    let arr = []
    _.each(chooseList, item => {
      if (item.index !== id) {
        arr.push(item)
      }
    })
    this.setState({
      chooseList: arr
    }, () => {
      this.computeAll()
    })
  }

  // 重新计算投注金额
  computeAll() {
    let chooseList = _.cloneDeep(this.state.chooseList);
    let beiNum = +this.state.beiNum;
    let buyQi = +this.state.buyQi
    let zhushu = 0
    _.each(chooseList, item => {
      zhushu += item.zhushu
    })
    this.setState({
      zongZhushu: zhushu,
      money: zhushu * beiNum * buyQi * 2
    })
  }

  beiNumBlur(v) {
    if (v.target.value === '' || v.target.value === '0') {
      this.setState({beiNum: 1}, () => {
        this.computeAll()
      })
    }
  }

// 输入倍数
  setBeiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '')
    if (value > this.state.maxBei) {
      value = this.state.maxBei
      Toast.info('最多可投' + this.state.maxBei + '倍', 1, null, false)
    } else if (value === '0') {
      value = 1
    }
    this.setState({
      beiNum: value
    }, () => {
      this.computeAll()
    })
  }


  // 输入期数
  setQiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '')
    if (value > this.state.maxQi) {
      value = this.state.maxQi
    } else if (value === '0') {
      value = 1
    }
    this.setState({
      buyQi: value
    }, () => {
      this.computeAll()
    })
  }

  qiNumBlur(v) {
    if (v.target.value === '' || v.target.value === 0) {
      this.setState({buyQi: 1}, () => {
        this.computeAll()
      })
    }
  }

  // 点击下一步自动生成一注
  creatOne(active) {
    let red = utils.math.random(this.data.jx[active].min, this.data.jx[active].max, this.data.jx[active].count, this.data.jx[active].repeat)
    if (this.data.jx[active].order) {
      red = utils.math.sort(red)
    }
    return red
  }

  //下一步
  doNext(type, data, zhushu) {
    let {m0, m1, m2} = data;
    let active = this.state.active
    if (zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    } else {
      //存储已选  返回的时候还在
      this.setState({
        choose: {
          data: data,
          zhushu: zhushu,
          type: type
        },

      })
    }
    let arr = []
    if (type === this.type.z3ds) {
      _.each(m0, item => {
        _.each(m1, item2 => {
          let param = {
            data: {
              m0: item,
              m1: item2,
              m2: item2,
            },
            index: arr.length + 1,
            zhushu: 1,
            type: type,
            zigou: true
          }
          arr.push(param)
        })
      })
    } else if (type === this.type.z6ds) {
      _.each(m0, item => {
        _.each(m1, item2 => {
          _.each(m2, item3 => {
            let param = {
              data: {
                m0: item,
                m1: item2,
                m2: item3,
              },
              index: arr.length + 1,
              zhushu: 1,
              type: type,
              zigou: true
            }
            arr.push(param)
          })

        })
      })
    } else {
      let param = {
        data: {
          m0,
          m1,
          m2,
        },
        index: 1,
        zhushu: zhushu,
        type: type,
        zigou: true
      }
      arr.unshift(param)
    }
    this.setState({
      buyQi: 1,
      beiNum: 1,
      chooseList: arr,
      showType: 2
    }, () => {
      this.computeAll()
    })
  }

  // 每条选中的数据渲染
  chooseTemplate(item) {
    let arr = []
    let code = ''
    if (item.type === this.type.zx) {
      let {m0, m1, m2} = item.data;
      code = m0.join(' ') + ' | ' + m1.join(' ') + ' | ' + m2.join(' ');
    } else if (item.type === this.type.hz) {
      let {m0} = item.data;
      code = m0.join(' ');
    } else if (item.type === this.type.z3ds || item.type === this.type.z6ds) {
      let {m0, m1, m2} = item.data;
      code = m0 + ' ' + m1 + ' ' + m2;
    } else if (item.type === this.type.z3fs || item.type === this.type.z6fs) {
      let {m0} = item.data;
      code = m0.join(' ')
    }
    arr.push(
      <p className="p1" key={"p1_" + item.index}>
        <span className="spanRed">{code}</span>
      </p>
    )
    arr.push(
      <p className="p2" key={"p2_" + item.index}>
        <span>{this.data.childName[item.type]} {item.zhushu}注{item.zhushu * 2}元</span>
      </p>
    )
    return arr
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
    content1 =
      <div id="lotteryBetting" tabIndex="0">
        {
          this.state.showType === 1 &&
          <div>
            <CommonNavBar title={this.data.name}/>
            <div className={sessionStorage.getItem("headFlag")?"Newarrow1":"Newarrow"} onClick={()=>this.menuPop(true)}><span/></div>
            {/*Newarrow有头部 Newarrow1没有头部*/}
            {menuShow ? <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData}/> : null}
            {menuShow ? <div className="menu-mask" onClick={()=>this.menuPop(false)}/> : null}
            <Tabs pageSize={3} activeKey={this.state.active}
                  onTabClick={this.switchType}
                  speed="3"
                  swipeable={false}
                  animated={false}>
              <TabPane tab={"直选"} key="1">
                {
                  this.state.active === '1' &&
                  <ZX
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }

              </TabPane>
              <TabPane tab={"直选和值"} key="2">
                {
                  this.state.active === '2' &&
                  <HZ
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }
              </TabPane>
              <TabPane tab={"组三单式"} key="3">
                {
                  this.state.active === '3' &&
                  <Z3DS
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }
              </TabPane>
              <TabPane tab={"组三复式"} key="4">
                {
                  this.state.active === '4' &&
                  <Z3FS
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }
              </TabPane>
              <TabPane tab={"组六单式"} key="5">
                {
                  this.state.active === '5' &&
                  <Z6DS
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }
              </TabPane>
              <TabPane tab={"组六复式"} key="6">
                {
                  this.state.active === '6' &&
                  <Z6FS
                    type={this.data.type}
                    pid={this.state.pid}
                    atime={this.state.atime}
                    yilou={this.state.yilou}
                    lishi={this.state.lishi}
                    listHeight={this.state.listHeight}
                    choose={this.state.choose}
                    receiveRead={this.receiveRead}
                    doNext={this.doNext}
                    jxNum={this.jxNum}
                    creatOne={this.creatOne}
                  />
                }
              </TabPane>
            </Tabs>
          </div>
        }
        {
          this.state.showType === 2 &&
          <div className="programContent">
            <NavBar className="myNav"
                    mode="dark"
                    onLeftClick={() => {
                      this.setShowType(1)
                    }}
                    rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                    style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
            >方案内容</NavBar>
            <div className="ssqBetBtn">
              <label onClick={() => {
                this.currentChoose = {
                  data: {m0: [], m1: [], m2: []},
                  zhushu: 0,
                  type: this.state.active,
                  index: ''
                }
                this.setState({
                  showType: 3
                })
              }
              }><span>+</span><span>自选1注</span></label>
              <label onClick={() => this.jxNum(1)}><span>+</span><span>机选1注</span></label>
              <label onClick={() => this.jxNum(5)}><span>+</span><span>机选5注</span></label>
            </div>
            <div className="programContentBox">
              <div className="programList ">
                {this.state.chooseList.length > 0 ?
                  <div className="popList listDivView" style={{height: this.state.popListHeight}}>
                    {
                      this.state.chooseList.map((item, index) => {
                        return (
                          <div className="mixedProgram " key={"choose_" + index}>
                            <div className="mixedFlex">
                              <div className="programBox_fl" onClick={() => this.delChoose(item.index)}><img
                                src={DelIcon}/>
                              </div>
                              <div className="programBox_fr_ssq" onClick={() => {
                                this.currentChoose = item
                                this.setState({
                                  showType: 3
                                })

                              }}>
                                {this.chooseTemplate(item)}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                    <UserProtocol link={this.data.type + "Bet/linkPage"}
                                  read={this.state.read}
                                  doClear={this.clearAll}
                                  receiveRead={this.receiveRead}/>
                  </div>
                  :
                  <div className="noChooseBet">亲~你还没有投注哦</div>
                }
              </div>
            </div>
            <Pl3Foot2
              qiNumBlur={this.qiNumBlur}
              beiNumBlur={this.beiNumBlur}
              setQiNum={this.setQiNum}
              setBeiNum={this.setBeiNum}
              buyQi={this.state.buyQi}
              beiNum={this.state.beiNum}
              money={this.state.money}
              zongZhushu={this.state.zongZhushu}
              doOrder={this.doOrder}
            />
          </div>
        }
        {this.state.showType === 3 &&
        <IndexChild state={this.state}
                    data={this.data}
                    type={this.type}
                    currentChoose={this.currentChoose}
                    setShowType={this.setShowType}
                    receive={this.receive}
                    switchType={this.switchType}
                    active={this.state.active}
        />
        }
      </div>


    return (
      <div>
        {children && content}
        <div style={{display: children ? 'none' : ''}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
