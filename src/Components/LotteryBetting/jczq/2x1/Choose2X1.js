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
import CommonJF from '../CommonJF'

/* 胜平负列表组件 */
export class Choose2X1 extends Component {
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
    this.renderOk = false;
    this.assist = {'1': ['主不败', '客胜'], '-1': ['主胜', '客不败']}
    this.Template = this.Template.bind(this)
    this.clickSPF = this.clickSPF.bind(this)
    this.doClear = this.doClear.bind(this)
    this.checkShow = this.checkShow.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.doNext = this.doNext.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.delChoose = this.delChoose.bind(this)
    this.CGCallback = this.CGCallback.bind(this)
    this.showCGPop = this.showCGPop.bind(this)
    this.reCompute = this.reCompute.bind(this)
    this.prepareForPay = this.prepareForPay.bind(this)
    this.doCompute = this.doCompute.bind(this)
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

  // 清空处理
  doClear(goTop = false) {
    this.chooseInfo = [];
    this.chooseArr = [];
    this.chooseIndex = [];
    this.setState({
      beiNum: 1,
      chooseSPF: [],
      chooseLength: 0,
      realCG: []
    }, () => {
      if (goTop) {
        this.checkShow(goTop)
      }
      this.reCompute()
    })
  }

  //显示串关组件
  showCGPop() {
    if (this.state.chooseLength > 2) {
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
        document.getElementById('zq2x1div').scrollTop = 0
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
    } else if (this.state.chooseLength === 1) {
      Toast.info('至少选择2场比赛', 1, null, false)
      return;
    }
    let params = {
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
  clickSPF(i, type, close, from = '') {
    let arr = _.cloneDeep(this.state.chooseSPF);
    if (this.state.chooseLength === 20 && !arr[i]) {
      Toast.info('最多可以选择20场比赛', 1, null, false);
      return;
    }
    if (!utils.checkIsArr(arr[i])) {
      arr[i] = [['', '', ''], ['', '', '']]
    }
    if (parseInt(close) === 1) {  //主队+1球
      if (type === '3') { //主不败=> +1 主胜
        arr[i][1][0] = arr[i][1][0] === '3' ? '' : '3'
      } else {  //客胜=> 0客胜
        arr[i][0][2] = arr[i][0][2] === '0' ? '' : '0'
      }

    } else if (parseInt(close) === -1) {  //主队-1球
      if (type === '3') { //主胜=>  0主胜
        arr[i][0][0] = arr[i][0][0] === '3' ? '' : '3'
      } else {  //客不败 -1客胜
        arr[i][1][2] = arr[i][1][2] === '0' ? '' : '0'
      }

    }
    if (arr[i][0].join('').length === 0 && arr[i][1].join('').length === 0) {
      arr[i] = ''
    }
    this.setState({
      chooseSPF: _.cloneDeep(arr),
    })
    this.doCompute(arr, from)

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
        let tempArr = [];
        let obj = {};
        _.each(item.spfchoose, (val, index) => {
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


  //点击选中计算
  doCompute(arr, from = '') {
    let cArr = _.cloneDeep(arr);
    this.chooseArr = [];
    this.chooseInfo = [];
    if (from !== 'fromPop') {
      this.chooseIndex = [];
    }
    let flag = 0;
    for (let i = 0, len = cArr.length; i < len; i++) {
      if (utils.checkIsArr(cArr[i])) {
        let istr = cArr[i].join('').replace(/,/g, '')
        if (from !== 'fromPop') {
          this.chooseIndex.push(i);
        }
        this.chooseInfo.push(
          _.assign({
            index: i,
            spfchoose: cArr[i]
          }, this.realSPF[i])
        )
        let cc = istr.length
        if (cc !== 0) {
          this.chooseArr.push(cc)
        }
      }
    }
    let tempCG = []
    if (this.chooseArr.length > 1) {
      tempCG = [2]
    } else {
      tempCG = []
    }
    console.log('选中的对阵', this.chooseInfo)
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

  //删除所选场次
  delChoose(index) {
    let a = this.state.chooseSPF
    let arr = _.cloneDeep(a)
    if (arr[index]) {
      arr[index] = ''
    }
    this.setState({
      chooseSPF: _.cloneDeep(arr)
    })
    this.doCompute(arr);

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
      Toast.info('至少选择2场比赛', 1, null, false)
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
            if (utils.isSell('PlayType_JCZQ_RQSPF', row[i].isale) &&
              utils.isSell('PlayType_JCZQ_SPF', row[i].isale) &&
              Math.abs(row[i].close) === 1) {
              realRow.push(row[i])
            }
          }
          let rLength = realRow.length;
          if (realRow && rLength > 0 && !_this.renderOk) {
            _this.realSPF = this.realSPF.concat(realRow)
          }
          arr.push(
            <div key={`jczq_2x1_date_${index}`}>
              {rLength > 0 &&
              <div onClick={_this.props.toggleList.bind(this)} data-id={index} data-type="2x1"
                   className="dateDiv down">{addesc + ' ' + rLength + '场比赛'}</div>
              }
              <div id={`jczq_2x1_list_${index}`}>
                {
                  (realRow && rLength > 0) &&
                  realRow.map((it, ind) => {
                    i += 1;
                    let num = '';
                    (function (e) {
                      num = e;
                    }(i))
                    let close = it.close;
                    let tco = it.tco.split(',');
                    return (
                      <div className="bettingBoxWrap" key={`jczq_2x1_${it.itemid}`}>
                        <div className="shengPingBox clearfix">
                          <div className="bettingLabel">
                            {
                              it.hot === 'yes' ? <label className="label_2"><span>热</span></label> : ''
                            }
                          </div>
                          <div className="bettingBox_fl" onClick={() => this.props.toggle(it.itemid, '2x1')}>
                            <p>{it.mname}</p><p>{it.name}</p><p>{`${moment(it.et).format('HH:mm')}截止`}</p>
                            <p className="arrow " id={`2x1_arrow_${it.itemid}`}/>
                          </div>
                          <div className="bettingBox_fr">
                            <table cellSpacing="0" cellPadding="0">
                              <tbody>
                              <tr>
                                {/*redBg 背景为红色*/}
                                <td
                                  className={"td1 border_lr2 " + (((close === '1' && _this.state.chooseSPF[num] && _this.state.chooseSPF[num][1][0] === '3')
                                    || (close === '-1' && _this.state.chooseSPF[num] && _this.state.chooseSPF[num][0][0] === '3') )
                                    ? 'redBg' : '')}
                                  onClick={
                                    () => {
                                      _this.clickSPF(num, '3', close)
                                    }}
                                ><p className="p1">{it.hn}</p>
                                  <p className="p2">{`${_this.assist[close][0]}${tco[0]}`}</p>
                                </td>
                                <td
                                  className={"td1 " + (((close === '1' && _this.state.chooseSPF[num] && _this.state.chooseSPF[num][0][2] === '0')
                                    || (close === '-1' && _this.state.chooseSPF[num] && _this.state.chooseSPF[num][1][2] === '0') )
                                    ? 'redBg' : '')}
                                  onClick={() => {
                                    _this.clickSPF(num, '0', close)
                                  }}
                                >
                                  <p className="p1">{it.gn}</p>
                                  <p className="p2">{`${_this.assist[close][1]}${tco[1]}`}</p>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <CommonJF item={it} type="2x1"/>
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
                        let close = item.close;
                        let tco = item.tco.split(',');
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
                                    className={"td1 border_lr2 " + (((close === '1' && _this.state.chooseSPF[index] && _this.state.chooseSPF[index][1][0] === '3')
                                      || (close === '-1' && _this.state.chooseSPF[index] && _this.state.chooseSPF[index][0][0] === '3') )
                                      ? 'redBg' : '')}
                                    onClick={
                                      () => {
                                        _this.clickSPF(index, '3', close, 'fromPop')
                                      }}
                                  >
                                    <p className="p1">{item.hn}</p>
                                    <p className="p2">{`${_this.assist[close][0]}${tco[0]}`}</p>
                                  </td>

                                  <td
                                    className={"td1 " + (((close === '1' && _this.state.chooseSPF[index] && _this.state.chooseSPF[index][0][2] === '0')
                                      || (close === '-1' && _this.state.chooseSPF[index] && _this.state.chooseSPF[index][1][2] === '0') )
                                      ? 'redBg' : '')}
                                    onClick={
                                      () => {
                                        _this.clickSPF(index, '0', close, 'fromPop')
                                      }}
                                  >
                                    <p className="p1">{item.gn}</p>
                                    <p className="p2">{`${_this.assist[close][1]}${tco[1]}`}</p>
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
              <div className="listDivView" id="zq2x1div" style={{height: this.props.listHeight}}>
                {this.Template()}
              </div>
              <ComFirstFoot doClear={this.doClear}
                            chooseLength={this.state.chooseLength}
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
                        <span>{utils.getCGDesc(this.state.realCG)}</span>
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
              />
              }
            </div>
        }
      </div>
    )
  }
}
