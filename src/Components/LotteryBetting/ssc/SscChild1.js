import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Tabs, Toast, NavBar} from 'antd-mobile';
import {YiXingZhiXuan} from "./yiXingZhiXuan"
import {WuXingZhiXuan} from "./wuXingZhiXuan"
import {DaXiaoDanShuang} from "./daXiaoDanShuang"
import {ErXingZuXuanHeZhi} from "./erXingZuXuanHeZhi"
import NumHighFoot from "../common/NumHighFoot";
import utils from "../../../common/utils";
import DownComt from '../common/downComt'
import {szcHistory} from "../../../Stubs/API";
import _ from 'lodash'
import commonConfig from '../../../config/commonConfig'

const TabPane = Tabs.TabPane;

class SscChild1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      HistoryStage: null,
      nowStage: null,
      omit: null,
      gid: this.props.gid,
      betList: this.props.betList,
      chooseList: this.props.currentChoose,
      ballNum: null,
      zhushu: "",
      zongZhushu: 0,
      money: 0,
      serverTime: ''
    }
    this.tabsData = [
      {title: '二星组选',key:'1',  active: 1, num: 2, m: 50, desc: '猜中开奖号码后2位(顺序不限）即中奖<span>50</span>元, 对子不中奖'},
      {
        title: '三星组三',key:'2', active: 2, num: 2, m: 320, desc: '猜中开奖号码后3位且为组三即中奖<span>320</span>元, 顺序不限(组三指3个号码中有2个相同，如353' +
      ')'
      },
      {title: '三星组六',key:'3', active: 3, num: 3, m: 160, desc: '猜中开奖号码后3位且为组六即中奖<span>160</span>元, 顺序不限(组六指3个号码各不相同，如345)'},
      {title: '一星直选', key:'4',active: 4, num: 1, m: 10, desc: '猜中开奖号码最后1位即中奖<span>10</span>元'},
      {title: '二星直选',key:'5', active: 5, num: 1, m: 100, desc: '按位猜中开奖号码后2位即中奖<span>100</span>元'},
      {title: '三星直选',key:'6', active: 6, num: 1, m: 1000, desc: '按位猜中开奖号码后3位即中奖<span>1000</span>元'},
      {title: '五星直选',key:'7', active: 7, num: 1, m: 100000, desc: '按位猜中全部开奖号码即中奖<span>100000</span>元'},
      {
        title: '五星通选',
        key:'8',
        active: 8,
        num: 1,
        m: 20440,
        desc: '按位猜中全部开奖号码即中奖<span>20440</span>元, 按位猜中前三或后三位即中奖<span>220</span>元;按位猜中前二或后二位即中奖<span>20</span>元'
      },
      {title: '二星组选和值',key:'9', active: 9, num: 1, m: 50, desc: '猜中开奖号码后2位数字之和即中奖<span>50</span>元(对子奖金<span>100</span>元'},
      {title: '大小单双',key:'10', active: 10, num: 1, m: 4, desc: '按位猜中开奖号码后2位的大小单双属性即中奖<span>4</span>元'}
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
      '1': {desc: '至少选2个号'},
      '2': {desc: '至少选2个号'},
      '3': {desc: '至少选3个号'},
      '4': {desc: '至少选1个号'},
      '5': {desc: '每位至少选1个号'},
      '6': {desc: '每位至少选1个号'},
      '7': {desc: '每位至少选1个号'},
      '8': {desc: '每位至少选1个号'},
      '9': {desc: '至少选1个号'},
      '10': {desc: '每位至少选1个号'}
    };
    this.type = {
      "04": "ssc",
    };
    this.initChoose = this.forChoose()
    this.animating = false;
    this.switchType = this.switchType.bind(this);
    this.callback = this.callback.bind(this);
    this.HistoryStageFunc = this.HistoryStageFunc.bind(this);
    this.initialize = this.initialize.bind(this);
    this.clearChoose = this.clearChoose.bind(this);
    this.doNext = this.doNext.bind(this);
    this.callChoose = this.callChoose.bind(this);
    this.JudgeChooseList = this.JudgeChooseList.bind(this);
    this.computeAll = this.computeAll.bind(this);
    this.setShowType = this.setShowType.bind(this);
    this.jxNum = this.jxNum.bind(this);
    this.creatOne = this.creatOne.bind(this);
    this.forChoose = this.forChoose.bind(this);

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
    this.shark = this.shark.bind(this);
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
    this.JinshuZhuS()
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentChoose) {
      this.setState({
        chooseList: nextProps.currentChoose
      });
    }
  }

  initialize() {
    let {pathname} = this.props;
    if (pathname == '/sscBet') {
      this.setState({
        gid: '04'
      }, () => {
        this.getPropsActive();
        this.HistoryStageFunc();
      })
    }
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

  getPropsActive() {
    let {active, pathname} = this.props;
    if (active) {
      this.setState({
        active: active,
        desc: this.descTitle[active].desc
      });
    } else {
      this.setState({
        active: "1",
        desc: this.descTitle[1].desc
      });
    }
  }

  HistoryStageFunc() {
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

  /**
   * tab导航 active切换
   * @param key
   */
  switchType(key) {
    this.setState({
      active: key
    });
  }

  callback(key) {
    let content = this.descTitle[key].desc;
    this.setState({
      desc: content
    });
  }

  /**
   * 计算奖金范围 奖金 注数
   * @returns {String}
   * @constructor
   */
  JinshuZhuS() {
    const {active, chooseList} = this.state;
    let zhushu = "",
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
      zhushu = utils.math.C(choose.unit.length, activeObj.num * 2);
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
    return this.setState({
      zhushu: zhushu,
      JJscope: JJscope,
      profit: profit
    });
    return true;
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
      money: 0,
      showType: 1
    }, () => {
      this.JinshuZhuS();
    })
  }

  /**
   * 重新计算投注金额
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
          .padArray(utils.math.random(0, 9, 2, true))
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
      }else if (active == 6) {
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
    this.props.receive(betCopy, "jx");
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
  /**
   * 点击下一步
   * @returns {boolean}
   */
  doNext() {
    const {active, chooseList, zhushu, betList} = this.state;
    const activeNum = this.Judgeactive[active];
    let arr = [];
    if (!this.JudgeChooseList()) return false;
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
      param.kil = param.kil.sort((a, b) => {
        return a - b
      })
      param.mir = param.mir.sort((a, b) => {
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
      param.kil = param.kil.sort((a, b) => {
        return a - b
      })
      param.mir = param.mir.sort((a, b) => {
        return a - b
      })
      this.props.receive(param, "zx", true);
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

  /**
   * 判断点击下一步时 是否符合规则
   * @returns {boolean}
   * @constructor
   */
  JudgeChooseList() {
    const {chooseList, active} = this.state;
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
    }else if (active == 5) {
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

  setShowType(type) {
    this.setState({
      showType: type
    });
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
    const {
      setShowType,
      HistoryStageFunc
    } = this.props;
    const {
      active, gid, chooseList, desc, ConHeight, zhushu, nowStage,
      HistoryStage,
      omit,
      serverTime,
      menuShow
    } = this.state;

    return (

      <div id="lotteryBetting">
        <NavBar
          className="myNav"
          mode="dark"
          iconName="cross"
          onLeftClick={() => {
            setShowType(2);
          }}
          rightContent={
            <div onClick={() => hashHistory.push("/index")} className="home"/>
          }
          style={{
            position: "relative",
            height: "44px",
            zIndex: 2,
            backgroundColor: "#FC5638"
          }}
        >
          {'时时彩'}
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
          {
            this.tabsData.map((item, index) => {
              const key = index + 1;
              let content = "";
              if (item.active == '1' || item.active == '2' || item.active == '3' || item.active == '4') {
                content = <YiXingZhiXuan
                  key={index}
                  callChoose={this.callChoose.bind(this)}
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
                  callChoose={this.callChoose.bind(this)}
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  desc={item.desc}
                  HistoryStageFunc={HistoryStageFunc}
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
                  callChoose={this.callChoose.bind(this)}
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  desc={item.desc}
                  HistoryStageFunc={HistoryStageFunc}
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
                  callChoose={this.callChoose.bind(this)}
                  ConHeight={ConHeight}
                  nowStage={nowStage}
                  HistoryStage={HistoryStage}
                  omit={omit}
                  desc={item.desc}
                  HistoryStageFunc={HistoryStageFunc}
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
      </div>
    )
  }
}

export default SscChild1
