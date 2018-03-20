"use strict";
import React, { Component } from "react";
import CommonNavBar from "../CommonComts/CommonNavBar";

import "../../Style/PlanDetail/programmeDetails.less";

class ProgrammeDetails extends Component {
  render() {
    const { children } = this.props;
    const {pathname} = this.props.location;
    let title = '方案详情';
    let content;
    if(pathname.indexOf('cpmx') > -1) {
      title = '出票明细';
    }else if(pathname.indexOf('cpxq') > -1) {
      title = '组合详情';
    }else if(pathname.indexOf('zhxq') > -1) {
      title = '追号详情';
    }
    if (children) {
      content = children;
    } else {
      content = (
        <div className="emptyRedBox">
          <p>客官，暂无数据哟~</p>
        </div>
      );
    }
    return (
      <div>
        <CommonNavBar title={title} />
        {content}
      </div>
    );
  }
}

export default ProgrammeDetails;
