"use strict";
import React, { Component } from "react";
import {Popover} from 'antd-mobile';
import LotteryNum from "../../common/HighlotteryNum";
import ZhuShou from '../../common/zhushou'

const Item = Popover.Item;
export class Qian2ZhiXuan extends Component {
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

  //点击选中球
  clickItem(e) {
    const { chooseList } = this.props;
    let dataset = e.target.dataset;
    let i = dataset.v;
    let type = dataset.type;
    let active = dataset.active;
    let obj = JSON.parse(JSON.stringify(chooseList[active]));
    let arr = obj[type];
    let key = Object.keys(obj);
    let arr1 = null,
      arr2 = null;
    if (arr.indexOf(i) >= 0) {
      arr = arr.slice(0, arr.indexOf(i)).concat(arr.slice(arr.indexOf(i) + 1));
    } else {
      arr.push(i);
    }
    obj[type] = arr;
    for (let x = 0; x < key.length; x++) {
      if (key[x] != type) {
        let attrArr = obj[key[x]];
        if (attrArr.indexOf(i) >= 0) {
          attrArr = attrArr
            .slice(0, attrArr.indexOf(i))
            .concat(attrArr.slice(attrArr.indexOf(i) + 1));
          obj[key[x]] = attrArr;
        }
      }
    }
    let choose = JSON.parse(JSON.stringify(chooseList));
    choose[active] = obj;
    this.props.callChoose(choose);
  }
  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      omitState: yl
    })
  }
  onSelect(opt) {
    this.setState({
      selected: opt.props.value
    });
  }

  omitStateJudge() {
    const { omitState } = this.state;
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
    const { omit } = this.props;
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
    const { chooseList } = this.props;
    const { active } = this.props;
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
      const { omitState } = this.state;
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
    const { omitState, visible } = this.state;
    const leaveout = omit && omit.m4.split(",");
    const aObj = Judgeactive[active];
    const m1 = omit && omit.m1.split(",");
    const m4 = omit && omit.m4.split(",");
    return (
      <div id="lotteryBetting" style={{ height: ConHeight, overflow: "auto" }}>
        <div className="x11x5Betting">
          <LotteryNum
            nowStage={nowStage}
            HistoryStage={HistoryStage}
            HistoryStageFunc={HistoryStageFunc}
            active={active}
            gid={gid}
            serverTime={this.props.serverTime}
          />
          <div className="redBallTitle">
            <p className="p2"><span onClick={() => {
              this.props.creatOne()
            }
            }>摇一摇机选</span></p>
            <p className="p1" dangerouslySetInnerHTML={{__html: desc}}></p>
            <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.omitState} type={this.props.type}/>
          </div>

          <div className="BallChoice redBallChoice">
            <div className="column">
              <div className="div2 clearfix">
                <span>第一位</span>
              </div>
              {this.Template(1, 6, "unit", "red")}
            </div>
            <div
              className="column_missing"
              style={{ display: omitState ? "flex" : "none" }}
            >
              <div className="emptyDiv2" />
              {this.TemplateOmit(1, 6, m1)}
            </div>
            <div className="column">
              <div className="emptyDiv2" />
              {this.Template(7, 11, "unit", "red")}
              <div className="emptyDiv" />
            </div>
            <div
              className="column_missing"
              style={{ display: omitState ? "flex" : "none" }}
            >
              <div className="emptyDiv2" />
              {this.TemplateOmit(7, 11, m1)}
              <div />
              <div />
            </div>
          </div>
          {/*line */}
          <div className="lineBox" />
          {/*第二位*/}
          <div className="BallChoice redBallChoice">
            <div className="column">
              <div className="div2 clearfix">
                <span>第二位</span>
              </div>
              {this.Template(1, 6, "ten", "red")}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv2" />
              {this.TemplateOmit(1, 6, m4)}
            </div>
            <div className="column">
              <div className="emptyDiv2" />
              {this.Template(7, 11, "ten", "red")}
              <div className="emptyDiv" />
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv2" />
              {this.TemplateOmit(7, 11, m4)}
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
