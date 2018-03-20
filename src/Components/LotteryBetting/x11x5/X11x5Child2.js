"use strict";
import React, { Component } from "react";
import { hashHistory } from "react-router";
import { Tabs, Popover, Toast, NavBar } from "antd-mobile";
import utils from "../../../common/utils";
import { szcHistory } from "../../../Stubs/API";
import NumHighFoot from "../common/NumHighFoot";
import DownComt from '../common/downComt'
const TabPane = Tabs.TabPane;
import commonConfig from '../../../config/commonConfig'
import _ from 'lodash'
import { RenXuan2 } from "./renXuan2/renXuan2";
import { Qian2ZhiXuan } from "./qian2ZhiXuan/qian2ZhiXuan";
import { Qian3ZhiXuan } from "./qian3ZhiXuan/qian3ZhiXuan";

class X11x5Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      HistoryStage: null,
      nowStage: null,
      omit: null,
      serverTime: '',
      gid: this.props.gid,
      betList: this.props.betList,
      chooseList: this.props.currentChoose,
      ballNum: null,
      zhushu: "",
      zongZhushu: 0,
      money: 0,
      menuShow:false,
      currentIndex:''
    };
    this.tabsData = [
      { title: "任选二",key: '1'},
      { title: "任选三" ,key: '2'},
      { title: "任选四" ,key: '3'},
      { title: "任选五" ,key: '4'},
      { title: "任选六" ,key: '5'},
      { title: "任选七" ,key: '6'},
      { title: "任选八" ,key: '7'},
      { title: "前一直选" ,key: '8'},
      { title: "前二直选" ,key: '9'},
      { title: "前三直选" ,key: '10'},
      { title: "前二组选" ,key: '11'},
      { title: "前三组选" ,key: '12'}
    ];
    this.Judgeactive = {
      1: { num: 2, m: 6 },
      2: { num: 3, m: 19 },
      3: { num: 4, m: 78 },
      4: { num: 5, m: 540 },
      5: { num: 6, m: 90 },
      6: { num: 7, m: 26 },
      7: { num: 8, m: 9 },
      8: { num: 1, m: 13 },
      9: { num: 2, m: 130 },
      10: { num: 3, m: 1170 },
      11: { num: 2, m: 65 },
      12: { num: 3, m: 195 }
    };
    this.type = {
      "59": "x11x5",
      "55": "y11x5"
    };
    this.initChoose = this.forChoose()
    this.animating = false;
    this.switchType = this.switchType.bind(this);
    this.callback = this.callback.bind(this);
    this.JudgeDesc = this.JudgeDesc.bind(this);
    this.initialize = this.initialize.bind(this);
    this.getPropsActive = this.getPropsActive.bind(this);
    this.SetnavTitle = this.SetnavTitle.bind(this);
    this.clearChoose = this.clearChoose.bind(this);

    this.jxNum = this.jxNum.bind(this);
    this.computeAll = this.computeAll.bind(this);
    this.doNext = this.doNext.bind(this);
    this.creatOne = this.creatOne.bind(this);

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
    this.shark = this.shark.bind(this);
    this.forChoose = this.forChoose.bind(this);
  }

  componentDidUpdate() {
    let programList = document.getElementsByClassName("programList")[0];
    if (programList && this.state.popListHeight === "") {
      let w = document.documentElement
        ? document.documentElement.clientHeight
        : document.body.clientHeight;
      let myNavHeight = document.getElementsByClassName("myNav")[0]
        .offsetHeight;
      let bettingFooter = document.getElementsByClassName("programFooter")[0]
        .offsetHeight;
      let listHeight = w - myNavHeight - bettingFooter - 80;
      this.setState({
        popListHeight: listHeight
      });
    }
  }

  componentDidMount() {
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
    this.initialize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentChoose) {
      this.setState({
        chooseList: nextProps.currentChoose
      });
    }
  }

  initialize() {
    this.getPropsActive();
    this.JinshuZhuS();
    this.HistoryStageFunc();
  }

  getPropsActive() {
    const { active } = this.state;
    let content = "";
    if (active) {
      content = this.JudgeDesc(active);
      this.setState({
        desc: content
      });
    }
  }

  HistoryStageFunc(bool) {
    const {gid} = this.state;
    szcHistory(gid).then(res => {
      this.setState({
        nowStage: res.rowc,
        HistoryStage: res.row,
        omit: res.rowp,
        pid: res.rowc.p,
        serverTime: res.serverTime
      });
    });
  }

  // 遍历生成初始chooseList
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

  JudgeDesc(key) {
    let content = `至少选<span>${Number(key) + 1}</span>个号`;
    switch (key) {
      case "1":
        return content;
        break;
      case "2":
      case "3":
      case "4":
      case "5":
        return content;
        break;
      case "6":
      case "7":
        return content;
        break;
      case "8":
        return "至少选<span>1</span>个号";
        break;
      case "9":
      case "10":
        return "每位至少选<span>1</span>个号";
        break;
      case "11":
        return "至少选<span>2</span>个号";
        break;
      case "12":
        return "至少选<span>3</span>个号";
        break;
    }
  }

  callback(key) {
    let content = this.JudgeDesc(key);
    this.setState({
      desc: content
    });
  }

  SetnavTitle(gid) {
    if (gid == 59) {
      return "新11选5";
    } else {
      return "粤11选5";
    }
  }

  menuPop(flag) {
    this.setState({
      menuShow: flag,
    });
  }

  clickWF(key) {
    this.setState({
      active:key,
      menuShow:false
    },()=>{
      this.callback(key)
      let url = utils.setUrlHash("active", key);
      hashHistory.replace(url);
    })
  }

  // 计算奖金范围 奖金 注数
  JinshuZhuS() {
    const { active, chooseList } = this.state;
    let zhushu = "",
      JJscope = "",
      profit = "";
    if (!active) return false;
    const activeObj = this.Judgeactive[active];
    const choose = chooseList[active];
    if (active == 9) {
      zhushu = choose.unit.length * choose.ten.length;
    } else if (active == 10) {
      zhushu = choose.unit.length * choose.hun.length * choose.ten.length;
    } else {
      zhushu = utils.math.C(choose.unit.length, activeObj.num);
    }
    if (!zhushu) return false;
    JJscope = `${activeObj.m}~${activeObj.m * zhushu}`;
    profit = `${activeObj.m - zhushu * 2}~${activeObj.m * zhushu - zhushu * 2}`;
    this.setState({
      zhushu: zhushu,
      JJscope: JJscope,
      profit: profit
    });
    return true;
  }

  /**
   * tab导航 active切换
   * @param key
   */
  switchType(key) {
    this.setState({
      active: key,
      ZXactive: key
    });
  }

  /**
   * 获取点击的球号
   * @param d
   */
  callChoose(d) {
    this.setState(
      {
        chooseList: d
      },
      () => {
        this.JinshuZhuS();
      }
    );
  }

  /**
   * 清空全部
   */
  clearChoose() {
    const { active, chooseList } = this.state;
    chooseList[active] = {
      unit: [],
      ten: [],
      hun: []
    };
    this.setState(
      {
        chooseList: chooseList,
        betList: [],
        zongZhushu: 0,
        money: 0,
        showType: 1
      },
      () => {
        this.computeAll();
      }
    );
  }

  /**
   * 重新计算投注金额
   */
  computeAll() {
    const { betList } = this.props;
    let betarr = JSON.parse(JSON.stringify(betList));
    let beiNum = this.state.beiNum;
    let buyQi = this.state.buyQi;
    let zhushu = 0;
    betarr.map((item, index) => {
      zhushu += item.zhushu;
    });
    this.setState({
      zongZhushu: zhushu,
      money: zhushu * beiNum * buyQi * 2
    });
  }

  //生成一注
  creatOne(render=true) {
    let {active} = this.state
    let chooseList = _.cloneDeep(this.initChoose)
    let activeNum = this.Judgeactive[active].num;
    let needSort = true;
    if (active == 9 || active == 10) {
      needSort = false
    }
    let code = utils.math.padArray(utils.math.random(1, 11, activeNum, false))
    if (needSort) {
      code = code.sort(function (a, b) {
        return a - b;
      });
    }
    if (active == 9) {
      chooseList[active] = {
        unit: [code[0]],
        ten: [code[1]],
        hun: []
      }
    } else if (active == 10) {
      chooseList[active] = {
        unit: [code[0]],
        ten: [code[1]],
        hun: [code[2]]
      }
    } else {
      chooseList[active] = {
        unit: code,
        ten: [],
        hun: []
      }
    }
    if(render){
      this.setState({
        chooseList: chooseList
      }, () => {
        this.JinshuZhuS()
      })
    }else{
      return chooseList
    }

  }
  /**
   * 点击下一步
   * @returns {boolean}
   */
  doNext() {
    const { active, chooseList, zhushu, betList } = this.state;
    const activeNum = this.Judgeactive[active];
    let arr = [];
    if (active == 9) {
      if (chooseList[active].unit.length === 0 && chooseList[active].ten.length === 0) {
        this.creatOne()
        return
      }
      if (
        chooseList[active].unit.length == 0 ||
        chooseList[active].ten.length == 0
      ) {
        Toast.info("请至少选择1注", 1, null, false);
        return;
      }
    } else if (active == 10) {
      if (chooseList[active].unit.length === 0 && chooseList[active].ten.length === 0 && chooseList[active].hun.length === 0) {
        this.creatOne()
        return
      }
      if (
        chooseList[active].unit.length == 0 ||
        chooseList[active].ten.length == 0 ||
        chooseList[active].hun.length == 0
      ) {
        Toast.info("请至少选择1注", 1, null, false);
        return;
      }
    } else {
      if (chooseList[active].unit.length === 0) {
        this.creatOne()
        return
      }
      if (chooseList[active].unit.length < activeNum.num) {
        Toast.info("请至少选择1注", 1, null, false);
        return;
      }
    }
    let current  = this.props.currentChoose
    if(current && current.index){
      chooseList.index = current.index
    }
    if (chooseList.index) {
      let param = {
        ...chooseList[active],
        index: chooseList.index,
        zhushu: zhushu,
        zigou: true,
        active: active
      };
      param.unit = param.unit.sort((a, b) => {
        return a - b
      })
      param.ten = param.ten.sort((a, b) => {
        return a - b
      })
      param.hun = param.hun.sort((a, b) => {
        return a - b
      })
      this.props.receive(param, "zx");
    } else {
      let param = {
        ...chooseList[active],
        index: betList.length + 1,
        zhushu: zhushu,
        zigou: true,
        active: active
      };
      param.unit = param.unit.sort((a, b) => {
        return a - b
      })
      param.ten = param.ten.sort((a, b) => {
        return a - b
      })
      param.hun = param.hun.sort((a, b) => {
        return a - b
      })
      this.props.receive(param, "zx", true);
    }
  }

  /**
   * 机选
   * @param{Number} n
   */
  jxNum(n) {
    const { active, betList } = this.state;
    let betCopy = [];
    for (let i = 0; i < n; i++) {
      let unit = [];
      let ten = [];
      let hun = [];
      let code = null;
      if (active == 9) {
        code = utils.math
          .padArray(utils.math.random(1, 11, 2, false))
          .sort(function(a, b) {
            return a - b;
          });
        unit = unit.concat(code[0]);
        ten = ten.concat(code[1]);
      } else if (active == 10) {
        code = utils.math
          .padArray(utils.math.random(1, 11, 3, false))
          .sort(function(a, b) {
            return a - b;
          });
        unit = unit.concat(code[0]);
        ten = ten.concat(code[1]);
        hun = hun.concat(code[2]);
      } else {
        code = utils.math
          .padArray(
            utils.math.random(1, 11, this.Judgeactive[active].num, false)
          )
          .sort(function(a, b) {
            return a - b;
          });
        unit = unit.concat(code);
      }
      let param = {
        unit: unit || [],
        ten: ten || [],
        hun: hun || [],
        index: betList.length + 1,
        zhushu: 1,
        active: active
      };
      betCopy.unshift(param);
    }
    this.props.receive(betCopy, "jx");
  }

  shark() {
    let {active} = this.state
    let obj = _.cloneDeep(this.initChoose)
    if (!this.animating) {
      this.animating = true;
      this.setState({
        chooseList: obj,
      }, () => {
        this.JinshuZhuS();
        let code = this.creatOne(false);
        let unitL = code[active].unit.length
        let tenL = code[active].ten.length
        let hunL = code[active].hun.length
        let i = 0;
        let flag = 'unit'
        let intel = setInterval(() => {
          let choose = this.state.chooseList
          if (flag === 'unit') {
            if (i < unitL) {
              choose[active].unit.push(code[active].unit[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'ten'
              i = 0
            }
          }
          if (flag === 'ten') {
            let choose = this.state.chooseList
            if (i < tenL) {
              choose[active].ten.push(code[active].ten[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'hun'
              i = 0
            }
          }
          if (flag === 'hun') {
            let choose = this.state.chooseList
            if (i < hunL) {
              choose[active].hun.push(code[active].hun[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'end'
            }
          }
          if (flag === 'end') {
            clearInterval(intel)
            this.animating = false
            this.JinshuZhuS()
          }
        }, commonConfig.AnimateDuration)
      })
    }
  }

  render() {
    utils.Shake.run(() => {
      this.shark()
    })
    let {
      setShowType,
      HistoryStageFunc
    } = this.props;
    let { active, gid, chooseList, desc, ConHeight, zhushu , nowStage, HistoryStage, omit, serverTime, menuShow} = this.state;
    return (
      <div id="lotteryBetting" zIndex="1">
        <NavBar
          className="myNav"
          mode="dark"
          iconName="cross"
          onLeftClick={() => {
            setShowType(2);
          }}
          rightContent={
            <div onClick={() => hashHistory.push("/index")} className="home" />
          }
          style={{
            position: "relative",
            height: "44px",
            zIndex: 2,
            backgroundColor: "#FC5638"
          }}
        >
          {this.SetnavTitle(gid)}
        </NavBar>
        <div className={sessionStorage.getItem("headFlag")?"Newarrow1":"Newarrow"} onClick={()=>this.menuPop(true)}><span/></div>
        {/*Newarrow有头部 Newarrow1没有头部*/}
        {menuShow ? <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData}/> : null}
        {menuShow ? <div className="menu-mask" onClick={()=>this.menuPop(false)}/> : null}
        <Tabs
          onChange={this.callback}
          pageSize={3}
          speed="3"
          onTabClick={this.switchType}
          swipeable={false}
          useOnPan={false}
          activeKey={active}
        >
          {this.tabsData.map((item, index) => {
            const key = index + 1;
            let content = "";
            if (item.title == "前二直选") {
              content = (
                <Qian2ZhiXuan
                  key={index}
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  HistoryStageFunc={HistoryStageFunc}
                  active={key}
                  gid={gid}
                  Judgeactive={this.Judgeactive}
                  chooseList={chooseList}
                  callChoose={this.callChoose.bind(this)}
                  serverTime={this.state.serverTime}
                  type={this.type[gid]}
                  creatOne={this.creatOne}
                />
              );
            } else if (item.title == "前三直选") {
              content = (
                <Qian3ZhiXuan
                  key={index}
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  HistoryStageFunc={HistoryStageFunc}
                  active={key}
                  gid={gid}
                  Judgeactive={this.Judgeactive}
                  chooseList={chooseList}
                  callChoose={this.callChoose.bind(this)}
                  serverTime={this.state.serverTime}
                  type={this.type[gid]}
                  creatOne={this.creatOne}
                />
              );
            } else {
              content = (
                <RenXuan2
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  HistoryStageFunc={HistoryStageFunc}
                  active={key}
                  gid={gid}
                  Judgeactive={this.Judgeactive}
                  chooseList={chooseList}
                  callChoose={this.callChoose.bind(this)}
                  serverTime={this.state.serverTime}
                  type={this.type[gid]}
                  creatOne={this.creatOne}
                />
              );
            }
            return (
              <TabPane tab={item.title} key={key}>
                {content}
              </TabPane>
            );
          })}
        </Tabs>
        <NumHighFoot
          gid={gid}
          chooseList={chooseList}
          desc={desc}
          active={active}
          Judgeactive={this.Judgeactive}
          clearChoose={this.clearChoose.bind(this)}
          doNext={this.doNext.bind(this)}
          zhushu={zhushu}
          jxNum={this.jxNum}
        />
      </div>
    );
  }
}

export default X11x5Child2;
