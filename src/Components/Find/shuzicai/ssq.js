'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'

import '../../../Style/Find/lotteryResults.css'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {NumLotteryDetail} from '../../../Stubs/API'
import {NumLotteryList} from '../lotteryIndexComponent/NumLotteryList'
import utils from '../../../common/utils'

const fontColor = {
  color: 'red'
};

const Spacing = {
  margin: '17px 0px 5px 0px'
}

class Ssq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gid: '',
      pid: '',
      flag: '',
      endtime: '',
      state: '',
      awardtime: '',
      initData: {
        acode: "01,07,10,11,26,27|11",
        atime: "2017-11-07 21:15:00",
        code: ",,,,,|",
        gid: "01",
        ginfo: "-------,------,----,---,--,-",
        gpool: "---------",
        gsale: "---------",
        ninfo: "--，----，---",
        pid: "------"
      }
    }
    this.initialize = this.initialize.bind(this);
    this.DateSubstring = this.DateSubstring.bind(this);
    this.valueTrasfrom = this.valueTrasfrom.bind(this);
    this.ClickhashGoto = this.ClickhashGoto.bind(this);
  }

  componentWillMount() {
    const {gid, pid, flag, endtime, state, awardtime} = this.props.location.query;
    this.setState({
      gid: gid,
      pid: pid,
      flag: flag ? flag : false,
      endtime: decodeURIComponent(endtime),
      state: state,
      awardtime: decodeURIComponent(awardtime)
    }, () => {
      const {state, pid, gid, initData, awardtime} = this.state;
      if (2 < state && state <= 6) { // 开奖号码未出
        let init = Object.assign({}, initData, {gid: gid, pid: pid, atime: awardtime});
        this.setState({
          initData: init
        });
      } else {
        this.initialize();
      }
    })
  }

  //组件挂载之后设置高度
  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  initialize() {
    const {gid, pid} = this.state;
    NumLotteryDetail(gid, pid).then(res => {
      this.setState({
        initData: res.result.data
      })
    })
  }

  DateSubstring(d) {
    let NumLo = new NumLotteryList();
    return NumLo.subDate(d)
  }

  /* 数值转换 */
  valueTrasfrom(d) {
    switch (d) {
      case 0:
        return '一';
        break;
      case 1:
        return '二';
        break;
      case 2:
        return '三';
        break;
      case 3:
        return '四';
        break;
      case 4:
        return '五';
        break;
      case 5:
        return '六';
        break;
      case 6:
        return '七';
        break;
    }
  }

  /* 点击跳转路由 */
  ClickhashGoto() {
    const {gid, pid} = this.state;
    hashHistory.push({
      pathname: '/lotteryResults/ssqList',
      query: {
        gid: gid,
        pid: pid
      }
    })
  }

  titleDes(gid) {
    switch (gid) {
      case '01':
        return "双色球开奖";
        break;
      case "03":
        return "福彩3D开奖";
        break;
      case "50":
        return "大乐透开奖";
        break;
      case '53':
        return "排列三开奖";
        break;
      case '52':
        return "排列五开奖";
        break;
      case "51":
        return '七星彩开奖';
        break;
      case "07":
        return "七乐彩开奖";
        break;
    }
  }

  render() {
    const {initData, gid, pid, flag, endtime, state, listHeight} = this.state;
    const code = initData.code.split('|');
    const redBall = code[0].split(',');
    const blueBall = code[1].split(',');
    const gsale = utils.MoneyFormate(initData.gsale);
    const gpool = utils.MoneyFormate(initData.gpool);
    let ninfo = initData.ninfo.split(',');
    let ginfo = initData.ginfo.split(',');
    let repng = false;
    if (initData.ninfo.indexOf('--') > 1) {
      ninfo = initData.ninfo.split(',--,--,');
      ginfo = initData.ginfo.split(',--,--,');
      if (ninfo[1] && ginfo[1]) {
        repng = true;
        ninfo[1] = ninfo[1].split(',');
        ginfo[1] = ginfo[1].split(',');
        ninfo[0] = ninfo[0].split(',');
        ginfo[0] = ginfo[0].split(',');
      }
    }
    let etime = endtime.substring(11, endtime.length - 3);
    return (
      <div id="lotteryResults">
        <CommonNavBar title={this.titleDes(gid)}/>
        <div style={{height: listHeight, overflow: 'auto'}}>
          <div className="lotteryA noArrow">
            <p className="p1">
              <span className="span1">{initData.pid}期</span>
              <span className="span13">{this.DateSubstring(initData.atime)}</span>
              {flag ? '' : <a onClick={this.ClickhashGoto} className='moreA'>更多期次</a>}
            </p>
            {
              state > 2 && state <= 6 ?
                <p style={Spacing}>
                  <span>今日 <em style={fontColor}>{etime}</em> 开奖</span>
                </p> :
                <p className="p2">
                  {redBall.map((item, index) => {
                    return (
                      <span key={index} className="ballSpan ballRed">{item}</span>
                    )
                  })
                  }
                  {blueBall.map((item, index) => {
                    return (
                      <span key={index} className="ballSpan ballBlue">{item}</span>
                    )
                  })
                  }
                </p>
            }
          </div>
          <div className="whiteBg">
            <div className="div10">开奖详情</div>
            {
              initData.ninfo.length > 2 ?
                <div>
                  <div className="div11">
                    <div>
                      <p className="p15"><span>{gsale.money}</span>{gsale.unit}</p>
                      <p className="p16">本期销量</p>
                    </div>
                    <div>
                      <p className="p15"><span>{gpool.money}</span>{gpool.unit}</p>
                      <p className="p16">奖池滚存</p>
                    </div>
                  </div>
                  <ul className="jiangUl">
                    <li>奖项</li>
                    <li>注数(注)</li>
                    <li>每注金额(元)</li>
                  </ul>
                  {
                    gid !== '50' && ninfo.map((item, index) => {
                      return (
                        <ul className="jiangUl2" key={index}>
                          <li><span>{this.valueTrasfrom(index)}等奖</span></li>
                          <li>{utils.NumAddComma(item)}</li>
                          <li><span className="redColor">{utils.NumAddComma(ginfo[index])}</span></li>
                        </ul>
                      )
                    })
                  }
                  {
                    (gid === '50' && repng) && ninfo[0].map((item, index) => {
                      return (
                        <ul key={index} className={gid == '50' && index==5?"jiangUl7":"jiangUl5"}>
                          <li className="li1">
                            <span className="span15">{this.valueTrasfrom(index)}等奖</span>
                            <span className="span14">基本</span>
                            {gid == '50' && index==5?'':<span className="span14">追加</span>}
                          </li>
                          <li>
                            <span>{utils.NumAddComma(item)}</span>
                            {gid == '50' && index==5?'':<span>{utils.NumAddComma(ninfo[1][index])}</span>}
                          </li>
                          <li>
                            <span className="redColor">{utils.NumAddComma(ginfo[0][index])}</span>
                            {gid == '50' && index==5?'':<span className="redColor">{utils.NumAddComma(ginfo[1][index])}</span>}
                          </li>
                        </ul>
                      )
                    })
                  }</div> : <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Ssq
