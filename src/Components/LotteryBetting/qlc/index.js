'use strict'
import React, {Component} from 'react'
import SsqDltChild from '../common/SsqDltChild'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/ssq.less'
import "../../../Style/lotteryBetting/mixedPop.less"


class LotteryBetting extends Component {
  constructor(...args) {
    super(...args)
    this.state = {};
  }

  render() {
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 =
      <SsqDltChild
        type="qlc"
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
