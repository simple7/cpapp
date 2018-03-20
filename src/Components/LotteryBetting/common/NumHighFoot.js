import React, {Component} from "react";
import {Popover} from "antd-mobile";
import utils from "../../../common/utils";

const Item = Popover.Item;

class NumHighFoot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSelect = this.onSelect.bind(this);
    this.showMoney = this.showMoney.bind(this);
    this.judgeActive = this.judgeActive.bind(this);
    this.judgeActive04 = this.judgeActive04.bind(this);
  }

  judgeActive(choose) {
    const {active, chooseList, Judgeactive} = this.props;
    if (!active) return false;
    const activeObj = Judgeactive[active];
    if (active == 9) {
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0
      ) {
        return 2;
      }
    } else if (active == 10) {
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0 &&
        chooseList[active].hun.length > 0
      ) {
        return 3;
      }
    } else {
      if (chooseList[active].unit.length >= activeObj.num) {
        return 1;
      }
    }
    return false;
  }

  judgeActive04() {
    const {active, chooseList, Judgeactive} = this.props;
    if (!active) return false;
    const activeObj = Judgeactive[active];
    if (active == 10) {
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0
      ) {
        return 2;
      }
    } else if (active == 6) {
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0 &&
        chooseList[active].hun.length > 0
      ) {
        return 3;
      }
    } else if (active == 7 || active == 8) {
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0 &&
        chooseList[active].hun.length > 0 &&
        chooseList[active].kil.length > 0 &&
        chooseList[active].mir.length > 0
      ) {
        return 5;
      }
    } else {
      if (chooseList[active].unit.length >= activeObj.num) {
        return 1;
      }
    }
    return false;
  }

  showMoney() {
    const {gid} = this.props;
    if (gid == '59' || gid == '55') {
      return this.judgeActive()
    } else if (gid == '04') {
      return this.judgeActive04();
    } else if (gid == '10') {
    }
  }

  onSelect(opt) {
    console.log(opt.props.value);
    this.props.jxNum(opt.props.value);
  }

  render() {
    const {
      gid,
      desc,
      chooseList,
      active,
      clearChoose,
      doNext,
      zhushu
    } = this.props;
    let ballNum = chooseList[active];
    let showMoney = this.showMoney();
    //const { zhushu, money, JJscope, profit } = zmJJp;
    return (
      <footer className="bettingFooter">
        {/*数字彩 高频彩  下一步*/}
        <div className="clearfix bettingFooterInfo">
          {ballNum &&
          (ballNum.unit.length > 0 ||
          ballNum.ten.length > 0 ||
          ballNum.hun.length > 0 ||
          (ballNum.kil && ballNum.kil.length > 0) ||
          (ballNum.mir && ballNum.mir.length > 0)) ? (
            <div
              className="emptyClear"
              onClick={() => {
                clearChoose(active);
              }}
            />
          ) : (
            <Popover
              placement="topLeft"
              overlay={[
                <Item
                  key="10"
                  style={{background: "#49484B", color: "white"}}
                  value={10}
                >
                  10注
                </Item>,
                <Item
                  key="5"
                  style={{background: "#49484B", color: "white"}}
                  value={5}
                >
                  5注
                </Item>,
                <Item
                  key="1"
                  style={{background: "#49484B", color: "white"}}
                  value={1}
                >
                  1注
                </Item>
              ]}
              onSelect={this.onSelect}
              align={{
                overflow: {adjustY: 0, adjustX: 0},
                offset: [10, -10]
              }}
            >
              <div className="choicePopover">机选</div>
            </Popover>
          )}
          <div className="footerInfo">
            {showMoney ? (
              <p className="p3">
                共<span>{zhushu}</span>注 <span>{zhushu * 2}</span>元
              </p>
            ) : (
              <p className="p3" dangerouslySetInnerHTML={{__html: desc}}/>
            )}
          </div>
        </div>
        <a className="nextBtn" onClick={() => doNext()}>
          下一步
        </a>
      </footer>
    );
  }
}

export default NumHighFoot;
