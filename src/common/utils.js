import moment from "moment";
import {Modal} from "antd-mobile";
import _ from "lodash";
import {hashHistory} from "react-router";
import {checkUserLogin, userBasicInfo} from "../Stubs/API";
import config from "./config";
import betConfig from "../config/betConfig";
import {AppJiek} from './AppApi'

const alert = Modal.alert;
import CryptoJS from "./aes";

let utils = {
  /**
   * @ 获取过去的多少天
   * @param days 过去天数(含今天)
   * @param format 返回格式
   * @param arr 返回天数数组
   */
  dayMillisecond: 24 * 60 * 60 * 1000,
  getLastDays(days, format) {
    let now = new Date().getTime();
    let arr = [];
    for (let i = 0; i < days; i++) {
      arr.push(moment(now - i * this.dayMillisecond).format(format));
    }
    return arr;
  },
  checkPhone(phone) {
    return /^1[34578]\d{9}$/.test(phone);
  },
  /**
   * 温馨提示
   * @param head  提示头
   * @param text  提示内容
   * @param cb    回调
   */
  wxMessage(head, text, cb, btnText) {
    alert(head || "温馨提示", text, [
      {
        text: btnText || "知道了",
        onPress: () => {
          if (typeof cb === "function") {
            cb();
          }
        }
      }
    ]);
  },
  /**
   * 确认提示框
   * @param head  头
   * @param text  说明
   * @param doText  确定按钮说明
   * @param callBack  确认回调
   */
  showAlert: (head, text, doText, callBack) => {
    return alert(head, text, [
      {
        text: "取消",
        onPress: () => {
        }
      },
      {
        text: doText,
        onPress: () => {
          if (callBack) {
            callBack();
          }
        }
      }
    ]);
  },
  /**
   * 判空
   * @param data
   * @returns {boolean}
   */
  checkIsNull: data => {
    if (data === null || data.trim() === "" || data === undefined) {
      return true;
    }
    return false;
  },

  /**
   * 金额判断  小于1万的显示完整数字，高于一万的显示XX万，高于1亿的显示 X.XX亿
   * @param data
   * @returns {{}}
   * @constructor
   */
  MoneyFormate: data => {
    let obj = {};
    if (data >= 0 && data < 10000) {
      obj.money = data;
      obj.unit = "元";
    } else if (data >= 10000 && data < 100000000) {
      obj.money = parseInt(data / 10000);
      obj.unit = "万";
    } else if (data >= 100000000) {
      obj.money = (Math.floor(data / 100000000 * 100) / 100).toFixed(2);
      obj.unit = "亿";
    }
    return obj;
  },

  /**
   * aes解密
   * @param word
   */
  aesCode: word => {
    let key = CryptoJS.enc.Utf8.parse(config.aes_key);
    let iv = CryptoJS.enc.Utf8.parse(config.aes_iv);
    let dencrypted = CryptoJS.AES.decrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    dencrypted = dencrypted.toString(CryptoJS.enc.Utf8);
    return dencrypted;
  },

  /**
   * aes加密
   * @param word
   * @returns {*}
   */
  aesEnCode: word => {
    // let srcs = CryptoJS.enc.Utf8.parse(word)
    let key = CryptoJS.enc.Utf8.parse(config.aes_key);
    let iv = CryptoJS.enc.Utf8.parse(config.aes_iv);
    let encrypted = CryptoJS.AES.encrypt(word, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let val = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString())
    );
    // console.log('字符',encrypted,val)
    return val;
  },
  // 校验对象是否为数组
  checkIsArr(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  },

  /**
   * 公用校验用户登录状态 未登录->登录首页   已登录->跳转对应path
   * @param path
   *
   */
  async checkLogin() {
    let flag = false;
    await checkUserLogin().then(result => {
      console.log("登录状态：", result);
      if (result.code === "10001") {
        flag = true;
      }
    });
    return flag;
  },

  /**设置除头部以外部位的高度
   * @returns {number}
   */
  setHeight() {
    let w = document.documentElement
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
    if (sessionStorage.getItem("headFlag")) {
      return w;
    } else {
      let myNavHeight = document.getElementsByClassName("myNav")[0].style
        .height;
      return w - parseInt(myNavHeight);
    }
  },

  /**
   *  数字每三位加一个逗号
   * @param str
   * @constructor
   */
  NumAddComma(str) {
    return str.replace(/\d(?=(?:\d{3})+\b)/g, "$&,");
  },

  /**
   * Route.js中 检测用户是否登录
   * @param nextState
   * @param replace
   * @param next
   * @returns {Promise.<void>}
   */
  async checkUserInfor(nextState, replace, next) {
    if (nextState.location.action === "POP") {
      await checkUserLogin().then(result => {
        if (result.code !== "10001") {
          replace("/loginIndex");
          next();
        } else {
          next();
        }
      });
    }
  },

  /**
   * 检查用户 是否登录
   * 登录状态下触发回调
   * @returns {Promise}
   */
  CheckInfor() {
    return new Promise((resolve, reject) => {
      checkUserLogin().then(result => {
        if (result.code !== "10001") {
          hashHistory.push("/loginIndex");
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * 判断手机号 身份证是否绑定
   * @param p1 地址
   * @param p2 地址
   * @param bankCard key值
   * @returns {Promise.<void>}
   * @constructor
   */
  CheckMobileIdCard(p1, p2, bankCard) {
    userBasicInfo().then(result => {
      let d = result.row;
      if (d[bankCard]) {
        hashHistory.push(p1);
        return false;
      } else {
        if (!d.mobileno) {
          utils.showAlert('温馨提示', '该账户未绑定手机号', '去绑定', () => {
            hashHistory.push('accountSafe/editMobile')
          });
          return false;
        }
        if (!d.idcard) {
          utils.showAlert('温馨提示', '该账户未绑定身份证', '去绑定', () => {
            hashHistory.push('accountSafe/editIdCard')
          });
          return false;
        }
        hashHistory.push(p2);
      }
    });
  },
  /**
   * 日期描述
   * @param date
   * @param format
   * @returns {*}
   */
  getDateDesc(date, format) {
    let fromNow = moment(date).valueOf() - (moment(moment().format('YYYYMMDD')).valueOf());
    let fromYesDay = moment(date).valueOf() - moment(moment().subtract(1, 'days').format('YYYYMMDD')).valueOf();
    if (fromNow > 0) {
      return "今天";
    } else if (fromYesDay > 0) {
      return "昨天";
    }
    return moment(date).format(format);
  },
  /**
   * 判断玩法开售状态
   * @param type
   * @param isale
   * @returns {number}
   */
  isSell(type, isale) {
    return utils.sellIntForType(type) & parseInt(isale);
  },
  sellIntForType(type) {
    switch (type) {
      /****** 竞彩足球  ******/
      case "PlayType_JCZQ_RQSPF": {
        return 1;
      }
        break;
      case "PlayType_JCZQ_CBF": {
        return 2;
      }
        break;
      case "PlayType_JCZQ_BQC": {
        return 4;
      }
        break;
      case "PlayType_JCZQ_ZJQ": {
        return 8;
      }
        break;
      case "PlayType_JCZQ_SPF": {
        return 16;
      }
        break;

      /****** 竞彩篮球 ******/
      case "PlayType_JCLQ_SF": {
        return 1;
      }
        break;
      case "PlayType_JCLQ_RFSF": {
        return 2;
      }
        break;
      case "PlayType_JCLQ_SFC": {
        return 4;
      }
        break;
      case "PlayType_JCLQ_DXF": {
        return 8;
      }
        break;

      /****** 足球单关 ******/
      case "PlayType_ZQDG_RQSPF": {
        return 32;
      }
        break;
      case "PlayType_ZQDG_CBF": {
        return 64;
      }
        break;
      case "PlayType_ZQDG_BQC": {
        return 128;
      }
        break;
      case "PlayType_ZQDG_ZJQ": {
        return 256;
      }
        break;
      case "PlayType_ZQDG_SPF": {
        return 512;
      }
        break;

      /****** 篮球单关 ******/
      case "PlayType_LQDG_SF": {
        return 16;
      }
        break;
      case "PlayType_LQDG_RFSF": {
        return 32;
      }
        break;
      case "PlayType_LQDG_SFC": {
        return 64;
      }
        break;
      case "PlayType_LQDG_DXF": {
        return 128;
      }
        break;

      //默认1023 转成二进制是10个1 表示所有玩法都开售
      default: {
        return 1023;
      }
        break;
    }
  },
  /**
   * 显示串关选择描述
   * @param realCG  串关数组
   * @param allIsDG 是否全是单关
   */
  getCGDesc(realCG, allIsDG) {
    console.log('===', realCG)
    console.log(realCG, allIsDG);
    let len = realCG.length;
    let desc = "";
    switch (len) {
      case 0:
        desc = "过关方式";
        break;
      case 1:
        if (allIsDG && realCG[0] === 1) {
          desc = "单关";
        } else {
          desc = betConfig.jczq.CGType[realCG[0]];
        }
        break;
      case 2:
        desc =
          betConfig.jczq.CGType[_.min(realCG)] +
          "," +
          betConfig.jczq.CGType[_.max(realCG)];
        break;
      default:
        desc =
          betConfig.jczq.CGType[_.min(realCG)] +
          "..." +
          betConfig.jczq.CGType[_.max(realCG)];
        break;
    }
    return desc;
  },
  /**
   * 对象数组排序
   * @param property 排序属性
   * @param type  类型 asc:升序(默认)  desc:降序
   * @returns {Function}
   */
  compare(property, type = "asc") {
    return function (obj1, obj2) {
      var value1 = obj1[property];
      var value2 = obj2[property];
      if (type === "asc") {
        return value1 - value2; // 升序
      } else {
        return value2 - value1;
      }
    };
  },
  /**
   * 好久没吐槽了。。。。真忍不住了，给传个 *胜*平*负 的值 这也就忍了，没有平的时候居然是 *平*负 。。。。。。 懒成狗了。。。。fuck
   * @param v
   */
  getSpf(v) {
    let s = "0",
      p = "0",
      f = "0";
    if (v.indexOf("胜") !== -1) {
      s = v.substring(0, v.indexOf("胜"));
    }
    if (v.indexOf("平") !== -1) {
      if (v.indexOf("胜") !== -1) {
        p = v.substring(v.indexOf("胜") + 1, v.indexOf("平"));
      } else {
        p = v.substring(0, v.indexOf("平"));
      }
    }
    if (v.indexOf("负") !== -1) {
      if (v.indexOf("平") !== -1) {
        f = v.substring(v.indexOf("平") + 1, v.indexOf("负"));
      } else if (v.indexOf("胜") !== -1) {
        f = v.substring(v.indexOf("胜") + 1, v.indexOf("负"));
      } else {
        f = v.substring(0, v.indexOf("负"));
      }
    }
    return [s, p, f];
    /*let regx = /(\d{1,})+(?:\.\d+)?/g
     return v.match(regx)*/
  },
  removeEmpty(arr) {
    let a = _.remove(arr, item => {
      if (item) {
        return item;
      }
    });
    return a;
  },

  setUrlHash(key, value) {
    let hash = window.location.hash;
    let str = "";
    if (hash.lastIndexOf("?") !== -1) {
      let arrstr = hash.substring(hash.lastIndexOf('?') + 1);
      let arr1 = arrstr.split("&");
      str = hash.substring(0, hash.lastIndexOf('?')) + "?";
      for (let i = 0, len = arr1.length; i < len; i++) {
        let str1 = "";
        let arr2 = arr1[i].split("=");
        if (arr2[0] === key) {
          str1 = arr2[0] + "=" + value;
        } else {
          str1 = arr2.join("=");
        }
        str += str1;
      }
    } else {
      str = hash + `?${key}=${value}`
    }
    str = str.substring(1);
    return str;
    // console.log(str)
    /*if(str){
     window.location.hash = str;
     }*/
  },
  /**
   * 二星和值对应的注数
   * @param num
   * @returns {*}
   * @constructor
   */
  SSCexhz_zhushu(num) {
    var exhz = {
      '0': 1,
      '1': 1,
      '2': 2,
      '3': 2,
      '4': 3,
      '5': 3,
      '6': 4,
      '7': 4,
      '8': 5,
      '9': 5,
      '10': 5,
      '11': 4,
      '12': 4,
      '13': 3,
      '14': 3,
      '15': 2,
      '16': 2,
      '17': 1,
      '18': 1
    }
    return exhz[num]
  },
  /*阻止默认事件*/
  onHandler(event) {
    let ev = event || window.event;
    ev.preventDefault();
  },
  /*禁止触屏滑动*/
  CancelEvent() {
    document.addEventListener('touchmove', utils.onHandler, false);
  },
  /*解除触屏滑动*/
  RemovEvent() {
    document.removeEventListener('touchmove', utils.onHandler, false);
  }
  ,

  /**********************投注计算相关函数************************************/
  math: {
    /**
     * @description 组合总数
     * @param {Int} n 总数
     * @param {Int} m 组合位数
     * @return {Int}
     * @example math.C(6,5);
     * @memberOf math
     */
    C: function (n, m) {
      var n1 = 1,
        n2 = 1;
      for (var i = n, j = 1; j <= m; n1 *= i--, n2 *= j++) {
      }
      return n1 / n2;
    }
    ,
    /**
     * @description 排列总数
     * @param {Int} n 总数
     * @param {Int} m 组合位数
     * @return {Int}
     * @example math.P(5,3); 60
     * @memberOf math
     */
    P: function (n, m) {
      var n1 = 1,
        n2 = 1;
      for (var i = n, j = 1; j <= m; n1 *= i--, n2 *= j++) {
      }
      return n1;
    }
    ,
    /**
     * @description 枚举数组算法
     * @param {Int} n 数组长度
     * @param {Int|Array} m 枚举位数
     * @return {Int}
     * @example math.Cs(4,3);  [[1,2,3],[1,2,4],[1,3,4],[2,3,4]]
     * @memberOf math
     */
    Cs: function (len, num) {
      var arr = [];
      if (typeof len == "number") {
        for (var i = 0; i < len; i++) {
          arr.push(i + 1);
        }
      } else {
        arr = len;
      }
      var r = [];
      (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (var i = 0, l = a.length; i <= l - n; i++) {
          f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
      })([], arr, num);
      return r;
    }
    ,
    /**
     * @description 获取竞彩N串1注数
     * @param {Array} spArr [2,2,1] 每一场选中的个数
     * @param {Int} n n串1
     * @return {Int}
     * @example math.N1([2,2,1],3);
     * @memberOf math
     */
    N1: function (spArr, n) {
      var zhushu = 0;
      var m = spArr.length; //场次
      var arr = utils.math.Cs(m, n);
      for (var i = 0; i < arr.length; i++) {
        var iTotal = 1; //每场注数
        for (var j = 0; j < arr[i].length; j++) {
          iTotal *= spArr[arr[i][j] - 1];
        }
        zhushu += iTotal;
      }
      return zhushu;
    }
    ,
    /**
     * @description 获取竞彩N串1胆拖注数
     * @param {Array} spArrd [[3,3,3,1,2],[1,1,1,1,0]] 选中5场，4场胆拖
     * @param {Int} n n串1
     * @return {Int}
     * @example math.N1d([[3,3,3,1,2],[1,1,1,1,0]],5); 选中5场，4场胆拖，5串1玩法  return 54
     * @example math.N1d([[3,3,3,1,2],[1,0,0,0,0]],3); 选中5场，1场胆拖，3串1玩法  return 87
     * @memberOf math
     */
    N1d: function (spArrd, n) {
      var nArr = [],
        dArr = [];
      try {
        for (var i = 0; i < spArrd[1].length; i++) {
          if (spArrd[1][i] == 1) {
            dArr.push(spArrd[0][i]);
          } else {
            nArr.push(spArrd[0][i]);
          }
        }
      } catch (e) {
        return 0;
      }
      if (dArr.length <= n) {
        return (
          utils.math.N1(nArr, n - dArr.length) *
          utils.math.N1(dArr, dArr.length)
        );
      } else {
        return 0;
      }
    }
    ,
    /**
     * @description 机选号码
     * @param {} startNum   起始值
     * @param {} totalNum   总数长度
     * @param {} len        机选个数或者数组
     * @param {} a          是否重复，缺省不重复
     * @param {Array} rep      删除不需要的元素，定胆机选用
     * @param {String} con     幸运选号类型'彩种+玩法+类型+值'例如：dlcr5xz1
     * @param {String} hour    幸运选好保留时间
     * @return {Array}
     * @example math.random(1,35,5); 机选1-35之间5不重复个数字 return [4,12,16,8,34,9]
     * @example math.random(1,12,2,true); 机选 return [4,4]
     * @example math.random(1,11,5,null,[],'dlcr5xz1') 幸运选号
     * @memberOf math   1 10 5
     */
    random: function (startNum, totalNum, len, a, rep, con, hour) {
      var absNum = Math.abs(startNum - totalNum) + 1;
      var repL = 0;
      var luckCon = (con && con.split("")) || [];
      if (typeof rep == "object") {
        repL = rep.length;
      }
      if (
        typeof len == "undefined" ||
        len > absNum ||
        len < 1 ||
        len > absNum - repL
      ) {
        return [];
      }

      var o = {},
        _r = new Array(len),
        i = 0,
        s,
        j = 1;
      if (luckCon.length > 0 && utils.Cookie.get(con) !== "") {
        return utils.Cookie.get(con).split(",");
      } else {
        while (i < len) {
          s = parseInt(Math.random() * absNum + startNum);
          if (!a) {
            s = (function (a, s) {
              for (var i = 0; i < a.length;) {
                if (a[i++] == s) return null;
                if (typeof rep == "object") {
                  for (var j = 0; j < repL; j++) {
                    if (s == rep[j]) return null;
                  }
                }
              }
              return s;
            })(_r, s);
            s !== null && (_r[i++] = s);
          } else {
            _r[i++] = s;
          }
        }
        if (luckCon.length > 0) {
          hour = (hour || 1) - new Date().getMinutes() / 60;
          utils.Cookie.set(con, _r.join(","), null, null, hour);
        }
      }
      return _r;
    }
    ,
    /**
     * @description 小于10的数字前补0
     * @param {String|Nubmer|Array} obj 需要获取的参数如bc_tag
     * @return {String}
     * @example
     utils.padArray([1,5,10,11]);//['01','05','10','11']
     utils.padArray(5);//'05'
     utils.padArray(5,3);//'005'

     * @memberOf utils
     */
    padArray: function (obj, length) {
      if (obj instanceof Array) {
        for (var j = 0, _max = obj.length; j < _max; j++) {
          var i = Number(obj[j]);
          obj[j] = utils.math.pad(i, length || 2);
        }
      }
      return obj;
    }
    ,

    /**
     * @description 是否补零
     * @param {String} source 数值
     * @param {Int} [length:true] 长度
     * @example utils.pad(9,2);return 09
     * @example utils.pad(9,3);return 009
     * @memberOf utils
     */
    pad: function (source, length) {
      var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));
      if (string.length < length) {
        pre = (new Array(length - string.length + 1)).join('0');
      }
      return (negative ? "-" : "") + pre + string;
    }
    ,
    /**
     * 数组升序排序
     * @param arr
     */
    sort(arr) {
      return arr.sort((a, b) => {
        return a - b
      })
    }
  }
  ,

//计算理论奖金
  Count: {
    /**
     * @description 通过每一排的最大最小sp 和 过关方式 取得理论奖金的最大最小值
     * @param {Array} arr 要遍历的数组对象
     * @param {Array} guoguan 过关方式
     * @return {obj}
     * @example utils.Count.prix([{max:'2',min:'1'},{max:'4',min:'2'}],[1,2]);return {max:XX,min:OO}
     */
    prix: function (arr, guoguan) {
      var gg_ = guoguan,
        min_pl = [],
        max_pl = [];
      arr.map(function (sp) {
        max_pl.push(+sp.max);
        min_pl.push(+sp.min);
      });
      if (!max_pl.length || !gg_) {
        return {
          min: 0,
          max: 0
        };
      } else {
        var pz = utils.Count.max_prize(max_pl, gg_);
        var minpz = 1;
        minpz = utils.Count.min_prize(min_pl, gg_);
        return {
          min: minpz,
          max: pz
        };
      }
    }
    ,
    /**
     * @description 通过每一排的最大sp 和 过关方式 取得理论奖金的最大值
     * @param {Array} arr 要遍历的数组对象 里面是每一排最大的sp
     * @param {Array} guoguan 过关方式
     * @return {Int}
     * @example utils.Count.max_prize(['3.1', '2.2', '5.5', '1.9'],[2,3]);return 1234
     */
    max_prize: function (arr, guoguan) {
      var max_prize = 0;
      var Q = guoguan;
      _.each(Q, function (value) {
        var _n = parseInt(value) || 1;
        var cl = utils.Count.cl(arr, _n);
        _.each(cl, function (b) {
          var x = 1;
          _.each(b, function (d) {
            x *= d;
          });
          max_prize += x;
        });
      });
      max_prize *= 2;
      return (max_prize = (+max_prize).toFixed(8));
    }
    ,
    /**
     * @description 通过每一排的最小sp 和 过关方式 取得理论奖金的最小值
     * @param {Array} arr 要遍历的数组对象 里面是每一排最小的sp
     * @param {Array} guoguan 过关方式
     * @return {Int}
     * @example utils.Count.max_prize(['3.1', '2.2', '5.5', '1.9'],[2,3]);return 2
     */
    min_prize: function (arr, guoguan) {
      var min_prize = 0;
      var Q = guoguan;
      _.each(Q, function (value) {
        var _n = parseInt(value) || 1;
        var cl = utils.Count.cl(arr, _n);
        _.each(cl, function (b) {
          var x = 1;
          _.each(b, function (d) {
            x *= d;
          });
          if (x < min_prize || min_prize == 0) {
            min_prize = x;
          }
        });
      });
      min_prize *= 2;
      return (min_prize = (+min_prize).toFixed(8));
    }
    ,
    /**
     * @description 通过每一排的最大或最小sp 和 单个过关方式 取得理论奖金的最大或最小值
     * @param {Array} arr 要遍历的数组对象 里面是每一排最小或最大的sp
     * @param {String} n 单个过关方式
     * @return {Int}
     * @example utils.Count.cl(['3.1', '2.2', '5.5', '1.9'],'2');return 2
     */

    cl: function (arr, n, z) {
      // z is max count
      var r = [];
      fn([], arr, n);
      return r;

      function fn(t, a, n) {
        if (n === 0 || (z && r.length == z)) {
          return (r[r.length] = t);
        }
        for (var i = 0, l = a.length - n; i <= l; i++) {
          if (!z || r.length < z) {
            fn(t.concat(a[i]), a.slice(i + 1), n - 1);
          }
        }
      }
    }
  }
  ,
  Cookie: {
    /**
     * @description 设置cookie
     * @param {String} name 名称
     * @param {String} value 值
     * @param {String} [domain:tenpay.com] 域
     * @param {String} [path:/] 路径
     * @param {String} [hour] 小时
     * @example CP.Cookie.set('cp_pagetype', 'page', 'tenpay.com');
     * @memberOf CP.Cookie
     */
    set: function (name, value, domain, path, hour) {
      if (hour) {
        var now = new Date();
        var expire = new Date();
        expire.setTime(parseFloat(now.getTime()) + 3600000 * hour);
      }
      document.cookie =
        name +
        "=" +
        value +
        "; " +
        (hour ? "expires=" + expire.toUTCString() + "; " : "");
    }
    ,
    /**
     * @description 设置cookie
     * @param {String} name 名称
     * @example CP.Cookie.get('cp_pagetype'); "page"
     * @memberOf CP.Cookie
     */
    get: function (name) {
      var re = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
      var result = document.cookie.match(re);
      return !result ? "" : result[1];
    }
    ,
    /**
     * @description 删除cookie
     * @param {String} name 名称
     * @param {String} [domain:tenpay_com] 域
     * @param {String} [path:/] 路径
     * @example CP.Cookie.del('cp_pagetype');
     * @memberOf CP.Cookie
     */
    del: function (name, domain, path) {
      if (domain === null) {
        document.cookie =
          name +
          "=; expires=Mon, 2 Mar 2009 19:00:00 UTC; path=" +
          (path || "/");
      } else {
        document.cookie =
          name +
          "=; expires=Mon, 2 Mar 2009 19:00:00 UTC; path=" +
          (path || "/") +
          "; domain=" +
          (domain || "qq.com") +
          ";";
      }
    }
  },
  Shake: function () {
    var SHAKE_THRESHOLD = 1500;
    var last_update = 0;
    var x, y, z, last_x, last_y, last_z;
    var callBack = null;

    function deviceMotionHandler(eventData) {
      var acceleration = eventData.accelerationIncludingGravity;

      var curTime = new Date().getTime();

      if ((curTime - last_update) > 100) {

        var diffTime = curTime - last_update;
        last_update = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
          callBack && callBack();
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
    }

    var run = function (call) {
      callBack = call;
    };
    var init = function () {
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
      }
    }
    init();
    return {
      run: run
    }
  }(),
  /*
   * 百度统计 事件跟踪
   * @params category 目标的类型名称
   * @params action 目标交互的行为
   * @params opt_label 额外信息
   * */
  baiduStatEventListen(category, action, opt_label){
    try {
      _hmt.push(['_trackEvent', category, action, opt_label])
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *  创建script标签，异步加载JSSDK
   * @param url
   * @constructor
   */
  CreateScriptEl(url){
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    return;
  }
};

export default utils;
