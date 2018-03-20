import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import _ from 'lodash'
import moment from 'moment'
import {preparePay, jcast, yczsCast, pcast, zcast,rechargeRoute} from '../../Stubs/API'
import {PlanNumber} from '../../common/LotType'
import utils from '../../common/utils'
import OrderChild from './orderChild'
import {Popup, Toast} from 'antd-mobile'
import commonConfig from '../../config/commonConfig'
import UseRed from './useRed'
import RedExplain from '../RedPackage/RedExplain'
import RechargeCommon from '../Recharge/RechargeCommon'
import lotteryInfo from '../../config/lotteryInfo'
import '../../Style/lotteryBetting/order.less'


/* 预约 */
class Order extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      data: {},
      gid: '',
      hasRed: false,
      redList: [],
      imoney: '', //订单金额
      usermoney: '',  //用户余额
      canUseRed: [],  //可用红包数组
      noCanUse: [],    //不可用红包数组
      noCanUseRed: false, //暂无可用标记
      useRedMoney: 0,  //使用红包金额
      useMoney: '',   // 余额扣除金额
      needRecharge: 0,// 需要充值金额
      showType: '1',  //弹框显示
      chooseRed: {},    //选中当前红包
      szc: false,   //是否调用数字彩接口购买
      buying: false,
      hasArrow: false,
      szcShow: false,
      rederOk: false
    }
    this.childBack = this.childBack.bind(this)
    this.clickRed = this.clickRed.bind(this)
    this.doBuy = this.doBuy.bind(this)
    this.doRecharge = this.doRecharge.bind(this)
    this.getLotteryDesc = this.getLotteryDesc.bind(this)
    this.getDesc = this.getDesc.bind(this)
    this.goInfo = this.goInfo.bind(this)
  }

  componentWillUnmount() {
    Popup.hide()
  }
  async componentWillMount() {
    let state = this.props.location.state;
    console.log(123, state)
    if (state && state.params) {
      let obj = state.params;
      let params = {
        trade_isource: localStorage.getItem('agent') || '3002', //投注时渠道
        trade_imoney: obj.imoney,  //投注金额
        trade_gameid: obj.gid, //彩种编号
      }
      this.setState({
        data: state.params,
        gid: state.params.gid,
        szc: state.params.szc || false
      })
      if (lotteryInfo.szc.indexOf(state.params.gid) >= 0 || lotteryInfo.kpc.indexOf(state.params.gid) >= 0) {
        this.setState({
          hasArrow: true
        })
      }
      await preparePay(params).then(result => {
        if (result) {
          this.setState({
            imoney: +obj.imoney,
            usermoney: +result.usermoney.usermoney,
            rederOk: true
          })
          if (result.redpackets && result.redpackets.redpacket) {
            let row = result.redpackets.redpacket;
            if (_.isArray(row)) {
              this.setState({
                hasRed: true,
                redList: row,
              })
            } else {
              this.setState({
                hasRed: true,
                redList: [row],
              })
            }
          } else {
            this.setState({
              hasRed: false
            })
          }
        } else {
          //todo 接口失败
        }
      })
      let canUseRed = [];
      let noCanUse = [];
      let tempArr = this.state.redList;
      let userMoney = this.state.usermoney;
      let imoney = this.state.imoney;
      if (tempArr.length > 0) {
        //红包数组排序，先根据时间升序，再根据余额降序
        tempArr = tempArr.sort(function (obj1, obj2) {
          let date1 = moment(obj1.cddate).valueOf()
          let date2 = moment(obj2.cddate).valueOf()
          let irmoney1 = obj1.irmoney
          let irmoney2 = obj2.irmoney
          if (date1 === date2) {
            return irmoney2 - irmoney1  //余额降序
          } else {
            return date1 - date2  //时间升序
          }
        })
        _.map(tempArr, (item) => {
          if (item.scale.indexOf('/') !== -1) {
            let arr = item.scale.split('/')
            if (parseInt(arr[1]) <= imoney) {
              canUseRed.push(item)
            } else {
              noCanUse.push(item)
            }
          } else {
            canUseRed.push(item)
          }

        })
        this.setState({
          canUseRed: canUseRed,
          noCanUse: noCanUse
        })
        if (canUseRed.length > 0) {
          let params = this.props.location.state.params || {}
          let buyQi = params.buyQi || '1'
          let useRed = canUseRed[0]
          let useRedMoney = 0
          if (buyQi == '1') {
            console.log(this.props.location.state)
            if (useRed.scale.indexOf('/') !== -1) {
              let rate = useRed.scale.split('/')
              useRedMoney = parseInt(imoney / rate[1]) * rate[0] > +useRed.irmoney ? parseInt(useRed.irmoney) : parseInt(imoney / rate[1]) * rate[0]
            } else {
              useRedMoney = imoney > +useRed.irmoney ? +useRed.irmoney : imoney
            }
          }
          this.setState({
            chooseRed: useRed,
            useMoney: imoney >= userMoney + useRedMoney ? userMoney : imoney - useRedMoney,
            needRecharge: userMoney + useRedMoney >= imoney ? 0 : imoney - useRedMoney - userMoney,
            useRedMoney: useRedMoney,
          })
        } else {
          this.setState({
            useMoney: imoney >= userMoney ? userMoney : imoney,
            needRecharge: imoney > userMoney ? (imoney - userMoney) : 0,
            noCanUseRed: true
          })
        }
      } else {
        this.setState({
          useMoney: imoney >= userMoney ? userMoney : imoney,
          needRecharge: imoney > userMoney ? (imoney - userMoney) : 0
        })
      }
    } else {
      hashHistory.goBack()
    }
  }

  getDesc(CG, gid) {
    let str = ''
    if (gid === '80' || gid === '81') {
      return str
    } else {
      if (CG) {
        _.each(CG, item => {
          if (item === 1) {
            str += '单关,'
          } else {
            str += item + '串1,'
          }
        })
      }
      return str.substr(0, str.length - 1)
    }
  }

  // 去充值
  doRecharge() {
    let hash = window.location.hash
    let payMoney = Math.ceil(this.state.needRecharge)
      rechargeRoute(payMoney).then(res=>{
        if(res.code==='0'){
          let rechargeWay = res.rechargeWay
          Popup.show(
            <RechargeCommon payMoney={payMoney} rechargeWay = {rechargeWay} type="1" hash={hash}/>,
            {
              animationType: 'slide-up',
              maskClosable: false,
            }
          )
        }else{
          utils.wxMessage('',res.desc)
        }
      })
  }

  getLotteryDesc(gid) {
    let desc = lotteryInfo.lot(gid, 3)
    if (gid === '80' || gid === '81') {
      desc += ' ' + this.state.data.pid + '期'
    }
    return desc
  }

  // 确认预约
  doBuy() {
    this.setState({
      buying: true
    })
    let data = this.state.data
    console.log(data.bonus)
    let params = {}
    if (this.state.data.yczs) {
      params = {
        lotid: data.gid,
        beishu: '1',
        ishm: '0',
        title: '',
        content: '',
        amoney: data.imoney,
        allnum: '1',
        buynum: '1',
        baodinum: '0',
        isshow: '0',
        tcbili: '0',
        comeFrom: '',
        extendtype: '15',
        codes: data.codes,
        newcodes: data.newcodes,
        source: localStorage.getItem('agent') || '3002',
        items: data.items,
        yhfs: '0',
        zxcodes: data.zxcodes,
        ppcodes: data.ppcodes,
        cupacketid: this.state.chooseRed.cptid || '',
        redpacket_money: this.state.useRedMoney === 0 ? '' : this.state.useRedMoney,
      }
      yczsCast(params).then(result => {
        if (result && result.code === '0') {
          let gid = data.gid;
          let hid = result.result.projid
          this.goInfo(gid, hid)
        } else {
          this.setState({
            buying: false
          })
          Toast.info(result.desc, 1, null, false)
        }
      })
    } else if (!this.state.data.szc) {
      params = {
        gid: data.gid,
        pid: data.pid || '',
        play: '1',
        codes: data.codes,
        muli: data.beiNum,
        fflag: '0',
        type: '0',
        name: '自购',
        desc: '自购',
        money: data.imoney,
        tnum: '1',
        bnum: '1',
        pnum: '0',
        oflag: '0',
        wrate: '0',
        source: localStorage.getItem('agent') || '3002',
        appversion: commonConfig.appversion,
        cupacketid: this.state.chooseRed.cptid || '',
        redpacket_money: this.state.useRedMoney === 0 ? '' : this.state.useRedMoney,
        imoneyrange: (+data.bonus.max * data.beiNum).toFixed(2),
        iminrange: (+data.bonus.min * data.beiNum).toFixed(2)
      }
      jcast(params).then(result => {
        if (result && result.code === '0') {
          let gid = data.gid;
          let hid = result.result.projid
          this.goInfo(gid, hid)
        } else {
          this.setState({
            buying: false
          })
          Toast.info(result.desc, 1, null, false)
        }
      })
    } else {
      //数字彩
      let buyQi = data.buyQi
      if (buyQi && buyQi > 1) {
        params = {
          gid: data.gid,
          pid: data.pid,
          codes: data.codes,
          mulitys: data.mulitys,
          zflag: data.stopZh,
          money: data.imoney,
          ischase: '1',
          source: localStorage.getItem('agent') || '3002',
          appversion: commonConfig.appversion,
          cupacketid: this.state.chooseRed.cptid || '',
          redpacket_money: this.state.useRedMoney === 0 ? '' : this.state.useRedMoney,
        }
        zcast(params).then(result => {
          if (result && result.code === '0') {
            console.log('===', result)
            let gid = data.gid;
            let hid = result.zhuihao.id
            this.goInfo(gid, hid, 'zh')
          } else {
            this.setState({
              buying: false
            })
            Toast.info(result.desc, 1, null, false)
          }
        })
      } else {
        params = {
          gid: data.gid,
          pid: data.pid,
          play: '1',
          codes: data.codes,
          muli: data.beiNum,
          fflag: '0',
          type: '0',
          name: '自购',
          desc: '自购',
          money: data.imoney,
          tnum: '1',
          bnum: '1',
          pnum: '0',
          oflag: '0',
          wrate: '0',
          source: localStorage.getItem('agent') || '3002',
          appversion: commonConfig.appversion,
          cupacketid: this.state.chooseRed.cptid || '',
          redpacket_money: this.state.useRedMoney === 0 ? '' : this.state.useRedMoney,
          imoneyrange: '',
          iminrange: ''
        }
        pcast(params).then(result => {
          if (result && result.code === '0') {
            let gid = data.gid;
            let hid = result.result.projid
            this.goInfo(gid, hid)
          } else {
            this.setState({
              buying: false
            })
            Toast.info(result.desc, 1, null, false)
          }
        })
      }

    }
  }

  goInfo(gid, hid, type) {
    if (type !== 'zh') {
      Toast.info('预约成功', 0.67, () => {
        // 由于数据入库的延时问题，所以在此延时500毫秒
        // 可去除延时器、修改延时器延时时间
        setTimeout(() => {
          hashHistory.push({
            pathname: PlanNumber[gid][3],
            query: {
              gid: gid,
              hid: hid
            }
          })
        }, 500)
      }, false)
    } else {
      Toast.info('预约成功', 0.67, () => {
        // 问题同上
        setTimeout(() => {
          hashHistory.push({
            pathname: '/plandetail/zhxq',
            query: {
              gid: gid,
              tid: hid
            }
          })
        }, 500)
      }, false)
    }
  }

  //子组件点击返回隐藏自己
  childBack(type) {
    this.setState({
      showType: type
    })
  }

  clickRed(red) {
    let imoney = this.state.imoney;
    let userMoney = this.state.usermoney;
    let useRedMoney = 0
    if (red && red.scale) {
      let rate = red.scale.split('/')
      useRedMoney = parseInt(imoney / rate[1]) * rate[0] > red.irmoney ? parseInt(red.irmoney) : parseInt(imoney / rate[1]) * rate[0]
    }
    this.setState({
      chooseRed: red,
      useMoney: imoney >= userMoney + useRedMoney ? userMoney : imoney - useRedMoney,
      needRecharge: userMoney + useRedMoney >= imoney ? 0 : imoney - useRedMoney - userMoney,
      useRedMoney: useRedMoney,
    })
  }

  render() {
    let buyQi = this.state.data.buyQi || '1'
    return (
      <div style={{height: '100%'}}>
        <div className="appointmentBox" style={{display: this.state.showType === '1' ? '' : 'none'}}>
          <CommonNavBar title="预约"/>
          {this.state.rederOk &&
          <div>
            <div
              className={this.state.hasArrow ?
                this.state.szcShow ? "appointmentInfo arrowUp"
                  : "appointmentInfo arrowDown"
                : "appointmentInfo"}
              onClick={this.state.hasArrow ? () => {
                this.setState({
                  szcShow: !this.state.szcShow
                })
              } : ''}>
              <p className="p1">{this.getLotteryDesc(this.state.gid)}</p>
              {
                !this.state.data.yczs ?
                  <p className="p2">
                    <span>{`${this.state.data.betNum}注${this.state.data.beiNum}倍`}</span>{this.getDesc(this.state.data.realCG, this.state.gid)}
                  </p>
                  :
                  <p className="p2">
                    <span>{`${this.state.data.betNum}注`}</span>{this.getDesc(this.state.data.realCG)},一场制胜
                  </p>
              }

              {this.state.hasArrow &&
              <div style={{display: this.state.szcShow ? '' : 'none'}}>
                <OrderChild list={this.state.data.chooseList} gid={this.state.gid}/>
              </div>
              }
            </div>
            <ul className="appointmentInfoUl">
              <li className="clearfix"><p className="p3">订单金额</p><p
                className={this.state.needRecharge > 0 ? "pRed noRed" : "pRed"}>{`￥${this.state.imoney}`}</p></li>
              {this.state.hasRed && buyQi == '1' &&
              < li className="clearfix" onClick={() => {
                this.setState({
                  showType: '2'
                })
              }
              }><p className="p3">红包支付</p>
                {
                  this.state.noCanUseRed ?
                    <p className="pGray">暂无可用</p>
                    :
                    this.state.useRedMoney === 0 ?
                      <p className="pGray">{`${this.state.canUseRed.length}个可用`}</p>
                      :
                      <p className="pBlack1">{`- ￥${this.state.useRedMoney}`}</p>
                }
              </li>
              }
              {this.state.usermoney > 0 &&
              <li className="clearfix">
                <p className="p4">
                <span
                  className="span1">{this.state.usermoney + this.state.useRedMoney > this.state.imoney ? '余额支付' : '可用余额'}</span>
                  {
                    this.state.usermoney + this.state.useRedMoney > this.state.imoney &&
                    <span className="span2">{`余额${this.state.usermoney}元`}</span>
                  }
                </p>
                <p className="pBlack">
                  - ￥{this.state.useMoney}</p>
              </li>
              }
              {this.state.usermoney > 0 && this.state.needRecharge !== 0 &&
              <li className="clearfix">
                <p className="p3">差额</p>
                <p className="pRed">{`￥${this.state.needRecharge.toFixed(2)}`}</p>
              </li>
              }
            </ul>
            <div className="btnBox">
              {
                this.state.needRecharge === 0 ?
                  <a onClick={this.state.buying ? '' : this.doBuy}
                     className={this.state.buying ? 'disableBtn' : ''}>确认预约</a>
                  :
                  <a onClick={this.doRecharge}>{`去支付 ￥${Math.ceil(this.state.needRecharge)}`}</a>
              }

            </div>
          </div>
          }
        </div>
        <div className="childRedBox" style={{display: this.state.showType === '2' ? '' : 'none'}}>
          <UseRed childBack={this.childBack}
                  clickRed={this.clickRed}
                  chooseRed={this.state.chooseRed}
                  canUseRed={this.state.canUseRed}
                  noCanUse={this.state.noCanUse}
                  imoney={this.state.imoney}/>
        </div>
        <div style={{display: this.state.showType === '3' ? '' : 'none'}}>
          <RedExplain childBack={this.childBack} type={'pop'}/>
        </div>
      </div>
    )

  }
}

export default Order

