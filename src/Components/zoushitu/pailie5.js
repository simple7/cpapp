'use strict'
import React, {Component} from 'react'
import {zst} from '../../Stubs/API'
import lotteryInfo from '../../config/lotteryInfo'
import CommonFilter from './commonFilter'
import _ from 'lodash'

class Pailie5 extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      headFlag: '',
      pid: 30,
      ylShow: true,
      tjShow: true,
      currentShow: 'wan',
      dataList: {}
    }
    this.tabData = [
      {key: 'wan', value: '万位'},
      {key: 'qian', value: '千位'},
      {key: 'bai', value: '百位'},
      {key: 'shi', value: '十位'},
      {key: 'ge', value: '个位'},
    ]
    this.getData = this.getData.bind(this)
    this.weiRender = this.weiRender.bind(this)
    this.basicFootRender = this.basicFootRender.bind(this)
    this.receiveSwitch = this.receiveSwitch.bind(this)
  }

  componentWillMount() {
    this.setState({
      headFlag: sessionStorage.getItem("headFlag")
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

  //基础下部渲染
  basicFootRender(type1, type2) {
    let dataList = this.state.dataList
    let arr = [];
    if (dataList[type1]) {
      let data = dataList[type1][type2].split(',')
      _.each(data, (item, index) => {
        arr.push(
          <div key={type1 + type2 + index}>{item}</div>
        )
      })
    }
    return arr
  }

  //按位渲染
  weiRender(wei) {
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

  receiveSwitch(obj) {
    let {qici, yilou, tj} = obj
    this.setState({
      pid: qici,
      ylShow: yilou,
      tjShow: tj,
    }, () => {
      this.getData(this.gid, this.state.pid)
    })
  }

  render() {
    let {currentShow, dataList, tjShow,headFlag} = this.state
    return (
      <div className="">
        <CommonFilter fun={this.receiveSwitch}/>
        <div className="tab">
          {
            this.tabData.map((item, index) => {
              return (
                <div className={currentShow === item.key ? "on" : ""}
                     key={"tab_" + item.key}
                     onClick={() => {
                       this.setState({
                         currentShow: item.key
                       })
                     }}>
                  <span>{item.value}</span>
                </div>
              )
            })
          }
        </div>
        {
          dataList.row &&
          <div>
            <div className={headFlag?"flexFixed zstFlex nonHead":"flexFixed zstFlex"}>
              <div className="flex3">期次</div>
              <div>0</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
            </div>
            {/*走势图*/}
            <div className="zstView">
              {this.weiRender(currentShow)}
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
    )
  }
}

export default Pailie5

