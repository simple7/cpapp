import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {Popover, Toast, NavBar} from 'antd-mobile';
import _ from 'lodash'
import utils from '../../../common/utils'
import moment from 'moment'
import ZhuShou from './zhushou'
import {szcHistory, lotteryControl, userBasicInfo} from '../../../Stubs/API'
import UserProtocol from '../common/userProtocol'
import SsqDltChild2 from './SsqDltChild2'
import commonConfig from '../../../config/commonConfig'
import DelIcon from '../../../Img/lotteryBetting/delIcon.png'
import {AppJiek} from '../../../common/AppApi'

const Item = Popover.Item;
export default class SsqDltChild extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: '',
      lishi: [],  //开奖历史
      yilou: {
        red: [],
        blue: [],
        redMax: '',
        blueMax: ''
      },          //遗漏值
      historyShow: false,   //控制历史开奖显示隐藏
      showMoney: false,     //控制显示底部金额
      yilouShow: false,     //控制遗漏显隐
      gPoll: {money: 0, unit: '亿'},   //奖金池
      tkbei: 1,                       //掏空倍数
      pid: '2010000',
      atime: '2010-01-01',
      choose: {
        red: [],
        blue: []
      },                  //选中球
      zhushu: 0,          //选中球的注数
      chooseList: [],     //选中列表
      showType: 1,        //控制显示层
      popListHeight: '',  //选中列表的高度
      read: true,         //阅读协议状态
      buyQi: 1,           //购买期次
      beiNum: 1,          //购买倍数
      zhShow: false,      //追号后停止那一栏
      beiNumShow: false,  //控制快捷倍数那一栏
      stopZh: false,      //停止追号状态
      minBei: 1,          //最小倍数
      maxBei: 99999,      //最大倍数
      minQi: 1,           //最小追号期次
      maxQi: 10,          //最大追号期次
      zongZhushu: 0,      //总注数
      money: 0,           //总金额
      perMoney: 2,        //每注金额
      zj: false,          //是否追加 大乐透存在追加
    }
    this.currentChoose = {red: [], blue: [], index: ''}
    this.lotteryData = {
      ssq: {
        'red': 33,
        'blue': 16,
        'miniRedNum': 6,
        'maxRedNum': 20,
        'miniBlueNum': 1,
        'count': 5,
        'lot_id': '01',
        'name': '双色球',
        'redDesc': '至少选择6个红球',
        'blueDesc': '至少选择1个蓝球'
      },
      dlt: {
        'red': 35,
        'blue': 12,
        'miniRedNum': 5,
        'maxRedNum': 20,
        'miniBlueNum': 2,
        'count': 5,
        'lot_id': '50',
        'name': '大乐透',
        'redDesc': '前区 至少选择5个红球',
        'blueDesc': '后区 至少选择2个蓝球'
      },
      qlc: {
        'red': 30,
        'blue': 0,
        'miniRedNum': 7,
        'maxRedNum': 30,
        'miniBlueNum': 0,
        'count': 5,
        'lot_id': '07',
        'name': '七乐彩',
        'redDesc': '请选择7-15个号',
      },
    }
    this.type = 'ssq'
    this.animating = false;
    this.Template = this.Template.bind(this)
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
    this.creatOne = this.creatOne.bind(this)
    this.computeChoose = this.computeChoose.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
    this.shark = this.shark.bind(this)
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

  componentWillMount() {
    let type = ''
    let hash = window.location.hash
    if (hash.indexOf('ssq') !== -1) {
      this.type = type = 'ssq'
    } else if (hash.indexOf('dlt') !== -1) {
      this.type = type = 'dlt'
    } else {
      this.type = type = 'qlc'
    }
    let choose = this.props.choose
    if (choose && choose.red.length > 0 && choose.blue.length > 0) {
      console.log(choose)
      this.setState({
        choose: choose
      }, () => {
        let choose = _.cloneDeep(this.state.choose)
        let {red, blue} = choose
        let rlen = red.length;
        let blen = blue.length;
        if (rlen >= this.lotteryData[type].miniRedNum && blen >= this.lotteryData[type].miniBlueNum) {
          let zhushu = utils.math.C(rlen, this.lotteryData[type].miniRedNum) * utils.math.C(blen, this.lotteryData[type].miniBlueNum)
          this.setState({
            showMoney: true,
            zhushu: zhushu
          })
        } else {
          this.setState({
            showMoney: false
          })
        }
      })
    }
    szcHistory(this.lotteryData[type].lot_id).then(result => {
      if (result) {
        let row = result.row
        let rowp = result.rowp;
        if (!_.isArray(rowp)) {
          rowp = [rowp]
        }
        let yilou = {}
        let lishi = []
        let gPoll = ''
        let transPoll = 0
        let tkbei = 1
        if (type === 'ssq' || type === 'dlt') {
          row.map(item => {
            if (item.color === 'red') {
              let arr = item.curyl.split(',')
              arr = _.map(arr, item => {
                return +item
              })
              yilou.red = arr
              yilou.redMax = _.max(arr)
            } else {
              let arr = item.curyl.split(',')
              arr = _.map(arr, item => {
                return +item
              })
              yilou.blue = arr
              yilou.blueMax = _.max(arr)
            }
          })
          gPoll = +result.gpool;
          tkbei = Math.ceil(gPoll / 5000000)
          transPoll = utils.MoneyFormate(gPoll)
        } else if (type === 'qlc') {
          yilou.red = row.m0.split(',')
          yilou.redMax = _.max(yilou.red)
        }
        rowp.map(item => {
          if (item.acode.indexOf('|') !== -1) {
            let code = item.acode.split('|')
            let param = {
              pid: item.pid,
              atime: item.atime,
              red: code[0].split(','),
              blue: code[1].split(',')
            }
            lishi.push(param)
          } else {
            let param = {
              pid: item.pid,
              atime: item.atime,
              acode: item.acode,
              red: [],
              blue: []
            }
            lishi.push(param)
          }

        })

        this.setState({
          pid: result.pid,
          atime: result.atime,
          gPoll: transPoll,
          tkbei: tkbei,
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
      money: zhushu * beiNum * buyQi * this.state.perMoney
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
      AppJiek.thirdAppLoginCheck(() => {
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
          if (this.type === 'ssq' || this.type === 'dlt') {
            let {red, blue} = item
            let str1 = red.join(',')
            let str2 = blue.join(',')
            if (this.type === 'dlt' && this.state.zj) {
              code = str1 + '|' + str2 + ':2:1;'
            } else {
              code = str1 + '|' + str2 + ':1:1;'
            }
          } else {
            let red = item.red
            let str1 = red.join(',')
            code = str1 + ':1:1;'
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
        console.log('codes:',params.codes)
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

  /**
   * 机选号码
   * n 机选注数 1 5 10
   * type 是否清空已选数组
   *
   */
  jxNum(n, type) {
    let chooseList = []
    if (type !== 'clear') {
      chooseList = _.cloneDeep(this.state.chooseList)
    }
    for (let i = 0; i < n; i++) {
      let red = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].red, this.lotteryData[this.type].miniRedNum, false)).sort(function (a, b) {
        return a - b;
      })
      let blue = []
      if (this.type !== 'qlc') {
        blue = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].blue, this.lotteryData[this.type].miniBlueNum, false)).sort(function (a, b) {
          return a - b;
        })
      }
      let param = {
        blue: blue,
        red: red,
        index: chooseList.length + 1,
        zhushu: 1
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


  //点击选中球
  clickItem(e) {
    let dataset = e.target.dataset;
    let i = dataset.v;
    let color = dataset.color;
    let type = dataset.type;
    let arr = _.cloneDeep(this.state.choose[color])
    if (arr.indexOf(i) >= 0) {
      arr = arr.slice(0, arr.indexOf(i)).concat(arr.slice(arr.indexOf(i) + 1))
    } else {
      arr.push(i)
    }
    let choose = {}
    choose[color] = arr
    if (color === 'red') {
      choose.blue = _.cloneDeep(this.state.choose.blue)
    } else {
      choose.red = _.cloneDeep(this.state.choose.red)
    }
    this.setState({
      choose: choose
    }, () => {
      this.computeChoose()
    })
  }

  // 计算点击球后注数
  computeChoose() {
    let choose = _.cloneDeep(this.state.choose)
    let {red, blue} = choose
    let rlen = red.length;
    let blen = blue.length;
    if (rlen >= this.lotteryData[this.type].miniRedNum && blen >= this.lotteryData[this.type].miniBlueNum) {
      let zhushu = utils.math.C(rlen, this.lotteryData[this.type].miniRedNum) * utils.math.C(blen, this.lotteryData[this.type].miniBlueNum)
      this.setState({
        showMoney: true,
        zhushu: zhushu
      })
    } else {
      this.setState({
        showMoney: false,
        zhushu: 0
      })
    }
  }

  // 生成一注
  creatOne(render = true) {
    let red = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].red, this.lotteryData[this.type].miniRedNum, false)).sort(function (a, b) {
      return a - b;
    })
    let blue = []
    if (this.type !== 'qlc') {
      blue = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].blue, this.lotteryData[this.type].miniBlueNum, false)).sort(function (a, b) {
        return a - b;
      })
    }
    let choose = {
      red: red,
      blue: blue
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
    let {red, blue} = this.state.choose;
    red = red.sort((a, b) => {
      return a - b
    })
    blue = blue.sort((a, b) => {
      return a - b
    })
    if (red.length === 0 && blue.length === 0 && this.type !== 'qlc') {
      this.creatOne()
      return;
    } else if (red.length === 0 && this.type === 'qlc') {
      this.creatOne()
      return;
    }
    if (this.state.zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    }
    let arr = []
    let param = {
      red: red,
      blue: blue,
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
      chooseList: [],
      showMoney: false,
      zhushu: 0,
      choose: {
        red: [],
        blue: []
      }
    }, () => {
      this.computeAll()
    })
  }

  setShowType(type) {
    this.setState({
      showType: type
    })
  }

  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      yilouShow: yl
    })
  }


  bigShow(e) {
    if (this.type === 'qlc') {
      let red = _.cloneDeep(this.state.choose.red)
      let i = e.target.dataset.v;
      if (red.length === 15 && red.indexOf(i) === -1) {
        Toast.info('最多可选择15个号码', 1, null, false)
        return
      }
    }
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

  Template(from, to, color, type) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from - 1; i < to; i++) {
        if (i >= _this.lotteryData[type][color]) {
          childArr.push(
            <div className="emptyDiv" key={color + 'qiu_' + i}/>
          )
        } else {
          let value = ('0' + (i + 1)).substr(-2)
          childArr.push(
            <div key={color + 'qiu_' + i}
                 className={_this.state.choose[color].indexOf(value) >= 0 ? color + 'Bg' : ''}
            >
              <p style={{display: 'block'}} data-v={value} data-color={color} data-type={type}
                 onTouchStart={_this.bigShow.bind(this)}
                 onTouchEnd={_this.bigHide.bind(this)}>{value}</p>
              <p className={"hover" + color + "Bg"}><span>{value}</span></p>
            </div>
          )

        }

      }
      return childArr
    }

    function ylChild() {
      let childArr = []
      let maxDesc = color + 'Max'
      for (let i = from - 1; i < to; i++) {
        if (i >= _this.lotteryData[type][color]) {
          childArr.push(
            <div key={color + 'yilou_' + i}/>
          )
        } else {
          childArr.push(
            <div key={color + 'yilou_' + i}
                 className={_this.state.yilou[maxDesc] === _this.state.yilou[color][i] ? "redColor" : ""}>
              {_this.state.yilou[color][i]}
            </div>
          )
        }

      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%', display: 'block'}} key={"chooseList" + from}>
        <div className="column">
          {
            child()
          }
        </div>
        <div className="column_missing" style={{display: _this.state.yilouShow ? '' : 'none'}}>
          {ylChild()}
        </div>
      </div>
    )
    return arr
  }

  shark() {
    if (!this.animating && this.state.showType === 1) {
      this.animating = true;
      this.setState({
        choose: {red: [], blue: []}
      }, () => {
        this.computeChoose()
        let code = this.creatOne(false);
        let redL = code.red.length
        let blueL = code.blue.length
        let red = this.state.choose.red;
        let blue = this.state.choose.blue;
        let i = 0;
        let flag = 'red'
        let intel = setInterval(() => {
          let choose = this.state.choose
          if (flag === 'red') {
            if (i < redL) {
              red.push(code.red[i])
              choose.red = red
              this.setState({
                choose: choose
              })
              i++;
            } else {
              i = 0
              flag = 'blue'
            }
          }
          if (flag === 'blue') {
            if (i < blueL) {
              blue.push(code.blue[i])
              choose.blue = blue
              this.setState({
                choose: choose
              })
              i++
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
      <div tabIndex="0">
        {this.state.showType === 1 &&
        <div id="lotteryBetting">
          <CommonNavBar title={this.lotteryData[type].name}/>
          <div className="ssqBetting listDivView" style={{height: this.state.listHeight}}>
            <div>
              <section className="beforePeriods" style={{display: this.state.historyShow ? "" : "none"}}>
                {this.state.lishi.map((item, index) => {
                  return (
                    <ul className="ul_1 clearfix" key={'ul_' + index}>
                      <li className="li_1">{item.pid.substr(-3)}期</li>
                      {
                        item.red.length > 0 ?
                          <li className="li_2">
                            {item.red.map((it, ind) => {
                              return (
                                <span key={'red_' + ind}>{it}</span>
                              )
                            })}
                            {item.blue.map((it, ind) => {
                              return (
                                <span className="colorBlue" key={'blue_' + ind}>{it}</span>

                              )
                            })}
                          </li>
                          :
                          <li className="li_2"><span className="color78">{item.acode}</span></li>
                      }

                    </ul>
                  )
                })}

              </section>
              <section className={type === 'qlc' ? "currentPeriods currentPeriods_qlc" : "currentPeriods"}>
                <div className="currentPeriodsBox clearfix">
                  <div className="currentPeriodsBox_fl">{this.state.pid.substr(-3)}期</div>
                  {(type === 'ssq' || type === 'dlt') ?
                    <div className="currentPeriodsBox_fr">
                      <p>{moment(this.state.atime).format('MM-DD HH:mm')}截止</p>
                      <p>奖池滚存
                        <span className="colorRed">{this.state.gPoll.money}
                    </span>{this.state.gPoll.unit} <span className="colorRed">{this.state.tkbei}</span>
                        倍掏空奖池
                      </p>
                    </div>
                    :
                    <div className="currentPeriodsBox_fr">
                      <p>{moment(this.state.atime).format('MM-DD HH:mm')}截止</p>
                    </div>
                  }

                </div>
                <p className={this.state.historyShow ? "arrowP up" : "arrowP"} onClick={() => {
                  this.setState({
                    historyShow: !this.state.historyShow
                  })
                }}/>
              </section>
            </div>
            <div>
              <div className="redBallTitle">
                <p className="p2"><span onClick={() => {
                  this.creatOne()
                }
                }>摇一摇机选</span></p>
                <p className="p1">{this.lotteryData[type].redDesc}</p>
                <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.type}/>
              </div>
              <div className="BallChoice redBallChoice">
                {this.Template(1, 7, 'red', type)}
                {this.Template(8, 14, 'red', type)}
                {this.Template(15, 21, 'red', type)}
                {this.Template(22, 28, 'red', type)}
                {this.Template(29, 35, 'red', type)}
              </div>
            </div>
            {
              (type === 'ssq' || type === 'dlt') &&
              <div>
                <div className="BlueBallTitle">
                  <p className="p1">{this.lotteryData[type].blueDesc}</p>
                </div>
                <div className="BallChoice blueBallChoice">
                  {this.Template(1, 7, 'blue', type)}
                  {this.Template(8, 14, 'blue', type)}
                  {this.Template(15, 21, 'blue', type)}
                </div>
              </div>
            }
          </div>
          <footer className="bettingFooter">
            <div className="clearfix bettingFooterInfo">
              {(this.state.choose.red.length > 0 || this.state.choose.blue.length > 0) ?
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
              <div className="footerInfo" style={{display: this.state.showMoney ? '' : 'none'}}>
                <p className="p3">共<span>{this.state.zhushu}</span>注
                  <span>{this.state.perMoney * this.state.zhushu}</span>元</p>
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
              this.currentChoose = {red: [], blue: [], index: ''}
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
                              <p className="p1">
                                {item.red.map((rit, rin) => {
                                  return (
                                    <span className="spanRed_ssq" key={'chooser_' + rin}>{rit}</span>
                                  )
                                })}
                                {item.blue.map((bit, bin) => {
                                  return (
                                    <span className="spanBlue_ssq" key={"chooseb_" + bin}>{bit}</span>
                                  )
                                })}
                              </p>
                              <p className="p2">
                                <span>{item.zhushu}注{item.zhushu * this.state.perMoney}元</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <UserProtocol link={"/" + type + "Bet/linkPage"}
                                read={this.state.read}
                                doClear={this.clearChoose}
                                receiveRead={this.receiveRead}/>
                </div>
                :
                <div className="noChooseBet">亲~你还没有投注哦</div>
              }
            </div>
          </div>
          {/*底部*/}
          <footer className="programFooter">
            {/*投注*/}
            {
              this.type === 'dlt' &&
              <div className="programFooter1_ssq">
                <div className="programFooter1_ssq_1"><i
                  className={this.state.zj ? "active" : ""}
                  onClick={() => {
                    let perM = this.state.perMoney === 2 ? 3 : 2
                    this.setState({
                      zj: !this.state.zj,
                      perMoney: perM
                    }, () => {
                      this.computeAll()
                    })
                  }
                  }/>追加投注
                </div>
                <div className="programFooter1_ssq_2">每注追加1元，最高可中1600万</div>
              </div>
            }

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
          <SsqDltChild2
            currentChoose={this.currentChoose}
            type={this.type}
            receive={this.receive}
            setShowType={this.setShowType}
            pid={this.state.pid}
            atime={this.state.atime}
            gPoll={this.state.gPoll}
            tkbei={this.state.tkbei}
            yilou={this.state.yilou}
            lishi={this.state.lishi}
            chooseList={this.state.chooseList}
            perMoney={this.state.perMoney}
          />
        }
      </div>
    )

  }
}
