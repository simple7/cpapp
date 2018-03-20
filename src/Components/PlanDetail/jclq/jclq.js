"use strict";
import React, {Component} from "react";
import TopIcon from "../common/topIcon";
import Progress from "../common/progress";
import FootBtn from "../common/footBtn";
import utils from "../../../common/fangAnUtils";
import {lotPlanDetail} from "../../../Stubs/API";
import JCLQGamePlay from "./JCLQGamePlay";
import FootDesc from "../common/footDesc";
import TableTicket from "../common/tableTicket";

class JclqDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contHeight: 0,
      git: '--',
      hid: "",
      lotName: "",
      gp: "",
      data: {}
    };
    this.initialize = this.initialize.bind(this);
    this.DataJudge = this.DataJudge.bind(this);
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
    lotPlanDetail(hid, gid).then(res => {
      this.setState({
        data: res
      });
      return true;
    });
  }

  /**
   * 数据判断
   * @param {*} data
   */
  DataJudge(d) {
    if(d){
      if (d.row || d.matchs) {
        return d.row || d.matchs.row;
      }
    }
  }

  render() {
    const {contHeight, data, gid, hid} = this.state;
    let row = this.DataJudge(data);
    return (
      <div>
        <div className="programmeDetails listDivView" style={{height: contHeight}}>
          {/*顶部 icon*/}
          <TopIcon data={data} gid={gid}/>
          {/*进度 金额*/}
          <Progress data={data} gid={gid}/>
          {/*方案内容*/}
          <div className="titleDiv">方案内容</div>
          {/* 竞彩篮球*/}
          <JCLQGamePlay
            row={row}
            gid={gid}
          />
          <TableTicket data={data} state={true} gid={gid} hid={hid}/>
          <FootDesc hid={hid} state={true}/>
          {/*底部按钮*/}
        </div>
        <FootBtn jindu={data.jindu} shareGod={data.shareGod} gid={gid}/>
      </div>
    );
  }
}

export default JclqDetail;
