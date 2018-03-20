"use strict";
import React, {Component} from "react";
import commonConfig from '../../../config/commonConfig'

class Progress extends Component {
  constructor(props) {
    super(props);
    this.FontShowState = this.FontShowState.bind(this);
    this.BooleanJudge = this.BooleanJudge.bind(this);
    this.ProgresslineStyle = this.ProgresslineStyle.bind(this);
    this.ProgressDotStyle = this.ProgressDotStyle.bind(this);
    this.ProgressDescStyle = this.ProgressDescStyle.bind(this);
    this.ProgressTimeSplit = this.ProgressTimeSplit.bind(this);
    this.ProgressOpenAwardTimeShowState = this.ProgressOpenAwardTimeShowState.bind(
      this
    );
    this.BonusShowState = this.BonusShowState.bind(this);
  }

  /**
   * 约单中 派单中 显示判断
   * @param {*} jd
   */
  FontShowState(jd) {
    if (jd) {
      const J = jd;
      if (J.node == "1" && J.percent < 100 && J.isflag != "1") {
        return true;
      } else if (J.node == "3" && J.percent < 100) {
        return false;
      }
      return;
    }
  }

  /**
   * 进度条 线条样式判断
   * redBg红线 grayBg灰线
   * @param {*} node
   * @param {*} index
   */
  ProgresslineStyle(node, index, percent) {
    let className = "";
    className = node && node > index ? "redBg" : "grayBg";
    if (node == 1 && percent < 100) { //约单中
      className = "grayBg";
    }
    return className;
  }

  /**
   * 进度条 圆点样式判断
   * span1 灰色球 span2 红色球 span3 带勾红球
   * @param {*} node
   * @param {*} percent
   * @param {*} index
   */
  ProgressDotStyle(node, percent, index) {
    let className = "";
    if (index == 0) {
      className = node && node == 0 ? "span3" : "span2";
    } else if (index == 1 || index == 2) {
      className =
        percent && node && node == index && percent == "100"
          ? "span3"
          : node > index ? "span2" : "span1";
    } else if (index == 3) {
      className = node && node == 3 ? "span3" : "span1";
    }
    return className;
  }

  /**
   * 进度条 文字标红
   * @param {*} node
   * @param {*} index
   */
  ProgressDescStyle(node, index, percent) {
    let className = "";
    className = node && node == index ? "redColor" : "";
    if (index == 1 && percent < 100) { //约单中
      className = "";
    }
    return className;
  }

  /**
   * 进度条 时间拆分
   * @param {*} time
   * @param {*} index
   * @param {*} bool
   */
  ProgressTimeSplit(time, index, bool) {
    let t = "";
    const {data} = this.props;
    if (time && time.indexOf("(") > -1) {
      time = time.replace(/\(|\)/g, "");
    }
    if (time && bool) {
      time = time.replace(/^\d{4}\-/, "");
    }
    t = time && time.split(" ");
    if (t) {
      return t[index];
    }
    return;
  }

  ProgressOpenAwardTimeShowState(data) {
    let state =
      data.jindu &&
      (data.jindu.isflag == "6" ||
        data.jindu.isflag == "7" ||
        data.jindu.isflag == "8" ||
        data.jindu.isflag == "12");
    return !state;
  }

  BonusShowState(jindu) {
    const {data} = this.props;
    if (jindu) {
      let imoneyrange =
        data.imoneyrange != undefined ? data.imoneyrange : data.row.imoneyrange;
      let rmoney = data.rmoney || data.row.rmoney;
      let isFlag = jindu.isflag;
      if (isFlag == 1 || isFlag == 5 || isFlag == 2 || isFlag == 3) {
        return {state: false, des: "", money: ""};
      } else if (
        (isFlag == 8 ||
          isFlag == 7 ||
          isFlag == 6)
      ) {
        return {state: true, des: "预计奖金", money: imoneyrange};
      } else if (isFlag == 12) {
        if (rmoney > 0) {
          return {
            state: true,
            des: "中奖情况",
            money: `${rmoney}元`,
            className: "span2"
          };
        } else {
          return {state: true, des: "中奖情况", money: "未中奖"};
        }
      }
    }
    return {state: false};
  }

