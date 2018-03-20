import React, {Component} from 'react'
import {lotteryControl, yczsMatch} from '../../../../Stubs/API'
import betConfig from '../../../../config/betConfig'
import {hashHistory} from 'react-router'
import utils from '../../../../common/utils'
import {Toast, NavBar, Stepper} from 'antd-mobile'
import _ from 'lodash'
import moment from 'moment'
import UserProtocol from '../../common/userProtocol'
import CommonJF from '../CommonJF'

/* 一场制胜列表组件 */
export class OneWinnerList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      minBei: '',
      maxBei: '',
      chooseLength: 0,
      chooseData: [],
      maxC: 8,
      realCG: [],
      betNum: 10,
      popListHeight: '',
      popShow: 1,
      bonus: {
        min: '',
        max: ''
      },
      commonBei: 10,
      currentClick: {},
      currentIndex: ''
    }
    this.realSPF = [];
    this.real = [];
    this.chooseArr = [];
    this.chooseIndex = [];
    this.chooseInfo = [];
    this.matchDz = [];
    this.minCommonBei = 10;
    this.Template = this.Template.bind(this)
    this.clickOption = this.clickOption.bind(this)
    this.doClear = this.doClear.bind(this)
    this.doNext = this.doNext.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.prepareForPay = this.prepareForPay.bind(this)
    this.doCompute = this.doCompute.bind(this)
    this.showDesc = this.showDesc.bind(this)
    this.delChoose = this.delChoose.bind(this)
    this.changeBei = this.changeBei.bind(this)
    this.reComputeBetNum = this.reComputeBetNum.bind(this)
    this.getPreMoney = this.getPreMoney.bind(this)
    this.getMaxBonus = this.getMaxBonus.bind(this)
    this.showMatchDesc = this.showMatchDesc.bind(this)
    this.stepBlur = this.stepBlur.bind(this)
  }

  componentWillMount() {
    lotteryControl(betConfig.jczq.hh.gid).then(result => {
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
    let programList = document.getElementsByClassName('programList')[0];
    if (programList && this.state.popListHeight === '') {
      let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
      let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
      let bettingFooter = document.getElementsByClassName('programFooter')[0].offsetHeight;
      let listHeight = w - myNavHeight - bettingFooter - 32;
      this.setState({
        popListHeight: listHeight
      })
    }
  }

  //输入步进器改变注数
  changeBei(v, index, ind, k) {
    if (v > this.state.maxBei) {
      v = this.state.maxBei
      Toast.info('最多可以投' + v + '倍', 1, null, false)
    }
    if (index !== '') {
      _.each(this.chooseInfo, item => {
        if (item.index === index) {
          item.betNum[ind][k] = v
        }
      })
    } else {
      let regx = /^([1-9][0-9]*)$/
      this.setState({
        commonBei: v
      })
      if (!regx.test(v) || +v < 10) {
        return
      }
      _.each(this.chooseInfo, item => {
        let bet = item.betNum
        _.each(bet, (j, m) => {
          _.each(j, (k, n) => {
            if (k !== '') {
              bet[m][n] = v
            }
          })
        })
      })
    }
    this.reComputeBetNum()
  }

  stepBlur(v, index, ind, k) {
    let regx = /^([1-9][0-9]*)$/
    if (index !== '') {
      if (!regx.test(v) || +v < 10) {
        v = this.minCommonBei
      }
      _.each(this.chooseInfo, item => {
        if (item.index === index) {
          item.betNum[ind][k] = v
        }
      })
    } else {
      if (!regx.test(v) || +v < 10) {
        v = this.minCommonBei
      }
      this.setState({
        commonBei: v
      })
      _.each(this.chooseInfo, item => {
        let bet = item.betNum
        _.each(bet, (j, m) => {
          _.each(j, (k, n) => {
            if (k !== '') {
              bet[m][n] = v
            }
          })
        })
      })
    }

    this.reComputeBetNum()
  }

  // 清空处理
  doClear(goTop = false) {
    let a = _.cloneDeep(this.real)
    this.realSPF = a;
    this.chooseInfo = [];
    this.chooseArr = [];
    this.setState({
      betNum: 0,
      chooseData: [],
      chooseLength: 0,
      realCG: [],
    }, () => {
      if (goTop) {
        this.setState({
          popShow: 1
        }, () => {
          document.getElementById('zqyczsdiv').scrollTop = 0;
        })
      }
      this.reComputeBetNum()
    })
  }

  // 计算总注数
  reComputeBetNum() {
    let betNum = 0;
    _.each(this.chooseInfo, item => {
      let bet = _.cloneDeep(item.betNum)
      _.each(bet, j => {
        _.each(j, k => {
          if (k !== '') {
            betNum = betNum + +k
          }
        })
      })
    })
    this.setState({
      betNum: betNum
    })
  }


  //点击下一步
  doNext() {
    if (this.state.chooseLength === 0) {
      Toast.info('请先选择比赛', 1, null, false)
    } else {
      let chooseInfo = _.cloneDeep(this.chooseInfo);
      let codes = '';
      _.each(chooseInfo, item => {
        codes += item.itemid + ','
      })
      codes = codes.substring(0, codes.length - 1);
      yczsMatch(codes).then(result => {
        if (result && result.code === '0') {
          let row = result.row;
          if (_.isArray(row)) {
            this.matchDz = row;
          } else {
            this.matchDz = [row];
          }
          let matchDz = _.cloneDeep(this.matchDz);
          let flag = true;
          _.each(chooseInfo, (item, index) => {
            let chooseWF = item.chooseWF
            let betNum = item.betNum

            let match = matchDz[index].match
            let matchClose = parseInt(match.close)
            let matchSpf = match.spf.split(',');
            let matchRqspf = match.rqspf.split(',');
            let matchSp = [];
            //让球数为正
            if (matchClose > 0) {
              matchSp = [matchSpf[2], matchRqspf[0]]
            } else {
              matchSp = [matchSpf[0], matchRqspf[2]]
              //让球数为负
            }
            if (flag) {
              _.each(chooseWF, (m, n) => {
                if (flag) {
                  for (let k = 0, len = m.length; k < len; k++) {
                    if (flag) {
                      if (m[k]) {
                        let sp = '';
                        if (n === 0) {
                          let spf = item.spf.split(',');
                          sp = spf[k]
                        } else {
                          let rqspf = item.rqspf.split(',');
                          sp = rqspf[k]
                        }
                        let zhushu = betNum[n][k]
                        let tempArr = []
                        if (zhushu % 2 === 0) {
                          tempArr = [(zhushu / 2) * sp * _.min(matchSp) * 2, (zhushu / 2) * sp * _.max(matchSp) * 2]
                        } else {
                          tempArr = [(parseInt(zhushu / 2) + 1) * sp * _.min(matchSp) * 2, parseInt(zhushu / 2) * sp * _.max(matchSp) * 2]
                        }
                        let minMoney = _.min(tempArr).toFixed(2)
                        if (minMoney < zhushu * 2) {
                          if (item.wf === 1) {
                            utils.wxMessage('', `匹配后，${item.name}可能会出现亏损`,)
                          } else {
                            utils.wxMessage('', `由于购买单场比赛的多个选项，匹配后，${item.name}可能会出现亏损`)
                          }
                          flag = false;
                        }
                      }
                    }
                  }
                }

              })
            }
          })
          if (flag) {
            this.setState({
              popShow: 2
            })
          }
        } else {
          Toast.info('暂时没有可匹配的场次，无法继续投注', 1, null, false)
          //todo 一场制胜匹配接口失败
        }

      })
      this.reComputeBetNum()
    }

  }

  // 计算每注的预计奖金
  getPreMoney(item, index, cIndex) {
    let betNum = item.betNum[index][cIndex]
    let spf = [];
    let rqspf = [];
    let sp = '';
    if (index === 0) {
      spf = item.spf.split(',');
      sp = spf[cIndex]
    } else {
      rqspf = item.rqspf.split(',');
      sp = rqspf[cIndex]
    }
    let matchDz = _.cloneDeep(this.matchDz);
    let matchItem = {}
    for (let i = 0, len = matchDz.length; i < len; i++) {
      if (matchDz[i].zxitemid === item.itemid) {
        matchItem = matchDz[i].match;
        break;
      }
    }
    let matchClose = parseInt(matchItem.close)
    let matchSpf = matchItem.spf.split(',');
    let matchRqspf = matchItem.rqspf.split(',');
    let matchSp = [];
    //让球数为正
    if (matchClose > 0) {
      matchSp = [matchSpf[2], matchRqspf[0]]
    } else {
      matchSp = [matchSpf[0], matchRqspf[2]]
      //让球数为负
    }
    let tempArr = []
    if (betNum % 2 === 0) {
      tempArr = [(betNum / 2) * sp * _.min(matchSp) * 2, (betNum / 2) * sp * _.max(matchSp) * 2]
    } else {
      tempArr = [(parseInt(betNum / 2) + 1) * sp * _.min(matchSp) * 2, parseInt(betNum / 2) * sp * _.max(matchSp) * 2]
    }
    if (!_.min(tempArr) && !_.max(tempArr)) {
      return '0.00~0.00'
    } else {
      return _.min(tempArr).toFixed(2) + '~' + _.max(tempArr).toFixed(2)
    }

  }

  //计算理论最高中奖
  getMaxBonus() {
    let matchDz = _.cloneDeep(this.matchDz);
    let choose = _.cloneDeep(this.chooseInfo)
    let max = 0;
    _.each(choose, (item, index) => {
      let arr = [[], []];
      let result = [];
      let spf = item.spf.split(',');
      let rqspf = item.rqspf.split(',');
      let close = parseInt(item.close);
      let chooseWF = item.chooseWF
      let bet = item.betNum
      // 取匹配场次信息
      let matchSp = [];
      let matchSpf = matchDz[index].match.spf.split(',');
      let matchRqspf = matchDz[index].match.rqspf.split(',');
      let matchClose = parseInt(matchDz[index].match.close);
      //让球数为正
      if (matchClose > 0) {
        matchSp = [matchSpf[2], matchRqspf[0]]
      } else {
        matchSp = [matchSpf[0], matchRqspf[2]]
        //让球数为负
      }
      let matchMaxSp = _.max(matchSp)
      let matchMinSp = _.min(matchSp)
      _.each(chooseWF, (m, n) => {
        _.each(m, (j, k) => {
          if (n === 0) {
            if (j !== '') {
              if (bet[0][k] % 2 === 0) {
                arr[0][k] = bet[0][k] / 2 * spf[k] * matchMaxSp;
              } else {
                arr[0][k] = _.max([(parseInt(bet[0][k] / 2) + 1) * spf[k] * matchMinSp, parseInt(bet[0][k] / 2) * spf[k] * matchMaxSp]);
              }
            } else {
              arr[0][k] = 0
            }
          } else {
            if (j !== '') {
              if (bet[1][k] % 2 === 0) {
                arr[1][k] = bet[1][k] / 2 * rqspf[k] * matchMaxSp;
              } else {
                arr[1][k] = _.max([(parseInt(bet[1][k] / 2) + 1) * rqspf[k] * matchMinSp, parseInt(bet[1][k] / 2) * rqspf[k] * matchMaxSp]);
              }
            } else {
              arr[1][k] = 0
            }
          }
        })
      })
      if (close > 0) {
        result = [arr[0][0] + arr[1][0], arr[0][1] + arr[1][0], arr[0][2] + arr[1][1], arr[0][2] + arr[1][2]]
      } else {
        result = [arr[0][0] + arr[1][0], arr[0][0] + arr[1][1], arr[0][1] + arr[1][2], arr[0][2] + arr[1][2]]
      }
      let sMax = (_.max(result) * 2).toFixed(2)
      max += +sMax
    })
    return max.toFixed(2)
  }

  //点击立即预约
  prepareForPay() {
    if (this.state.chooseLength === 0) {
      Toast.info('请先选择比赛', 1, null, false)
      return;
    }
    let params = {
      yczs: 'true',
      realCG: [2],
      betNum: this.state.betNum,
      chooseInfo: this.chooseInfo,
      matchDz: this.matchDz,
      imoney: this.state.betNum * 2,
    }
    this.props.doOrder(params, 'needBack')
  }


  //删除所选玩法  2  0 '3'
  delChoose(index, ind, v) {
    let arr = _.cloneDeep(this.state.chooseData);
    if (arr[index]) {
      arr[index][ind][+betConfig.jczq.spf.location[v]] = ''
    }
    if ((arr[index].join('').replace(/,/g, '')).length === 0) {
      arr[index] = ''
    }
    this.setState({
      chooseData: arr
    }, () => {
      this.doCompute(arr)
      this.reComputeBetNum()
    })
  }

  /**
   * i：对阵下标
   * value：选中选项
   * type：类型:: spf rq  bf  jq  bqc
   *
   */
  clickOption(i, value, type) {
    let arr = _.cloneDeep(this.state.chooseData);
    if (this.state.chooseLength === 20 && !arr[i]) {
      Toast.info('最多可以选择20场比赛', 1, null, false);
      return;
    }
    if (!utils.checkIsArr(arr[i])) {
      arr[i] = [['', '', ''], ['', '', '']]
    }
    let index = parseInt(betConfig.jczq.hh.index[type]);
    let cIndex = parseInt(betConfig.jczq[type].location[value]);
    arr[i][index][cIndex] = (arr[i][index][cIndex] === value) ? '' : value;
    if ((arr[i].join('').replace(/,/g, '')).length === 0) {
      arr[i] = ''
    }
    console.log('选中arr:', arr[i])
    this.setState({
      chooseData: _.cloneDeep(arr),
    })
    this.doCompute(arr)
  }


  //选中后计算相关数组
  doCompute(arr) {
    let cArr = _.cloneDeep(arr)
    this.chooseArr = [];
    this.chooseInfo = [];
    this.chooseIndex = [];
    for (let i = 0, len = cArr.length; i < len; i++) {
      this.realSPF[i].chooseWF = cArr[i];
      if (utils.checkIsArr(cArr[i])) {
        let betNum = [['', '', ''], ['', '', '']]
        let wf = 0;
        let realChoose = []
        let bArr = _.cloneDeep(cArr[i])
        _.each(bArr, (item, index) => {
          _.each(item, (v, i) => {
            if (v) {
              betNum[index][i] = 10
            }
          })
        })
        let dArr = _.cloneDeep(cArr[i])
        _.each(dArr, item => {
          let a = _.remove(item, n => {
            if (n) {
              return n
            }
          })
          realChoose.push(a)
          wf += a.length
        })
        this.chooseIndex.push(i);
        this.chooseInfo.push(
          _.assign({
            wf: wf,
            index: i,
            betNum: betNum,
            chooseWF: cArr[i]
          }, this.realSPF[i])
        )
        if (wf !== 0) {
          this.chooseArr.push(wf)
        }
      }
    }
    console.log('选中信息：', this.chooseInfo)
    this.setState({
      commonBei: 10,
      chooseLength: this.chooseArr.length,
    })
  }

  /**
   * 确认页面显示选中信息
   * @param value
   * @param item
   * @param type
   * @returns {string}
   */
  showDesc(value, item, type) {
    let spf = [];
    let rqspf = [];
    let sp = ''
    if (type === 'spf') {
      let spf = item.spf.split(',');
      sp = `(${spf[+betConfig.jczq.spf.location[value]]})`
    }
    if (type === 'rq') {
      let rqspf = item.rqspf.split(',');
      sp = `(${rqspf[+betConfig.jczq.rq.location[value]]})`
    }
    let descObj = betConfig.jczq[type].yczsdesc
    let desc = descObj[value] + sp;
    return desc;
  }

  //显示匹配场次信息
  showMatchDesc(item, type) {
    let spf = item.spf.split(',');
    let rqspf = item.rqspf.split(',');
    let sp = [];
    let close = parseInt(item.close);
    let desc = '';
    let minDesc = '';
    let maxDesc = ''
    if (close > 0) {
      if (+spf[2] > +rqspf[0]) {
        minDesc = '让球主胜';
        maxDesc = '客胜'
      } else {
        minDesc = '客胜';
        maxDesc = '让球主胜'
      }
      sp.push(spf[2], rqspf[0])
    } else {
      if (+spf[0] > +rqspf[2]) {
        minDesc = '让球客胜';
        maxDesc = '主胜'
      } else {
        minDesc = '主胜';
        maxDesc = '让球客胜'
      }
      sp.push(spf[0], rqspf[2])
    }
    if (type === 0) {
      desc = minDesc + '(' + _.min(sp) + ')'
    } else {
      desc = maxDesc + '(' + _.max(sp) + ')'
    }
    return {desc: desc, sp: sp};
  }

  Template() {
    let _this = this
    let arr = [];
    if (this.props.dataList && this.props.dataList.length > 0) {
      let i = -1;
      this.props.dataList.map((item, index) => {
        let row = _.cloneDeep(item.row)
        let addesc = item.addesc
        if (!utils.checkIsArr(row)) {
          row = [row]
        }
        if (row && row.length > 0) {
          let realRow = []
          for (let i = 0, len = row.length; i < len; i++) {
            if ((utils.isSell('PlayType_JCZQ_RQSPF', row[i].isale) ||
                utils.isSell('PlayType_JCZQ_SPF', row[i].isale)) &&
              !utils.isSell('PlayType_ZQDG_SPF', row[i].isale) &&
              !utils.isSell('PlayType_ZQDG_RQSPF', row[i].isale)) {
              realRow.push(row[i])
            }
          }
          let rLength = realRow.length;
          if (realRow && rLength > 0 && !_this.renderOk) {
            _this.realSPF = this.realSPF.concat(_.cloneDeep(realRow))
            _this.real = this.real.concat(_.cloneDeep(realRow))
          }
          arr.push(
            <div key={`jczq_yczs_date_${index}`}>
              {
                rLength > 0 &&
                <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="yczs"
                     className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              }
              <div id={`jczq_yczs_list_${index}`}>
                {
                  realRow.map((it, ind) => {
                    i += 1;
                    let num = '';
                    (function (e) {
                      num = e;
                    }(i))
                    let spf = it.spf.split(',');
                    let rqspf = it.rqspf.split(',');
                    let spfscale = it.spfscale.split(',')
                    let rqspfscale = it.rqspfscale.split(',')
                    return (
                      <div className="bettingBoxWrap" key={`jczq_yczs_${it.itemid}`}>
                        <div className="bettingBox">
                          <div className="bettingLabel">
                            {
                              it.hot === 'yes' ? <label className="label_2"><span>热</span></label> : ''
                            }
                          </div>
                          <div className="bettingBox_fl" onClick={() => this.props.toggle(it.itemid, 'yczs')}>
                            <p>{it.mname}</p><p>{it.name}</p><p>{`${moment(it.et).format('HH:mm')}截止`}</p>
                            <p className="arrow " id={`yczs_arrow_${it.itemid}`}/>
                          </div>
                          <div className="bettingBox_fr">
                            <div className="bettingBox_fr_title clearfix">
                              <p>让球</p>
                              <ul>
                                <li className="li1">{it.hn}</li>
                                <li className="li2">vs</li>
                                <li className="li3">{it.gn}</li>
                              </ul>
                            </div>
                            <table cellSpacing="0" cellPadding="0">
                              <tbody>
                              {
                                (utils.isSell('PlayType_JCZQ_SPF', it.isale) && spf[0] !== '') ?
                                  <tr>
                                    <td className="td1">0</td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[0][0] === '3') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '3', 'spf')
                                      }
                                      }
                                    >
                                      <span>主胜</span>
                                      <span className="span1">{spf[0]}</span>
                                    </td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[0][1] === '1') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '1', 'spf')
                                      }
                                      }
                                    >
                                      <span>平 </span>
                                      <span className="span1">{spf[1]}</span>
                                    </td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[0][2] === '0') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '0', 'spf')
                                      }
                                      }
                                    >
                                      <span>客胜</span>
                                      <span className="span1">{spf[2]}</span>
                                    </td>
                                  </tr>
                                  :
                                  <tr>
                                    <td className="td1">0</td>
                                    <td className="td2" colSpan="3"><span className="grayColor">未开售</span></td>
                                  </tr>
                              }
                              {
                                (utils.isSell('PlayType_JCZQ_RQSPF', it.isale) && rqspf[0] !== '') ?
                                  <tr>
                                    <td
                                      className={'td1 ' + (+it.close >= 0 ? "tdRed" : "tdGreen")}>{+it.close >= 0 ? '+' + it.close : it.close}</td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[1][0] === '3') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '3', 'rq')
                                      }
                                      }>
                                      <span>主胜</span>
                                      <span className="span1">{rqspf[0]}</span>
                                    </td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[1][1] === '1') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '1', 'rq')
                                      }
                                      }>
                                      <span>平 </span>
                                      <span className="span1">{rqspf[1]}</span>
                                    </td>
                                    <td
                                      className={'td2 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[1][2] === '0') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '0', 'rq')
                                      }
                                      }>
                                      <span>客胜</span>
                                      <span className="span1">{rqspf[2]}</span>
                                    </td>
                                  </tr>
                                  :
                                  <tr>
                                    <td
                                      className={'td1 ' + (+it.close >= 0 ? "tdRed" : "tdGreen")}>{+it.close >= 0 ? '+' + it.close : it.close}</td>
                                    <td className="td2" colSpan="3"><span className="grayColor">未开售</span></td>
                                  </tr>
                              }
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <CommonJF item={it} type="yczs"/>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        } else {
          arr.push(
            <div className="dateDiv down" key={addesc}>{`${addesc} 0场比赛`}</div>
          )
        }
      })
      this.renderOk = true;
    }
    return arr
  }

  chooseTemplate() {
    let _this = this;
    return (
      <div>
        <NavBar className="myNav"
                mode="dark"
                onLeftClick={() => {
                  this.setState({
                    popShow: 1
                  })
                }}
                rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >方案内容</NavBar>
        <div className="programContentBox">
          <div className="programList">
            {
              (_this.chooseIndex.length > 0 && _this.chooseInfo.length > 0) ?
                <div className="popList listDivView" style={{height: this.state.popListHeight}}>
                  {
                    _this.chooseInfo.map((item, index) => {
                      let spf = item.spf.split(',');
                      return (
                        <div className="mixedProgram" key={`hh_choose_${index}`}>
                          <div className="mixedProgramTitle">
                            <ul className="clearfix">
                              <li className="li1">{item.name}</li>
                              <li className="li2">{item.hn}</li>
                              <li className="li3">VS</li>
                              <li className="li4">{item.gn}</li>
                            </ul>
                          </div>
                          {(item.chooseWF && _.isArray(item.chooseWF)) &&
                          item.chooseWF.map((it, ind) => {
                              return (
                                it.map((v, k) => {
                                  if (v) {
                                    return (
                                      <div className="mixedFlex oneBorder">
                                        <div className="oneWinnerProgram  clearfix">
                                          <div className="programBox_fl"
                                               onClick={() => _this.delChoose(item.index, ind, v)}>
                                            <img src={require('../../../../Img/lotteryBetting/delIcon.png')}/>
                                          </div>
                                          <div className="programBox_fr clearfix">
                                            <div className="programBox_fr_1">
                                              <p className="p1">{this.showDesc(v, item, ind === 0 ? 'spf' : 'rq')}</p>
                                              <p className="p2">预计奖金：<span>{this.getPreMoney(item, ind, k)}元</span></p>
                                            </div>
                                            <div className="programBox_fr_2">
                                              <Stepper
                                                style={{width: '103px'}}
                                                showNumber
                                                max={this.state.maxBei}
                                                min={this.minCommonBei}
                                                onBlur={v => {
                                                  _this.stepBlur(v.target.value, item.index, ind, k)
                                                }}
                                                onChange={v => _this.changeBei(v, item.index, ind, k)}
                                                value={item.betNum[ind][k]}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                })
                              )
                            }
                          )}
                        </div>
                      )
                    })
                  }
                  <UserProtocol link="/jczqBet/linkPage" doClear={this.doClear} read={this.props.read} receiveRead={this.props.receiveRead}/>
                  <div className="ViewMatchingBox">
                    <a onClick={() => {
                      _this.setState({
                        popShow: 3
                      })
                    }}
                    >查看匹配详情</a></div>
                </div>
                :
                <div className="noChooseBet">亲~你还没有投注哦</div>
            }
          </div>
        </div>

      </div>
    )
  }

  render() {
    let _this = this
    return (
      <div>
        <div style={{display: this.state.popShow === 1 ? '' : 'none'}}>
          <div className="listDivView" id="zqyczsdiv" style={{height: this.props.listHeight}}>
            {this.Template()}
          </div>
          <footer className="bettingFooter" id="spfFoot">
            <div className="clearfix bettingFooterInfo">
              <div className="emptyClear" onClick={this.doClear}/>
              {
                this.state.chooseLength === 0 &&
                <div className="footerInfo">
                  <p className="p1">请先选择比赛</p>
                  <p className="p2">开奖结果不包含加时赛和点球大战</p>
                </div>
              }
              {
                this.state.chooseLength > 0 &&
                <div className="footerInfo">
                  <p className="p1">已选<span>{this.state.chooseLength}</span>场</p>
                  <p className="p2">页面赔率仅供参考，请以出票赔率为准</p>
                </div>
              }
            </div>
            <a className="nextBtn" onClick={this.doNext}>下一步</a>
          </footer>
        </div>
        {
          this.state.popShow === 2 &&
          <div className="programContent">
            {this.chooseTemplate()}

            <footer className="programFooter">
              {
                this.state.chooseLength > 1 &&
                <div className="oneWinnerFooter">
                  每项都买
                  <Stepper
                    style={{width: '115px'}}
                    showNumber
                    max={this.state.maxBei}
                    min={this.minCommonBei}
                    onBlur={v => {
                      this.stepBlur(v.target.value, '')
                    }}
                    value={this.state.commonBei}
                    onChange={v => this.changeBei(v, '')}
                  />倍
                </div>
              }
              <div className="bettingFooterInfo">
                <div className="footerInfo">
                  <p className="p1">{`${this.state.betNum}注 合计`}<span>{this.state.betNum * 2}</span>元</p>
                  <p className="p2">理论最高奖金:{this.getMaxBonus()}元</p>
                </div>
                <a className="nextBtn"
                   onClick={_this.prepareForPay}>立即预约</a>
              </div>
            </footer>
          </div>
        }{
        this.state.popShow === 3 &&
        <div className="programContent">
          <NavBar className="myNav"
                  mode="dark"
                  onLeftClick={() => {
                    this.setState({
                      popShow: 2
                    })
                  }}
                  rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                  style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
          >匹配详情</NavBar>
          <div className="matchingDetails">
            <table cellPadding="0" cellSpacing="0" className="matchingTable marginB">
              <tbody>
              <tr>
                <td className="tdTitle">自购场次</td>
                <td className="tdTitle">匹配场次</td>
              </tr>
              {
                _this.chooseInfo.map((item, index) => {
                  let matchDz = _this.matchDz[index].match
                  return (
                    <tr key={"dzxq_" + index}>
                      <td className="td1">
                        <p className="p1">{item.name}</p>
                        <p className="p2 clearfix">
                            <span className="span1">{item.hn}
                              <span className={parseInt(item.close) > 0 ? 'tdRed' : 'tdGreen'}>
                                {parseInt(item.close) > 0 ? ('+' + item.close) : item.close}
                              </span>
                            </span>
                          <span className="span2">vs</span>
                          <span className="span3">{item.gn}</span>
                        </p>
                      </td>
                      <td className="td1">
                        <p className="p1">{matchDz.name}</p>
                        <p className="p2 clearfix">
                            <span className="span1">{matchDz.hn}
                              <span className={parseInt(matchDz.close) > 0 ? 'tdRed' : 'tdGreen'}>
                                {parseInt(matchDz.close) > 0 ? ('+' + matchDz.close) : matchDz.close}
                              </span>
                            </span>
                          <span className="span2">vs</span>
                          <span className="span3">{matchDz.gn}</span>
                        </p>
                      </td>
                    </tr>
                  )
                })
              }

              </tbody>
            </table>
            <table cellPadding="0" cellSpacing="0" className="matchingTable">
              <tbody>
              <tr>
                <td className="tdTitle">匹配明细</td>
                <td className="tdTitle tdTitle1">倍数</td>
                <td className="tdTitle tdTitle2">理论奖金</td>
              </tr>
              </tbody>
            </table>
            {
              _this.chooseInfo.map((item, index) => {
                let chooseWF = item.chooseWF;
                let betNum = item.betNum
                let matchDz = _this.matchDz[index].match
                let matchInfo = _this.showMatchDesc(matchDz, 0)
                let matchInfo1 = _this.showMatchDesc(matchDz, 1)
                let spf = item.spf.split(',');
                let rqspf = item.rqspf.split(',');
                return (
                  chooseWF.map((m, n) => {
                    return (
                      m.map((j, k) => {
                        let tempspf = [];
                        if (j) {
                          if (n === 0) {
                            tempspf = spf
                          } else {
                            tempspf = rqspf
                          }
                          let bet1 = betNum[n][k] % 2 === 0 ? betNum[n][k] / 2 : parseInt(betNum[n][k] / 2) + 1;
                          let bet2 = betNum[n][k] % 2 === 0 ? betNum[n][k] / 2 : parseInt(betNum[n][k] / 2);
                          return (
                            <table cellPadding="0" cellSpacing="0" className="matchingTable" key={'ppxq' + index}>
                              <tbody>
                              <tr>
                                <td className="td1 tdWidth">
                                  <p className="p3">
                                    <span className="span4">{item.hn}</span>
                                    <span className="span5">{_this.showDesc(j, item, n === 0 ? 'spf' : 'rq')}</span>
                                  </p>
                                  <p className="p3">
                                    <span className="span4">{matchDz.hn}</span>
                                    <span
                                      className="span5">{matchInfo.desc}</span>
                                  </p>
                                </td>
                                <td className="td1 tdWidth tdWidth1">
                                  {bet1}
                                </td>
                                <td className="td1 tdWidth tdWidth2">
                                  {(_.min(matchInfo.sp) * bet1 * tempspf[k] * 2).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td className="td1">
                                  <p className="p3">
                                    <span className="span4">{item.hn}</span>
                                    <span className="span5">{_this.showDesc(j, item, n === 0 ? 'spf' : 'rq')}</span>
                                  </p>
                                  <p className="p3">
                                    <span className="span4">{matchDz.hn}</span>
                                    <span
                                      className="span5">{matchInfo1.desc}</span>
                                  </p>
                                </td>
                                <td className="td1">
                                  {bet2}
                                </td>
                                <td className="td1">
                                  {(_.max(matchInfo.sp) * bet2 * tempspf[k] * 2).toFixed(2)}
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          )
                        }
                      })
                    )
                  })

                )
              })
            }

          </div>
        </div>
      }
      </div>
    )
  }
}
