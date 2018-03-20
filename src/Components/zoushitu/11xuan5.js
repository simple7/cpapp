'use strict'
import React, {Component} from 'react'
import {zst} from '../../Stubs/API'
import CommonFilter from './commonFilter'

class Xuan11x5 extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      headFlag: '',
      blockState: true,
      omit: true,
      pid: 30,
      gid: 59,
      initData: {},
      ylShow: true,
      tjShow: true,
    }
    this.bsoe = ['0:5',
      '1:4',
      '2:3',
      '3:2',
      '4:1',
      '5:0']
    this.clickSwitchNav = this.clickSwitchNav.bind(this);
    this.initialize = this.initialize.bind(this);
    this.receiveSwitch = this.receiveSwitch.bind(this);
  }

  componentWillMount() {
    if (this.props.type == 'x11x5') {
      this.setState({
        gid: 59
      })
    } else {
      this.setState({
        gid: 55
      })
    }
    this.setState({
      headFlag: sessionStorage.getItem("headFlag")
    })
    this.initialize();
  }

  initialize() {
    const {gid, pid} = this.state;
    zst(gid, pid).then((res) => {
      if (res.row) {
        this.setState({
          initData: res
        })
      }
    })
  }

  clickSwitchNav() {
    const {blockState} = this.state;
    this.setState({
      blockState: !blockState
    })
  }

  receiveSwitch(obj) {
    let {qici, yilou, tj} = obj
    this.setState({
      pid: qici,
      ylShow: yilou,
      tjShow: tj,
    }, () => {
      this.initialize();
    })
  }

  substr(str) {
    let len = str.length;
    return str.substr(len - 2, len);
  }

  render() {
    const {blockState, pid, ylShow, tjShow, initData, headFlag} = this.state;
    return (
      <div className="">
        <CommonFilter fun={this.receiveSwitch}/>
        <div className="tab">
          <div className={blockState ? "on" : ""} onClick={this.clickSwitchNav}>
            <span>号码分布</span>
          </div>
          <div className={blockState ? "" : "on"} onClick={this.clickSwitchNav}>
            <span>形态分布</span>
          </div>
        </div>
        {/*期次*/}
        {initData && initData.row &&
        <div>
          <div className={headFlag ? "flexFixed zstFlex nonHead" : "flexFixed zstFlex"}
               style={{display: blockState ? "" : "none"}}>
            <div className="flex2">期次</div>
            <div>01</div>
            <div>02</div>
            <div>03</div>
            <div>04</div>
            <div>05</div>
            <div>06</div>
            <div>07</div>
            <div>08</div>
            <div>09</div>
            <div>10</div>
            <div>11</div>
          </div>
          {/*走势图*/}
          <div className="zstView" style={{display: blockState ? "" : "none"}}>
            {
              initData.row && initData.row.map((item, index) => {
                let balls = item.balls.split(',');
                return (
                  <div className="zstFlex" key={index}>
                    <div className="flex2">{this.substr(item.pid)}</div>
                    {
                      balls.map((item1, index1) => {
                        return (
                          <div className={item1 == '0' ? "on" : ""} key={index1}>
                            <span>{item1 == '0' ? Number(index1) + 1 : (ylShow && item1)}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
            {
              tjShow && <div className="zstFlex purpleViwe">
                <div className="flex2">出现次数</div>
                {
                  initData.dis && initData.dis.balls.split(',').map((item, index) => {
                    return (
                      <div key={index}>{item}</div>
                    )
                  })
                }
              </div>
            }
            {
              tjShow && <div className="zstFlex cyanView">
                <div className="flex2">平均遗漏</div>
                {
                  initData.avg && initData.avg.balls.split(',').map((item, index) => {
                    return (
                      <div key={index}>{item}</div>
                    )
                  })
                }
              </div>
            }
            {
              tjShow && <div className="zstFlex brownView">
                <div className="flex2">最大遗漏</div>
                {
                  initData.mmv && initData.mmv.balls.split(',').map((item, index) => {
                    return (
                      <div key={index}>{item}</div>
                    )
                  })
                }
              </div>
            }
            {
              tjShow && <div className="zstFlex blueView">
                <div className="flex2">最大连出</div>
                {
                  initData.mlv && initData.mlv.balls.split(',').map((item, index) => {
                    return (
                      <div key={index}>{item}</div>
                    )
                  })
                }
              </div>
            }
          </div>

          {/*形态分布*/}
          <div className={headFlag ? "flexFixed1 zstFlex nonHead" : "flexFixed1 zstFlex"}
               style={{display: blockState ? "none" : ""}}>
            <div className="flex2">期次</div>
            <div className="flex7">
              <span className="text1">大小比(大数≥6)</span>
              <div className="text2">
                <span>0:5</span>
                <span>1:4</span>
                <span>2:3</span>
                <span>3:2</span>
                <span>4:1</span>
                <span>5:0</span>
              </div>
            </div>
            <div className="flex7">
              <span className="text1">奇偶比</span>
              <div className="text2">
                <span>0:5</span>
                <span>1:4</span>
                <span>2:3</span>
                <span>3:2</span>
                <span>4:1</span>
                <span>5:0</span>
              </div>
            </div>
          </div>
          <div className="zstView" style={{top: '95px', display: blockState ? "none" : ""}}>
            {
              initData.row && initData.row.map((item, index) => {
                let bs = item.bs.split(',');
                let oe = item.oe.split(',');
                return (
                  <div className="zstFlex" key={index}>
                    <div className="flex2">{this.substr(item.pid)}</div>
                    {
                      bs.map((item1, index1) => {
                        return (
                          <div className={item1 == '0' ? "onOrange" : ""} key={index1}>
                            <span>{item1 == '0' ? this.bsoe[index1] : (ylShow && item1)}</span>
                          </div>
                        )
                      })
                    }
                    {
                      oe.map((item1, index1) => {
                        return (
                          <div className={item1 == '0' ? "onBlue" : ""} key={index1}>
                            <span>{item1 == '0' ? this.bsoe[index1] : (ylShow && item1)}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
        }

      </div>
    )
  }
}

export default Xuan11x5

