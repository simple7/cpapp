'use strict'
import React, {Component} from 'react'
import SscChild from './SscChild'

import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/ssc.less'
import "../../../Style/lotteryBetting/mixedPop.less"

class LotteryBetting extends Component {

  render() {
    let {children} = this.props;
    let {active} = this.props.location.query;
    let {pathname} = this.props.location;
    let content, content1;
    if (children) {
      content = children
    }
    content1 = <SscChild active={active} pathname={pathname}/>
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
