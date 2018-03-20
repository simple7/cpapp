import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast, NavBar} from 'antd-mobile';
import {YiXingZhiXuan} from "./yiXingZhiXuan"
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {WuXingZhiXuan} from "./wuXingZhiXuan"
import {DaXiaoDanShuang} from "./daXiaoDanShuang"
import {ErXingZuXuanHeZhi} from "./erXingZuXuanHeZhi"
import NumHighFoot from "../common/NumHighFoot";
import UserProtocol from "../common/userProtocol";
import utils from "../../../common/utils";
import {szcHistory, lotteryControl, userBasicInfo} from "../../../Stubs/API";
import DownComt from '../common/downComt'
import DelIcon from "../../../Img/lotteryBetting/delIcon.png";
import SscChild1 from "./SscChild1";
import _ from 'lodash'
import commonConfig from '../../../config/commonConfig'
import {AppJiek} from '../../../common/AppApi'

const TabPane = Tabs.TabPane;

class SscChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ConHeight: '',
      active: '',
      chooseList: [],
      gid: '',
      nowStage: '',
      HistoryStage: '',
      omit: '',
      pid: '',
      zhushu: '',
      JJscope: '',
      profit: '',
      showType: 1,
      betList: [],
      money: '',
      beiNum: 1,
      buyQi: 1,
      read: true,
      minBei: 1,
      maxBei: 99999,
      minQi: 1,
      maxQi: 10,
      popListHeight: 0,
      serverTime: '',
      menuShow: false
    }
    this.tabsData = [
      {title: '二星组选', key: '1', active: 1, num: 2, m: 50, desc: '猜中开奖号码后2位(顺序不限）即中奖<span>50</span>元, 对子不中奖'},
      {
        title: '三星组三',
        key: '2',
        active: 2,
        num: 2,
        m: 320,
        desc: '猜中开奖号码后3位且为组三即中奖<span>320</span>元, 顺序不限(组三指3个号码中有2个相同，如353' +
        ')'
      },
      {
        title: '三星组六',
        key: '3',
        active: 3,
        num: 3,
        m: 160,
        desc: '猜中开奖号码后3位且为组六即中奖<span>160</span>元, 顺序不限(组六指3个号码各不相同，如345)'
      },
      {title: '一星直选', key: '4', active: 4, num: 1, m: 10, desc: '猜中开奖号码最后1位即中奖<span>10</span>元'},
      {title: '二星直选', key: '5', active: 5, num: 1, m: 100, desc: '按位猜中开奖号码后2位即中奖<span>100</span>元'},
      {title: '三星直选', key: '6', active: 6, num: 1, m: 1000, desc: '按位猜中开奖号码后3位即中奖<span>1000</span>元'},
      {title: '五星直选', key: '7', active: 7, num: 1, m: 100000, desc: '按位猜中全部开奖号码即中奖<span>100000</span>元'},
      {
        title: '五星通选',
        key: '8',
        active: 8,
        num: 1,
        m: 20440,
        desc: '按位猜中全部开奖号码即中奖<span>20440</span>元, 按位猜中前三或后三位即中奖<span>220</span>元;按位猜中前二或后二位即中奖<span>20</span>元'
      },
      {
        title: '二星组选和值',
        key: '9',
        active: 9,
        num: 1,
        m: 50,
        desc: '猜中开奖号码后2位数字之和即中奖<span>50</span>元(对子奖金<span>100</span>元'
      },
      {title: '大小单双', key: '10', active: 10, num: 1, m: 4, desc: '按位猜中开奖号码后2位的大小单双属性即中奖<span>4</span>元'}
    ];
    this.Judgeactive = {
      1: {num: 2, m: 50, maxNum: 2},
      2: {num: 2, m: 320, maxNum: 2},
      3: {num: 3, m: 160, maxNum: 3},
      4: {num: 1, m: 10, maxNum: 1},
      5: {num: 1, m: 100, maxNum: 2},
      6: {num: 1, m: 1000, maxNum: 3},
      7: {num: 1, m: 100000, maxNum: 5},
      8: {num: 1, m: 20440, maxNum: 5},
      9: {num: 1, m: 50, maxNum: 1},
      10: {num: 1, m: 4, maxNum: 2}
    };
    this.descTitle = {
      '1': {desc: '至少选<span>2</span>个号'},
      '2': {desc: '至少选<span>2</span>个号'},
      '3': {desc: '至少选<span>3</span>个号'},
      '4': {desc: '至少选<span>1</span>个号'},
      '5': {desc: '每位至少选<span>1</span>个号'},
      '6': {desc: '每位至少选<span>1</span>个号'},
      '7': {desc: '每位至少选<span>1</span>个号'},
      '8': {desc: '每位至少选<span>1</span>个号'},
      '9': {desc: '至少选<span>1</span>个号'},
      '10': {desc: '每位至少选<span>1</span>个号'}
    };
    this.type = {
      "04": "ssc",
    };
    this.initChoose = {}
    this.animating = false;
    this.switchType = this.switchType.bind(this);
    this.callback = this.callback.bind(this);
    this.HistoryStageFunc = this.HistoryStageFunc.bind(this);
    this.initialize = this.initialize.bind(this);
    this.clearChoose = this.clearChoose.bind(this);
    this.doNext = this.doNext.bind(this);
    this.forChoose = this.forChoose.bind(this);
    this.callChoose = this.callChoose.bind(this);
    this.JudgeChooseList = this.JudgeChooseList.bind(this);
    this.setBeiNum = this.setBeiNum.bind(this);
    this.setQiNum = this.setQiNum.bind(this);
    this.computeAll = this.computeAll.bind(this);
    this.setShowType = this.setShowType.bind(this);
    this.jxNum = this.jxNum.bind(this);
    this.ControlBaishu = this.ControlBaishu.bind(this);
    this.CreateChoose = this.CreateChoose.bind(this);
    this.receive = this.receive.bind(this);
    this.doOrder = this.doOrder.bind(this);
    this.creatOne = this.creatOne.bind(this);

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
    this.shark = this.shark.bind(this);
  }

  componentWillMount() {
    this.initialize();
    let c = this.forChoose()
    this.initChoose = c
    this.setState({
      chooseList: c
    });
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

  componentDidUpdate() {
    let programList = document.getElementsByClassName("programList")[0];
    if (programList && this.state.popListHeight == "") {
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

  /**
   * 初始化
   */
  initialize() {
    let {pathname} = this.props;
    if (pathname.indexOf('/sscBet') > -1) {
      this.setState({
        gid: '04'
      }, () => {
        this.getPropsActive();
        this.HistoryStageFunc();
        this.ControlBaishu();
      })
    }
  }

  /**
   * 初始化 active 和desc
   */
  getPropsActive() {
    let {active, pathname} = this.props;
    let content = "";
    console.log(active);
    if (active) {
      this.setState({
        active: active,
        desc: this.descTitle[active].desc
      });
    } else {
      this.setState({
        active: "1",
        desc: this.descTitle[1].desc
      }, () => {
        this.switchType(this.state.active);
      });
    }
  }

  /**
   * 获取 开奖号码 时间
   * @constructor
   */
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
      } else {
        this.setState({
          nowStage: res.rowc,
          HistoryStage: res.row,
          omit: res.rowp,
          pid: res.rowc.p,
          serverTime: res.serverTime
        });
      }
    });
  }

  /**
   * 获取最大 期数、倍数限制
   * @constructor
   */
  ControlBaishu() {
    const {gid} = this.state;
    lotteryControl(gid).then(result => {
      if (result && result.bs) {
        let bs = result.bs
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
   * 生成初始数据 chooseList
   * @returns {{}}
   */
  forChoose() {
    let choose = {};
    for (let i = 1; i < 13; i++) {
      choose[i] = {
        unit: [],
        ten: [],
        hun: [],
        kil: [],
        mir: []
      };
    }
    return choose;
  }

  /**
   * tabs 切换
   * @param{Number} key
   */
  switchType(key) {
    console.log(key);
    this.setState({
      active: key
    });
    let url = utils.setUrlHash("active", key);
    hashHistory.replace(url);
  }

  /**
   *  footer描述
   * @param key
   */
  callback(key) {
    let content = this.descTitle[key].desc;
    this.setState({
      desc: content
    });
  }

  /**
   * 计算注数
   * @returns {boolean}
   * @constructor
   */
  JinshuZhuS() {
    const {active, chooseList} = this.state;
    let zhushu = 0,
      JJscope = "",
      profit = "";
    if (!active) return false;
    const activeObj = this.Judgeactive[active];
    const choose = chooseList[active];
    if (active == 5 || active == 10) {
      zhushu = choose.unit.length * choose.ten.length;
    } else if (active == 6) {
      zhushu = choose.unit.length * choose.hun.length * choose.ten.length;
    } else if (active == 7 || active == 8) {
      zhushu = choose.unit.length * choose.hun.length * choose.ten.length * choose.kil.length * choose.mir.length;
    } else if (active == 2) {
      zhushu = utils.math.C(choose.unit.length, activeObj.num) * 2;
    } else if (active == 9) {
      choose.unit.map((item, index) => {
        zhushu += Number(utils.SSCexhz_zhushu(item));
      })
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
   * 获取子组件 点击的球号
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
   * 清空全部投注数据
   */
  clearChoose() {
    const {active, chooseList} = this.state;
    chooseList[active] = {
      unit: [],
      ten: [],
      hun: [],
      kil: [],
      mir: []
    }
    this.setState({
      chooseList: chooseList,
      betList: [],
      zongZhushu: 0,
      money: 0
    }, () => {
      this.JinshuZhuS();
    })
  }

  /**
   * 计算投注金额
   */
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

  /**
   * 输入倍数
   * @param{ecent} e
   */
  setBeiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value > this.state.maxBei) {
      value = this.state.maxBei;
      Toast.info("最多可投" + this.state.maxBei + "倍", 1, null, false);
    } else if (value == '0') {
      value = 1
    }
    console.log(value);
    this.setState(
      {
        beiNum: value
      },
      () => {
        this.computeAll();
      }
    );
  }

  /**
   * 输入期数
   * @param{event} e
   */
  setQiNum(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
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

  /**
   * 删除单条投注数据
   * @param id
   */
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

  /**
   * 机选
   * @param{Number} n
   */
  jxNum(n) {
    const {active, betList} = this.state;
    let betCopy = JSON.parse(JSON.stringify(betList));
    for (let i = 0; i < n; i++) {
      let unit = [];
      let ten = [];
      let hun = [];
      let mir = [];
      let kil = [];
      let code = null;
      if (active == 5) {
        code = utils.math
          .padArray(utils.math.random(0, 9, 2, false))
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(this.strSubstr(code[0]));
        ten = ten.concat(this.strSubstr(code[1]));
      } else if (active == 10) {
        code = utils.math
          .padArray(utils.math.random(1, 4, 2, true))
          .sort(function (a, b) {
            return a - b;
          });
        let uarr = this.strSubstr(code[0]);
        let tarr = this.strSubstr(code[1]);
        unit = unit.concat(
          uarr.replace(/1/g, '大').replace(/2/g, '小').replace(/3/g, '单').replace(/4/g, '双')
        );
        ten = ten.concat(
          tarr.replace(/1/g, '大').replace(/2/g, '小').replace(/3/g, '单').replace(/4/g, '双')
        );
      } else if (active == 6) {
        code = utils.math
          .padArray(utils.math.random(0, 9, 3, true))
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(this.strSubstr(code[0]));
        ten = ten.concat(this.strSubstr(code[1]));
        hun = hun.concat(this.strSubstr(code[2]));
      } else if (active == 7 || active == 8) {
        code = utils.math
          .padArray(utils.math.random(0, 9, 5, true))
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(this.strSubstr(code[0]));
        ten = ten.concat(this.strSubstr(code[1]));
        hun = hun.concat(this.strSubstr(code[2]));
        kil = kil.concat(this.strSubstr(code[3]));
        mir = mir.concat(this.strSubstr(code[4]));
      } else if (active == 9) {
        code = utils.math
          .padArray(utils.math.random(0, 18, 1, false))
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(this.strSubstr(code));
      } else {
        code = utils.math
          .padArray(
            utils.math.random(0, 9, this.Judgeactive[active].num, false)
          )
          .sort(function (a, b) {
            return a - b;
          });
        unit = unit.concat(this.strSubstr(code));
      }
      let zhushu = 0;
      if (active == '9') {
        zhushu = this.countZhushu(unit);
      } else if (active == '2') {
        zhushu = this.countZhushu();
      } else {
        zhushu = 1;
      }
      let param = {
        unit: unit || [],
        ten: ten || [],
        hun: hun || [],
        kil: kil || [],
        mir: mir || [],
        index: betCopy.length + 1,
        zhushu: zhushu,
        active: active
      };
      betCopy.unshift(param);
    }
    this.setState(
      {
        betList: betCopy,
      },
      () => {
        this.setShowType(2);
        this.computeAll();
      }
    );
  }

  /**
   * 计算机选注数
   * @param arr
   * @returns {number}
   */
  countZhushu(arr) {
    const {active} = this.state;
    let zhushu = 0;
    if (active == '9') {
      arr.map((item) => {
        zhushu += Number(utils.SSCexhz_zhushu(item));
      })
    } else if (active == '2') {
      zhushu = 2;
    }
    return zhushu;
  }

  /**
   * 去除数字第一位的0
   * @param arr
   * @returns {*}
   */
  strSubstr(arr) {
    let narr = [];
    if (arr instanceof Array) {
      for (let i = 0; i < arr.length; i++) {
        let str = arr[i].replace(/[0]{1}/, '');
        narr.push(str);
      }
      return narr;
    } else {
      if (arr == 0) {
        return 0
      }
      return arr.replace(/[0]{1}/, '');
    }
  }

  /**
   * 点击下一步
   * @returns {boolean}
   */
  doNext() {
    const {active, chooseList, zhushu} = this.state;
    const activeNum = this.Judgeactive[active];
    let arr = [];
    if (!this.JudgeChooseList()) return false;
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
    param.kil = param.kil.sort((a, b) => {
      return a - b
    })
    param.mir = param.mir.sort((a, b) => {
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


  /**
   * 点击下一步 判断数据是否符合规则
   * @returns {boolean}
   * @constructor
   */
  JudgeChooseList() {
    const {chooseList, active} = this.state;
    console.log(chooseList)
    const activeNum = this.Judgeactive[active];
    if (active == 10) {
      if (chooseList[active].unit.length === 0 &&
        chooseList[active].ten.length === 0) {
        this.creatOne()
        return false
      }
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0
      ) {
        return true;
      }
    } else if (active == 6) {
      if (
        chooseList[active].unit.length === 0 &&
        chooseList[active].ten.length === 0 &&
        chooseList[active].hun.length === 0
      ) {
        this.creatOne()
        return false
      }
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0 &&
        chooseList[active].hun.length > 0
      ) {
        return true;
      }
    } else if (active == 5) {
      if (
        chooseList[active].unit.length === 0 &&
        chooseList[active].ten.length === 0
      ) {
        this.creatOne()
        return false
      }
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0
      ) {
        return true;
      }
    } else if (active == 7 || active == 8) {
      if (
        chooseList[active].unit.length === 0 &&
        chooseList[active].ten.length === 0 &&
        chooseList[active].hun.length === 0 &&
        chooseList[active].kil.length === 0 &&
        chooseList[active].mir.length === 0
      ) {
        this.creatOne()
        return false
      }
      if (
        chooseList[active].unit.length > 0 &&
        chooseList[active].ten.length > 0 &&
        chooseList[active].hun.length > 0 &&
        chooseList[active].kil.length > 0 &&
        chooseList[active].mir.length > 0
      ) {
        return true;
      }
    } else {
      if (chooseList[active].unit.length === 0) {
        this.creatOne()
        return false
      }
      if (chooseList[active].unit.length >= activeNum.num) {
        return true;
      }
    }
    Toast.info("请至少选择1注", 1, null, false);
    return false;
  }

  /**
   * 跳转预约页面
   * @returns {Promise.<void>}
   */
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
      }, flag)
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
          let {unit, ten, hun, kil, mir, active} = item;
          let un = unit.join('');
          let te = ten.join('');
          let hu = hun.join('');
          let ki = kil.join('');
          let mi = mir.join('');
          if (active == '5' || active == '10') {
            if (active == '10') {
              code = `${this.DaxiaoDS(te)},${this.DaxiaoDS(un)}${this.rightCodeStr(active)};`;
            } else {
              code = `${te},${un}${this.rightCodeStr(active)};`;
            }
          } else if (active == '6') {
            code = `${hu},${un},${te}${this.rightCodeStr(active)};`;
          } else if (active == '7' || active == '8') {
            code = `${mi},${ki},${hu},${te},${un}${this.rightCodeStr(active)};`;
          } else {
            let un = unit.join(',');
            code = `${un}${this.rightCodeStr(active)};`;
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

  /**
   * 修改 showType (1 || 2 || 3)
   * @param{Number} type
   */
  setShowType(type) {
    this.setState({
      showType: type
    }, () => {
      if (type == 2) {
        this.HistoryStageFunc(true);
      }
    });
  }

  /**
   * codes 中右边的数字
   * @param playType
   * @returns {string}
   */
  rightCodeStr(playType) {
    let str = "";
    if (playType == 1) {
      // 二星组选
      str = ":7:3";
    } else if (playType == 2) {
      // 三星组三
      str = ":8:3";
    } else if (playType == 3) {
      // 三星组六
      str = ":9:3";
    } else if (playType == 4) {
      // 一星直选
      str = ":5:1";
    } else if (playType == 5) {
      // 二星直选
      str = ":4:1";
    } else if (playType == 6) {
      // 三星直选
      str = ":3:1";
    } else if (playType == 7) {
      // 五星直选
      str = ":1:1";
    } else if (playType == 8) {
      // 五星通选
      str = ":12:1";
    } else if (playType == 9) {
      //二星组选和值
      str = ":7:4";
    } else if (playType == 10) {
      //大小单双
      str = ":6:1";
    }
    return str;
  }

  DaxiaoDS(t) {
    switch (t) {
      case '大':
        return 2;
        break;
      case '小':
        return 1;
        break;
      case '单':
        return 5;
        break;
      case '双':
        return 4;
        break;
    }
  }

  CreateChoose(item) {
    const {active} = this.state;
    const {unit, ten, hun, kil, mir} = item;
    let choose = {};
    for (let i = 1; i < 13; i++) {
      choose[i] = {
        unit: [],
        ten: [],
        hun: [],
        kil: [],
        mir: []
      }
    }
    choose[item.active].unit = unit;
    choose[item.active].ten = ten;
    choose[item.active].hun = hun;
    choose[item.active].kil = kil;
    choose[item.active].mir = mir;
    choose.index = item.index;
    return choose;
  }

  /**
   * 接受弹框返回回来的数据
   */
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

  /**
   * 生成一注
   * @param needSort 是否需要排序  默认不排序
   * @param repeat  是否可生成重复元素 默认不重复
   * @returns {*|Array}
   */
  creatOne(render = true) {
    let {active} = this.state;
    let chooseList = _.cloneDeep(this.initChoose)
    let needSort = false;
    let repeat = true;
    if (active != 10 && active != 5 && active != 6 && active != 7 && active != 8) {
      needSort = true;
      repeat = false;
    }
    let min = 0;
    let max = 9;
    if (active == 10) {
      min = 1;
      max = 4
    } else if (active == 9) {
      max = 18
    }
    let num = this.Judgeactive[active].maxNum
    let code = utils.math.random(min, max, num, repeat)
    if (needSort) {
      code = code.sort(function (a, b) {
        return a - b;
      });
    }
    if (active == 10) {
      let uarr = ('' + code[0]).replace(/1/g, '大').replace(/2/g, '小').replace(/3/g, '单').replace(/4/g, '双')
      let tarr = ('' + code[1]).replace(/1/g, '大').replace(/2/g, '小').replace(/3/g, '单').replace(/4/g, '双');
      chooseList[active].unit = [uarr]
      chooseList[active].ten = [tarr]
    } else if (active == 6) {
      chooseList[active].unit = ['' + code[0]]
      chooseList[active].ten = ['' + code[1]]
      chooseList[active].hun = ['' + code[2]]
    } else if (active == 5) {
      chooseList[active].unit = ['' + code[0]]
      chooseList[active].ten = ['' + code[1]]
    } else if (active == 7 || active == 8) {
      chooseList[active].unit = ['' + code[0]]
      chooseList[active].ten = ['' + code[1]]
      chooseList[active].hun = ['' + code[2]]
      chooseList[active].kil = ['' + code[3]]
      chooseList[active].mir = ['' + code[4]]
    } else {
      code = code.map(item => {
        item = '' + item
        return item
      })
      chooseList[active].unit = code
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


  //摇一摇
  shark() {
    let {active} = this.state
    let obj = _.cloneDeep(this.initChoose)
    console.log(111,obj)
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
        let kilL = code[active].kil.length
        let mirL = code[active].mir.length
        let i = 0;
        let flag = 'mir'
        let intel = setInterval(() => {
          let choose = this.state.chooseList
          if (flag === 'mir') {
            if (i < mirL) {
              choose[active].mir.push(code[active].mir[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'kil'
              i = 0;
            }
          }
          if (flag === 'kil') {
            if (i < kilL) {
              choose[active].kil.push(code[active].kil[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'hun'
              i = 0;
            }
          }
          if (flag === 'hun') {
            if (i < hunL) {
              choose[active].hun.push(code[active].hun[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'ten'
              i = 0;
            }
          }
          if (flag === 'ten') {
            if (i < tenL) {
              choose[active].ten.push(code[active].ten[i])
              this.setState({
                chooseList: choose
              })
              i++;
            } else {
              flag = 'unit'
              i = 0
            }
          }
          if (flag === 'unit') {
            if (i < unitL) {
              choose[active].unit.push(code[active].unit[i])
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
    const {active, gid, chooseList, desc, zhushu, ConHeight, nowStage, HistoryStage, omit, showType, money, zongZhushu, menuShow} = this.state;
    const type = this.type[gid];
    return (
      <div id="lotteryBetting">
        {showType == 1 &&
        <div><CommonNavBar title="时时彩"/>
          <div className={sessionStorage.getItem("headFlag") ? "Newarrow1" : "Newarrow"}
               onClick={() => this.menuPop(true)}><span/></div>
          {/*Newarrow有头部 Newarrow1没有头部*/}
          {menuShow ? <DownComt active={active} showType="3" clickWF={this.clickWF} menuPop={this.menuPop}
                                tabsData={this.tabsData}/> : null}
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
            {
              this.tabsData.map((item, index) => {
                const key = index + 1;
                let content = "";
                if (item.active == '1' || item.active == '2' || item.active == '3' || item.active == '4') {
                  content = <YiXingZhiXuan
                    key={index}
                    callChoose={this.callChoose}
                    ConHeight={ConHeight}
                    nowStage={nowStage}
                    HistoryStage={HistoryStage}
                    omit={omit}
                    desc={item.desc}
                    HistoryStageFunc={this.HistoryStageFunc}
                    active={key}
                    gid={gid}
                    chooseList={chooseList}
                    serverTime={this.state.serverTime}
                    type={this.type[gid]}
                    creatOne={this.creatOne}
                  />
                } else if (item.active == '9') {
                  content = <ErXingZuXuanHeZhi
                    key={index}
                    chooseList={chooseList}
                    callChoose={this.callChoose}
                    ConHeight={ConHeight}
                    nowStage={nowStage}
                    HistoryStage={HistoryStage}
                    omit={omit}
                    desc={item.desc}
                    HistoryStageFunc={this.HistoryStageFunc}
                    active={key}
                    gid={gid}
                    serverTime={this.state.serverTime}
                    type={this.type[gid]}
                    creatOne={this.creatOne}
                  />
                } else if (item.active == '10') {
                  content = <DaXiaoDanShuang
                    key={index}
                    chooseList={chooseList}
                    callChoose={this.callChoose}
                    ConHeight={ConHeight}
                    nowStage={nowStage}
                    HistoryStage={HistoryStage}
                    omit={omit}
                    desc={item.desc}
                    HistoryStageFunc={this.HistoryStageFunc}
                    active={key}
                    gid={gid}
                    serverTime={this.state.serverTime}
                    type={this.type[gid]}
                    creatOne={this.creatOne}
                  />
                } else {
                  content = <WuXingZhiXuan
                    key={index}
                    chooseList={chooseList}
                    callChoose={this.callChoose}
                    ConHeight={ConHeight}
                    nowStage={nowStage}
                    HistoryStage={HistoryStage}
                    omit={omit}
                    desc={item.desc}
                    HistoryStageFunc={this.HistoryStageFunc}
                    active={key}
                    gid={gid}
                    serverTime={this.state.serverTime}
                    type={this.type[gid]}
                    creatOne={this.creatOne}
                  />
                }
                return (
                  <TabPane tab={item.title} key={key}>
                    {content}
                  </TabPane>
                )
              })
            }
          </Tabs>
          <NumHighFoot
            gid={gid}
            chooseList={chooseList}
            desc={desc}
            active={active}
            Judgeactive={this.Judgeactive}
            clearChoose={this.clearChoose.bind(this)}
            doNext={this.doNext}
            zhushu={zhushu}
            jxNum={this.jxNum}/>
        </div>}

        {showType == 2 && (
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
            >方案内容
            </NavBar>
            <div className="ssqBetBtn">
              <label
                onClick={() => {
                  this.currentChoose = this.forChoose();
                  this.itemActive = active;
                  this.setShowType(3);
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
              <div className="programList ">
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
                                {item.mir.map((mi, hin) => {
                                  return (
                                    <span
                                      className="spanRed_ssc"
                                      key={"chooseb_" + mi}
                                    >
                                      {mi}
                                    </span>
                                  );
                                })}
                                {item.mir.length > 0 && <span className="spanRed_ssc">|</span>}
                                {item.kil.map((ki, hin) => {
                                  return (
                                    <span
                                      className="spanRed_ssc"
                                      key={"chooseb_" + ki}
                                    >
                                      {ki}
                                    </span>
                                  );
                                })}
                                {item.kil.length > 0 && <span className="spanRed_ssc">|</span>}
                                {item.hun.map((hu, hin) => {
                                  return (
                                    <span
                                      className="spanRed_ssc"
                                      key={"chooseb_" + hin}
                                    >
                                      {hu}
                                    </span>
                                  );
                                })}
                                {item.hun.length > 0 && <span className="spanRed_ssc">|</span>}
                                {item.ten.map((te, tin) => {
                                  return (
                                    <span
                                      className="spanRed_ssc"
                                      key={"chooseb_" + tin}
                                    >
                                      {te}
                                    </span>
                                  );
                                })}
                                {item.ten.length > 0 && <span className="spanRed_ssc">|</span>}
                                {item.unit.map((un, uin) => {
                                  return (
                                    <span
                                      className="spanRed_ssc"
                                      key={"chooser_" + uin}
                                    >
                                      {un}
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
                                  {item.zhushu}注{Number(item.zhushu) * 2}元
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
                        if (v.target.value === "" || v.target.value === 0) {
                          this.setState({buyQi: 1}, () => {
                            this.computeAll()
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
                            this.computeAll()
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
          <SscChild1
            currentChoose={this.currentChoose}
            gid={gid}
            type={this.type}
            receive={this.receive}
            setShowType={this.setShowType}
            pid={this.state.pid}
            nowStage={nowStage}
            omit={omit}
            HistoryStage={HistoryStage}
            active={this.itemActive}
            betList={this.state.betList}
            HistoryStageFunc={this.HistoryStageFunc}
            serverTime={this.state.serverTime}
          />
        )}
      </div>
    )
  }
}

export default SscChild
