import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {Popover, Toast, NavBar} from 'antd-mobile';
import _ from 'lodash'
import utils from '../../../common/utils'
import moment from 'moment'
import {szcHistory, lotteryControl, userBasicInfo} from '../../../Stubs/API'
import UserProtocol from '../common/userProtocol'
import QxP52 from './QxP52'
import ZhuShou from './zhushou'
import commonConfig from '../../../config/commonConfig'
import DelIcon from '../../../Img/lotteryBetting/delIcon.png'
import {AppJiek} from '../../../common/AppApi'

const Item = Popover.Item;
export default class QxP5 extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: '',
      lishi: [],
      yilou: {
        m0: [],
        m1: [],
        m2: [],
        m3: [],
        m4: [],
        m5: [],
        m6: [],
        m0Max: 0,
        m1Max: 0,
        m2Max: 0,
        m3Max: 0,
        m4Max: 0,
        m5Max: 0,
        m6Max: 0
      },
      historyShow: false,
      showMoney: false,
      yilouShow: false,
      pid: '2010000',
      atime: '2010-01-01',
      choose: {
        m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []
      },
      zhushu: 0,
      chooseList: [],
      showType: 1,
      popListHeight: '',
      read: true,
      buyQi: 1,
      beiNum: 1,
      zhShow: false,
      beiNumShow: false,
      stopZh: false,
      minBei: 1,
      maxBei: 99999,
      minQi: 1,
      maxQi: 10,
      zongZhushu: 0,
      money: 0,
      delShow: false,
    }
    this.animating = false;
    this.currentChoose = {red: [], blue: [], index: ''}
    this.lotteryData = {
      'pl5': {
        'red': 9,
        'miniRedNum': 1,
        'count': 5,
        'lot_id': '52',
        'name': '排列五',
        topDesc: '与开奖号码按位相符即中奖100000元',
        wei: {
          0: '万位', 1: '千位', 2: '百位', 3: '十位', 4: '个位'
        }
      },
      'qxc': {
        'red': 9,
        'miniRedNum': 1,
        'count': 7,
        'lot_id': '51',
        'name': '七星彩',
        topDesc: '每位至少选择1个号',
        wei: {
          0: '第一位', 1: '第二位', 2: '第三位', 3: '第四位', 4: '第五位', 5: '第六位', 6: '第七位'
        }

      }
    }
    this.type = 'qxc'
    this.animating = false
    this.Template = this.Template.bind(this)
    this.template = this.template.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.bigShow = this.bigShow.bind(this)
    this.bigHide = this.bigHide.bind(this)
    this.clearChoose = this.clearChoose.bind(this)
    this.doNext = this.doNext.bind(this)
    this.jxNum = this.jxNum.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.receiveRead = this.receiveRead.bind(this)
    this.setShowType = this.setShowType.bind(this)
    this.receive = this.receive.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.setQiNum = this.setQiNum.bind(this)
    this.computeAll = this.computeAll.bind(this)
    this.doOrder = this.doOrder.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.computeChoose = this.computeChoose.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
    this.creatOne = this.creatOne.bind(this)
    this.shark = this.shark.bind(this)
  }

  componentWillMount() {
    let type = ''
    let hash = window.location.hash
    if (hash.indexOf('pl5') !== -1) {
      this.type = type = 'pl5'
    } else {
      this.type = type = 'qxc'
    }
    szcHistory(this.lotteryData[type].lot_id).then(result => {
      if (result) {
        let row = result.row
        let rowSet = Object.keys(row)
        let rowp = result.rowp;
        if (!_.isArray(rowp)) {
          rowp = [rowp]
        }
        let yilou = {m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []}
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
          let code = item.acode
          let param = {
            pid: item.pid,
            atime: item.atime,
            red: code.split(','),
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
    lotteryControl(this.lotteryData[type].lot_id).then(result => {
      if (result && result.bs) {
        let bs = result.bs
        this.setState({
          minBei: parseInt(bs.min),
          maxBei: parseInt(bs.max)
        })
      }
    })
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
          pathname: this.type + 'Bet/login',
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
        _.each(chooseList, item => {
          let code = ''
          if (this.type === 'qxc') {
            code = item.m0.join('') + ','
              + item.m1.join('') + ','
              + item.m2.join('') + ','
              + item.m3.join('') + ','
              + item.m4.join('') + ','
              + item.m5.join('') + ','
              + item.m6.join('') + ':1:1;'
          } else {
            code = item.m0.join('') + ','
              + item.m1.join('') + ','
              + item.m2.join('') + ','
              + item.m3.join('') + ','
              + item.m4.join('') + ':1:1;'
          }
          codes += code
        })
        codes = codes.substring(0, codes.length - 1)
        console.log('投注内容：', codes)
        let gid = this.lotteryData[this.type].lot_id
        params.gid = gid;
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
          pathname: this.type + 'Bet/order',
          state: {
            params: params
          }
        })
      }
    }
  }

  //接受弹框返回回来的数据
  receive(item, type, isAdd) {
    console.log(item)
    let chooseList = _.cloneDeep(this.state.chooseList)
    let arr = []
    if (type === 'jx') {
      arr = _.concat(item, chooseList)
    } else {
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
    }
    this.setState({
      showType: 2,
      chooseList: arr
    }, () => {
      this.computeAll()
    })
  }

  receiveRead(read) {
    this.setState({
      read: read
    })
  }

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

  onSelect(obj) {
    let zhushu = obj.key
    this.jxNum(zhushu, 'clear')
  }

  //机选
  jxNum(n, type) {
    let chooseList = []
    if (type !== 'clear') {
      chooseList = _.cloneDeep(this.state.chooseList)
    }
    for (let i = 0; i < n; i++) {
      let red = utils.math.random(0, this.lotteryData[this.type].red, this.lotteryData[this.type].count, true)
      let param = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
        m5: [],
        m6: [],
        index: chooseList.length + 1,
        zhushu: 1,
      }
      if (this.type === 'qxc') {
        param.m5 = [red[5]]
        param.m6 = [red[6]]
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

  componentDidUpdate() {
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

  componentDidMount() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && bettingFooter) {
        let gettableHeight = w - bettingFooter.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      if (this.state.listHeight === '' && myNavHeight && myNavHeight.offsetHeight !== 0) {
        let bettingFooter = document.getElementsByClassName('bettingFooter')[0].offsetHeight
        let gettableHeight = w - myNavHeight.offsetHeight - bettingFooter;
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  //点击选中球
  clickItem(e) {
    let dataset = e.target.dataset;
    let val = +dataset.v;
    let wei = dataset.wei;
    let type = this.type;
    let choose = _.cloneDeep(this.state.choose)
    let child = choose[wei]
    if (child.indexOf(val) >= 0) {
      child = child.slice(0, child.indexOf(val)).concat(child.slice(child.indexOf(val) + 1))
    } else {
      child.push(val)
    }
    child = utils.math.sort(child)
    choose[wei] = child
    this.setState({
      choose: choose
    }, () => {
      this.computeChoose()
    })
  }

  computeChoose() {
    let choose = _.cloneDeep(this.state.choose)
    let showMoney = false
    let zhushu = 0
    let delShow = false
    if (this.type === 'qxc') {
      let {m0, m1, m2, m3, m4, m5, m6} = choose;
      zhushu = m0.length * m1.length * m2.length * m3.length * m4.length * m5.length * m6.length
      if (zhushu > 0) {
        showMoney = true
      }
      if (m0.length > 0 || m1.length > 0 || m2.length > 0 || m3.length > 0 || m4.length > 0 || m5.length > 0 || m6.length > 0) {
        delShow = true
      }
    } else {
      let {m0, m1, m2, m3, m4} = choose
      zhushu = m0.length * m1.length * m2.length * m3.length * m4.length
      if (zhushu > 0) {
        showMoney = true
      }
      if (m0.length > 0 || m1.length > 0 || m2.length > 0 || m3.length > 0 || m4.length > 0) {
        delShow = true
      }
    }
    this.setState({
      showMoney: showMoney,
      zhushu: zhushu,
      delShow: delShow
    })
  }

  //生成一注
  creatOne(render = true) {
    let red = utils.math.random(0, this.lotteryData[this.type].red, this.lotteryData[this.type].count, true)
    let choose = {}
    if (this.type === 'qxc') {
      choose = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
        m5: [red[5]],
        m6: [red[6]],
      }

    } else if (this.type === 'pl5') {
      choose = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
      }
    }
    if (render) {
      this.setState({
        choose: choose
      }, () => {
        this.computeChoose()
      })
    } else {
      return choose
    }

  }

  //下一步
  doNext() {
    let {m0, m1, m2, m3, m4, m5, m6} = this.state.choose;
    if (this.type === 'qxc'
      && m0.length === 0
      && m1.length === 0
      && m2.length === 0
      && m3.length === 0
      && m4.length === 0
      && m5.length === 0
      && m6.length === 0) {
      this.creatOne()
      return;
    } else if (
      this.type === 'pl5'
      && m0.length === 0
      && m1.length === 0
      && m2.length === 0
      && m3.length === 0
      && m4.length === 0
    ) {
      this.creatOne()
      return;
    }
    if (this.state.zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    }
    let arr = []
    let param = {
      m0,
      m1,
      m2,
      m3,
      m4,
      m5,
      m6,
      index: 1,
      zhushu: this.state.zhushu,
      zigou: true
    }
    arr.unshift(param)
    this.setState({
      buyQi: 1,
      beiNum: 1,
      chooseList: arr,
      showType: 2
    }, () => {
      this.computeAll()
    })
  }

  //清空
  clearChoose() {
    this.setState({
      delShow: false,
      chooseList: [],
      showMoney: false,
      zhushu: 0,
      choose: {
        m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []
      },
    }, () => {
      this.computeAll()
    })
  }

  setShowType(type) {
    this.setState({
      showType: type
    })
  }

  bigShow(e) {
    let a = e.target.nextElementSibling
    a.classList.add('active')
    this.clickItem(e)
  }

  bigHide(e) {
    let a = e.target.nextElementSibling
    setTimeout(() => {
      a.classList.remove('active')
    }, 200)
  }

//球渲染子模板
  template(from, to, wei, desc) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from; i <= to; i++) {
        childArr.push(
          <div key={wei + 'qiu_' + i}
               className={_this.state.choose[wei].indexOf(i) >= 0 ? 'redBg' : ''}
          >
            <p style={{display: 'block'}} data-v={i} data-wei={wei}
               onTouchStart={_this.bigShow.bind(this)}
               onTouchEnd={_this.bigHide.bind(this)}>{i}</p>
            <p className="hoverRedBg"><span>{i}</span></p>
          </div>
        )
      }
      return childArr
    }

    function ylChild() {
      let childArr = []
      let maxDesc = wei + 'Max'
      for (let i = from; i <= to; i++) {
        childArr.push(
          <div key={wei + 'yilou_' + i}
               className={_this.state.yilou[maxDesc] === _this.state.yilou[wei][i] ? "redColor" : ""}
          >
            {_this.state.yilou[wei][i]}
          </div>
        )
      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%'}} key={"chooseList" + wei}>
        <div className="column">
          {desc ?
            <div className="div2 clearfix">
              <span>{desc}</span>
            </div>
            :
            <div className="emptyDiv2"/>
          }

          {
            child()
          }
        </div>
        <div className="column_missing" style={{display: _this.state.yilouShow ? '' : 'none'}}>
          <div className="emptyDiv2"/>
          {ylChild()}
        </div>
      </div>
    )
    return arr
  }

  //球渲染模板
  Template() {
    let type = this.type
    let arr = []
    for (let i = 0; i < this.lotteryData[type].count; i++) {
      arr.push(
        <div key={type + i}>
          <div className="BallChoice redBallChoice">
            {this.template(0, 4, 'm' + i, this.lotteryData[type].wei[i])}
            {this.template(5, 9, 'm' + i, '')}
          </div>
          {i !== this.lotteryData[this.type].count - 1 &&
          < div className="lineBox"/>
          }
        </div>
      )
    }
    return arr;
  }

  // 每条选中的数据渲染
  chooseTemplate(item) {
    let arr = []
    let {m0, m1, m2, m3, m4, m5, m6} = item;
    let code = ''
    if (this.type === 'qxc') {
      code = m0.join(' ') + ' | ' + m1.join(' ') + ' | ' + m2.join(' ') + ' | ' + m3.join(' ') + ' | ' + m4.join(' ') + ' | ' + m5.join(' ') + ' | ' + m6.join(' ')
    } else {
      code = m0.join(' ') + ' | ' + m1.join(' ') + ' | ' + m2.join(' ') + ' | ' + m3.join(' ') + ' | ' + m4.join(' ')
    }
    arr.push(
      <p className="p1" key={"p1_" + item.index}>
        <span className="spanRed">{code}</span>
      </p>
    )
    arr.push(
      <p className="p2" key={"p2_" + item.index}>
        <span>{this.lotteryData[this.type].name} {item.zhushu}注{item.zhushu * 2}元</span>
      </p>
    )
    return arr
  }

  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      yilouShow: yl
    })
  }
  shark(){
    if (!this.animating && this.state.showType === 1) {
      this.animating = true;
      this.setState({
        choose: {m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []}
      }, () => {
        this.computeChoose()
        let code = this.creatOne(false);
        let redL = Object.keys(code).length
        let i = 0;
        let flag = 'red'
        let intel = setInterval(() => {
          let choose = this.state.choose
          if (flag === 'red') {
            if (i < redL) {
              let key = 'm' + i
              choose[key] = code[key]
              this.setState({
                choose: choose
              })
              i++;
            } else {
              flag = 'end'
            }
          }
          if (flag === 'end') {
            clearInterval(intel)
            this.animating = false
            this.computeChoose()
          }
        }, commonConfig.AnimateDuration)

      })

    }
  }
  render() {
    let type = this.type;
    utils.Shake.run(() => {
      this.shark()
    })
    return (
      <div>
        {this.state.showType === 1 &&
        <div id="lotteryBetting">
          <CommonNavBar title={this.lotteryData[type].name}/>
          <div className="fc3DBetting listDivView" style={{height: this.state.listHeight}}>
            <div>
              <section className="beforePeriods" style={{display: this.state.historyShow ? "" : "none"}}>
                {this.state.lishi.map((item, index) => {
                  return (
                    <ul className="ul_1 clearfix" key={'ul_' + index}>
                      <li className="li_1">{item.pid.substr(-3)}期</li>
                      <li className="li_2">
                        {item.red.map((it, ind) => {
                          return (
                            <span key={'red_' + ind}>{it}</span>
                          )
                        })}
                      </li>
                    </ul>
                  )
                })}
              </section>

              <section className="currentPeriods">
                <div className="currentPeriodsBox clearfix">
                  <div className="currentPeriodsBox_fl">{this.state.pid.substr(-3)}期</div>
                  <div className="currentPeriodsBox_fr">
                    <p>{moment(this.state.atime).format('MM-DD HH:mm')}截止</p>
                  </div>
                </div>
                <p className={this.state.historyShow ? "arrowP up" : "arrowP"} onClick={() => {
                  this.setState({
                    historyShow: !this.state.historyShow
                  })
                }}/>
              </section>
            </div>
            <div className="redBallTitle">
              <p className="p2"><span onClick={() => {
                this.creatOne()
              }
              }>摇一摇机选</span></p>
              {type === 'pl5' ?
                <p className="p1">与开奖号码按位相符即中奖<span>100000</span>元</p>
                :
                <p className="p1">{this.lotteryData.qxc.topDesc}</p>

              }
              <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.type}/>
            </div>
            {this.Template()}
          </div>
          <footer className="bettingFooter">
            <div className="clearfix bettingFooterInfo">
              {this.state.delShow ?
                <div className="emptyClear" onClick={() => {
                  this.clearChoose()
                }}/>
                :
                <Popover placement="topLeft"
                         overlay={[
                           (<Item key="10" style={{background: "#49484B", color: "white"}}>10注</Item>),
                           (<Item key="5" style={{background: "#49484B", color: "white"}}>5注</Item>),
                           (<Item key="1" style={{background: "#49484B", color: "white"}}>1注</Item>)
                         ]}
                         align={{
                           overflow: {adjustY: 0, adjustX: 0},
                           offset: [10, -20],
                         }}
                         onSelect={this.onSelect}
                >
                  <div className="choicePopover">机选
                  </div>
                </Popover>
              }
              <div className="footerInfo">
                {
                  this.state.showMoney ?
                    <p className="p3">共<span>{this.state.zhushu}</span>注 <span>{2 * this.state.zhushu}</span>元</p>
                    :
                    this.type !== 'qxc' ?
                      <p className="p3">每位至少选<span>1</span>个号</p>
                      : ''
                }
              </div>
            </div>
            <a className="nextBtn" onClick={() => this.doNext()}>下一步</a>
          </footer>
        </div>
        }

        {this.state.showType === 2 &&
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
              this.currentChoose = {m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []}
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
                  <UserProtocol link={"/" + type + "Bet/linkPage"}
                                doClear={this.clearChoose}
                                read={this.state.read}
                                receiveRead={this.receiveRead}/>
                </div>
                :
                <div className="noChooseBet">亲~你还没有投注哦</div>
              }
            </div>
          </div>
          {/*底部*/}
          <footer className="programFooter">
            {/*方案文字*/}
            <div className="programFooter1">
              <div className="clearfix">
                <div className="inputBox">连续买
                  <input type="tel"
                         onBlur={v => {
                           if (v.target.value === '' || v.target.value === 0) {
                             this.setState({buyQi: 1}, () => {
                               this.computeAll()
                             })
                           }
                         }}
                         onChange={this.setQiNum.bind(this)}
                         value={this.state.buyQi}/>期
                </div>
                <div className="inputBox fr">投
                  <input type="tel"
                         onBlur={v => {
                           if (v.target.value === '' || v.target.value === '0') {
                             this.setState({beiNum: 1}, () => {
                               this.computeAll()
                             })
                           }
                         }}
                         onChange={this.setBeiNum.bind(this)}
                         value={this.state.beiNum}/>倍
                </div>
              </div>
            </div>
            <div className="ssqChaseNumber"
                 style={{display: this.state.zhShow ? '' : 'none'}}
                 onClick={() => this.setState({stopZh: !this.state.stopZh})}>
              <span className={this.state.stopZh ? "radioSpan active" : "radioSpan"}/>
              中奖后停止追号
            </div>
            <ul className="ssqBetMultiple clearfix" style={{display: 'none'}}>
              <li className="active">10倍</li>
              <li className="border_lr">20倍</li>
              <li>105倍掏空</li>
            </ul>
            <div className="bettingFooterInfo">
              <div className="footerInfo">
                <p className="p1">合计<span>{this.state.money}</span>元</p>
                <p className="p2">共{this.state.zongZhushu}注</p>
              </div>
              <a className="nextBtn" onClick={() => this.doOrder()}>立即预约</a>
            </div>
          </footer>
        </div>
        }
        {
          this.state.showType === 3 &&
          <QxP52
            currentChoose={this.currentChoose}
            type={this.type}
            receive={this.receive}
            setShowType={this.setShowType}
            pid={this.state.pid}
            atime={this.state.atime}
            yilou={this.state.yilou}
            lishi={this.state.lishi}
            chooseList={this.state.chooseList}
          />
        }
      </div>
    )

  }
}
