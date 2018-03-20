import React, {Component} from 'react'
import utils from '../../../../common/utils'
import moment from 'moment'
import _ from 'lodash'
import {lotteryControl} from '../../../../Stubs/API'
import {NavBar, Toast} from 'antd-mobile'
import {hashHistory} from 'react-router'
import ComFirstFoot from '../ComFirstFoot'
import betConfig from '../../../../config/betConfig'
import CGComponent from '../../common/CGComponent'
import UserProtocol from '../../common/userProtocol'
import BjdcPop from '../../common/BjdcPop'
import CommonJF from '../CommonJF'

/* 让球胜平负列表组件 */
export default class BanquanChangList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      minBei: '',
      maxBei: '',
      chooseLength: 0,
      chooseData: [],
      maxC: 6,
      realCG: [],
      betNum: 0,
      popListHeight: '',
      beiNum: 1,
      popShow: false,
      bjdcPopShow: false,
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
    this.allIsDG = true;
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
    this.chooseFromPop = this.chooseFromPop.bind(this)
    this.checkShow = this.checkShow.bind(this)
  }

  componentWillMount() {
    lotteryControl(betConfig.bjdc.bqc.gid).then(result => {
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
  checkShow(goTop=false) {
    this.setState({
      popShow: !this.state.popShow
    }, () => {
      if (goTop) {
        document.getElementById('bdbqcdiv').scrollTop = 0
      }
    })
  }

  chooseFromPop(item, num, fromPop) {
    console.log(item, num)
    this.setState({
      currentClick: item,
      currentIndex: num,
      bjdcPopShow: true,
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
  doClear(goTop) {
    let a = _.cloneDeep(this.real)
    this.realSPF = a;
    this.chooseInfo = [];
    this.chooseArr = [];
    this.setState({
      beiNum: 1,
      chooseData: [],
      chooseLength: 0,
      realCG: []
    }, () => {
      if(goTop){
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
        let bqc = item.bqc.split(',');
        let tempArr = [];
        let obj = {};
        _.each(item.chooseWF, (val, index) => {
          if (val) {
            tempArr.push(parseFloat(bqc[+betConfig.bjdc.bqc.location[val]]))
          }
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
      Toast.info('至少选择1场比赛', 1, null, false);
      return;
    }
    this.setState({
      beiNum:1,
      popShow: !this.state.popShow
    })

  }

  //点击立即预约
  prepareForPay() {
    if (this.state.chooseLength === 0) {
      Toast.info('至少选择1场比赛', 1, null, false)
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
   * type：类型:: bf bqc
   *
   */
  clickOption(i, value, type) {
    let arr = _.cloneDeep(this.state.chooseData);
    if (this.state.chooseLength === 20 && !arr[i]) {
      Toast.info('最多可以选择20场比赛', 1, null, false);
      return;
    }
    if (!utils.checkIsArr(arr[i])) {
      arr[i] = []
    }
    let index = parseInt(betConfig.bjdc[type].location[value]);
    arr[i][index] = (arr[i][index] === value) ? '' : value;
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
      bjdcPopShow: false
    })
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
        let wf = 0;
        let realChoose = []
        let bArr = _.cloneDeep(cArr[i])
        _.each(bArr, item => {
          if (item) {
            wf += 1
            realChoose.push(item)
          }
        })
        this.realSPF[i].wfNum = wf;
        this.chooseIndex.push(i);
        this.chooseInfo.push(
          _.assign({
            index: i,
            chooseWF: cArr[i],
            realChoose:realChoose
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
    let tempCG = [1]
    this.setState({
      realCG: tempCG,
      chooseLength: this.chooseArr.length,
    }, () => {
      this.reCompute()
      if (this.state.chooseLength < 6) {
        this.setState({
          maxC: this.state.chooseLength
        })
      } else {
        this.setState({
          maxC: 6
        })
      }
    })
  }

  //确认页面显示选中信息
  showDesc(arr, type) {
    console.log(111,arr)
    let desc = '';
    switch (type) {
      case 'bf':
        _.each(arr, item => {
            if (item) {
              desc += item + ',';
            }
          }
        )
        break;
      case 'bqc':
        _.each(arr, item => {
            if (item) {
              desc += betConfig.bjdc.bqc.desc[item] + ',';
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
    if (this.state.chooseLength > 1) {
      this.setState({
        CGShow: true
      })
    }
  }


  // 渲染对阵信息
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
            if (row[i].spf.split(',')[0] !== '') {
              realRow.push(row[i])
            }
          }
          let rLength = realRow.length;
          if (realRow && rLength > 0 && !_this.renderOk) {
            _this.realSPF = this.realSPF.concat(realRow)
            _this.real = this.real.concat(_.cloneDeep(realRow))
          }
          arr.push(
            <div key={`spf_date_${index}`}>
              <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="bqc"
                   className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              <div id={`bqc_list_${index}`}>
                {
                  (realRow && rLength > 0) &&
                  realRow.map((it, ind) => {
                    i += 1;
                    let num = '';
                    (function (e) {
                      num = e;
                    }(i))
                    return (
                      <div className="bettingBoxWrap" key={`bqc_${it.itemid}`}>
                        <div className="bettingBoxSingle">
                          <div className="bettingBox_fl" onClick={() => this.props.toggle(it.itemid, 'bqc')}>
                            <p>{it.mname}</p>
                            <p>{it.itemid}</p>
                            <p>{`${moment(it.et).format('HH:mm')}截止`}</p>
                            <p className="arrow " id={`bqc_arrow_${it.itemid}`}/>
                          </div>
                          <div className="bettingBox_fr">
                            <div className="bettingBox_fr_title clearfix">
                              <ul>
                                <li className="li1">{it.hn.substr(0,5)}</li>
                                <li className="li2">vs</li>
                                <li className="li3">{it.gn.substr(0,5)}</li>
                              </ul>
                            </div>
                            <table cellSpacing="0" cellPadding="0">
                              <tbody>
                              <tr>
                                <td className={this.realSPF[num].wfNum > 0 ? "redRed" : "bfBlack"}
                                    onClick={() => this.chooseFromPop(_this.realSPF[num], num)}>
                                  {(this.realSPF[num].wfNum && this.realSPF[num].wfNum> 0) ? this.showDesc(this.realSPF[num].chooseWF, 'bqc') : "点击选择半全场"}
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <CommonJF item={it} type="bqc"/>
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


  // 渲染选中信息
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
                              <li className="li1">{item.itemid}</li>
                              <li className="li2">{item.hn.substr(0,5)}</li>
                              <li className="li3">VS</li>
                              <li className="li4">{item.gn.substr(0,5)}</li>
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
                                item.chooseWF.join('').length > 0 &&
                                <p>
                                  <span className="span3" onClick={() => this.chooseFromPop(item, item.index)}>{this.showDesc(item.chooseWF, 'bqc')}</span>
                                </p>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  <UserProtocol link="/bjdcBet/linkPage" doClear={this.doClear} receiveRead={this.props.receiveRead}/>
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
      <div tabIndex="0">
        {
          !this.state.popShow ?
            <div>
              <div className="listDivView" id="bdbqcdiv" style={{height: this.props.listHeight}}>
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
                      <p className="p2">{`理论奖金：${((+this.state.bonus.min) * this.state.beiNum * 0.65).toFixed(2)}元`}</p>
                      :
                      <p
                        className="p2">{`预计奖金：${((+this.state.bonus.min) * this.state.beiNum * 0.65).toFixed(2)}~${((+this.state.bonus.max) * this.state.beiNum * 0.65).toFixed(2)}元`}</p>
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
        {this.state.bjdcPopShow &&
        <BjdcPop
          hidePop={this.hidePop}
          data={this.state.currentClick}
          fromPop={this.state.fromPop}
          type="bqc"
        />
        }
      </div>
    )
  }
}

