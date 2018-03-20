"use strict";
import React, { Component } from "react";
import "../../../Style/lotteryBetting/index.less";
import "../../../Style/lotteryBetting/x11x5.less";
import "../../../Style/lotteryBetting/mixedPop.less";
import LotteryBetting11x5Child from './X11x5Child'

class LotteryBetting11x5 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { children } = this.props;
    let active = this.props.location.query.active;
    let pathname = this.props.location.pathname;
    let content, content1;
    if (children) {
      content = children;
    }
    content1 = (
      <LotteryBetting11x5Child pathname={pathname} active={active}/>
    );

    return (
      <div>
        {children && content}
        <div style={{ display: children ? "none" : "" }}>{content1}</div>
      </div>
    );
  }
}

export default LotteryBetting11x5;
