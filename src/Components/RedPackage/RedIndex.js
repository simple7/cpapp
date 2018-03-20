import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router'
import {getMyRed, checkUserLogin} from '../../Stubs/API'
import moment from 'moment'
import {Tabs, Badge, NavBar, Icon} from 'antd-mobile'
import CommonNavBar from "../CommonComts/CommonNavBar";
import RedExchange from './RedExchange'
import utils from '../../common/utils'
import '../../Style/My/MyRed.css'

const TabPane = Tabs.TabPane;


function computeRed(deadDate) {
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  return Math.ceil((moment(deadDate) - moment()) / dayMilliseconds);
}


class MyRed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canUsePacket: [],
      willGetPacket: [],
      pastPacket: [],
      hasUsePacket: true,
      hasWillPacket: true,
      hasPastPacket: true,
      listHeight: '',
      childHeight: ''
    }
    this.initialize = this.initialize.bind(this);
    this.getDesc = this.getDesc.bind(this);
    this.clickTab = this.clickTab.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  initialize() {
    let _this = this;
    // 可用红包
    getMyRed('1').then(result => {
      console.log('可用红包', result);
      if (result.rows && result.code === '0') {
        let row = result.rows.row
        if (row) {
          if (utils.checkIsArr(row)) {
            _this.setState({
              canUsePacket: row
            })
          } else {
            _this.setState({
              canUsePacket: [row]
            })
          }
        } else {
          _this.setState({
            hasUsePacket: false
          })
        }
      }
    })
    // 过期红包
    getMyRed('2').then(result => {
      console.log('过期红包', result);
      if (result.rows && result.code === '0') {
        let row = result.rows.row
        if (row) {
          if (utils.checkIsArr(row)) {
            _this.setState({
              pastPacket: row
            })
          } else {
            _this.setState({
              pastPacket: [row]
            })
          }
        } else {
          _this.setState({
            hasPastPacket: false
          })
        }
      }
    })

    // 待派发红包
    getMyRed('3').then(result => {
      console.log('待发红包', result);
      if (result.rows && result.code === '0') {
        let row = result.rows.row
        if (row) {
          if (utils.checkIsArr(row)) {
            _this.setState({
              willGetPacket: row
            })
          } else {
            _this.setState({
              willGetPacket: [row]
            })
          }
        } else {
          _this.setState({
            hasWillPacket: false
          })
        }
      }
    })
  }

  componentDidUpdate() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let ambarHeight = document.getElementsByClassName('am-tabs-bar')[0]
      let questionHeight = document.getElementsByClassName('questionBox')[0]
      if (this.state.listHeight === '' && ambarHeight && ambarHeight.offsetHeight !== 0 && questionHeight) {
        let gettableHeight = w - ambarHeight.offsetHeight;
        this.setState({
          listHeight: gettableHeight,
          childHeight: gettableHeight - questionHeight.offsetHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      let questionHeight = document.getElementsByClassName('questionBox')[0]
      if (this.state.listHeight === '' && myNavHeight && myNavHeight.offsetHeight !== 0 && questionHeight) {
        let gettableHeight = w - myNavHeight.offsetHeight - document.getElementsByClassName('am-tabs-bar')[0].offsetHeight;
        this.setState({
          listHeight: gettableHeight,
          childHeight: gettableHeight - questionHeight.offsetHeight
        })
      }
    }
  }

  getDesc(scale) {
    if (scale) {
      let arr = scale.split('/')
      return `(每满${arr[1]}减${arr[0]})`
    } else {

    }
    return ''
  }

  clickTab(key) {

  }

  render() {
    let _this = this
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content = <div id="MyRed">
        <CommonNavBar
          // rightContent={<Link to="redpack/redExchange">兑换</Link>}
          title="我的红包"
        />
        <Tabs swipeable={false} animated={false} onTabClick={this.clickTab}>
          <TabPane tab={<Badge>可用({this.state.canUsePacket.length})</Badge>} key="1">
            <div style={{height: this.state.listHeight}}>
              <div className="questionBox"><Link to="redpack/redExplain" className="questionLink">红包说明</Link></div>
              {this.state.canUsePacket.length > 0 &&
              <div className="redList redList1 listDivView" style={{height: this.state.childHeight}}>
                {
                  this.state.canUsePacket.map(function (item, index) {
                    return (
                      <a className="redBox" key={`ky_${index}`}
                         onClick={() => {
                           console.log(item.rpid)
                           hashHistory.push({
                             pathname: 'redpack/redUse',
                             query: {
                               item: JSON.stringify(item)
                             }
                           })
                         }}
                      >
                        <div className="redBox1 redBoxBg1">
                          <p className="p1">
                            <span>￥</span>
                            {item.money}
                          </p>
                          {item.rmoney &&
                          <p className="p2">余额：{item.rmoney}</p>
                          }
                        </div>
                        <div className="redBox2">
                          <p className="p3">{item.rpname + _this.getDesc(item.scale)}</p>
                          <p className="p4">有效期至{item.deaddate}</p>
                        </div>
                        {computeRed(item.deaddate) <= 3 &&
                        <div className="redBox3">{computeRed(item.deaddate)}天后过期</div>
                        }
                      </a>
                    )
                  })
                }
                <div className="redOver">以上是所有可用红包</div>
              </div>
              }
              {!this.state.hasUsePacket &&
              <div className="emptyRedBox"><p>暂无可用红包</p></div>
              }

            </div>
          </TabPane>
          <TabPane tab={<Badge>待派发({this.state.willGetPacket.length})</Badge>} key="2">
            <div className="listDivView" style={{height: this.state.listHeight}}>
              {this.state.willGetPacket.length > 0 &&
              <div className="redList">
                {
                  this.state.willGetPacket.map(function (item, index) {
                    return (
                      <a className="redBox" key={`df_${index}`}
                         onClick={() => {
                           hashHistory.push({
                             pathname: 'redpack/redUse',
                             query: {
                               item: JSON.stringify(item)
                             }
                           })
                         }}
                      >
                        <div className="redBox1 redBoxBg1">
                          <p className="p1">
                            <span>￥</span>{item.money}</p>
                          {item.rmoney &&
                          <p className="p2">余额：{item.rmoney}</p>
                          }
                        </div>
                        <div className="redBox2"><p className="p3">{item.rpname + _this.getDesc(item.scale)}</p><p
                          className="p4">
                          有效期至{item.deaddate}</p>
                        </div>
                        <div className="redBox4"></div>
                      </a>
                    )
                  })
                }
                <div className="redOver">以上是所有待派发红包</div>
              </div>
              }
              {!this.state.hasWillPacket &&
              <div className="emptyRedBox"><p>暂无待派发红包</p></div>
              }
            </div>
          </TabPane>
          <TabPane tab={<Badge>过期/用完</Badge>} key="3">
            <div className="listDivView" style={{height: this.state.listHeight}}>
              {this.state.pastPacket.length > 0 &&
              <div className="redList">
                {
                  this.state.pastPacket.map(function (item, index) {
                    return (
                      <a className="redBox" to="" key={`yy_${index}`}
                         onClick={() => {
                           hashHistory.push({
                             pathname: 'redpack/redUse',
                             query: {
                               item: JSON.stringify(item)
                             }
                           })
                         }}
                      >
                        <div className="redBox1 redBoxBg2">
                          <p className="p1"><span>￥</span>{item.money}</p>
                          {item.rmoney &&
                          <p className="p2">余额：{item.rmoney}</p>
                          }
                        </div>
                        <div className="redBox2"><p className="p3">{item.rpname + _this.getDesc(item.scale)}</p><p
                          className="p4">
                          有效期至{item.deaddate}</p></div>
                        {parseFloat(item.rmoney) != 0 ?
                          (<div className="redBox5 imgGuoqi"></div>) : (<div className="redBox5 imgYongwan"></div>)
                        }
                      </a>
                    )
                  })
                }
                <div className="redOver">以上是所有失效红包</div>
              </div>
              }
              {!this.state.hasPastPacket &&
              <div className="emptyRedBox"><p>暂无失效红包</p></div>
              }
            </div>
          </TabPane>
          <TabPane tab={<Badge>兑换</Badge>} key="4">
            <div className="listDivView" style={{height: this.state.listHeight}}>
              <RedExchange/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    }
    return (
      <div style={{height: '100%'}}>
        {content}
      </div>
    )
  }
}

export default MyRed
