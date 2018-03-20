'use strict'
import React, {Component} from 'react'
import utils from "../../../common/fangAnUtils";
import {ZhuiHaoXq, stopZH} from '../../../Stubs/API'
import {PlanNumber} from '../../../common/LotType'
import {Toast} from 'antd-mobile'
import FootBtn from "../common/footBtn";

import '../../../Style/lotteryBetting/programmeDetails.less'

class ChildComp1 extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 追号的状态
   * i   结算标识: 0 未结算 1 正在结算 3已结算
   * itax   税后奖金
   * awardcode  开奖号码
   * reason   停止原因: 0 未完成 1  已完成  2 中奖停止 3 用户手工停止
   * **/
  IjiesuanState(item) {
    const istate = item.istate;
    const isreturn = item.isreturn;
    const itax = item.itax;
    let stateInfo = '';
    if (istate == "2") {
      stateInfo = "已投注";
    } else if (istate == "1") {
      stateInfo = "出票中";
    }
    if (itax == 0 && !(isreturn == '1') && !(isreturn == '0')) {
      stateInfo = "未中奖";
    } else if (!("2" == istate) && itax == 0) {
      stateInfo = "--";
    } else {
      if (itax > 0) {
        stateInfo = itax;
      } else {
        stateInfo = "未结算";
      }
    }
    if ("0" == istate) {
      stateInfo = "未投注";
    } else if ("3" == istate || "5" == istate) {
      stateInfo = "系统撤销";
    } else if ("4" == istate) {
      stateInfo = "用户撤销";
    }
    return stateInfo
  }

  awardCodeSplit(item) {
    let red = null;
    let blue = null;
    if (!item.awardcode) {
      red = null;
    } else if (item.awardcode.indexOf('|') > -1) {
      let code = item.awardcode.split('|');
      red = code [0].split(',');
      blue = code [1].split(',')
    } else {
      red = item.awardcode.split(',');
    }
    return {red: red, blue: blue}
  }

  render() {
    const {data, ccastdate} = this.props;
    return (
      <div>
        {
          data instanceof Array ? data.map((item, index) => {
            const Mstate = this.IjiesuanState(item);
            const {red, blue} = this.awardCodeSplit(item);
            return (
              <div key={index}>
                <ChildComp
                  item={item}
                  len={data.length}
                  red={red}
                  blue={blue}
                  index={index}
                  Mstate={Mstate}
                  ccastdate={ccastdate}
                  icmoney={item.icmoney}/>
              </div>
            )
          }) : <ChildComp
            item={data}
            len={1}
            red={this.awardCodeSplit(data).red}
            blue={this.awardCodeSplit(data).blue}
            index={0}
            Mstate={this.IjiesuanState(data)}
            ccastdate={ccastdate}
            icmoney={data.icmoney}/>
        }
      </div>
    )
  }
}

class ChildComp extends Component {
  constructor(props) {
    super(props);
    this.ccastdate = '';
  }

  render() {
    const {item, index, red, blue, Mstate, len, ccastdate, icmoney} = this.props;
    const boolCDate = Boolean(item.ccastdate);
    return (
      <div className="kaijiang_dlt_box">
        <p className="pDate">
          <span>第{item.cperiodid}期</span>
          <span className="ccastdate">{item.ccastdate || ccastdate}</span>
        </p>
        <div className="kaijiang_dlt clearfix">
          <div className="div1"><p className="p1">{len ? (`${(len - index) * icmoney}/${icmoney}`) : '--'}</p><p
            className="p2">
            累计当前</p>
          </div>
          <div className="div2">
            <p className="p1">
              {
                red && red instanceof Array ? red.map((it, i) => {
                  return (
                    <span key={i}>{it}</span>
                  )
                }) : "--"
              }
              {blue && '|'}
              {
                (blue && blue instanceof Array) && blue.map((it, i) => {
                  return (
                    <span className="blueBall" key={i}>{it}</span>
                  )
                })
              }
            </p>
            <p className="p2">开奖号</p>
          </div>
          <div className="div3">
            {
              Mstate > 0 ? <p className="p1">中奖<span className="colorRed">{Mstate}</span>元</p> :
                <p className="p1">
                  {Mstate || '未投注'}</p>
            }
            <p className="p2">状态</p></div>
        </div>
      </div>
    )
  }
}

class ProgrammeDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gid: 0,
      pid: '',
      pn: 1,
      tp: '',
      pn1: 1,
      tp1: '',
      flag: 44,
      data: null,
      data1: null,
      titlerow: null,
      contHeight: 0,
      cperiodid: '',
      showZHState: false,
    }
    this.StopReason = this.StopReason.bind(this);
    this.stopZH = this.stopZH.bind(this);
  }

  componentWillMount() {
    const {tid, gid} = this.props.location.query;
    this.setState({
      tid: tid,
      gid: gid
    }, () => {
      this.initialize(1, false);
    })
  }

  componentDidMount() {
    let progFootDomHeight = document.getElementsByClassName('programmeFooter')[0];
    if (progFootDomHeight && progFootDomHeight.offsetHeight !== 0 && this.state.contHeight === 0) {
      let height = utils.setHeight() - progFootDomHeight.offsetHeight;
      this.setState({
        contHeight: height
      });
    }
  }

  initialize(num, bool) {
    const {tid, gid, flag, pn, tp, data, data1} = this.state;
    if (tp && pn && pn > tp) {
      this.setState({
        hasMore: false
      })
      return false;
    }
    ZhuiHaoXq(tid, gid, flag, num).then((res) => {
      console.log(res)
      if (!bool) {
        if (flag == 44) {
          this.setState({
            titlerow: res.rows.titlerow,
            data: res.rows.row,
            yzqc: res.rows.yzqc,
            pn: res.rows.pn,
            tp: res.rows.tp
          })
        } else {
          this.setState({
            data1: res.rows.row,
            pn1: res.rows.pn,
            tp1: res.rows.tp
          })
        }
      } else {
        if (flag == 44) {
          this.setState({
            titlerow: res.rows.titlerow,
            data: data.concat(res.rows.row),
            pn1: res.rows.pn,
            tp: res.rows.tp
          })
        } else {
          this.setState({
            data1: data1.concat(res.rows.row),
            pn1: res.rows.pn,
            tp1: res.rows.tp
          })
        }
      }
    })
  }

  /**
   * 方案状态
   * @param r 停止原因: 0 未完成 1  已完成  2 中奖停止 3 用户手工停止
   * @returns {*}
   * @constructor
   */
  StopReason(r) {
    const reason = r;
    switch (reason) {
      case '0':
        return '进行中';
        break;
      case '1':
        return '已完成';
        break;
      case '2':
        return '中奖停止';
        break;
      case '3':
        return '用户手工停止';
        bresk;
    }
  }

  //停止追号
  stopZH() {
    let {gid, tid} = this.state
    utils.showAlert('停止追号', '若停止追号，剩余追号计划中的内容将会停止。', '确定', () => {
      stopZH(gid, tid).then(res => {
        if (res.code === '0') {
          let {titlerow} = this.state
          titlerow.reason = '3'
          this.setState({
            titlerow:titlerow
          })
        } else {
          Toast.info(res.desc, 1, null, false)
        }
      })
    })
  }

  render() {
    const {
      contHeight, gid, tid, data, showZHState, total, yzqc, flag, data1, titlerow, pn,
      tp,
      pn1,
      tp1,
    } = this.state;
    console.log(111, titlerow, data1)
    const IconUrl = PlanNumber[gid][4];
    const LotDesc = PlanNumber[gid][2];
    const ccastdate = titlerow && titlerow.ccastdate.substring(5);
    const pnums = titlerow && titlerow.pnums;
    const reason = titlerow && this.StopReason(titlerow.reason);
    const imulity = titlerow && titlerow.imulity;
    let result = titlerow && utils.showCode(gid, titlerow.ccodes);
    let codes = result && result.html;
    let codeArr = codes;
    return (
      <div>
        <div className="programmeDetails_dlt" style={{height: contHeight, overflow: 'auto'}}>
          <div className="programHead">
            <div className="clearfix programHeadCont">
              <div className="programHeadCont_1">
                <img src={IconUrl}/>
              </div>
              <div className="programHeadCont_2">
                <p className="p1">{LotDesc}</p>
                <p className="p2">{ccastdate || '----'}</p>
              </div>
            </div>
          </div>
          {/*金额*/}
          <table cellSpacing="0" cellPadding="0" className="moneyTable">
            <tbody>
            <tr>
              <td className="td1">追号期数</td>
              <td className="td2">共{pnums}期／已追{data && yzqc || 0}期
                ({titlerow && titlerow.izhflag == "1" ? `中奖后停止` : `中奖后不停止`})
              </td>
            </tr>
            <tr>
              <td className="td1">方案状态</td>
              <td className="td2">
                {reason || '--'}
                {titlerow && titlerow.reason === '0' && titlerow.zhtype === '0' && yzqc < pnums &&
                <span className="stopZh" onClick={() => this.stopZH()}>停止追号</span>
                }
              </td>
            </tr>
            </tbody>
          </table>
          {/*方案内容*/}
          <div className="titleDiv">方案内容{/*<a href="javascript:;" className="bonusAgainstA">奖金对照</a>*/}</div>
          {/**/}
          <table cellSpacing="0" cellPadding="0" className="shuZiCaiTable">
            <tbody>
            {
              codeArr && codeArr.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="td1">{item.wf}-{item.zhushu}注</td>
                    <td className="td2">
                      {
                        item.red.map((it, inde) => {
                          return (
                            <span key={inde}>{it}</span>
                          )
                        })
                      }
                      {
                        item.blue && item.blue.map((it, inde) => {
                          return (
                            <span key={inde}>{it}</span>
                          )
                        })
                      }
                    </td>
                  </tr>
                )
              })
            }
            <tr>
              <td colSpan={2} className="td3">投注倍数：{imulity || '--'}倍</td>
            </tr>
            </tbody>
          </table>
          {/*追号详情*/}
          <div className="Details_dlt">
            <div className="titleDiv">追号详情</div>
            <ul className="Details_dlt_ul clearfix">
              <li className={showZHState ? "li_1" : "li_1 active"} onClick={() => {
                if (flag != 44) {
                  this.setState({showZHState: false, flag: 44, pn: 1, tp: ''}, () => {
                  });
                }
              }}>已追号
              </li>
              <li className={!showZHState ? "li_1" : "li_1 active"} onClick={() => {
                if (flag != 45) {
                  this.setState({showZHState: true, flag: 45, pn: 1, tp: ''}, () => {
                    this.initialize(1, false);
                  })
                }
              }}>待追号
              </li>
            </ul>
            {/*数据*/}
            {
              !showZHState ? <div>
                {
                  data ? <ChildComp1 data={data} ccastdate={titlerow.ccastdate}/>
                    : <div className="emptyRedBox">
                      <p>客官，暂无数据哟~</p>
                    </div>
                }
                {tp > pn && <div className="More" onClick={() => {
                  this.initialize(Number(pn) + 1, true)
                }}>查看更多</div>}
              </div> : data1 ?
                <div>
                  {data1 instanceof Array ? data1.map((item, index) => {
                    return (
                      <div key={index}>
                        <ChildComp
                          item={item}
                        />
                      </div>
                    )
                  }) : <ChildComp
                    item={data1}/>}
                  {tp1 > pn1 && <div className="More" onClick={() => {
                    this.initialize(Number(pn1) + 1, true)
                  }}>查看更多</div>}
                </div> :
                <div className="empty_Details_dlt"><p>暂无待追号数据</p></div>
            }
          </div>
          {/*方案编号*/}
          <div className="schemeNumber">
            <p>方案编号：{tid}</p>
          </div>
        </div>
        {/*底部按钮*/}
        <FootBtn gid={gid} hid={tid}/>
      </div>
    )
  }
}

export default ProgrammeDetails
