import React, {Component} from 'react'
import {lotteryControl} from '../../../../Stubs/API'
import betConfig from '../../../../config/betConfig'
import {hashHistory} from 'react-router'
import utils from '../../../../common/utils'
import {Toast, NavBar} from 'antd-mobile'
import _ from 'lodash'
import moment from 'moment'
import ComFirstFoot from '../../common/ComFirstFoot'
import CGComponent from '../../common/CGComponent'
import UserProtocol from '../../common/userProtocol'
import HhPop from '../../common/HhPop'
import CommonJF from '../CommonJF'

/* 混合投注列表组件 */
export class MixedBetsList extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      minBei: '',         //最小倍数
      maxBei: '',         //最大倍数
      chooseLength: 0,    //选择对阵场次
      chooseData: [],     //第一步选择的对阵数据
      maxC: 8,            //最大串关
      realCG: [],         //选择的串关方式
      betNum: 0,          //注数
      popListHeight: '',  //选中列表高度
      beiNum: 1,          //倍数
      popShow: false,     //弹框是否显示
      HhPopShow: false,   //混投弹框显示
      bonus: {
        min: '',
        max: ''
      },                  //理论中奖金额
      CGShow: false,      //串关组件是否显示
      currentClick: {},   //当前点击项
      currentIndex: ''    //当前点击项索引
    }
    this.realSPF = [];    //索引对阵数据，接口返回的是按天返回的对象数组
    this.real = [];       //初始对阵数据，realSPF会被改变  用来清空是付给realSPF
    this.allIsDG = false;
    this.chooseArr = [];  // 每场选中玩法数 计算注数
    this.chooseIndex = [];// 选中比赛的索引
    this.chooseInfo = []; // 选中比赛的对阵数据
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
    this.checkShow = this.checkShow.bind(this)
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


  // 输入倍数
  setBeiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '')
    if (value > this.state.maxBei) {
      value = this.state.maxBei
      Toast.info('最多可以投' + value + '倍', 1, null, false)
    } else if (value === '0') {
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
        let spf = item.spf.split(',');
        let rqspf = item.rqspf.split(',');
        let cbf = item.cbf.split(',');
        let jqs = item.jqs.split(',');
        let bqc = item.bqc.split(',');
        let tempArr = [];
        let obj = {};
        _.each(item.chooseWF, (val, index) => {
          _.each(val, v => {
            switch (index) {
              case 0:
                if (v) {
                  tempArr.push(parseFloat(spf[+betConfig.jczq.spf.location[v]]))
                }
                break;
              case 1:
                if (v) {
                  tempArr.push(parseFloat(rqspf[+betConfig.jczq.rq.location[v]]))
                }
                break;
              case 2:
                if (v) {
                  tempArr.push(parseFloat(cbf[+betConfig.jczq.bf.location[v]]))
                }
                break;
              case 3:
                if (v) {
                  tempArr.push(parseFloat(jqs[+betConfig.jczq.jq.location[v]]))
                }
                break;
              case 4:
                if (v) {
                  tempArr.push(parseFloat(bqc[+betConfig.jczq.bqc.location[v]]))
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

  // 控制弹框显示与否
  checkShow(goTop = false) {
    this.setState({
      popShow: !this.state.popShow
    }, () => {
      if (goTop) {
        document.getElementById('zqhhdiv').scrollTop = 0
      }
    })
  }

  //点击下一步
  doNext() {
    if (this.state.chooseLength === 0) {
      Toast.info('请先选择比赛', 1, null, false)
    } else if (this.state.chooseLength === 1) {
      if (this.allIsDG) {
        this.checkShow()
      } else {
        Toast.info('至少选择2场比赛', 1, null, false)
      }
    } else {
      this.setState({
        beiNum: 1
      })
      this.checkShow()
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
      arr[i] = [[], [], [], [], []] //spf rqspf bf  jq  bqc
    }
    let index = parseInt(betConfig.jczq.hh.index[type]);
    let cIndex = parseInt(betConfig.jczq[type].location[value]);
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
        let length4 = realChoose[4].length
        console.log(length0, length1, length2, length3, length4)
        if (length2 > 0 || length4 > 0) {
          maxC = 4
        } else if (length3 > 0) {
          maxC = 6
        }
        this.realSPF[i].wfNum = wf;
        //是否开售胜平负单关
        let spfFlag = utils.isSell('PlayType_ZQDG_SPF', this.realSPF[i].isale);
        //是否开售让球单关
        let rqspfFlag = utils.isSell('PlayType_ZQDG_RQSPF', this.realSPF[i].isale);
        //在开售其中一种时显示单关标记 但是仅限点击开售玩法为单关  若点击未开售玩法任然按照混投处理至少选两场
        let a = length0 === 0 && length1 === 0 && (length2 > 0 || length3 > 0 || length4 > 0)
        if (spfFlag && rqspfFlag) {
          flag += 1;
        } else if (spfFlag && !rqspfFlag) {
          if (length0 > 0 && length1 === 0) {
            flag += 1;
          } else if (a) {
            flag += 1;
          }
        } else if (!spfFlag && rqspfFlag) {
          if (length0 === 0 && length1 > 0) {
            flag += 1;
          } else if (a) {
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
  showDesc(arr, type) {
    let desc = '';
    let a = arr[+betConfig.jczq.hh.index[type]]
    switch (type) {
      case 'spf':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jczq.spf.desc[item] + ',';
            }
          }
        )
        break;
      case 'rq':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jczq.rq.desc[item] + ',';
            }
          }
        )
        break;
      case 'bqc':
        _.each(a, item => {
            if (item) {
              desc += betConfig.jczq.bqc.desc[item] + ',';
            }
          }
        )
        break;
      case 'jq':
        _.each(a, item => {
            if (item) {
              if (item === '7') {
                desc += item + '+球,';
              } else {
                desc += item + '球,';
              }

            }
          }
        )
        break;
      case 'bf':
        _.each(a, item => {
            if (item) {
              if (item === '9:0') {
                desc += '胜其他' + ','
              } else if (item === "9:9") {
                desc += '平其他' + ','
              } else if (item === "0:9") {
                desc += '负其他' + ','
              } else {
                desc += item + ','
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
            <div key={`jczq_hh_date_${index}`}>
              {rLength > 0 &&
              <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="hh"
                   className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              }
              <div id={`jczq_hh_list_${index}`}>
                {
                  row.map((it, ind) => {
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
                      <div className="bettingBoxWrap" key={`jczq_spf_${it.itemid}`}>
                        <div className="bettingBox">
                          <div className="bettingLabel">
                            {
                              (utils.isSell('PlayType_ZQDG_SPF', it.isale) || utils.isSell('PlayType_ZQDG_RQSPF', it.isale)) ?
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
                                    {
                                      !_this.realSPF[num].wfNum ?
                                        <td rowSpan="2"
                                            onClick={() => {
                                              let arr = _.cloneDeep(this.state.chooseData);
                                              if (this.state.chooseLength === 20 && !arr[i]) {
                                                Toast.info('最多可以选择20场比赛', 1, null, false);
                                                return;
                                              }
                                              _this.setState({
                                                currentClick: _this.realSPF[num],
                                                currentIndex: num,
                                                HhPopShow: true
                                              })
                                            }}
                                            className="td3"
                                        >
                                          全部<br/>
                                          玩法
                                        </td>
                                        :
                                        <td rowSpan="2"
                                            onClick={() => {
                                              _this.setState({
                                                currentClick: _this.realSPF[num],
                                                currentIndex: num,
                                                HhPopShow: true
                                              })
                                            }}
                                            className="td3 tdPink"
                                        >
                                          已选<br/>
                                          <span>{_this.realSPF[num].wfNum}</span>项
                                        </td>
                                    }

                                  </tr>
                                  :
                                  <tr>
                                    <td className="td1">0</td>
                                    <td className="td2" colSpan="3"><span className="grayColor">未开售</span></td>
                                    {
                                      !_this.realSPF[num].wfNum ?
                                        <td rowSpan="2"
                                            onClick={() => {
                                              _this.setState({
                                                currentClick: _this.realSPF[num],
                                                currentIndex: num,
                                                HhPopShow: true
                                              })
                                            }}
                                            className="td3"
                                        >
                                          全部<br/>
                                          玩法
                                        </td>
                                        :
                                        <td rowSpan="2"
                                            onClick={() => {
                                              _this.setState({
                                                currentClick: _this.realSPF[num],
                                                currentIndex: num,
                                                HhPopShow: true
                                              })
                                            }}
                                            className="td3 tdPink"
                                        >
                                          已选<br/>
                                          <span>{_this.realSPF[num].wfNum}</span>项
                                        </td>
                                    }
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

                        <CommonJF item={it} type="hh"/>
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
                          <div className="mixedFlex">
                            <div className="programBox_fl" onClick={() => _this.delChoose(item.index)}>
                              <img src={require('../../../../Img/lotteryBetting/delIcon.png')}/>
                            </div>
                            <div className="programBox_fr"
                                 onClick={() => {
                                   _this.setState({
                                     currentClick: item,
                                     currentIndex: item.index,
                                     HhPopShow: true
                                   })
                                 }}
                            >
                              {
                                item.chooseWF[0].join('').length > 0 &&
                                <p>
                                  <span className="span1">胜平负:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'spf')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[1].join('').length > 0 &&
                                <p>
                                  <span
                                    className="span1">{`让球(${+item.close > 0 ? '+' + item.close : item.close}):`}</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'rq')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[2].join('').length > 0 &&
                                <p>
                                  <span className="span1">比分:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'bf')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[3].join('').length > 0 &&
                                <p>
                                  <span className="span1">总进球:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'jq')}</span>
                                </p>
                              }
                              {
                                item.chooseWF[4].join('').length > 0 &&
                                <p>
                                  <span className="span1">半全场:</span>
                                  <span className="span2">{this.showDesc(item.chooseWF, 'bqc')}</span>
                                </p>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <UserProtocol link="/jczqBet/linkPage" doClear={this.doClear} read={this.props.read} receiveRead={this.props.receiveRead}/>
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
            <div className="listDivView" id='zqhhdiv' style={{height: this.props.listHeight}}>
              {this.Template()}
            </div>
            <ComFirstFoot doClear={this.doClear}
                          chooseLength={this.state.chooseLength}
                          allIsDG={this.allIsDG}
                          doNext={this.doNext}
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
        <HhPop hidePop={this.hidePop} data={this.state.currentClick}/>
        }

      </div>
    )
  }
}
