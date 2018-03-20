'use strict'
import React, {Component} from 'react'
import Moment from 'moment'
import '../../../Style/Find/lotteryResults.css'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import utils from '../../../common/utils'
import {sfcResulut, RJResulut} from '../../../Stubs/API'

class Shengfucai extends Component {
  constructor(props) {
    super(props);
    let GetData = props.location.query
    /*console.log(GetData)
    console.log(decodeURIComponent(GetData.code))*/
    this.state = {
      rows: {
        ginfo: "1154484,15757",
        gpool: "0",
        gsale: "25769752",
        ninfo: "10,314",
        row: ''
      },
      listHeight: '',
      moreqc: (GetData.moreqc || true) == true ? true : false,
      cdoe: decodeURIComponent(GetData.code),
      awardtime: decodeURIComponent(GetData.awardtime),
      gid: GetData.gid,
      pid: GetData.pid
    }
    this.initialize = this.initialize.bind(this);
    this.MoneyFormate = this.MoneyFormate.bind(this);
    this.WeekDateFormate = this.WeekDateFormate.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  //组件挂载之后设置高度
  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  MoneyFormate(data) {
    let obj = {};
    if (data >= 0 && data < 10000) {
      obj.money = data;
      obj.unit = '元';
    } else if (data >= 10000 && data < 100000000) {
      obj.money = parseInt(data / 10000);
      obj.unit = '万';
    } else if (data >= 100000000) {
      obj.money = (data / 100000000).toFixed(2);
      obj.unit = '亿';
    }
    return obj
  }

  initialize() {
    const _this = this;
    if (_this.state.gid == 80) {
      sfcResulut(_this.state.pid).then((data) => {
        console.log(data)
        _this.setState({
          rows: data.rows
        })
      }).catch((err) => {
        console.log(err);
      })
    } else if (_this.state.gid == 81) {
      RJResulut(_this.state.pid).then((data) => {
        console.log(data)
        _this.setState({
          rows: data.rows
        })
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  WeekDateFormate(data) {
    let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return arr[data]
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  render() {
    const _this = this;
    let data = this.state.rows;
    console.log(111, data)
    let code = this.state.cdoe;
    const {listHeight} = this.state;
    return (
      <div id="lotteryResults">
        <CommonNavBar title={_this.state.gid == 80 ? '胜负彩开奖' : '任选九开奖'}/>
        <div style={{height: listHeight, overflow: 'auto'}}>
          <div className="lotteryA noArrow">
            <p className="p1">
              <span className="span1">{_this.state.pid.substring(2, _this.state.pid.length)}期</span>
              <span
                className="span13">{`${Moment(_this.state.awardtime).format('MM-DD')}(${_this.WeekDateFormate(Moment(_this.state.awardtime).weekday())})`}</span>
              {
                _this.state.moreqc ?
                  <a href={`#/lotteryResults/sfcList?gid=${_this.state.gid}`} className='moreA'>更多期次</a>
                  : ''
              }
            </p>
            <p className="p2">
              {
                code.split(',').map((item, index) => {
                  return (<span key={index} className="greenSpan">{item}</span>)
                })
              }
            </p>
          </div>
          {/**/}
          <div className="whiteBg">
            <div className="div10">开奖详情</div>
            <div className="div11">
              <div>
                <p className="p15">
                  <span>{_this.MoneyFormate(data.gsale).money}</span>{_this.MoneyFormate(data.gsale).unit}</p>
                <p className="p16">本期销量</p>
              </div>
              <div>
                <p className="p15">
                  <span>{_this.MoneyFormate(data.gpool).money || '*'}</span>{_this.MoneyFormate(data.gpool).unit || ''}
                </p>
                <p className="p16">奖池滚存</p>
              </div>
            </div>
            <ul className="jiangUl">
              <li>奖项</li>
              <li>注数(注)</li>
              <li>每注金额(元)</li>
            </ul>
            {
              _this.state.gid == 80 ?
                (<div>
                  <ul className="jiangUl2">
                    <li>一等奖</li>
                    <li>{data.ninfo.split(',')[0] ? utils.NumAddComma(data.ninfo.split(',')[0]) : '*'}</li>
                    <li><span
                      className="redColor">{data.ginfo.split(',')[0] ? utils.NumAddComma(data.ginfo.split(',')[0]) : '*'}</span>
                    </li>
                  </ul>
                  <ul className="jiangUl2">
                    <li>二等奖</li>
                    <li>{data.ninfo.split(',')[1] ? utils.NumAddComma(data.ninfo.split(',')[1]) : '*'}</li>
                    <li><span
                      className="redColor">{data.ginfo.split(',')[1] ? utils.NumAddComma(data.ginfo.split(',')[1]) : '*'}</span>
                    </li>
                  </ul>
                </div>) : (<ul className="jiangUl2">
                  <li>一等奖</li>
                  <li>{data.ninfo.split(',')[0] ? utils.NumAddComma(data.ninfo.split(',')[0]) : '*'}</li>
                  <li><span
                    className="redColor">{data.ginfo.split(',')[0] ? utils.NumAddComma(data.ginfo.split(',')[0]) : '*'}</span>
                  </li>
                </ul>)
            }
          </div>
          <div className='whiteBg margin_t30'>
            <ul className="jiangUl3">
              <li>场次</li>
              <li className="li1">主队</li>
              <li>比分</li>
              <li className="li1">客队</li>
              <li>赛果</li>
            </ul>
            {
              data.row != '' ? data.row.map((item, index) => {
                return (
                  <ul className="jiangUl4" key={index}>
                    <li>{index + 1}</li>
                    <li className="li1">{item.hn}</li>
                    <li>{item.hs}-{item.vs}</li>
                    <li className="li1">{item.vn}</li>
                    <li><span className="greenBg">{item.result || '*'}</span></li>
                  </ul>
                )
              }) : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Shengfucai
