import React, {Component} from 'react'
import utils from '../../../common/utils'
import moment from 'moment'
import _ from 'lodash'
import {lotteryControl} from '../../../Stubs/API'
import {NavBar, Toast} from 'antd-mobile'
import {hashHistory} from 'react-router'
import betConfig from '../../../config/betConfig'
import UserProtocol from './userProtocol'
import '../../../Style/lotteryBetting/programContent.less'

/* 胜平负列表组件 */
export default class SFR9 extends Component {
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
      /*bonus: {
        min: '',
        max: ''
      },*/
    }
    this.renderOk = false;
    this.type = '';
    this.maxC = 14;
    this.realSPF = [];  //符合投注条件的列表数组[{}...]
    this.chooseInfo = []; //选中的比赛信息数组[{},{},{}]，在第二步点击胜平负同样影响
    this.chooseArr = [];  //选中场次每场选几个数组[2,1,1]，在第二步点击胜平负同样影响
    this.chooseIndex = [];  //第一步选中场次的下标[2,5,8],在第二步只有点击删除或清空能影响
    this.Template = this.Template.bind(this)
    this.clickSPF = this.clickSPF.bind(this)
    this.doClear = this.doClear.bind(this)
    this.checkShow = this.checkShow.bind(this)
    this.chooseTemplate = this.chooseTemplate.bind(this)
    this.doNext = this.doNext.bind(this)
    this.setBeiNum = this.setBeiNum.bind(this)
    this.getSpArr = this.getSpArr.bind(this)
    this.reCompute = this.reCompute.bind(this)
    this.prepareForPay = this.prepareForPay.bind(this)
  }


  componentWillMount() {
    let type = this.props.type;
    this.type = type;
    let gid = ''
    if (type === 'sfc') {
      this.maxC = 14;
      this.setState({
        realCG: [14]
      })
      gid = betConfig.sfc.gid
    } else if (type === 'r9') {
      this.maxC = 9;
      this.setState({
        realCG: [9]
      })
      gid = betConfig.r9.gid
    }
    lotteryControl(gid).then(result => {
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
    }, () => {
      if (goTop) {
        this.checkShow(true)
      }
      this.reCompute()
    })
  }

  // 控制弹框显示与否
  checkShow(flag) {
    this.setState({
      popShow: !this.state.popShow
    }, () => {
      if (flag) {
        document.getElementById('sfcr9div').scrollTop = 0
      }
    })
  }


