"use strict";
import React, {Component} from "react";
import {Link} from 'react-router'
import utils from "../../../common/fangAnUtils";
import {PlanNumber} from '../../../common/LotType'

class FootBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {shareGod, jindu, gid} = this.props;
    let hasResult = jindu && utils.hasResult(jindu.node, jindu.percent);
    //let shareBtn = utils.shareBtnState(hasResult, shareGod);
    let shareBtn = {desc: "", ShareState: false}
    let href = PlanNumber[gid][5];
    return (
      <div className="programmeFooter">
          <div className="clearfix">
            <Link to={href ? href : '/index'}
                  className="programmeFooterBtn3">
              继续购彩
            </Link>

            <Link to="/index" className="programmeFooterBtn2">
              首页
            </Link>

          </div>
      </div>
    );
  }
}

export default FootBtn;
