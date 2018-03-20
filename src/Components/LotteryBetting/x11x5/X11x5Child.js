"use strict";
import React, {Component} from "react";
import {hashHistory} from "react-router";
import {Tabs, Popover, Toast, NavBar} from "antd-mobile";
import CommonNavBar from "../../CommonComts/CommonNavBar";
import utils from "../../../common/utils";
import {szcHistory, lotteryControl, userBasicInfo} from "../../../Stubs/API";
import NumHighFoot from "../common/NumHighFoot";
import UserProtocol from "../common/userProtocol";
import commonConfig from '../../../config/commonConfig'
import _ from 'lodash'

const TabPane = Tabs.TabPane;

import {RenXuan2} from "./renXuan2/renXuan2";
import {Qian2ZhiXuan} from "./qian2ZhiXuan/qian2ZhiXuan";
import {Qian3ZhiXuan} from "./qian3ZhiXuan/qian3ZhiXuan";
import DownComt from '../common/downComt'
import X11x5Child2 from "./X11x5Child2";
import DelIcon from "../../../Img/lotteryBetting/delIcon.png";
import {AppJiek} from '../../../common/AppApi'

class LotteryBetting11x5Child extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "",
      ZXactive: "",
      visible: false,
      desc: "",
      ConHeight: "",
      popListHeight: "",
      HistoryStage: null,
      nowStage: null,
      omit: null,
      gid: "",
      chooseList: null,
      betList: [],
      ballNum: null,
      showType: 1,
      read: true,
      minQi: 1,
      maxQi: 10,
      minBei: 1,
      maxBei: 999,
      buyQi: 1,
      beiNum: 1,
      zhushu: "",
      zongZhushu: 0,
      money: 0,
      JJscope: "",
      profit: 0,
      codes: "",
      pid: "", //当前期号
      zhShow: false,
      stopZh: false,
      serverTime: '',
      menuShow: false,
    };
    this.tabsData = [
      {title: "任选二", key: '1', desc: '猜中任意2个开奖号码即中奖<span>6</span>元'},
      {title: "任选三", key: '2', desc: '猜中任意3个开奖号码即中奖<span>19</span>元'},
      {title: "任选四", key: '3', desc: '猜中任意4个开奖号码即中奖<span>78</span>元'},
      {title: "任选五", key: '4', desc: '猜中全部5个开奖号码即中奖<span>540</span>元'},
      {title: "任选六", key: '5', desc: '猜中全部5个开奖号码即中奖<span>90</span>元'},
      {title: "任选七", key: '6', desc: '猜中全部5个开奖号码即中奖<span>26</span>元'},
      {title: "任选八", key: '7', desc: '猜中全部5个开奖号码即中奖<span>9</span>元'},
      {title: "前一直选", key: '8', desc: '猜中第1位开奖号码即中奖<span>13</span>元'},
      {title: "前二直选", key: '9', desc: '按位猜中前2位开奖号码即中奖<span>130</span>元'},
      {title: "前三直选", key: '10', desc: '按位猜中前3位开奖号码即中奖<span>1170</span>元'},
      {title: "前二组选", key: '11', desc: '猜中前2位开奖号码即中奖<span>65</span>元'},
      {title: "前三组选", key: '12', desc: '猜中前3位开奖号码即中奖<span>195</span>元'}
    ];
    this.Judgeactive = {
      1: {num: 2, m: 6},
      2: {num: 3, m: 19},
      3: {num: 4, m: 78},
      4: {num: 5, m: 540},
      5: {num: 6, m: 90},
      6: {num: 7, m: 26},
      7: {num: 8, m: 9},
      8: {num: 1, m: 13},
      9: {num: 2, m: 130},
      10: {num: 3, m: 1170},
      11: {num: 2, m: 65},
      12: {num: 3, m: 195}
    };
    this.type = {
      "59": "x11x5",
      "55": "y11x5"
    };
    this.initChoose = {}
    this.animating = false;
    this.switchType = this.switchType.bind(this);
    this.callback = this.callback.bind(this);
    this.JudgeDesc = this.JudgeDesc.bind(this);
    this.initialize = this.initialize.bind(this);
    this.HistoryStageFunc = this.HistoryStageFunc.bind(this);
    this.getPropsActive = this.getPropsActive.bind(this);
    this.SetnavTitle = this.SetnavTitle.bind(this);
    this.clearChoose = this.clearChoose.bind(this);
    this.receiveRead = this.receiveRead.bind(this);
    this.setBeiNum = this.setBeiNum.bind(this);
    this.setQiNum = this.setQiNum.bind(this);

    this.jxNum = this.jxNum.bind(this);
    this.computeAll = this.computeAll.bind(this);
    this.doNext = this.doNext.bind(this);
    this.receive = this.receive.bind(this);
    this.setShowType = this.setShowType.bind(this);
    this.CreateChoose = this.CreateChoose.bind(this);
    this.doOrder = this.doOrder.bind(this);
    this.ControlBaishu = this.ControlBaishu.bind(this);
    this.creatOne = this.creatOne.bind(this);

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
    this.shark = this.shark.bind(this);
  }

  componentWillMount() {
    let {pathname} = this.props;
    console.log(pathname);
    if (pathname.indexOf("/x11x5Bet") > -1) {
      this.setState({
        gid: '59'
      }, () => {
        this.initialize();
      });
    } else {
      this.setState({
        gid: '55'
      }, () => {
        this.initialize();
      });
    }
    let c = this.forChoose()
    this.initChoose = c
    this.setState({
      chooseList: c
    });
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
  }

  initialize() {
    this.getPropsActive();
    this.HistoryStageFunc();
    this.ControlBaishu();
  }

  getPropsActive() {
    let {active} = this.props;
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
      }, () => {
        this.switchType(this.state.active);
      });
    }
  }

  HistoryStageFunc(bool) {
    const {gid} = this.state;
    szcHistory(gid).then(res => {
      if (bool) {
        this.setState({
          nowStage: res.rowc,
          HistoryStage: res.row,
          pid: res.rowc.p,
          serverTime: res.serverTime
        });
        return;
      }
      this.setState({
        nowStage: res.rowc,
        HistoryStage: res.row,
        omit: res.rowp,
        pid: res.rowc.p,
        serverTime: res.serverTime
      });
    });
  }

  ControlBaishu() {
    const {gid} = this.state;
    lotteryControl(gid).then(result => {
      if (result && result.bs) {
        let bs = result.bs;
        let qs = result.qs
        this.setState({
          minBei: parseInt(bs.min),
          maxBei: parseInt(bs.max),
          minQi: parseInt(qs.min),
          maxQi: parseInt(qs.max)
        })
      }
    })
  }

  /**
   * 遍历生成初始chooseList
   * @returns {{}}
   */
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

  /*
   * 计算奖金范围 奖金 注数
   * */
  JinshuZhuS() {
    const {active, chooseList} = this.state;
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

  //跳转预约页面
  async doOrder() {
    const {gid} = this.state;
    if (!this.state.read) {
      Toast.info("请阅读并同意《用户服务协议》", 1, null, false);
      return;
    }
    let flag = await utils.checkLogin();
    if (!flag) {
      AppJiek.thirdAppLoginCheck(()=> {
        hashHistory.push({
          pathname: this.type[gid] + "Bet/login",
          query: {
            flag: "needBack"
          }
        });
      }, flag);
    } else {
      let phone = "";
      let idCard = "";
      await userBasicInfo().then(result => {
        if (result.code === "0") {
          let row = result.row;
          phone = row.mobbind;
          idCard = row.idcard;
        }
      });
      if (!phone || phone === "0") {
        utils.showAlert("温馨提示", "该账户未绑定手机号", "去绑定", () => {
          hashHistory.push({
            pathname: this.type[gid] + "Bet/editMobile",
            query: {
              needBack: true
            }
          });
        });
      } else if (!idCard) {
        utils.showAlert("温馨提示", "该账户未绑定身份证", "去绑定", () => {
          hashHistory.push({
            pathname: this.type[gid] + "Bet/editIdCard",
            query: {
              needBack: true
            }
          });
        });
      } else {
        let params = {};
        let codes = "";
        let betList = JSON.parse(JSON.stringify(this.state.betList));
        betList.map((item, index) => {
          let code = "";
          let {unit, ten, hun, active} = item;
          let un = unit.join(',');
          let te = ten.join(',');
          let hu = hun.join(',');
          if (active == '9') {
            code = `${un}|${te}${this.rightCodeStr(active)}:01;`;
          } else if (active == '10') {
            code = `${un}|${te}|${hu}${this.rightCodeStr(active)}:01;`;
          } else {
            code = `${un}${this.rightCodeStr(active)}:01;`;
          }
          codes += code;
        })
        codes = codes.substring(0, codes.length - 1);
        console.log("投注内容：", codes);
        params.gid = gid;
        params.chooseList = betList;
        params.beiNum = this.state.beiNum;
        params.betNum = this.state.zongZhushu;
        params.buyQi = this.state.buyQi;
        params.imoney = this.state.money;
        params.stopZh = this.state.stopZh ? "1" : "0";
        params.codes = codes;
        if (params.buyQi > 1) {
          let pid = this.state.pid;
          let mulitys = "";
          for (let i = 1; i <= params.buyQi; i++) {
            pid += ",";
            mulitys += this.state.beiNum + ",";
          }
          params.pid = pid.substring(0, pid.length - 1);
          params.mulitys = mulitys.substring(0, mulitys.length - 1);
        } else {
          params.pid = this.state.pid;
        }
        params.szc = true;
        hashHistory.push({
          pathname: this.type[gid] + "Bet/order",
          state: {
            params: params
          }
        });
      }
    }
  }

  // tab导航
  switchType(key) {
    this.setState({
      active: key
    });
    let url = utils.setUrlHash("active", key);
    hashHistory.replace(url);
  }

  // 获取点击的球号
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

  // 清除
  clearChoose() {
    const {chooseList, active} = this.state;
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
        money: 0
      },
      () => {
        this.computeAll();
      }
    );
  }

  delChoose(id) {
    const {betList} = this.state;
    let betarr = JSON.parse(JSON.stringify(betList));
    let arr = [];
    betarr.map((item, index) => {
      if (item.index !== id) {
        arr.push(item);
      }
    });
    this.setState(
      {
        betList: arr
      },
      () => {
        this.computeAll();
      }
    );
  }

  // 重新计算投注金额
  computeAll() {
    const {betList} = this.state;
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

  // 输入倍数
  setBeiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value > this.state.maxBei) {
      value = this.state.maxBei;
      Toast.info("最多可投" + this.state.maxBei + "倍", 1, null, false);
    } else if (value == '0') {
      value = 1
    }
    this.setState(
      {
        beiNum: value
      },
      () => {
        this.computeAll();
      }
    );
  }

  // 输入期数
  setQiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    console.log(value);
    if (value > this.state.maxQi) {
      value = this.state.maxQi;
    } else if (value == '0') {
      value = 1
    }
    this.setState(
      {
        buyQi: value
      },
      () => {
        this.computeAll();
      }
    );
  }

  //生成一注
  creatOne(render = true) {
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
    if (render) {
      this.setState({
        chooseList: chooseList
      }, () => {
        this.JinshuZhuS()
      })
    } else {
      return chooseList
    }
  }

  // 点击下一步
  doNext() {
    const {showType, active, chooseList, zhushu} = this.state;
    const activeNum = this.Judgeactive[active];
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
    let arr = [];
    let param = {
      ...chooseList[active],
      index: 1,
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
    arr.unshift(param);
    this.setState(
      {
        betList: arr
      },
      () => {
        this.setShowType(2);
        this.computeAll();
      }
    );
  }

  // 机选
  jxNum(n) {
    const {active, betList} = this.state;
    let betCopy = JSON.parse(JSON.stringify(betList));
    for (let i = 0; i < n; i++) {
      let unit = [];
      let ten = [];
      let hun = [];
      let code = null;
      if (active == 9) {
        code = utils.math.padArray(utils.math.random(1, 11, 2, false))
        unit = unit.concat(code[0]);
        ten = ten.concat(code[1]);
      } else if (active == 10) {
        code = utils.math.padArray(utils.math.random(1, 11, 3, false))
        unit = unit.concat(code[0]);
        ten = ten.concat(code[1]);
        hun = hun.concat(code[2]);
      } else {
        code = utils.math
          .padArray(
            utils.math.random(1, 11, this.Judgeactive[active].num, false)
          )
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(code);
      }
      let param = {
        unit: unit || [],
        ten: ten || [],
        hun: hun || [],
        index: betCopy.length + 1,
        zhushu: 1,
        active: active
      };
      betCopy.unshift(param);
    }
    this.setState(
      {
        betList: betCopy,
        showType: 2
      },
      () => {
        this.computeAll();
      }
    );
  }

  setShowType(type) {
    this.setState({
      showType: type
    }, () => {
      if (type == 2) {
        this.HistoryStageFunc(true);
      }
    });
  }

  receiveRead(read) {
    this.setState({
      read: read
    });
  }

  //接受弹框返回回来的数据
  receive(item, type, isAdd) {
    let betList = JSON.parse(JSON.stringify(this.state.betList));
    let arr = [];
    if (type === "jx") {
      arr = arr.concat(item, betList);
    } else {
      betList.map((it, index) => {
        if (it.index !== item.index) {
          arr.push(it);
        } else {
          arr.push(item);
        }
      });
      if (isAdd) {
        arr.unshift(item);
      }
    }
    this.setState(
      {
        betList: arr
      },
      () => {
        this.setShowType(2);
        this.computeAll();
      }
    );
  }

  CreateChoose(item) {
    const {active} = this.state;
    const {unit, ten, hun} = item;
    let choose = {};
    for (let i = 1; i < 13; i++) {
      choose[i] = {
        unit: [],
        ten: [],
        hun: []
      };
    }
    choose[item.active].unit = unit;
    choose[item.active].ten = ten;
    choose[item.active].hun = hun;
    choose.index = item.index;
    console.log(choose[item.active])
    return choose;
  }

  rightCodeStr(playType) {
    let str = "";
    if (playType == 8) {
      // 前一直选
      str = ":01";
    } else if (playType == 1) {
      // 任选2
      str = ":02";
    } else if (playType == 2) {
      // 任选3
      str = ":03";
    } else if (playType == 3) {
      // 任选4
      str = ":04";
    } else if (playType == 4) {
      // 任选4
      str = ":05";
    } else if (playType == 5) {
      // 任选6
      str = ":06";
    } else if (playType == 6) {
      // 任选7
      str = ":07";
    } else if (playType == 7) {
      // 任选8
      str = ":08";
    } else if (playType == 9) {
      //前二直选
      str = ":09";
    } else if (playType == 10) {
      //前三直选
      str = ":10";
    } else if (playType == 11) {
      //前二组选
      str = ":11";
    } else if (playType == 12) {
      //前三组选
      str = ":12";
    }
    return str;
  }

  menuPop(flag) {
    this.setState({
      menuShow: flag,
    });
  }

  clickWF(key) {
    this.setState({
      active: key,
      menuShow: false
    }, () => {
      this.callback(key)
      let url = utils.setUrlHash("active", key);
      hashHistory.replace(url);
    })
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
    const {
      active,
      visible,
      desc,
      ConHeight,
      nowStage,
      HistoryStage,
      omit,
      gid,
      chooseList,
      showType,
      zhushu,
      zongZhushu,
      money,
      buyQi,
      beiNum,
      ZXactive,
      popListHeight,
      serverTime,
      menuShow
    } = this.state;
    const type = this.type[gid];
    return (
      <div>
        {showType == 1 && (
          <div id="lotteryBetting">
            <CommonNavBar title={this.SetnavTitle(gid)}/>
            <div className={sessionStorage.getItem("headFlag") ? "Newarrow1" : "Newarrow"}
                 onClick={() => this.menuPop(true)}><span/></div>
            {/*Newarrow有头部 Newarrow1没有头部*/}
            {menuShow ?
              <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData}/> : null}
            {menuShow ? <div className="menu-mask" onClick={() => this.menuPop(false)}/> : null}
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
                      HistoryStageFunc={this.HistoryStageFunc}
                      active={key}
                      gid={gid}
                      Judgeactive={this.Judgeactive}
                      chooseList={chooseList}
                      callChoose={this.callChoose.bind(this)}
                      serverTime={this.state.serverTime}
                      desc={item.desc}
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
                      HistoryStageFunc={this.HistoryStageFunc}
                      active={key}
                      gid={gid}
                      Judgeactive={this.Judgeactive}
                      chooseList={chooseList}
                      callChoose={this.callChoose.bind(this)}
                      serverTime={this.state.serverTime}
                      desc={item.desc}
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
                      HistoryStageFunc={this.HistoryStageFunc}
                      active={key}
                      gid={gid}
                      Judgeactive={this.Judgeactive}
                      chooseList={chooseList}
                      callChoose={this.callChoose.bind(this)}
                      serverTime={this.state.serverTime}
                      desc={item.desc}
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
              visible={visible}
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
        )}

        {showType === 2 && (
          <div className="programContent">
            <NavBar
              className="myNav"
              mode="dark"
              onLeftClick={() => {
                this.setShowType(1);
              }}
              rightContent={
                <div
                  onClick={() => hashHistory.push("/index")}
                  className="home"
                />
              }
              style={{
                position: "relative",
                height: "44px",
                zIndex: 2,
                backgroundColor: "#FC5638"
              }}
            >
              方案内容
            </NavBar>
            <div className="ssqBetBtn">
              <label
                onClick={() => {
                  this.currentChoose = _.cloneDeep(this.initChoose);
                  this.itemActive = active;
                  this.setShowType(3)
                }}
              >
                <span>+</span>
                <span>自选1注</span>
              </label>
              <label onClick={() => this.jxNum(1)}>
                <span>+</span>
                <span>机选1注</span>
              </label>
              <label onClick={() => this.jxNum(5)}>
                <span>+</span>
                <span>机选5注</span>
              </label>
            </div>
            <div className="programContentBox">
              <div className="programList " style={{height: popListHeight}}>
                {this.state.betList.length > 0 ? (
                  <div
                    className="popList listDivView"
                    style={{height: this.state.popListHeight}}
                  >
                    {this.state.betList.map((item, index) => {
                      return (
                        <div className="mixedProgram " key={"choose_" + index}>
                          <div className="mixedFlex">
                            <div
                              className="programBox_fl"
                              onClick={() => this.delChoose(item.index)}
                            >
                              <img src={DelIcon}/>
                            </div>
                            <div
                              className="programBox_fr_ssq"
                              onClick={() => {
                                this.currentChoose = this.CreateChoose(item);
                                this.itemActive = item.active;
                                this.setShowType(3);
                              }}
                            >
                              <p className="p1">
                                {item.unit.map((un, uin) => {
                                  return (
                                    <span
                                      className="spanRed_x11x5"
                                      key={"chooser_" + uin}
                                    >
                                      {un}
                                    </span>
                                  );
                                })}
                                {item.ten.length > 0 && <span className="spanRed_x11x5">|</span>}
                                {item.ten.map((te, tin) => {
                                  return (
                                    <span
                                      className="spanRed_x11x5"
                                      key={"chooseb_" + tin}
                                    >
                                      {te}
                                    </span>
                                  );
                                })}
                                {item.hun.length > 0 && <span className="spanRed_x11x5">|</span>}
                                {item.hun.map((hu, hin) => {
                                  return (
                                    <span
                                      className="spanRed_x11x5"
                                      key={"chooseb_" + hin}
                                    >
                                      {hu}
                                    </span>
                                  );
                                })}
                              </p>
                              <p className="p2">
                                <span>
                                  {
                                    this.tabsData[item.active - 1].title
                                  }&nbsp;&nbsp;&nbsp;
                                </span>
                                <span>
                                  {item.zhushu}注{item.zhushu * 2}元
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <UserProtocol
                      link={"/" + type + "Bet/linkPage"}
                      doClear={this.clearChoose}
                      read={this.state.read}
                      receiveRead={this.receiveRead}
                    />
                  </div>
                ) : (
                  <div className="noChooseBet">亲~你还没有投注哦</div>
                )}
              </div>
            </div>
            {/*底部*/}
            <footer className="programFooter">
              {/*方案文字*/}
              <div className="programFooter1">
                <div className="clearfix">
                  <div className="inputBox">
                    连续买
                    <input
                      type="tel"
                      onBlur={v => {
                        if (v.target.value == "" || v.target.value == 0) {
                          this.setState({buyQi: 1}, () => {
                            this.computeAll();
                          });
                        }
                      }}
                      onChange={this.setQiNum.bind(this)}
                      value={this.state.buyQi}
                    />期
                  </div>
                  <div className="inputBox fr">
                    投
                    <input
                      type="tel"
                      onBlur={v => {
                        if (v.target.value === "" || v.target.value === 0) {
                          this.setState({beiNum: 1}, () => {
                            this.computeAll();
                          });
                        }
                      }}
                      onChange={this.setBeiNum.bind(this)}
                      value={this.state.beiNum}
                    />倍
                  </div>
                </div>
              </div>
              <div
                className="ssqChaseNumber"
                style={{display: this.state.zhShow ? "" : "none"}}
                onClick={() => this.setState({stopZh: !this.state.stopZh})}
              >
                <span
                  className={
                    this.state.stopZh ? "radioSpan active" : "radioSpan"
                  }
                />
                中奖后停止追号
              </div>
              <ul
                className="ssqBetMultiple clearfix"
                style={{display: "none"}}
              >
                <li className="active">10倍</li>
                <li className="border_lr">20倍</li>
                <li>105倍掏空</li>
              </ul>
              <div className="bettingFooterInfo">
                <div className="footerInfo">
                  <p className="p1">
                    合计<span>{money}</span>元
                  </p>
                  <p className="p2">共{zongZhushu}注</p>
                </div>
                <a className="nextBtn" onClick={this.doOrder}>立即预约</a>
              </div>
            </footer>
          </div>
        )}

        {this.state.showType == 3 && (
          <X11x5Child2
            currentChoose={this.currentChoose}
            gid={gid}
            type={this.type}
            receive={this.receive}
            setShowType={this.setShowType}
            active={this.itemActive}
            ZXactive={ZXactive}
            betList={this.state.betList}
            HistoryStageFunc={this.HistoryStageFunc}
            serverTime={this.state.serverTime}
          />
        )}
      </div>
    );
  }
}

export default LotteryBetting11x5Child;
