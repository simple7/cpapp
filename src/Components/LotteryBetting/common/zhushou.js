import React, {Component} from 'react'
import {Popover} from 'antd-mobile';
import {hashHistory} from 'react-router'

const Item = Popover.Item;

export default class ZhuShou extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      otherVisible: false
    }
    this.hasZst = ['ssq', 'dlt', 'pl3', 'k3', 'fc3d', 'pl5', 'x11x5', 'y11x5']
    this.handleVisibleChange = this.handleVisibleChange.bind(this)
    this.showOther = this.showOther.bind(this)
    this.getZhuShou = this.getZhuShou.bind(this)
  }

  handleVisibleChange(visible) {
    this.setState({
      otherVisible: visible,
    });
  }

  showOther(obj) {
    let key = obj.key
    this.setState({
      otherVisible: false,
    })
    if (key === 'showYL') {
      this.props.receiveYL(!this.props.yilouShow)
    } else if (key === 'showZST') {
      let type = this.props.type
      let route = type + 'Bet/zst'
      hashHistory.push({
        pathname: route,
        query: {
          type: type
        }
      })
    } else {
      let type = this.props.type
      let route = type + 'Bet/wanfa'
      hashHistory.push({
        pathname: route,
        query: {
          type: type
        }
      })
    }
  }

  getZhuShou() {
    let type = this.props.type
    let hasYL = this.props.hasYL || 'yes'
    let arr = [
      <Item key="showWF" style={{background: "#49484B", color: "white"}}>玩法说明</Item>
    ]
    if (this.hasZst.indexOf(type) !== -1) {
      arr.push(
        <Item key="showZST" style={{background: "#49484B", color: "white"}}>走势图</Item>
      )
    }
    if (hasYL === 'yes') {
      arr.unshift(<Item key="showYL"
                        style={{background: "#49484B", color: "white"}}>{this.props.yilouShow ? '隐藏遗漏' : '显示遗漏'}</Item>)
    }
    return arr
  }

  render() {

    return (
      <Popover
        visible={this.state.otherVisible}
        overlay={
          this.getZhuShou()
        }
        align={{
          overflow: {adjustY: 0, adjustX: 0},
          offset: [-10, 5],
        }}
        onVisibleChange={this.handleVisibleChange}
        onSelect={this.showOther}
      >
        <div className="redBallTitle_position clearfix"
             onClick={() => {
               this.setState({
                 otherVisible: !this.state.otherVisible
               })
             }
             }
        >
          <span className="zhushouSpan">助手</span>
        </div>
      </Popover>
    )
  }
}
