'use strict'
import React, {Component} from 'react'

import CommonNavBar from '../../CommonComts/CommonNavBar'
import QxP5 from '../common/QxP5'
import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/fc3D.less'
import "../../../Style/lotteryBetting/mixedPop.less"


class LotteryBetting extends Component {


  render() {
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 = <QxP5 type="pl5"/>
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
