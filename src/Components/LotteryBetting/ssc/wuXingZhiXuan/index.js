'use strict'
import React, {Component} from 'react'
import LotteryNum from "../../common/HighlotteryNum";
import {Popover} from 'antd-mobile';
const Item = Popover.Item;
import ZhuShou from '../../common/zhushou'

export class WuXingZhiXuan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      omitState: false,
      active1: false,
      active2: false,
      active3: false
    }
    this.bigShow = this.bigShow.bind(this);
    this.bigHide = this.bigHide.bind(this);
    this.Template = this.Template.bind(this);
    this.TemplateOmit = this.TemplateOmit.bind(this);
    this.omitStateJudge = this.omitStateJudge.bind(this);
    this.omitJudge = this.omitJudge.bind(this);
    this.clickItem = this.clickItem.bind(this);
    this.ChangeActive = this.ChangeActive.bind(this);
    this.receiveYL = this.receiveYL.bind(this);
  }
  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      omitState: yl
    })
  }
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

  Template(start, end, type, color) {
    const {chooseList} = this.props;
    const {active} = this.props;
    let st = start;
    let en = end;
    let ty = type;
    let child = [];
    let choose = "";
    if (ty == "kil") {
      choose = chooseList[active].kil;
      ty = "kil";
    } else if (ty == "mir") {
      choose = chooseList[active].mir;
      ty = "mir";
    } else if (ty == "ten") {
      choose = chooseList[active].ten;
      ty = "ten";
    } else if (ty == "hun") {
      ty = "hun";
      choose = chooseList[active].hun;
    } else if (ty == "unit") {
      ty = "unit";
      choose = chooseList[active].unit;
    }
    for (let i = st; i <= en; i++) {
      let value = `${i}`;
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
      let child = [];
      for (let i = start - 1; i < end; i++) {
        let value = arr[i];
        child.push(<div key={i}>{value}</div>);
      }
      return child;
    }
    return false;
  }

  omitStateJudge() {
    const {omitState} = this.state;
    this.setState({
      omitState: !omitState
    })
  }

  omitJudge() {
    const {active, omit} = this.props;
    if (active && omit) {
      if (active == '1') {
        return omit.m6.split(',')
      } else if (active == '2' || active == '3') {
        return omit.m5.split(',')
      } else if (active == '4') {
        return omit.m4.split(',')
      }
    }
    return false;
  }

  ChangeActive() {
    const {active} = this.props;
    if (active == '5') {
      return 2
    } else if (active == '6') {
      return 3
    } else if (active == '7' || active == '8') {
      return 5
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
      desc,
      Judgeactive,
      callChoose,
      chooseList
    } = this.props;
    const {omitState} = this.state;
    const aState = this.ChangeActive();
    const m0 = omit && omit.m0.split(',');
    const m1 = omit && omit.m1.split(',');
    const m2 = omit && omit.m2.split(',');
    const m3 = omit && omit.m3.split(',');
    const m4 = omit && omit.m4.split(',');
    return (
      <div id="lotteryBetting" style={{height: ConHeight, overflow:'auto'}}>
        <div className="sscBetting">
          <LotteryNum
            nowStage={nowStage}
            HistoryStage={HistoryStage}
            HistoryStageFunc={HistoryStageFunc}
            active={active}
            gid={gid}
            serverTime={this.props.serverTime}
          />
          {/*选号*/}
          {/*万位*/}
          <div className="redBallTitle">
            <p className="p4"><span onClick={() => {
              this.props.creatOne()
            }
            }>摇一摇机选</span></p>
            <p className={active == '8'?'p3':"p1"} dangerouslySetInnerHTML={{ __html: desc }} ></p>
            <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.omitState} type={this.props.type}/>
          </div>
          {aState == 5 && <div>
            <div className="BallChoice redBallChoice">
              <div className="column">
                <div className="div1"><span>万位</span></div>
                {this.Template(0, 4, 'mir', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(1,5, m0)}
              </div>
              <div className="column">
                <div className="emptyDiv1"></div>
                {this.Template(5, 9, 'mir', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(6,10, m0)}
              </div>
            </div>
            {/*line */}
            <div className="lineBox"></div>
          </div>}
          {/*千位*/}
          {aState == 5 && <div>
            <div className="BallChoice redBallChoice">
              <div className="column">
                <div className="div1"><span>千位</span></div>
                {this.Template(0, 4, 'kil', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(1,5, m1)}
              </div>
              <div className="column">
                <div className="emptyDiv1"></div>
                {this.Template(5, 9, 'kil', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(6,10, m1)}
              </div>
            </div>
            {/*line */}
            <div className="lineBox"></div>
          </div>}
          {/*百位*/}
          {(aState == 5 || aState == 3) && <div>
            <div className="BallChoice redBallChoice">
              <div className="column">
                <div className="div1"><span>百位</span></div>
                {this.Template(0, 4, 'hun', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(1,5, m2)}
              </div>
              <div className="column">
                <div className="emptyDiv1"></div>
                {this.Template(5, 9, 'hun', 'red')}
              </div>
              <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
                <div className="emptyDiv1"></div>
                {this.TemplateOmit(6,10, m2)}
              </div>
            </div>
            {/*line */}
            <div className="lineBox"></div>
          </div>}
          {/*十位*/}
          {(aState == 5 || aState == 3 || aState == 2) && <div className="BallChoice redBallChoice">
            <div className="column">
              <div className="div1"><span>十位</span></div>
              {this.Template(0, 4, 'ten', 'red')}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(1,5, m3)}
            </div>
            <div className="column">
              <div className="emptyDiv1"></div>
              {this.Template(5, 9, 'ten', 'red')}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(6,10, m3)}
            </div>
          </div>}
          {/*line */}
          <div className="lineBox"></div>
          {/*个位*/}
          {(aState == 5 || aState == 3 || aState == 2) && <div className="BallChoice redBallChoice">
            <div className="column">
              <div className="div1"><span>个位</span></div>
              {this.Template(0, 4, 'unit', 'red')}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(1,5, m4)}
            </div>
            <div className="column">
              <div className="emptyDiv1"></div>
              {this.Template(5, 9, 'unit', 'red')}
            </div>
            <div className="column_missing last_p40" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(6,10, m4)}
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

