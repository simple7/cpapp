import React, {Component} from 'react'
import utils from '../../../common/utils'
import {connect} from 'react-redux'
import {jsbf, jcodds} from '../../../Stubs/API'
import commonConfig from '../../../config/commonConfig'
import moment from 'moment'
import {Toast} from 'antd-mobile'
import {MatchJsAction} from '../../../action/action.match'
import '../../../Style/Find/lotteryResults.css'
import Notice from "../../../Img/notice_icon.png"

 class MatchJishi extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      dataList: [],
      statge: {},
      noResult: false,
      listHeight: '',
      odds: {},
      timeShow:false
    }
    this.getDataIntv = '';
    this.getOddsIntv = '';
    this.serverTime = '';
    this.computeTime = this.computeTime.bind(this);
    this.switchType = this.switchType.bind(this);
    this.getJsbfData = this.getJsbfData.bind(this);
    this.getJcodds = this.getJcodds.bind(this);
    this.getOdds = this.getOdds.bind(this);
  }

  componentWillMount() {
    let matchList = this.props.MatchList
    let type='first'
    if(matchList.dataList.length >0){
      type = 'notFirst'
      this.setState({
        dataList:matchList.dataList,
        statge:matchList.statge,
        odds:matchList.odds
      })
    }
    this.getJsbfData(type);
  }

  componentWillUnmount() {
    clearInterval(this.getDataIntv)
  }

  getJsbfData(type) {
    let _this = this;
    let cid = Math.random()
    if (type === 'first') {
      Toast.loading('正在加载...', 0, null);
    }
    jsbf(cid, 'noLoad').then(result => {
      if (result.code === '0' && result.rows) {
        let rows = result.rows;
        let statge = result.statge;
        if (!utils.checkIsArr(rows)) {
          rows = [rows]
        }
        this.serverTime = result.serverTime
        this.setState({
          dataList: rows,
          statge: statge,
          noResult: false,
          timeShow:true
        },()=>{
          _this.getJcodds(cid, type)
        })
      } else {
        this.setState({
          noResult: true
        })
      }
    })
  }

  // 获取赔率 明明可以放在同一个接口里非得用两个。。。。 还得去循环一遍 碰到一个接口能请求到 另一个报错的时候，。蛋疼
  getJcodds(cid,type) {
    let _this = this;
    console.log('获取赔率')
    jcodds(cid, 'noLoad').then(result => {
      if(type==='first'){
        Toast.hide()
      }
      if (result && result.row) {
        let odds = {}
        let row = result.row;
        if (utils.checkIsArr(row)) {
          for (let i in row) {
            odds[row[i]['rid']] = row[i]['spf']
          }
        } else {
          odds[row.rid] = row.spf
        }
        this.setState({
          odds: odds
        },()=>{
          this.props.dispatch(MatchJsAction({
            dataList:this.state.dataList,
            statge: this.state.statge,
            odds:this.state.odds
          }))
        })
      } else {
        /*this.setState({
          noResult: true
        })*/
      }
    })
  }

  getOdds(odds) {
    if (odds) {
      let odd = odds.split(',')
      let oddLen = odd.join('').length;
      if(oddLen !==0){
        return `${odd[0] || '-'}/${odd[1] || '-'}/${odd[2] || '-'}`
      }else{
        return ''
      }
    } else {
      return ''
    }
  }

  componentDidMount() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    let tabHeight = document.getElementsByClassName('am-tab-bar-bar')[0];
    let tabBarHeight = document.getElementsByClassName('am-tabs-bar')[0];
    if (tabBarHeight && tabBarHeight.offsetHeight !== 0 && this.state.listHeight === '') {
      let listHeight = w - tabHeight.offsetHeight - tabBarHeight.offsetHeight
      this.setState({
        listHeight: listHeight
      })
    }
    let _this = this;
    this.getDataIntv = setInterval(() => {
      _this.getJsbfData('intval', 'noLoad')
    }, 30000)
  }


  computeTime(htime, type) {
    let s = this.serverTime;
    let sDate = moment(s).utcOffset(8).format('YYYY-MM-DD HH:mm:ssZ')
    let serverTime = sDate.substring(sDate.length-6,0);
   /* sDate = new Date(sDate)
    let year = sDate.getFullYear();
    let date = sDate.getDate();
    let month = sDate.getMonth() + 1;
    let r = /(\s)*[\S]*!/g;
    let time = s.match(r)
    time = time[2].substring(1);
    let time = moment(sDate).format('HH:mm:ss')
    let serverTime = year + '-' + ('0'+month).substr(-2) + '-' + ('0'+date).substr(-2) + ' ' + time
    */
    let gap;
    if (htime) {
      gap = moment(serverTime) - moment(htime)||0
    }
    switch (type) {
      case '1':
        return parseInt(gap / (1000 * 60)) > 45 ? '45+′' : parseInt(gap / (1000 * 60)) + '′'
        break;
      case '2':
        return '中场休息'
        break;
      case '3':
        return parseInt(gap / (1000 * 60)) > 45 ? '90+′' : parseInt(gap / (1000 * 60)) + 45 + '′'
        break;
      default:
        return '';
        break;
    }

  }

  /**
   *  判断比赛状态
   *  0：未开赛 1：开赛 2：完赛 3：异常状态
   *
   */
  switchType(type) {
    let value = 0;
    if (type === '17') {
      value = 0;
    } else if (['1', '2', '3'].indexOf(type) !== -1) {
      value = 1;
    } else if (type === '4') {
      value = 2;
    } else {
      value = 3
    }
    return value
  }


  render() {
    let _this = this
    return (
      <div id="jsbf">
        {!this.state.noResult ?
          <div className="listDivView" style={{height: this.state.listHeight + 'px'}}>
            {_this.state.dataList.map((item, index) => {
              let row = item.row;
              if (!utils.checkIsArr(row)) {
                row = [row]
              }
              return (
                <div key={`jcbf_${index}`}>
                  <div className="lanqiuTime">{item.desc}</div>
                  {row.map((it, ind) => {
                    return (
                      <div className="lanqiuBox"
                           onClick={() => {
                             location.href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${it.roundItemId}&type=${it.type}&rid=${it.rid}&qc=${it.qc}`
                           }}
                           key={`jcbfc_${ind}`}>
                        <div className="box2">
                          <p className="p13">{`${it.jn} ${it.ln}`}
                            <span className="span12">{_this.getOdds(_this.state.odds[it.rid])}</span></p>
                          <p className="p19">
                            {(it.htime || it.type === '2') && this.state.timeShow &&
                            <span style={{color: it.type === '2' ? '#F22F12' : ''}}>
                                {(it.type === '1' || it.type === '3') &&
                                <i></i>
                                }
                              {_this.computeTime(it.htime, it.type)}
                                </span>
                            }
                          </p>
                          <p className="p17">
                            <span className="span5">{it.hn}</span>
                            <span className="span6">
                                  <img
                                    src={`${commonConfig.mobileDomain}${_this.state.statge.logourl}team_${it.hid}.jpg`}/>
                                </span>
                            {
                              _this.switchType(it.type) === 0 &&
                              <span className="span7">{moment(it.time).format('HH:mm')}</span>
                            }
                            {
                              _this.switchType(it.type) === 1 &&
                              <span className="span7 colorRed">{`${it.hsc} - ${it.asc}`}</span>
                            }
                            {
                              _this.switchType(it.type) === 2 &&
                              <span className="span7">{`${it.hsc}-${it.asc}`}</span>
                            }
                            {
                              _this.switchType(it.type) === 3 &&
                              <span className="span7"><img src={Notice} className="noticeImg"/></span>
                            }
                            <span className="span8"><img
                              src={`${commonConfig.mobileDomain}${_this.state.statge.logourl}team_${it.gid}.jpg`}/></span>
                            <span className="span9">{it.gn}</span>
                          </p>
                          <p className="p18">
                            <span className="span5">{it.homeRank}</span>
                            <span className="span6"></span>
                            <span className="span7"></span>
                            <span className="span8"></span>
                            <span className="span9">{it.guestRank}</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })
            }
          </div>
          : <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
        }
      </div>
    )
  }
}


function select(state) {
  return {
    MatchList: state.Match
  }
}
export default connect(select)(MatchJishi)
