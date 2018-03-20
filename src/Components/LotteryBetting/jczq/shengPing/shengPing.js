import React, {Component} from 'react'
import utils from '../../../../common/utils'
import moment from 'moment'
import _ from 'lodash'
import {lotteryControl} from '../../../../Stubs/API'
import {NavBar, Toast} from 'antd-mobile'
import {hashHistory} from 'react-router'
import ComFirstFoot from '../../common/ComFirstFoot'
import betConfig from '../../../../config/betConfig'
import CGComponent from '../../common/CGComponent'
import UserProtocol from '../../common/userProtocol'
import '../../../../Style/lotteryBetting/programContent.less'
import CommonJF from '../CommonJF'

/* 胜平负列表组件 */
export class ShengPingList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      chooseSPF: [],
      chooseLength: 0,  //实际选中玩法的场次
      popShow: false,
      popListHeight: '',
      betNum: 0, //注数
      beiNum: 1,  //倍数
      minBei: '',
      maxBei: '',
      realCG: [],  //串关
      bonus: {
        min: '',
        max: ''
      },
      maxC: 8,
      CGShow: false,
      CGDesc: ''
    }
    this.realSPF = [];  //符合投注条件的列表数组[{}...]
    this.chooseInfo = []; //选中的比赛信息数组[{},{},{}]，在第二步点击胜平负同样影响
    this.chooseArr = [];  //选中场次每场选几个数组[2,1,1]，在第二步点击胜平负同样影响
    this.chooseIndex = [];  //第一步选中场次的下标[2,5,8],在第二步只有点击删除或清空能影响
    this.allIsDG = false;
    this.renderOk = false;
    this.Template = this.Template.bind(this)
    this.clickSPF = this.clickSPF.bind(this)
    this.doClear = this.doClear.bind(this)
    this.checkShow = this.checkShow.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.doNext = this.doNext.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.delChoose = this.delChoose.bind(this)
    this.getSpArr = this.getSpArr.bind(this)
    this.CGCallback = this.CGCallback.bind(this)
    this.showCGPop = this.showCGPop.bind(this)
    this.reCompute = this.reCompute.bind(this)
    this.prepareForPay = this.prepareForPay.bind(this)
  }


  componentWillMount() {
    lotteryControl(betConfig.jczq.spf.gid).then(result => {
      if (result && result.bs) {
        let bs = result.bs
        this.setState({
          minBei: parseInt(bs.min),
          maxBei: parseInt(bs.max)
        })
      }
    })
  }

  // 清空处理
  doClear(goTop = false) {
    console.log(goTop)
    this.chooseInfo = [];
    this.chooseArr = [];
    this.chooseIndex = [];
    this.allIsDG = false;
    this.setState({
      chooseSPF: [],
      chooseLength: 0,
      realCG: [],
      beiNum: 1,
    }, () => {
      if (goTop) {
        this.checkShow(goTop)
      }
      this.reCompute()
    })

  }

  //显示串关组件
  showCGPop() {
    if ((!this.allIsDG && this.state.chooseLength > 2) || (this.allIsDG && this.state.chooseLength > 1)) {
      this.setState({
        CGShow: true
      })
    }
  }

  // 控制弹框显示与否
  checkShow(goTop = false) {
    this.setState({
      popShow: !this.state.popShow
    }, () => {
      if (goTop) {
        document.getElementById('zqspfdiv').scrollTop = 0
      }
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

  /**
   * 点击选中计算
   * i 下标
   * type 选中的胜平负类型
   */
  clickSPF(i, type, from = '') {
    let arr = [].concat(this.state.chooseSPF);
    if (this.state.chooseLength === 20 && !arr[i]) {
      Toast.info('最多可以选择20场比赛', 1, null, false);
      return;
    }
    if (!utils.checkIsArr(arr[i])) {
      arr[i] = ['', '', '']
    }
    let index = +betConfig.jczq.spf.location[type];
    arr[i][index] = arr[i][index] === type ? '' : type;
    if (arr[i].join('').length === 0) {
      arr[i] = ''
    }
    console.log('选中arr:', arr)
    this.setState({
      chooseSPF: arr,
    })
    this.chooseArr = [];
    this.chooseInfo = [];
    if (from !== 'fromPop') {
      this.chooseIndex = [];
    }
    this.allIsDG = false;
    let flag = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (utils.checkIsArr(arr[i])) {
        let istr = arr[i].join('')
        if (utils.isSell('PlayType_ZQDG_SPF', this.realSPF[i].isale) || utils.isSell('PlayType_ZQDG_RQSPF', this.realSPF[i].isale)) {
          flag += 1;
        }
        if (from !== 'fromPop') {
          this.chooseIndex.push(i);
        }
        this.chooseInfo.push(
          _.assign({
            index: i,
            spfchoose: istr.split('')
          }, this.realSPF[i])
        )
        let cc = istr.length
        if (cc !== 0) {
          this.chooseArr.push(cc)
        }
      }
    }
    let tempCG = []
    if (flag === this.chooseArr.length && this.chooseArr.length !== 0) {
      this.allIsDG = true;
      tempCG = [1];
    } else if (flag !== this.chooseArr.length && this.chooseArr.length > 1) {
      tempCG = [2]
    } else {
      tempCG = []
    }
    console.log('选择比赛场次：', this.chooseArr.length)
    this.setState({
      realCG: tempCG,
      chooseLength: this.chooseArr.length,
    }, () => {
      this.reCompute()
      if (this.state.chooseLength < 8) {
        this.setState({
          maxC: this.state.chooseLength
        })
      } else {
        this.setState({
          maxC: 8
        })
      }
    })

  }

  /**
   * 计算注数和奖金
   *
   */
  reCompute() {
    let spArr = this.getSpArr(this.chooseInfo);
    let zhushu = 0;
    _.each(this.state.realCG, (item, index) => {
      zhushu += utils.math.N1(this.chooseArr, item)
    })
    this.setState({
      betNum: zhushu,
      bonus: utils.Count.prix(spArr, this.state.realCG),
    })
  }

  /**
   * @description 处理选中对阵arr,为计算预计奖金
   * @param {Array} chooseInfo 要遍历的数组对象
   * @return {Array}[{max:'2',min:'1'},{max:'4',min:'2'}]
   *
   */
  getSpArr(chooseInfo) {
    let arr = []
    if (_.isArray(chooseInfo)) {
      _.each(chooseInfo, item => {
        let tempSp = item.spf.split(',');
        let tempArr = [];
        let obj = {};
        _.each(item.spfchoose, val => {
          tempArr.push(tempSp[betConfig.jczq.spf.location[val]])
        })
        obj.min = _.min(tempArr)
        obj.max = _.max(tempArr)
        arr.push(obj)
      })
    }
    return arr
  }

  //删除所选场次
  delChoose(index) {
    this.allIsDG = false;
    let indexArr = this.chooseIndex;
    let ind = indexArr.indexOf(index)
    this.chooseIndex = indexArr.slice(0, ind).concat(indexArr.slice(ind + 1))
    //修改chooseInfo
    let info = this.chooseInfo
    let reChooseInfo = []
    for (let j = 0, infoLen = info.length; j < infoLen; j++) {
      if (info[j].index !== index) {
        reChooseInfo.push(info[j])
      }
    }
    this.chooseInfo = reChooseInfo
    // 修改chooseSPF
    let chooseSPF = this.state.chooseSPF;
    let reChooseSPF = [];
    for (let j = 0, chooseLen = chooseSPF.length; j < chooseLen; j++) {
      if (j !== index) {
        reChooseSPF.push(chooseSPF[j])
      } else {
        reChooseSPF.push('')
      }
    }
    this.chooseArr = []
    let flag = 0;
    for (let j = 0, rechooseLen = reChooseSPF.length; j < rechooseLen; j++) {
      if (utils.checkIsArr(reChooseSPF[j])) {
        if (utils.isSell('PlayType_ZQDG_SPF', this.realSPF[j].isale) || utils.isSell('PlayType_ZQDG_RQSPF', this.realSPF[j].isale)) {
          flag += 1;
        }
        let istr = reChooseSPF[j].join('');
        let cc = istr.length
        if (cc !== 0) {
          this.chooseArr.push(cc)
        }
      }
    }
    let tempCG = [];
    if (flag === this.chooseArr.length && this.chooseArr.length !== 0) {
      this.allIsDG = true;
      tempCG = [1];
    } else if (flag !== this.chooseArr.length && this.chooseArr.length > 1) {
      tempCG = [2];
    } else {
      tempCG = [];
    }
    this.setState({
      realCG: tempCG,
      chooseSPF: reChooseSPF,
      chooseLength: this.chooseArr.length,
    }, () => {
      this.reCompute()
      if (this.state.chooseLength < 8) {
        this.setState({
          maxC: this.state.chooseLength
        })
      } else {
        this.setState({
          maxC: 8
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
      let arr = _.cloneDeep(this.state.chooseSPF);
      this.chooseIndex = [];
      for (let i = 0, len = arr.length; i < len; i++) {
        if (utils.checkIsArr(arr[i])) {
          this.chooseIndex.push(i);
        }
      }
      this.setState({
        beiNum: 1
      })
      this.checkShow()
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
            if (row[i].spf.split(',')[0] !== '' && utils.isSell('PlayType_JCZQ_SPF', row[i].isale)) {
              realRow.push(row[i])
            }
          }
          let rLength = realRow.length;
          if (realRow && rLength > 0 && !_this.renderOk) {
            _this.realSPF = this.realSPF.concat(realRow)
          }
          arr.push(
            <div key={`jczq_spf_date_${index}`}>
              {rLength > 0 &&
              <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="spf"
                   className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              }
              <div id={`jczq_spf_list_${index}`}>
                {
                  (realRow && rLength > 0) &&
                  realRow.map((it, ind) => {
                    i += 1;
                    let num = '';
                    (function (e) {
                      num = e;
                    }(i))
                    let spf = it.spf.split(',');
                    let spfscale = it.spfscale.split(',')
                    let rqspfscale = it.rqspfscale.split(',')
                    return (
                      <div className="bettingBoxWrap" key={`jczq_spf_${it.itemid}`}>
                        <div className="shengPingBox clearfix">
                          <div className="bettingLabel">
                            {
                              (utils.isSell('PlayType_ZQDG_SPF', it.isale) || utils.isSell('PlayType_ZQDG_RQSPF', it.isale)) ?
                                <label className="label_1"><span>单</span></label>
                                : it.hot === 'yes' ? <label className="label_2"><span>热</span></label> : ''
                            }
                          </div>
                          <div className="bettingBox_fl" onClick={() => this.props.toggle(it.itemid, 'spf')}>
                            <p>{it.mname}</p><p>{it.name}</p><p>{`${moment(it.et).format('HH:mm')}截止`}</p>
                            <p className="arrow " id={`spf_arrow_${it.itemid}`}/>
                          </div>
                          <div className="bettingBox_fr">
                            <table cellSpacing="0" cellPadding="0">
                              <tbody>
                              <tr>
                                {/*redBg 背景为红色*/}
                                <td
                                  className={"td1 " + ((_this.state.chooseSPF[num] && _this.state.chooseSPF[num][0] === '3') ? 'redBg' : '')}
                                  onClick={
                                    () => {
                                      _this.clickSPF(num, '3')
                                    }}
                                ><p className="p1">{it.hn}</p>
                                  <p className="p2">{`主胜${spf[0]}`}</p>
                                </td>
                                <td
                                  className={"td2 border_lr " + ((_this.state.chooseSPF[num] && _this.state.chooseSPF[num][1] === '1') ? 'redBg' : '')}
                                  onClick={() => {
                                    _this.clickSPF(num, '1')
                                  }}
                                >
                                  <p className="p1">VS</p>
                                  <p className="p2">{`平${spf[1]}`}</p>
                                </td>
                                <td
                                  className={"td1 " + ((_this.state.chooseSPF[num] && _this.state.chooseSPF[num][2] === '0') ? 'redBg' : '')}
                                  onClick={() => {
                                    _this.clickSPF(num, '0')
                                  }}
                                >
                                  <p className="p1">{it.gn}</p>
                                  <p className="p2">{`客胜${spf[2]}`}</p>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <CommonJF item={it} type="spf"/>
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
                onLeftClick={() => this.checkShow()}
                rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >方案内容</NavBar>
        <div className="programContentBox">
          <div className="programList">
            {
              (_this.chooseIndex.length > 0 && _this.realSPF.length > 0) ?
                <div className="popList listDivView" style={{height: this.state.popListHeight}}>
                  {
                    _this.realSPF.map((item, index) => {
                      if (_this.chooseIndex.indexOf(index) !== -1) {
                        let spf = item.spf.split(',');
                        return (
                          <div className="clearfix programBox" key={`choose_data_${index}`}>
                            <div className="programBox_fl" onClick={() => _this.delChoose(index)}>
                              <img src={require('../../../../Img/lotteryBetting/delIcon.png')}/>
                            </div>
                            <div className="programBox_fr">
                              <table cellSpacing="0" cellPadding="0">
                                <tbody>
                                <tr>
                                  <td
                                    className={"td1 " + ((_this.state.chooseSPF[index] && _this.state.chooseSPF[index][0] === '3') ? 'redBg' : '')}
                                    onClick={
                                      () => {
                                        _this.clickSPF(index, '3', 'fromPop')
                                      }}
                                  >
                                    <p className="p1">{item.hn}</p>
                                    <p className="p2">{`主胜${spf[0]}`}</p>
                                  </td>
                                  <td
                                    className={"td2 border_lr " + ((_this.state.chooseSPF[index] && _this.state.chooseSPF[index][1] === '1') ? 'redBg' : '')}
                                    onClick={
                                      () => {
                                        _this.clickSPF(index, '1', 'fromPop')
                                      }}
                                  >
                                    <p className="p1">VS</p>
                                    <p className="p2">{`平${spf[1]}`}</p>
                                  </td>
                                  <td
                                    className={"td1 " + ((_this.state.chooseSPF[index] && _this.state.chooseSPF[index][2] === '0') ? 'redBg' : '')}
                                    onClick={
                                      () => {
                                        _this.clickSPF(index, '0', 'fromPop')
                                      }}
                                  >
                                    <p className="p1">{item.gn}</p>
                                    <p className="p2">{`客胜${spf[2]}`}</p>
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="line_dashed"/>
                          </div>
                        )
                      }
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
      <div tabIndex="0">
        {
          !this.state.popShow ?
            <div>
              <div className="listDivView" id="zqspfdiv" style={{height: this.props.listHeight}}>
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
      </div>
    )
  }
}

