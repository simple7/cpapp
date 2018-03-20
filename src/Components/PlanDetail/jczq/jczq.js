"use strict";
import React, { Component } from "react";
import TopIcon from "../common/topIcon";
import Progress from "../common/progress";
import FootBtn from "../common/footBtn";
import utils from "../../../common/fangAnUtils";
import { lotPlanDetail } from "../../../Stubs/API";
import Awinner from "./Awinner";
import OtherGameplay from "./JCZQOtherGamePlay";
import JJYHList from "./JJYHList";
import FootDesc from "../common/footDesc";
import TableTicket from "../common/tableTicket";

class JczqDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contHeight: 0,
      git: 70,
      hid: "",
      lotName: "",
      gp: "",
      data: {}
    };
    this.initialize = this.initialize.bind(this);
    this.ResultsState = this.ResultsState.bind(this);
    this.HalfScore = this.HalfScore.bind(this);
    this.DataJudge = this.DataJudge.bind(this);
  }

  componentWillMount() {
    const { gid, hid } = this.props.location.query;
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
    if(progFootDomHeight){
      height = height - progFootDomHeight[0].offsetHeight;
    }
    this.setState({
      contHeight: height
    });
  }

  initialize() {
    const { hid, gid } = this.state;
    lotPlanDetail(hid, gid).then(res => {
      this.setState({
        data: res
      });
      return true;
    });
  }
  /**
   * 数据判断
   * 奖金优化与一般订单 数据结构存在差异
   * @param {*} data
   */
  DataJudge(d) {
    if (d.row || d.matchs) {
      return d.row || d.matchs.row;
    }
  }
  /**
   * 赛果 显示结构判断
   */
  ResultsState() {
    const { data } = this.state;
    if (data.shareGod) {
      if (data.shareGod == 2 && data.showCode == false) {
        //神单状态
        return false;
      } else if (data.shareGod) {
        return true;
      }
    }
  }

  /**
   * 竞彩足球 半全场显示判断
   * @param {*} da
   */
  HalfScore(data) {
    const { gid } = this.state;
    if (data) {
      if (gid == "92") {
        return `/${data.hhs}:${data.hgs}`;
      } else {
        return "";
      }
    }
    return;
  }

  render() {
    const { contHeight, data, gid, hid} = this.state;
    let row = this.DataJudge(data);
    let AWJJStat = utils.AwinnerState(data.source);
    return (
      <div>
      <div className="programmeDetails listDivView" style={{ height: contHeight}}>
        {/*顶部 icon*/}
        <TopIcon data={data} gid={gid} />
        {/*进度 金额*/}
        <Progress data={data} gid={gid} />
        {/*方案内容*/}
        <div className="titleDiv">方案内容</div>
        {/* 竞彩足球 一场制胜特殊判断, 其中单关与串关也不同*/}
        {data.source && data.source != "15" ? (
          <OtherGameplay
            row={row}
            gid={gid}
            ResultsState={this.ResultsState}
            HalfScore={this.HalfScore}
            source={data.source}
          />
        ) : (
          <Awinner
            row={row}
            gid={gid}
            ResultsState={this.ResultsState}
            HalfScore={this.HalfScore}
          />
        )}
        <TableTicket data={data} state={true} gid={gid} hid={hid}/>
        {
          data.detail && <JJYHList detail={data.detail} source={data.source}/>
        }
        <FootDesc hid={hid} state={true}/>
      </div>
        <FootBtn jindu={data.jindu} shareGod={data.shareGod} gid={gid}/>
      </div>
    );
  }
}

export default JczqDetail;
