"use strict";
import React, {Component} from "react";
import TopIcon from "../common/topIcon";
import Progress from "../common/progress";
import FootBtn from "../common/footBtn";
import utils from "../../../common/fangAnUtils";
import {lotPlanDetail_R9SFC} from "../../../Stubs/API";
import Gameplay from "./GamePlay";
import FootDesc from "../common/footDesc";
import TableTicket from "../common/tableTicket";

class R9AndSFCDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contHeight: 0,
      gid: '',
      hid: "",
      lotName: "",
      gp: "",
      data: {}
    };
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    const {gid, hid} = this.props.location.query;
    this.setState(
      {
        gid: gid,
        hid: hid
      },
      () => {
        this.initialize();
      }
    );
  }

  componentDidMount() {
    let height = utils.setHeight();
    let progFootDomHeight = document.getElementsByClassName('programmeFooter');
    if (progFootDomHeight) {
      height = height - progFootDomHeight[0].offsetHeight;
    }
    this.setState({
      contHeight: height
    });
  }

  initialize() {
    const {hid, gid} = this.state;
    lotPlanDetail_R9SFC(hid, gid).then(res => {
      this.setState({
        data: res
      });
      return true;
    });
  }

  render() {
    const {contHeight, data, gid, hid} = this.state;
    return (
      <div>
        <div className="programmeDetails listDivView" style={{height: contHeight, overflow: 'auto'}}>
          {/*顶部 icon*/}
          <TopIcon data={data} gid={gid}/>
          {/*进度 金额*/}
          <Progress data={data} gid={gid}/>
          {/*方案内容*/}
          <div className="titleDiv">方案内容</div>
          {/* 胜负过关 与 北京单场 */}
          <Gameplay
            row={data.r}
            gid={gid}
          />
          <TableTicket data={data}/>
          <FootDesc hid={hid}/>
          {/*底部按钮*/}
        </div>
        <FootBtn jindu={data.jindu} shareGod={data.shareGod} gid={gid}/>
      </div>
    );
  }
}

export default R9AndSFCDetail;
