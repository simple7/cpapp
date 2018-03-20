import React, {Component} from 'react'
import {lotteryControl} from '../../../../Stubs/API'
import betConfig from '../../../../config/betConfig'
import {hashHistory} from 'react-router'
import commonConfig from '../../../../config/commonConfig'
import utils from '../../../../common/utils'
import {Toast, NavBar} from 'antd-mobile'
import _ from 'lodash'
import moment from 'moment'
import ComFirstFoot from '../../common/ComFirstFoot'
import CGComponent from '../../common/CGComponent'
import UserProtocol from '../../common/userProtocol'
import LqHhPop from '../../common/LqHhPop'

/* 混合投注列表组件 */
export class MixedBetsList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      minBei: '',
      maxBei: '',
      chooseLength: 0,
      chooseData: [],
      maxC: 8,
      realCG: [],
      betNum: 0,
      popListHeight: '',
      beiNum: 1,
      popShow: false,
      HhPopShow: false,
      fromPop: false,
      bonus: {
        min: '',
        max: ''
      },
      CGShow: false,
      CGDesc: '',
      currentClick: {},
      currentIndex: ''
    }
    this.realSPF = [];
    this.real = [];
    this.allIsDG = false;
    this.chooseArr = [];
    this.chooseIndex = [];
    this.chooseInfo = [];
    this.Template = this.Template.bind(this)
    this.clickOption = this.clickOption.bind(this)
    this.doClear = this.doClear.bind(this)
    this.reCompute = this.reCompute.bind(this)
    this.doNext = this.doNext.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.prepareForPay = this.prepareForPay.bind(this)
    this.CGCallback = this.CGCallback.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.hidePop = this.hidePop.bind(this)
    this.doCompute = this.doCompute.bind(this)
    this.showDesc = this.showDesc.bind(this)
    this.showCGPop = this.showCGPop.bind(this)
    this.delChoose = this.delChoose.bind(this)
    this.chooseSfc = this.chooseSfc.bind(this)
    this.checkShow = this.checkShow.bind(this)
  }

  componentWillMount() {
    lotteryControl(betConfig.jclq.hh.gid).then(result => {
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

  // 控制弹框显示与否
  checkShow(goTop) {
    this.setState({
      popShow: !this.state.popShow
    }, () => {
      if (goTop) {
        document.getElementById('lqhhdiv').scrollTop = 0
      }
    })
  }

  chooseSfc(item, num, fromPop) {
    let arr = _.cloneDeep(this.state.chooseData);
    if (this.state.chooseLength === 20 && !arr[num]) {
      Toast.info('最多可以选择20场比赛', 1, null, false);
      return;
    }
    this.setState({
      currentClick: item,
      currentIndex: num,
      HhPopShow: true,
      fromPop: fromPop || false
    })
  }

  // 输入倍数
  setBeiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '')
    if (value > this.state.maxBei) {
      value = this.state.maxBei
      Toast.info('最多可以投' + value + '倍', 1, null, false)
    }else if (value === '0') {
      value = 1
    }
    this.setState({
      beiNum: value
    })
  }

  // 清空处理
  doClear(goTop = false) {
    let a = _.cloneDeep(this.real)
    this.realSPF = a;
    this.chooseInfo = [];
    this.chooseArr = [];
    this.allIsDG = false;
    this.setState({
      beiNum: 1,
      chooseData: [],
      chooseLength: 0,
      realCG: []
    }, () => {
      if (goTop) {
        this.checkShow(goTop)
      }
      this.reCompute()
    })
  }

  /**
   * 计算注数和奖金
   *
   */
  reCompute() {
    let spArr = [];
    if (_.isArray(this.chooseInfo)) {
      let chooseInfo = _.cloneDeep(this.chooseInfo)
      _.each(chooseInfo, item => {
        let sf = item.sf.split(',');
        let rfsf = item.rfsf.split(',');
        let dxf = item.dxf.split(',');
        let sfc = item.sfc.split(',');
        let tempArr = [];
        let obj = {};
        _.each(item.chooseWF, (val, index) => {
          _.each(val, v => {
            switch (index) {
              case 0:
                if (v) {
                  tempArr.push(parseFloat(sf[+betConfig.jclq.sf.location[v]]))
                }
                break;
              case 1:
                if (v) {
                  tempArr.push(parseFloat(rfsf[+betConfig.jclq.rf.location[v]]))
                }
                break;
              case 2:
                if (v) {
                  tempArr.push(parseFloat(dxf[+betConfig.jclq.dxf.location[v]]))
                }
                break;
              case 3:
                if (v) {
                  tempArr.push(parseFloat(sfc[+betConfig.jclq.sfc.location[v]]))
                }
                break;
            }

          })

        })
        obj.min = _.min(tempArr)
        obj.max = _.max(tempArr)
        spArr.push(obj)
      })
    }
    let zhushu = 0;
    _.each(this.state.realCG, item => {
      zhushu += utils.math.N1(this.chooseArr, item)
    })
    this.setState({
      betNum: zhushu,
      bonus: utils.Count.prix(spArr, this.state.realCG),
    })
  }

  // 串关组件回调函数
  CGCallback(v) {
    this.setState({
      CGShow: false,
    })
    if (v) {
      this.setState({
        realCG: v
      }, () => {
        this.reCompute()
      })
    }
  }

  //点击下一步
  doNext() {
    if (this.state.chooseLength === 0) {
      Toast.info('请先选择比赛', 1, null, false)
    } else if (this.state.chooseLength === 1) {
      if (this.allIsDG) {
        this.setState({
          popShow: !this.state.popShow
        })
      } else {
        Toast.info('至少选择2场比赛', 1, null, false)
      }
    } else {
      this.setState({
        beiNum:1,
        popShow: !this.state.popShow
      })
    }
  }

  //点击立即预约
  prepareForPay() {
    if (this.state.chooseLength === 0) {
      Toast.info('请先选择比赛', 1, null, false)
      return;
    } else if (this.state.chooseLength === 1 && !this.allIsDG) {
      Toast.info('至少选择2场比赛', 1, null, false)
      return;
    }
    let params = {
      allIsDG: this.allIsDG,
      betNum: this.state.betNum,
      realCG: this.state.realCG,
      chooseInfo: this.chooseInfo,
      bonus: this.state.bonus,
      beiNum: this.state.beiNum,
      imoney: this.state.betNum * this.state.beiNum * 2,
    }
    this.props.doOrder(params, 'needBack')
  }


  //删除所选场次
  delChoose(index) {
    let arr = _.cloneDeep(this.state.chooseData);
    if (arr[index]) {
      arr[index] = ''
    }
    this.setState({
      chooseData: arr
    })
    this.doCompute(arr)
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
      arr[i] = [[], [], [], []]
    }
    let index = parseInt(betConfig.jclq.hh.index[type]);
    let cIndex = parseInt(betConfig.jclq[type].location[value]);
    arr[i][index][cIndex] = (arr[i][index][cIndex] === value) ? '' : value;
    if ((arr[i].join('').replace(/,/g, '')).length === 0) {
      arr[i] = ''
    }
    console.log('选中arr:', arr[i])
    this.setState({
      chooseData: arr,
    })
    this.doCompute(arr)
  }

  //弹框选择玩法回调
  hidePop(chooseWF) {
    console.log('弹框回调：', chooseWF)
    if (chooseWF) {
      if ((chooseWF.join('').replace(/,/g, '')).length === 0) {
        chooseWF = ''
      }
      let arr = _.cloneDeep(this.state.chooseData)
      arr[this.state.currentIndex] = chooseWF
      this.setState({
        chooseData: arr
      })
      this.doCompute(arr)
    }
    this.setState({
      HhPopShow: false
    })
  }

  //选中后计算相关数组
  doCompute(arr) {
    let cArr = _.cloneDeep(arr)
    this.chooseArr = [];
    this.chooseInfo = [];
    this.chooseIndex = [];
    this.allIsDG = false;
    let maxC = 8;
    let flag = 0;
    for (let i = 0, len = cArr.length; i < len; i++) {
      this.realSPF[i].chooseWF = cArr[i];
      if (utils.checkIsArr(cArr[i])) {
        let wf = 0;
        let realChoose = []
        let bArr = _.cloneDeep(cArr[i])
        _.each(bArr, item => {
          let a = _.remove(item, n => {
            if (n) {
              return n
            }
          })
          realChoose.push(a)
          wf += a.length
        })
        let length0 = realChoose[0].length
        let length1 = realChoose[1].length
        let length2 = realChoose[2].length
        let length3 = realChoose[3].length
        if (length3 > 0) {
          maxC = 4
        }
        this.realSPF[i].wfNum = wf;
        let sfFlag = utils.isSell('PlayType_LQDG_SF', this.realSPF[i].isale);
        let qfsfFlag = utils.isSell('PlayType_LQDG_RFSF', this.realSPF[i].isale);
        let dxfFlag = utils.isSell('PlayType_LQDG_DXF', this.realSPF[i].isale);
        let a = length0 === 0 && length1 === 0 && length2 === 0 && length3 > 0
        if (sfFlag && qfsfFlag && dxfFlag) {
          flag += 1;
        } else if (sfFlag && !qfsfFlag && !dxfFlag) {
          if (length0 > 0 && length1 === 0 && length2 === 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (!sfFlag && qfsfFlag && !dxfFlag) {
          if (length0 === 0 && length1 > 0 && length2 === 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (!sfFlag && !qfsfFlag && dxfFlag) {
          if (length0 === 0 && length1 === 0 && length2 > 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (sfFlag && qfsfFlag && !dxfFlag) {
          if (length0 > 0 && length1 > 0 && length2 === 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (!sfFlag && qfsfFlag && dxfFlag) {
          if (length0 === 0 && length1 > 0 && length2 > 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (sfFlag && !qfsfFlag && dxfFlag) {
          if (length0 > 0 && length1 === 0 && length2 > 0) {
            flag += 1;
          }else if (a) {
            flag += 1;
          }
        } else if (a) {
          flag += 1;
        }
        this.chooseIndex.push(i);
        this.chooseInfo.push(
          _.assign({
            index: i,
            chooseWF: cArr[i]
          }, this.realSPF[i])
        )
        if (wf !== 0) {
          this.chooseArr.push(wf)
        }
      } else {
        this.realSPF[i].wfNum = 0;
      }
    }
    console.log('选中信息：', this.chooseInfo)
    let tempCG = []
    if (flag === this.chooseArr.length && this.chooseArr.length !== 0) {
      this.allIsDG = true;
      tempCG = [1];
    } else if (flag !== this.chooseArr.length && this.chooseArr.length > 1) {
      tempCG = [2]
    } else {
      tempCG = []
    }
    this.setState({
      realCG: tempCG,
      chooseLength: this.chooseArr.length,
    }, () => {
      this.reCompute()
      if (maxC !== 8) {
        if (this.state.chooseLength < maxC) {
          this.setState({
            maxC: this.state.chooseLength
          })
        } else {
          this.setState({
            maxC: maxC
          })
        }

      } else {
        if (this.state.chooseLength < 8) {
          this.setState({
            maxC: this.state.chooseLength
          })
        } else {
          this.setState({
            maxC: 8
          })
        }
      }
    })
  }

  //确认页面显示选中信息
  showDesc(arr, type, zclose) {
    let desc = '';
    let a = arr[+betConfig.jclq.hh.index[type]]
    switch (type) {
      case 'sf':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jclq.sf.desc[item] + ',';
            }
          }
        )
        break;
      case 'rf':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jclq.rf.desc[item] + ',';
            }
          }
        )
        break;
      case 'dxf':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jclq.dxf.desc[item] + zclose + ',';
            }
          }
        )
        break;
      case 'sfc':
        _.each(a, item => {
            if (item) {
              if (parseInt(item) > 10) {
                desc += '客胜 ' + betConfig.jclq.sfc.desc[item] + ',';
              } else {
                desc += '主胜 ' + betConfig.jclq.sfc.desc[item] + ',';
              }
            }
          }
        )
        break;
    }
    desc = desc.substring(0, desc.length - 1)
    return desc;
  }

  //显示串关组件
  showCGPop() {
    if ((!this.allIsDG && this.state.chooseLength > 2) || (this.allIsDG && this.state.chooseLength > 1)) {
      this.setState({
        CGShow: true
      })
    }
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
          let rLength = row.length;
          if (row && rLength > 0 && !_this.renderOk) {
            _this.realSPF = this.realSPF.concat(_.cloneDeep(row))
            _this.real = this.real.concat(_.cloneDeep(row))
          }
          arr.push(
            <div key={`jclq_hh_date_${index}`}>
              {rLength > 0 &&
              <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="hh"
                   className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              }
              <div id={`jclq_hh_list_${index}`}>
                {
                  row.map((it, ind) => {
                    i += 1;
                    let num = '';
                    (function (e) {
                      num = e;
                    }(i))
                    let sf = it.sf.split(',');
                    let rfsf = it.rfsf.split(',');
                    let dxf = it.dxf.split(',');
                    let sfc = it.sfc.split(',');
                    return (
                      <div className="bettingBoxWrap" key={`jclq_sf_${it.itemid}`}>
                        <div className="bettingBoxBasketball">
                          <div className="bettingLabel">
                            {
                              (utils.isSell('PlayType_LQDG_SF', it.isale)
                                || utils.isSell('PlayType_LQDG_RFSF', it.isale)
                                || utils.isSell('PlayType_LQDG_DXF', it.isale)) ?
                                <label className="label_1"><span>单</span></label>
                                : it.hot === 'yes' ? <label className="label_2"><span>热</span></label> : ''
                            }
                          </div>
                          <div className="bettingBox_fl" onClick={() => this.props.toggle(it.itemid, 'hh')}>
                            <p>{it.mname}</p><p>{it.name}</p><p>{`${moment(it.et).format('HH:mm')}截止`}</p>
                            <p className="arrow " id={`hh_arrow_${it.itemid}`}/>
                          </div>
                          <div className="bettingBox_fr">
                            <div className="bettingBox_fr_title clearfix">
                              <ul>
                                <li className="li1">{it.gn}</li>
                                <li className="li2">vs</li>
                                <li className="li3">{it.hn}<span className="mainSpan">主</span></li>
                              </ul>
                            </div>
                            <table cellSpacing="0" cellPadding="0">
                              <tbody>
                              {
                                (utils.isSell('PlayType_JCLQ_SF', it.isale) && sf[0] !== '') ?
                                  <tr>
                                    <td className="td1 tdRed">胜负</td>
                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[0][0] === '0') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '0', 'sf')
                                      }
                                      }
                                    >
                                      <p className="p3">客胜</p>
                                      <p className="p4">{sf[0]}</p>
                                    </td>

                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[0][1] === '3') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '3', 'sf')
                                      }
                                      }
                                    >
                                      <p className="p3">主胜</p>
                                      <p className="p4">{sf[1]}</p>
                                    </td>
                                  </tr>
                                  :
                                  <tr>
                                    <td className="td1 tdRed">胜负</td>
                                    <td className="td5 h_66" colSpan="2">
                                      <p className="p5">未开售</p>
                                    </td>
                                  </tr>
                              }
                              {
                                (utils.isSell('PlayType_JCLQ_RFSF', it.isale) && rfsf[0] !== '') ?
                                  <tr>
                                    <td className='td1 tdGreen'>让分</td>
                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[1][0] === '0') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '0', 'rf')
                                      }}
                                    >
                                      <p className="p3">让客胜</p>
                                      <p className="p4">{rfsf[0]}</p>
                                    </td>

                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[1][1] === '3') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '3', 'rf')
                                      }
                                      }>
                                      <p className="p3">让主胜<span
                                        className={parseFloat(it.close) > 0 ? "redColor" : "greenColor"}>({it.close})</span>
                                      </p>
                                      <p className="p4">{rfsf[1]}</p>
                                    </td>
                                  </tr>
                                  :
                                  <tr>
                                    <td className='td1 tdGreen'>让分</td>
                                    <td className="td5 h_66" colSpan="2">
                                      <p className="p5">未开售</p>
                                    </td>
                                  </tr>
                              }
                              {
                                (utils.isSell('PlayType_JCLQ_DXF', it.isale) && dxf[0] !== '') ?
                                  <tr>
                                    <td className="td1 tdBlue">大小分</td>
                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[2][0] === '3') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '3', 'dxf')
                                      }}
                                    >
                                      <p className="p3">大于{it.zclose}</p>
                                      <p className="p4">{dxf[0]}</p>
                                    </td>
                                    <td
                                      className={'td5 ' + ((_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[2][1] === '0') ? 'tdOrange' : '')}
                                      onClick={() => {
                                        _this.clickOption(num, '0', 'dxf')
                                      }}
                                    >
                                      <p className="p3">小于{it.zclose}</p>
                                      <p className="p4">{dxf[1]}</p>
                                    </td>
                                  </tr>
                                  :
                                  <tr>
                                    <td className='td1 tdBlue'>大小分</td>
                                    <td className="td5 h_66" colSpan="2">
                                      <p className="p5">未开售</p>
                                    </td>
                                  </tr>
                              }
                              {
                                (utils.isSell('PlayType_JCLQ_SFC', it.isale) && sfc[0] !== '') ?
                                  <tr>
                                    <td className="td1 tdYellow">胜分差</td>
                                    {(_this.realSPF[num].chooseWF && _this.realSPF[num].chooseWF[3].join('').length !== 0) ?
                                      <td className="td5 h_66 tdOrange" colSpan={2}
                                          onClick={() => this.chooseSfc(_this.realSPF[num], num)}
                                      >
                                        <p className="p5 ">{this.showDesc(_this.realSPF[num].chooseWF, 'sfc')}</p>
                                      </td>
                                      :
                                      <td className="td5 h_66" colSpan={2}
                                          onClick={() => this.chooseSfc(_this.realSPF[num], num)}
                                      >
                                        <p className="p5">点击选择胜分差</p>
                                      </td>
                                    }
                                  </tr>
                                  :
                                  <tr>
                                    <td className='td1 tdYellow'>胜分差</td>
                                    <td className="td5 h_66" colSpan="2">
                                      <p className="p5">未开售</p>
                                    </td>
                                  </tr>
                              }
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className='bettingBoxDown lqBoxDown ' id={`hh_${it.itemid}`}>
                          <table cellSpacing="0" cellPadding="0">
                            <tbody>
                            <tr>
                              <td className="td1">联赛排名</td>
                              <td colSpan="4" className="td2">
                                <div className='fontS24'>{it.grank}</div>
                                <div className='fontS24'>{it.hrank}</div>
                              </td>
                            </tr>
                            <tr>
                              <td className="td1 lqTd1">近期战绩</td>
                              <td className="td2 lqTd2">
                                <div>
                                  <span className="colorRed">{`${it.gjk3}胜`}</span>
                                  <span className="colorGreen">{`${it.gjk0}负`}</span>
                                </div>
                                <div>

                                  <span className="colorRed">{`${it.hjk3}胜`}</span>
                                  <span className="colorGreen">{`${it.hjk0}负`}</span>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="td1 lqTd1">历史交锋</td>
                              <td className="td2 lqTd2">
                                {`近${parseInt(it.jf0) + parseInt(it.jf3)}次交战，主队`}
                                <span className="colorRed">{`${it.jf3}胜`}</span>
                                <span className="colorGreen">{`${it.jf0}负`}</span>
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
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
                  this.checkShow()
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
                      return (
                        <div className="mixedProgram" key={`hh_choose_${index}`}>
                          <div className="mixedProgramTitle">
                            <ul className="clearfix">
                              <li className="li1">{item.name}</li>
                              <li className="li2">{item.gn}</li>
                              <li className="li3">VS</li>
                              <li className="li4">{item.hn}<span className="mainSpan">主</span></li>
                            </ul>
                          </div>
                          <div className="mixedFlex">
                            <div className="programBox_fl" onClick={() => _this.delChoose(item.index)}>
                              <img src={require('../../../../Img/lotteryBetting/delIcon.png')}/>
                            </div>
                            <div className="programBox_fr"
                                 onClick={() => {
                                   _this.chooseSfc(item, item.index, true)
                                 }}
                            >
                              {
                                item.chooseWF[0].join('').length > 0 &&
                                <p>
                                  <span className="span1">胜负:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'sf')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[1].join('').length > 0 &&
                                <p>
                                  <span className="span1">{`让分(${item.close}):`}</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'rf')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[2].join('').length > 0 &&
                                <p>
                                  <span className="span1">大小分:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'dxf', item.zclose)}</span>
                                </p>
                              }
                              {
                                item.chooseWF[3].join('').length > 0 &&
                                <p>
                                  <span className="span1">胜分差:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'sfc')}</span>
                                </p>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <UserProtocol link="/jclqBet/linkPage" doClear={this.doClear} read={this.props.read} receiveRead={this.props.receiveRead}/>
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
    let _this = this;
    return (
      <div>
        {!this.state.popShow ?
          <div>
            <div className="listDivView" id="lqhhdiv" style={{height: this.props.listHeight}}>
              {this.Template()}
            </div>
            <ComFirstFoot doClear={this.doClear}
                          chooseLength={this.state.chooseLength}
                          allIsDG={this.allIsDG}
                          doNext={this.doNext}
                          type="jclq"
            />
          </div>
          :
          <div className="programContent">
            {this.chooseTemplate()}
            <footer className="programFooter">
              <div className="programFooter1">
                <div className="clearfix">
                  <div className="selectedTxt">
                    <p onClick={this.showCGPop}>
                      <span>{utils.getCGDesc(this.state.realCG, this.allIsDG)}</span>
                    </p>
                  </div>
                  <div className="inputBox">投
                    <input type="tel"
                           onBlur={v => {
                             if (v.target.value === '' || v.target.value === '0') {
                               _this.setState({beiNum: _this.state.minBei})
                             }
                           }}
                           onChange={_this.setBeiNum.bind(this)}
                           value={_this.state.beiNum}/>倍
                  </div>
                </div>
              </div>
              {/*立即预约*/}
              <div className="bettingFooterInfo">
                <div className="footerInfo">
                  <p className="p1">{`${this.state.betNum}注 合计`}
                    <span>{this.state.betNum * this.state.beiNum * 2}</span>元
                  </p>
                  {this.state.bonus.min === this.state.bonus.max ?
                    <p className="p2">{`理论奖金：${((+this.state.bonus.min) * this.state.beiNum).toFixed(2)}元`}</p>
                    :
                    <p
                      className="p2">{`预计奖金：${((+this.state.bonus.min) * this.state.beiNum).toFixed(2)}~${((+this.state.bonus.max) * this.state.beiNum).toFixed(2)}元`}</p>
                  }

                </div>
                <a className="nextBtn" onClick={this.prepareForPay}>立即预约</a>
              </div>
            </footer>
            {this.state.CGShow &&
            <CGComponent
              maxC={this.state.maxC}
              realCG={this.state.realCG}
              callback={this.CGCallback}
              allIsDG={this.allIsDG}/>
            }
          </div>
        }
        {this.state.HhPopShow &&
        <LqHhPop hidePop={this.hidePop} data={this.state.currentClick} fromPop={this.state.fromPop}/>
        }

      </div>
    )
  }
}
