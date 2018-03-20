"use strict";
import React, { Component } from "react";
import { hashHistory } from "react-router";
import { Tabs } from "antd-mobile";
import CommonNavBar from "../../CommonComts/CommonNavBar";
import utils from "../../../common/utils";
import NumHighFoot from "../common/NumHighFoot";
import { szcHistory } from "../../../Stubs/API";

import "../../../Style/lotteryBetting/index.less";
import "../../../Style/lotteryBetting/xk3.less";
import "../../../Style/lotteryBetting/mixedPop.less";
const TabPane = Tabs.TabPane;

import { HeZhi } from "./heZhi/heZhi";
import { TwobuTongHao } from "./2buTongHao/2buTongHao";
import { TwotongHaoDanXuan } from "./2tongHaoDanXuan/2tongHaoDanXuan";
import { TwotongHaoFuXuan } from "./2tongHaoFuXuan/2tongHaoFuXuan";
import { ThreebuTongHao } from "./3buTongHao/3buTongHao";
import { ThreelianHaoTongXuan } from "./3lianHaoTongXuan/3lianHaoTongXuan";
import { ThreetongHaoDanXuan } from "./3tongHaoDanXuan/3tongHaoDanXuan";
import { ThreetongHaoTongXuan } from "./3tongHaoTongXuan/3tongHaoTongXuan";

class LotteryBetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "",
      visible: false,
      desc: "",
      ConHeight: "",
      HistoryStage: null,
      nowStage: null,
      omit: null,
      gid: ''
    };
    this.switchType = this.switchType.bind(this);
    this.callback = this.callback.bind(this);
    this.JudgeDesc = this.JudgeDesc.bind(this);
    this.initialize = this.initialize.bind(this);
    this.HistoryStageFunc = this.HistoryStageFunc.bind(this);
  }

  componentWillMount() {
    let pathname = this.props.location.pathname;
    if (pathname == "/xk3Bet") {
      this.setState({
        gid: 10
      },()=> {this.initialize();});
    }
  }

  componentDidMount() {
    let active = this.props.location.query.active;
    let content = "";
    if (active) {
      content = this.JudgeDesc(active);
      this.setState({
        active: active,
        desc: content
      });
    } else {
      content = this.JudgeDesc(active);
      this.setState({
        active: "1",
        desc: content
      });
    }
  }

  componentDidUpdate() {
    let w = document.documentElement
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
    if (sessionStorage.getItem("headFlag")) {
      let ambarHeight = document.getElementsByClassName("am-tabs-bar")[0]
        .offsetHeight;
      if (this.state.ConHeight === "" && ambarHeight !== 0) {
        let bettingFooter = document.getElementsByClassName("bettingFooter")[0]
          .offsetHeight;
        let gettableHeight = w - ambarHeight - bettingFooter;
        this.setState({
          ConHeight: gettableHeight
        });
      }
    } else {
      let myNavHeight = document.getElementsByClassName("myNav")[0]
        .offsetHeight;
      if (this.state.ConHeight === "" && myNavHeight !== 0) {
        let bettingFooter = document.getElementsByClassName("bettingFooter")[0]
          .offsetHeight;
        let gettableHeight =
          w -
          myNavHeight -
          document.getElementsByClassName("am-tabs-bar")[0].offsetHeight -
          bettingFooter;
        this.setState({
          ConHeight: gettableHeight
        });
      }
    }
  }

  initialize() {
    this.HistoryStageFunc();
  }

  HistoryStageFunc() {
    const {gid} = this.state;
    szcHistory(gid).then(res => {
      this.setState({
        nowStage: res.rowc,
        HistoryStage: res.row,
        omit: res.rowp
      })
    });
  }

  JudgeDesc(key) {
    switch (key) {
      case "1":
        return "至少选<span>1</span>个号";
        break;
      case "8":
      case "7":
      case "6":
      case "2":
        return "至少选<span>1</span>组号";
        break;
      case "3":
        return "至少选<span>3</span>个号";
        break;
      case "4":
        return "每位至少选<span>1</span>个号";
        break;
      case "5":
        return "至少选<span>2</span>个号";
        break;
    }
  }

  callback(key) {
    let content = this.JudgeDesc(key);
    this.setState({
      desc: content
    });
  }

  switchType(key) {
    this.setState({
      active: key
    });
    let url = utils.setUrlHash("active", key);
    hashHistory.replace(url);
  }

  render() {
    const {
      active,
      visible,
      desc,
      ConHeight,
      nowStage,
      HistoryStage,
      omit,
      gid
    } = this.state;
    let { children } = this.props;
    let content, content1;
    if (children) {
      content = children;
    }
    content1 = (
      <div id="lotteryBetting">
        <CommonNavBar title="新快3" />
        <Tabs
          onChange={this.callback}
          pageSize={4}
          onTabClick={this.switchType}
          swipeable={false}
          useOnPan={false}
          activeKey={active}
        >
          <TabPane tab={"和值"} key="1">
            <HeZhi
              ConHeight={ConHeight}
              nowStage={nowStage}
              HistoryStage={HistoryStage}
              omit={omit}
              HistoryStageFunc={this.HistoryStageFunc}
              active= {1}
              gid={gid}
            />
          </TabPane>
          <TabPane tab={"三同号单选"} key="2">
            <ThreetongHaoDanXuan ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"三不同号"} key="3">
            <ThreebuTongHao ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"二同号单选"} key="4">
            <TwotongHaoDanXuan ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"二不同号"} key="5">
            <TwobuTongHao ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"二同号复选"} key="6">
            <TwotongHaoFuXuan ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"三同号通选"} key="7">
            <ThreetongHaoTongXuan ConHeight={ConHeight} />
          </TabPane>
          <TabPane tab={"三连号通选"} key="8">
            <ThreelianHaoTongXuan ConHeight={ConHeight} />
          </TabPane>
        </Tabs>
        <NumHighFoot
          visible={visible}
          gid={"10"}
          money={""}
          betnum={""}
          desc={desc}
        />
      </div>
    );
    return (
      <div>
        {children && content}
        <div style={{ display: children ? "none" : "" }}>{content1}</div>
      </div>
    );
  }
}

export default LotteryBetting;