  /**
   * 布尔值 判断
   * @param {*} bool
   */
  BooleanJudge(bool) {
    if (typeof bool == "boolean") {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {data} = this.props;
    const jindu = data.jindu;
    const ctime = data.ctime || (data.row && data.row.ctime);
    const btime = data.btime || (data.row && data.row.btime);
    const shareGod = data.shareGod;
    const FontShowState = this.FontShowState(jindu);
    const fontSS = this.BooleanJudge(FontShowState);
    const paint = jindu && jindu.paint;
    const node = jindu && jindu.node;
    const percent = jindu && jindu.percent;
    const kjtime = jindu && jindu.kjtime;
    const bonusObj = this.BonusShowState(jindu);
    return (
      <div>
        {/*进度*/}
        <div className="progressDiv">
          {/*第一行*/}
          <div className="progressDiv_1">
            <div className={FontShowState && fontSS ? "txt" : (paint=='约单失败'?"txt":"")}>
              {FontShowState && fontSS ? "约单中" : (paint=='约单失败'?"约单失败":"")}
            </div>
            <div className=""/>
            <div className={!FontShowState && fontSS ? "txt" : ""}>
              {!FontShowState && fontSS ? "派单中" : ""}
            </div>
          </div>
          {/*第二行*/}
          <div className="progressDiv_2">
            {/*第一个球*/}
            <div className="progressDiv_2_cont">
              <div className="div1"/>
              {/*第一个没有线*/}
              <div className="div2">
                <span className={this.ProgressDotStyle(node, percent, 0)}/>
              </div>
              <div className={`div1 ${this.ProgresslineStyle(node, 0)}`}/>
            </div>
            {/*第二个球*/}
            <div className="progressDiv_2_cont">
              <div className={`div1 ${this.ProgresslineStyle(node, 0, percent)}`}/>
              <div className="div2">
                <span className={this.ProgressDotStyle(node, percent, 1)}/>
              </div>
              <div className={`div1 ${this.ProgresslineStyle(node, 1)}`}/>
            </div>
            {/*第三个球*/}
            <div className="progressDiv_2_cont">
              <div className={`div1 ${this.ProgresslineStyle(node, 1)}`}/>
              <div className="div2">
                <span className={this.ProgressDotStyle(node, percent, 2)}/>
              </div>
              <div className={`div1 ${this.ProgresslineStyle(node, 2)}`}/>
            </div>
            {/*第四个球*/}
            <div className="progressDiv_2_cont">
              <div className={`div1 ${this.ProgresslineStyle(node, 2)}`}/>
              <div className="div2">
                <span className={this.ProgressDotStyle(node, percent, 3)}/>
              </div>
              <div className="div1"/>
            </div>
          </div>
          {/*第三行*/}
          <div className="progressDiv_3 clearfix">
            <div>
              <p className={`p1 ${this.ProgressDescStyle(node, 0)}`}>发起约单</p>
              <p className="p2">{this.ProgressTimeSplit(btime, 0, true)}</p>
              <p className="p2">{this.ProgressTimeSplit(btime, 1)}</p>
            </div>
            <div>
              <p className={`p1 ${this.ProgressDescStyle(node, 1, percent)}`}>约单成功</p>
              <p className="p2">{this.ProgressTimeSplit(ctime, 0)}</p>
              <p className="p2">{this.ProgressTimeSplit(ctime, 1)}</p>
            </div>
            <div>
              <p className={`p1 ${this.ProgressDescStyle(node, 2)}`}>开奖</p>
              <p className="p2">
                {this.ProgressOpenAwardTimeShowState(data) &&
                this.ProgressTimeSplit(kjtime, 0)}
              </p>
              <p className="p2">
                {this.ProgressOpenAwardTimeShowState(data) &&
                this.ProgressTimeSplit(kjtime, 1)}
              </p>
            </div>
            <div>
              <p className={`p1 ${this.ProgressDescStyle(node, 3)}`}>派奖</p>
              <p className="p2"/>
              <p className="p2"/>
            </div>
          </div>
        </div>
        <table cellSpacing="0" cellPadding="0" className="moneyTable">
          <tbody>
          <tr>
            <td className="td1">订单金额</td>
            <td className="td2">
              {data &&
              `${data.tmoney || (data.row && data.row.tmoney) || "--"}元`}
              {data.rpmoney > 0 ? `(使用${data.rpmoney}元红包)` : ""}
              {this.props.zj &&
              `${this.props.zj}`}
            </td>
          </tr>
          {bonusObj.state && (
            <tr>
              <td className="td1">{bonusObj.des}</td>
              <td className="td2">
                  <span className={bonusObj.className}>
                    {data.shareGod == 2 && data.rmoney > 0
                      ? `方案金额${bonusObj.money}，打赏发单人${data.reward}元`
                      : bonusObj.money}
                  </span>
              </td>
            </tr>
          )}
          </tbody>
        </table>
        {/*跟买信息*/}
        {data.shareGod &&
        data.shareGod == 2 && (
          <div>
            <div className="titleDiv">跟买信息</div>
            <table cellSpacing="0" cellPadding="0" className="moneyTable">
              <tbody>
              <tr>
                <td className="td1">发单人</td>
                <td className="td2 blueColor">
                  <a
                    style={{color: "#2395ff"}}
                    href={`${commonConfig.domain}sdjc/details.html?loc=${data.hideSharedNickid}`}
                  >
                    {data.sharedNickid}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="td1">打赏比例</td>
                <td className="td2">
                  {data.minRatio}%<span className="span4"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Progress;