//点击下一步
  doNext() {
    if (this.type === 'sfc') {
      if (this.state.chooseLength !== 14) {
        Toast.info('至少选择14场比赛', 1, null, false)
        return;
      }
    } else if (this.type === 'r9') {
      if (this.state.chooseLength < 9) {
        Toast.info('至少选择9场比赛', 1, null, false)
        return;
      }
    }
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

  //点击立即预约
  prepareForPay() {
    if (this.type === 'sfc') {
      if (this.state.chooseLength !== 14) {
        Toast.info('至少选择14场比赛', 1, null, false)
        return;
      }
    } else if (this.type === 'r9') {
      if (this.state.chooseLength < 9) {
        Toast.info('至少选择9场比赛', 1, null, false)
        return;
      }
    }
    let params = {
      betNum: this.state.betNum,
      realCG: this.state.realCG,
      chooseInfo: this.chooseInfo,
      chooseLength: this.state.chooseLength,
      // bonus: this.state.bonus,
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
    let flag = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      if (utils.checkIsArr(arr[i])) {
        let istr = arr[i].join('')
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

    console.log('选择比赛场次：', this.chooseArr.length)
    this.setState({
      chooseLength: this.chooseArr.length,
    }, () => {
      this.reCompute()
    })

  }

  /**
   * 计算注数和奖金
   *
   */
  reCompute() {
    // let spArr = this.getSpArr(this.chooseInfo);
    let zhushu = 0;
    _.each(this.state.realCG, (item, index) => {
      zhushu += utils.math.N1(this.chooseArr, item)
    })
    this.setState({
      betNum: zhushu,
      // bonus: utils.Count.prix(spArr, this.state.realCG),
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
        console.log(111, item)
        let tempSp = [item.oh, item.od, item.oa]
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


  // 渲染对阵信息
  Template() {
    let _this = this
    let arr = [];
    if (this.props.dataList && this.props.dataList.length > 0) {
      arr.push(
        <div key="jczq_sfc_list">
          <div
            className="dateDiv noPic">{moment(this.props.et).format('MM-DD HH:mm') + '截止 ' + this.props.pid + '期'}</div>
          {this.props.dataList.map((it, ind) => {
            if (!_this.renderOk) {
              _this.realSPF.push(it);
            }
            return (
              <div className="bettingBoxWrap" key={`jczq_sfc_${it.xid}`}>
                <div className="shengPingBox clearfix">
                  <div className="bettingBox_fl" onClick={() => this.props.toggle(it.xid, 'sfc')}>
                    <p>{it.xid + ' ' + it.mname}</p>
                    <p>{moment(it.mtime).format('MM-DD')}</p>
                    <p>{`${moment(it.mtime).format('HH:mm')}截止`}</p>
                    <p className="arrow " id={`sfc_arrow_${it.xid}`}/>
                  </div>
                  <div className="bettingBox_fr">
                    <table cellSpacing="0" cellPadding="0">
                      <tbody>
                      <tr>
                        {/*redBg 背景为红色*/}
                        <td
                          className={"td1 " + ((_this.state.chooseSPF[ind] && _this.state.chooseSPF[ind][0] === '3') ? 'redBg' : '')}
                          onClick={
                            () => {
                              _this.clickSPF(ind, '3')
                            }}
                        ><p className="p1">{it.hn}</p>
                          <p className="p2">{`主胜${it.oh}`}</p>
                        </td>
                        <td
                          className={"td2 border_lr " + ((_this.state.chooseSPF[ind] && _this.state.chooseSPF[ind][1] === '1') ? 'redBg' : '')}
                          onClick={() => {
                            _this.clickSPF(ind, '1')
                          }}
                        >
                          <p className="p1">VS</p>
                          <p className="p2">{`平${it.od}`}</p>
                        </td>
                        <td
                          className={"td1 " + ((_this.state.chooseSPF[ind] && _this.state.chooseSPF[ind][2] === '0') ? 'redBg' : '')}
                          onClick={() => {
                            _this.clickSPF(ind, '0')
                          }}
                        >
                          <p className="p1">{it.gn}</p>
                          <p className="p2">{`客胜${it.oa}`}</p>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className='bettingBoxDown lqBoxDown' id={`sfc_${it.xid}`}>
                  <table cellSpacing="0" cellPadding="0">
                    <tbody>
                    <tr>
                      <td className="td1 lqTd1">平均赔率</td>
                      <td colSpan="4" className="td2 lqTd2">
                        <div className='fontS24 div2'>{it.oh}</div>
                        <div className='fontS24 div2'>{it.od}</div>
                        <div className='fontS24 div2'>{it.oa}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="td1 lqTd1">联赛排名</td>
                      <td colSpan="4" className="td2 lqTd2">
                        <div className='fontS24'>{it.hm}</div>
                        <div className='fontS24'>{it.gm}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="td1 lqTd1">近期战绩</td>
                      <td colSpan="4" className="td2 lqTd2">
                        <div>
                          {utils.getSpf(it.htn)[0] !== '0' &&
                          <span className="colorRed">{`${utils.getSpf(it.htn)[0]}胜`}</span>
                          }
                          {
                            utils.getSpf(it.htn)[1] !== '0' &&
                            <span className="colorBlue">{`${utils.getSpf(it.htn)[1]}平`}</span>
                          }
                          {
                            utils.getSpf(it.htn)[2] !== '0' &&
                            <span className="colorGreen">{`${utils.getSpf(it.htn)[2]}负`}</span>
                          }

                        </div>
                        <div>
                          {
                            utils.getSpf(it.gtn)[0] !== '0' &&
                            <span className="colorRed">{`${utils.getSpf(it.gtn)[0]}胜`}</span>
                          }
                          {
                            utils.getSpf(it.gtn)[1] !== '0' &&
                            <span className="colorBlue">{`${utils.getSpf(it.gtn)[1]}平`}</span>
                          }
                          {
                            utils.getSpf(it.gtn)[2] !== '0' &&
                            <span className="colorGreen">{`${utils.getSpf(it.gtn)[2]}负`}</span>
                          }
                        </div>
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
      )
      _this.renderOk = true;
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
                onLeftClick={this.checkShow}
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
                        let spf = [item.oh, item.od, item.oa];
                        return (
                          <div className="clearfix programBox" key={`choose_data_${index}`}>
                            <div className="programBox_fr sfc_fr">
                              <table cellSpacing="0" cellPadding="0" style={{margin: '0 auto'}}>
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
                  <UserProtocol
                    link={this.type === 'sfc' ? "/sfcBet/linkPage" : "/r9Bet/linkPage"}
                    doClear={this.doClear}
                    read={this.props.read}
                    receiveRead={this.props.receiveRead}/>
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
              <div id="sfcr9div" className="listDivView" style={{height: this.props.listHeight}}>
                {this.Template()}
              </div>
              <footer className="bettingFooter" id="spfFoot">
                <div className="clearfix bettingFooterInfo">
                  <div className="emptyClear" onClick={() => this.doClear()}/>
                  {
                    <div className="footerInfo">
                      {this.state.chooseLength === 0 &&
                      <p className="p1">至少选择<span>{this.maxC}</span>场比赛</p>
                      }
                      {this.state.chooseLength > 0 && this.state.chooseLength < this.maxC &&
                      <p className="p1">
                        已选<span>{this.state.chooseLength}</span>场,至少再选择<span>{this.maxC - this.state.chooseLength}</span>场
                      </p>
                      }
                      {this.state.chooseLength >= this.maxC &&
                      <p className="p1"><span>{this.state.betNum}</span>注 合计
                        <span>{this.state.betNum * this.state.beiNum * 2}</span>元
                      </p>
                      }
                      <p className="p2">开奖结果不包含加时赛和点球大战</p>
                    </div>
                  }

                </div>
                <a className="nextBtn" onClick={this.doNext}>下一步</a>
              </footer>
            </div>
            :
            <div className="programContent">
              {this.chooseTemplate()}
              <footer className="programFooter">
                <div className="programFooter1">
                  <div className="clearfix">
                    <div className="inputBox inputCen" style={{textAlign: 'center'}}>投
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
                    <p className="p1">合计<span>{this.state.betNum * this.state.beiNum * 2}</span>元</p>
                    <p className="p2">共{this.state.betNum}注</p>
                  </div>
                  <a className="nextBtn" onClick={this.prepareForPay}>立即预约</a>
                </div>
              </footer>
            </div>
        }
      </div>
    )
  }
}

