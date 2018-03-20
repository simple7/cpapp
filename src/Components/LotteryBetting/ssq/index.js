'use strict'
import React, {Component} from 'react'
import SsqDltChild from '../common/SsqDltChild'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/ssq.less'
import "../../../Style/lotteryBetting/mixedPop.less"

class LotteryBetting extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      choose: {
        red: [],
        blue: []
      }
    };
  }

  componentWillMount() {
    let data = this.props.location.query
    console.log(data)
    if (data && data.code) {
      let arr = data.code.split('|')
      let red = arr[0].split(',')
      let blue = arr[1].split(',')
      this.setState({
        choose: {
          red: red,
          blue: blue
        }
      })
    }
  }

  render() {
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 =
      <SsqDltChild
        choose={this.state.choose}
        type="ssq"
      />

    return (
      <div>
        {children && content}
        <div style={{display: children ? 'none' : ''}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default LotteryBetting
