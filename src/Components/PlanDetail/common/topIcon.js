"use strict";
import React, { Component } from "react";
import { PlanNumber } from "../../../common/LotType";

class TopIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gp: "",
      Pname: ""
    };
    this.playJudge = this.playJudge.bind(this);
    this.isFlag = this.isFlag.bind(this);
  }

  componentWillMount() {}

  playJudge(source) {
    const { gid, data } = this.props;
    const shareGod = data.shareGod
    let d = {};
    d.playname = PlanNumber[gid][2]; // 彩种
    if (source == "8" || source == "14") {
      d.gametype = "2选1"; // 玩法
    } else if (source == "15") {
      d.gametype = "一场制胜";
    } else {
      if (shareGod && shareGod == "2") {
        d.gametype = "神单跟买";
      } else {
        d.gametype = PlanNumber[gid][0];
      }
    }
    return d;
  }

  /* 1  撤单
    * 2 出票中
    * 3等待出票
    * 5出票成功
    * 6已开奖
    * 7已计奖
    * 8派奖中
    * 12已派奖
    * 13未支付
    * 14自动跟单中
    * else 发起
    * */
    /*result_1 等待开奖 result_2 再接再厉 result_3 约单中 result_4 派奖中 result_5 已中奖 result_6 约单失败*/
  isFlag(jindu,rmoney) {
    if(jindu){
      const isFlag = jindu.isflag;
      const mo = rmoney;
      if(isFlag == 1){ //约单中
        return 'result_6'
      }else if(isFlag == 2 || isFlag == 3){ //等待开奖
        return 'result_3'
      }else if(isFlag == 5){ //出票成功
        return 'result_1'
      }else if(isFlag == 8 || isFlag == 7 || isFlag == 6){ // 派奖中
        return 'result_4'
      }else if(isFlag == 12){ // 中奖或者再接再厉
        if(mo > 0){
          return 'result_5'
        }else{
          return 'result_2'
        }
      }
    }
    return '';
  }

  render() {
    const { Pname, gp, data, gid} = this.props;
    const source = data.row &&data.row.source || data.source;
    const jindu = data && data.jindu;
    const rmoney = data.row && data.row.rmoney || data.rmoney;
    const d = this.playJudge(source);
    const fl = this.isFlag(jindu,rmoney);
    const iconUrl = gid && PlanNumber[gid][4];
    return (
      <div className={`programHead ${fl || 'result_1'}`}>
        <div className="clearfix programHeadCont">
          <div className="programHeadCont_1">
            <img src={iconUrl} />
          </div>
          <div className="programHeadCont_2">
            <p className="p1">{d.playname }</p>
            <p className="p2">{d.gametype || `第${data.pid || (data.row && data.row.pid)}期`}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default TopIcon;
