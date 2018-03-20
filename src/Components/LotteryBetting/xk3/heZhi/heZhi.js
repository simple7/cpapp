"use strict";
import React, { Component } from "react";
import LotteryNum from "../../common/HighlotteryNum";

import {Popover} from 'antd-mobile';
const Item = Popover.Item;

export class HeZhi extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      visible: false,
      selected: ""
    };
  }
  onSelect(opt) {
    console.log(opt);
    this.setState({
      visible: false,
      selected: opt.props.value
    });
  }

  render() {
    const {
      ConHeight,
      omit,
      HistoryStage,
      nowStage,
      HistoryStageFunc,
      active,
      gid
    } = this.props;
    const leaveout = omit && omit.m4.split(',');
    return (
      <div
        className="xk3Betting"
        style={{ height: ConHeight, overflow: "auto" }}
      >
        <LotteryNum
          nowStage={nowStage}
          HistoryStage={HistoryStage}
          HistoryStageFunc={HistoryStageFunc}
          active={active}
          gid={gid}
        />
        {/*与开奖号码按位相符即中奖1040元*/}
        <div className="xk3Title_1">
          <p className="p2"><span>摇一摇机选</span></p>
          <p className="p1" dangerouslySetInnerHTML={{__html: desc}}></p>
          <Popover
            overlay={[
              (<Item key="10" style={{background: "#49484B", color: "white"}}>显示遗漏</Item>),
              (<Item key="5" style={{background: "#49484B", color: "white"}}>玩法说明</Item>)
            ]}
            align={{
              overflow: {adjustY: 0, adjustX: 0},
              offset: [-10, 5],
            }}
            onSelect={this.onSelect}
          >
            <div className="redBallTitle_position clearfix">
              <span className="zhushouSpan">助手</span>
            </div>
          </Popover>
        </div>
        {/*<div className="xk3Title_1">
          <p className="p1">
            猜中开奖号码之和最高可中<span>240</span>元{" "}
          </p>
          <div className="redBallTitle_position clearfix">
            <p className="MissingP">遗漏</p>
          </div>
        </div>*/}
        {/*选号*/}
        <div className="NumChoice">
          <div className="column">
            <div className="redBg">
              <p className="p1">3</p>
              <p className="p2">奖金240元</p>
            </div>
            <div>
              <p className="p1">4</p>
              <p className="p2">奖金80元</p>
            </div>
            <div>
              <p className="p1">5</p>
              <p className="p2">奖金40元</p>
            </div>
            <div>
              <p className="p1">6</p>
              <p className="p2">奖金25元</p>
            </div>
          </div>
          <div className="column_missing">
            {/*className="redColor"*/}
            <div>123</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </div>
          <div className="column">
            <div>
              <p className="p1">7</p>
              <p className="p2">奖金16元</p>
            </div>
            <div>
              <p className="p1">8</p>
              <p className="p2">奖金12元</p>
            </div>
            <div>
              <p className="p1">9</p>
              <p className="p2">奖金10元</p>
            </div>
            <div className="redBg">
              <p className="p1">10</p>
              <p className="p2">奖金9元</p>
            </div>
          </div>
          <div className="column_missing">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </div>
          <div className="column">
            <div className="redBg">
              <p className="p1">11</p>
              <p className="p2">奖金9元</p>
            </div>
            <div>
              <p className="p1">12</p>
              <p className="p2">奖金10元</p>
            </div>
            <div>
              <p className="p1">13</p>
              <p className="p2">奖金12元</p>
            </div>
            <div>
              <p className="p1">14</p>
              <p className="p2">奖金16元</p>
            </div>
          </div>
          <div className="column_missing">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </div>
          <div className="column">
            <div>
              <p className="p1">15</p>
              <p className="p2">奖金25元</p>
            </div>
            <div>
              <p className="p1">16</p>
              <p className="p2">奖金40元</p>
            </div>
            <div>
              <p className="p1">17</p>
              <p className="p2">奖金80元</p>
            </div>
            <div>
              <p className="p1">18</p>
              <p className="p2">奖金240元</p>
            </div>
          </div>
          <div className="column_missing">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
          </div>
        </div>
        {/*快速选号*/}
        <div className="xk3Title_2">
          <p className="p1">快速选号</p>
        </div>
        <div className="NumChoice">
          <div className="column">
            <div>
              <p className="p3">大</p>
            </div>
            <div>
              <p className="p3">小</p>
            </div>
            <div>
              <p className="p3">单</p>
            </div>
            <div className="redBg">
              <p className="p3">双</p>
            </div>
          </div>
        </div>
        {/*下一步*/}
      </div>
    );
  }
}
