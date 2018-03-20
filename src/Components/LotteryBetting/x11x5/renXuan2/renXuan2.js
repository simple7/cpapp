"use strict";
import React, {Component} from "react";
import {Popover} from 'antd-mobile';
import LotteryNum from "../../common/HighlotteryNum";
import ZhuShou from '../../common/zhushou'

const Item = Popover.Item;
export class RenXuan2 extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      visible: false,
      selected: "",
      omitState: false
    };
    this.omitStateJudge = this.omitStateJudge.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.omitSplit = this.omitSplit.bind(this);
    this.clickItem = this.clickItem.bind(this);
    this.Template = this.Template.bind(this);
    this.TemplateOmit = this.TemplateOmit.bind(this);
    this.receiveYL = this.receiveYL.bind(this);
  }

  forChoose() {
    let choose = {};
    for (let i = 1; i < 13; i++) {
      choose[i] = {
        unit: [],
        ten: [],
        hun: []
      };
    }
    return choose;
  }

  //点击选中球
  clickItem(e) {
    const {chooseList, callChoose} = this.props;
    let dataset = e.target.dataset;
    let i = dataset.v;
    let type = dataset.type;
    let active = dataset.active;
    let arr = JSON.parse(JSON.stringify(chooseList[active][type]));
    if (arr.indexOf(i) >= 0) {
      arr = arr.slice(0, arr.indexOf(i)).concat(arr.slice(arr.indexOf(i) + 1));
    } else {
      arr.push(i);
    }
    let choose = JSON.parse(JSON.stringify(chooseList));
    choose[active][type] = JSON.parse(JSON.stringify(arr));
    callChoose(choose);
  }

  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      omitState: yl
    })
  }
  onSelect(opt) {
    console.log(opt);
    this.setState({
      visible: false,
      selected: opt.props.value
    });
  }

  omitStateJudge() {
    const {omitState} = this.state;
    this.setState({
      omitState: !omitState
    });
  }

  bigShow(e) {
    let a = e.target.nextElementSibling;
    a.classList.add("active");
    this.clickItem(e);
  }

  bigHide(e) {
    let a = e.target.nextElementSibling;
    setTimeout(() => {
      a.classList.remove("active");
    }, 200);
  }

  omitSplit(ac) {
    const {omit} = this.props;
    if (ac == 12) {
      return omit.m3.split(",");
    } else if (ac == 11) {
      return omit.m2.split(",");
    } else if (ac == 8) {
      return omit.m1.split(",");
    } else {
      return omit.m0.split(",");
    }
  }

  Template(start, end, type, color) {
    const {chooseList} = this.props;
    const {active} = this.props;
    let st = start;
    let en = end;
    let ty = type;
    let child = [];
    let choose = "";
    if (ty == "ten") {
      choose = chooseList[active].ten;
      ty = "ten";
    } else if (ty == "hun") {
      ty = "hun";
      choose = chooseList[active].hun;
    } else {
      ty = "unit";
      choose = chooseList[active].unit;
    }
    for (let i = st; i <= en; i++) {
      let value = String(i).length >= 2 ? `${i}` : `0${i}`;
      child.push(
        <div className={choose.indexOf(value) > -1 ? `redBg` : ""} key={i}>
          <p
            data-v={value}
            data-type={ty}
            data-active={active}
            onTouchStart={this.bigShow.bind(this)}
            onTouchEnd={this.bigHide.bind(this)}
          >
            {value}
          </p>
          {color ? (
            <p className="hoverRedBg">
              <span>{value}</span>
            </p>
          ) : (
            ""
          )}
        </div>
      );
    }
    return child;
  }

  TemplateOmit(start, end, arr) {
    if (arr) {
      const {omitState} = this.state;
      let child = [];
      for (let i = start - 1; i < end; i++) {
        let value = arr[i];
        child.push(<div key={i}>{value}</div>);
      }
      return child;
    }
    return false;
  }

  render() {
    const {
      ConHeight,
      omit,
      HistoryStage,
      nowStage,
      HistoryStageFunc,
      active,
      gid,
      Judgeactive,
      callChoose,
      chooseList,
      desc
    } = this.props;
    const {omitState, visible} = this.state;
    const leaveout = omit && omit.m4.split(",");
    const aObj = Judgeactive[active];
    const mo = omit && this.omitSplit(active);
    return (
      <div>
        <div
          id="lotteryBetting"
          style={{height: ConHeight, overflow: "auto"}}
        >
          <div className="x11x5Betting">
            <LotteryNum
              nowStage={nowStage}
              HistoryStage={HistoryStage}
              HistoryStageFunc={HistoryStageFunc}
              active={active}
              gid={gid}
              serverTime={this.props.serverTime}
            />
            {/*选号*/}
            <div className="redBallTitle">
              <p className="p2"><span onClick={() => {
                this.props.creatOne()
              }
              }>摇一摇机选</span></p>
              <p className="p1" dangerouslySetInnerHTML={{__html: desc}}></p>
              <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.omitState} type={this.props.type}/>
            </div>
            <div className="BallChoice redBallChoice">
              <div className="column">{this.Template(1, 6, "unit", "red")}</div>
              <div
                className="column_missing"
                style={{display: omitState ? "flex" : "none"}}
              >
                {this.TemplateOmit(1, 6, mo)}
              </div>
              <div className="column">
                {this.Template(7, 11, "unit", "red")}
                <div className="emptyDiv"/>
              </div>
              <div
                className="column_missing"
                style={{display: omitState ? "flex" : "none"}}
              >
                {this.TemplateOmit(7, 11, mo)}
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
