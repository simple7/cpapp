'use strict'
import React, {Component} from 'react'
import LotteryNum from "../../common/HighlotteryNum";
import {Popover} from 'antd-mobile';
const Item = Popover.Item;
import ZhuShou from '../../common/zhushou'
export class DaXiaoDanShuang extends Component {
  constructor(props){
    super(props);
    this.state = {
      omitState: false
    }
    this.bigShow = this.bigShow.bind(this);
    this.bigHide = this.bigHide.bind(this);
    this.Template = this.Template.bind(this);
    this.TemplateOmit = this.TemplateOmit.bind(this);
    this.omitStateJudge = this.omitStateJudge.bind(this);
    this.clickItem = this.clickItem.bind(this);
    this.receiveYL = this.receiveYL.bind(this);
  }
  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      omitState: yl
    })
  }
  clickItem(e) {
    const { chooseList, callChoose} = this.props;
    let dataset = e.target.dataset;
    let i = dataset.v;
    let type = dataset.type;
    let active = dataset.active;
    let arr = JSON.parse(JSON.stringify(chooseList[active][type]));
    if (arr.indexOf(i) >= 0) {
      arr = arr.slice(0, arr.indexOf(i)).concat(arr.slice(arr.indexOf(i) + 1));
    }else if(arr.length > 0){
      arr = [];
      arr.push(i);
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

  Template(type, color) {
    const { chooseList } = this.props;
    const { active } = this.props;
    let st = 0;
    let en = ['大', '小', '单', '双'];
    let ty = type;
    let child = [];
    let choose = "";
    if(ty == "kil"){
      choose = chooseList[active].kil;
      ty = "kil";
    } else if(ty == "mir") {
      choose = chooseList[active].mir;
      ty = "mir";
    } else if (ty == "ten") {
      choose = chooseList[active].ten;
      ty = "ten";
    } else if (ty == "hun") {
      ty = "hun";
      choose = chooseList[active].hun;
    } else if(ty == "unit"){
      ty = "unit";
      choose = chooseList[active].unit;
    }
    for (let i = 0; i < en.length; i++) {
      let value =  en[i];
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
    const m7 = omit && omit.m7.split(',');
    const m8 = omit && omit.m8.split(',');
    return (
      <div id="lotteryBetting">
        <div className="sscBetting">
          <LotteryNum
            nowStage={nowStage}
            HistoryStage={HistoryStage}
            HistoryStageFunc={HistoryStageFunc}
            active={active}
            gid={gid}
            serverTime={this.props.serverTime}
          />
          <div className="redBallTitle">
            <p className="p4"><span onClick={() => {
              this.props.creatOne()
            }
            }>摇一摇机选</span></p>
            <p className="p2" dangerouslySetInnerHTML={{__html: desc}}></p>
            <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.omitState} type={this.props.type}/>
          </div>
          <div className="BallChoice redBallChoice BallChoice_pr">
            <div className="column">
              <div className="div1"><span>十位</span></div>
              {this.Template('ten', 'red')}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(1,4, m7)}
            </div>
          </div>
          {/*line */}
          <div className="lineBox"></div>
          {/*个位*/}
          <div className="BallChoice redBallChoice BallChoice_pr">
            <div className="column">
              <div className="div1"><span>个位</span></div>
              {this.Template('unit', 'red')}
            </div>
            <div className="column_missing" style={{ display: omitState ? "flex" : "none" }}>
              <div className="emptyDiv1"></div>
              {this.TemplateOmit(1,4, m8)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

