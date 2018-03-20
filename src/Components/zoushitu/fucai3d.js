'use strict'
import React, {Component} from 'react'
import CommonFilter from './commonFilter'
import {zst} from '../../Stubs/API'
import lotteryInfo from '../../config/lotteryInfo'
import _ from 'lodash'

class Fucai3D extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      pid: 30,
      ylShow: true,
      tjShow: true,
      currentShow: 'basic',
      headFlag:'',
      dataList: {}
    }
    this.gid = '';
    this.tabData = [
      {
        key: 'basic',
        value: '基础'
      },
      {
        key: 'bai',
        value: '百位'
      },
      {
        key: 'shi',
        value: '十位'
      },
      {
        key: 'ge',
        value: '个位'
      }
    ]
    this.receiveSwitch = this.receiveSwitch.bind(this)
    this.getData = this.getData.bind(this)
    this.basicRender = this.basicRender.bind(this)
    this.getType = this.getType.bind(this)
    this.basicFootRender = this.basicFootRender.bind(this)
    this.otherRender = this.otherRender.bind(this)
  }

  receiveSwitch(obj) {
    console.log(obj)
    let {qici, yilou, tj} = obj
    this.setState({
      pid: qici,
      ylShow: yilou,
      tjShow: tj,
    }, () => {
      this.getData(this.gid, this.state.pid)
    })
  }

  componentWillMount() {
    this.setState({
      headFlag:sessionStorage.getItem("headFlag")
    })
    let type = this.props.type
    this.gid = lotteryInfo.zstLottery[type]
    this.getData(this.gid, this.state.pid)
  }

  getData(gid, pid) {
    zst(gid, pid).then(res => {
      if (res.row) {
        this.setState({
          dataList: res
        })
      }
    })
  }

  getType(item, index, key) {
    let {ylShow} = this.state
    let desc = {
      0: ['onGreen', '组六'],
      1: ['onBlue', '组三'],
      2: ['onOrange', '豹子']
    }
    if (item === '0') {
      return (
        <div className={desc[index][0]} key={key}>
          <span>{desc[index][1]}</span>
        </div>
      )
    } else {
      return (
        <div style={{visibility: ylShow ? "" : "hidden"}} key={key}>
          <span>{item}</span>
        </div>
      )
    }
  }

  //基础走势图模板
  basicRender() {
    let dataList = this.state.dataList
    let row = _.cloneDeep(dataList.row)
    let arr = []
    if (row) {
      _.each(row, (item, index) => {
        let codes = item.codes.split('')
        let type = item.type.split(',')
        arr.push(
          <div className="zstFlex" key={item.pid + '_kj'}>
            <div className="flex3">{item.pid.substr(-3)}</div>
            <div className="flex4">
              {_.map(codes, (item2, index2) => {
                return (
                  <span key={`${item.pid}_code_${index2}`}>{item2}</span>
                )
              })}
            </div>
            {_.map(type, (item3, index3) => {
              return (
                this.getType(item3, index3, item.pid + '_code_' + index3)
              )
            })}
          </div>
        )
      })
    }

    return arr
  }

  //基础下部渲染
  basicFootRender(type1, type2 = 'type') {
    let dataList = this.state.dataList
    let arr = [];
    if (dataList[type1]) {
      let data = dataList[type1][type2].split(',')
      _.each(data, (item, index) => {
        arr.push(
          <div key={type1+type2+index}>{item}</div>
        )
      })
    }
    return arr
  }

  //其他区域渲染
  otherRender(wei) {
    let {dataList, ylShow} = this.state
    let row = _.cloneDeep(dataList.row)
    let arr = []
    if (row) {
      _.each(row, (item, index) => {
        let data = item[wei].split(',')
        if (data) {
          arr.push(
            <div className="zstFlex" key={wei + 'kj_' + index}>
              <div className="flex3">{item.pid.substr(-3)}</div>
              {
                data.map((item2, index2) => {
                  return (
                    <div
                      style={{visibility: (item2 !== '0' && !ylShow) ? "hidden" : ""}}
                      className={item2 === '0' ? "on" : ""}
                      key={wei + row.pid + index2}>
                      <span>{item2 === "0" ? index2 : item2}</span>
                    </div>
                  )
                })
              }
            </div>
          )
        }
      })
    }
    return arr
  }

  render() {
    let {currentShow, tjShow, ylShow, dataList,headFlag} = this.state
    return (
      <div className="">
        <CommonFilter fun={this.receiveSwitch}/>
        <div className="tab">
          {this.tabData.map((item, index) => {
            return (
              <div className={currentShow === item.key ? "on" : ""}
                   onClick={() => {
                     this.setState({
                       currentShow: item.key
                     })
                   }}
                   key={"tab_" + index}>
                <span>{item.value}</span>
              </div>
            )
          })}
        </div>
        {
          dataList.row &&
          <div>
            {
              currentShow === 'basic' &&
              <div>
                <div className={headFlag?"flexFixed zstFlex nonHead":"flexFixed zstFlex"}>
                  <div className="flex3">期次</div>
                  <div className="flex4">开奖号码</div>
                  <div>组六</div>
                  <div>组三</div>
                  <div>豹子</div>
                </div>
                <div className="zstView">
                  {this.basicRender()}
                  <div style={{display: tjShow ? "" : "none"}}>
                    <div className="zstFlex purpleViwe">
                      <div className="flex5">出现次数</div>
                      {this.basicFootRender('dis')}
                    </div>
                    <div className="zstFlex cyanView">
                      <div className="flex5">平均遗漏</div>
                      {this.basicFootRender('avg')}
                    </div>
                    <div className="zstFlex brownView">
                      <div className="flex5">最大遗漏</div>
                      {this.basicFootRender('mmv')}
                    </div>
                    <div className="zstFlex blueView">
                      <div className="flex5">最大连出</div>
                      {this.basicFootRender('mlv')}
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              currentShow !== 'basic' &&
              <div>
                <div className={headFlag?"flexFixed zstFlex nonHead":"flexFixed zstFlex"}>
                  <div className="flex3">期次</div>
                  <div>01</div>
                  <div>02</div>
                  <div>03</div>
                  <div>04</div>
                  <div>05</div>
                  <div>06</div>
                  <div>07</div>
                  <div>08</div>
                  <div>09</div>
                </div>
                {/*走势图*/}
                <div className="zstView">
                  {this.otherRender(currentShow)}
                  <div style={{display: tjShow ? "" : "none"}}>
                    <div className="zstFlex purpleViwe">
                      <div className="flex3">出现次数</div>
                      {this.basicFootRender('dis', currentShow)}
                    </div>
                    <div className="zstFlex cyanView">
                      <div className="flex3">平均遗漏</div>
                      {this.basicFootRender('avg', currentShow)}
                    </div>
                    <div className="zstFlex brownView">
                      <div className="flex3">最大遗漏</div>
                      {this.basicFootRender('mmv', currentShow)}
                    </div>
                    <div className="zstFlex blueView">
                      <div className="flex3">最大连出</div>
                      {this.basicFootRender('mlv', currentShow)}
                    </div>
                  </div>
                </div>

              </div>
            }
          </div>
        }


      </div>
    )
  }
}

export default Fucai3D

