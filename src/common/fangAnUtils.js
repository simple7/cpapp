import betConfig from '../config/betConfig'
import {Modal} from "antd-mobile";
const alert = Modal.alert;

const fangAnUtils = {
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
  /**********************方案详情************************************/
  /**
   * 第一次拆分 竞彩足球 竞彩篮球 ccode 数据
   * @param {String} row HH|SPF=3_1.25,SPF=3_1.25 || SPF_3_1.25,SPF_3_1.25 || SPF|3_1.25,SPF|3_1.25
   */
  CcodesSplit(row, gid) {
    if (row) {
      let ccodes = row.ccodes;
      if (gid == 70 || gid == 71) {
        ccodes = row.ccodes.split("|");
        ccodes = ccodes[1] || ccodes[0];
      }
      let code = "";
      code = ccodes.split(",");
      code = fangAnUtils.CcodesLotMerger(code);
      return code;
    }
    return false;
  }
  ,
  /**
   * 第一次拆分 北京单场 胜负过关 ccode 数据
   * @param {String} row SXP|3 ,SXP|3
   */
  CcodesSplitBgSF(row) {
    if (row) {
      let code = {};
      let ccodes = row.ccodes.split("|");
      let type = fangAnUtils.CcodesType(ccodes[0]);
      if (!code[type]) {
        code[type] = [];
        code[type].push(ccodes[1]);
      } else {
        code[type].push(ccodes[1]);
      }
      return code;
    }
    return false;
  }
  ,
  /**
   * 将玩法归类 相同的存入数组
   * @param {Array} c [SPF=3_1.25,SPF=3_1.25] || [SPF_3_1.25,SPF_3_1.25]
   */
  CcodesLotMerger(c) {
    let code = JSON.parse(JSON.stringify(c));
    let data = {};
    for (let i = 0; i < code.length; i++) {
      let type = fangAnUtils.CcodesType(code[i]);
      let lo = fangAnUtils.CcodeTwoSplit(code[i]);
      if (!data[type]) {
        data[type] = [];
        data[type].push(lo);
      } else {
        data[type].push(lo);
      }
    }
    return data;
  }
  ,
  /**
   * 判断 玩法
   * @param {String} code SPF=3_1.25 || SPF_3_1.25
   */
  CcodesType(code) {
    //竞彩足彩
    if (code.indexOf("SPF") == 0) {
      return "SPF";
    } else if (code.indexOf("RQSPF") == 0 || code.indexOf("RSPF") == 0) {
      return "RQSPF";
    } else if (code.indexOf("BF") == 0 || code.indexOf("CBF") == 0) {
      return "BF";
    } else if (code.indexOf("JQS") == 0) {
      return "JQS";
    } else if (code.indexOf("ZJQ") == 0) {
      return "ZJQ";
    } else if (code.indexOf("BQC") == 0) {
      return "BQC";
    } else if (code.indexOf("SFC") == 0) {
      return "SFC";
      //竞彩篮彩
    } else if (code.indexOf("SF") == 0) {
      return "SF";
    } else if (code.indexOf("DXF") == 0) {
      return "DXF";
    } else if (code.indexOf("RFSF") == 0) {
      return "RFSF";
      // 北京单场 胜负过关
    } else if (code.indexOf("SXP") == 0) {
      return "SXP";
    }
  }
  ,
  /**
   * 第二次拆分 竞彩篮球足球 将玩法类型和赔率过滤出来
   * @param {String} code  'SPF=3_1.35' || 'SPF_3_1.35' || SPF|3_1.35
   * @returns String 3_1.25
   */
  CcodeTwoSplit(code) {
    if (code.indexOf("=") > -1) {
      let codeSplit = code.split("=");
      return codeSplit[1];
    } else if (code.indexOf("|") > -1) {
      let codeSplit = code.split("|");
      return codeSplit[1];
    } else if (code.indexOf("_") > -1) {
      let codeSplit = code.split("_");
      return `${codeSplit[1]}_${codeSplit[2]}`;
    }
  }
  ,
  /**
   * 解析 code
   * @param {String} key 玩法 SPF|RQSPF
   * @param {String} code 赔率 3_1.25
   * @param {String} gid 彩种 70
   * @param {String} close 让球数 1|-1
   * @returns Object
   */
  JCCcodeAnalysis(key, code, gid, close, zclose) {
    if (code) {
      let obj = {};
      let clo = close ? (close > 0 ? `(+${close})` : `(${close})`) : "";
      if (
        gid == "70" ||
        gid == "72" ||
        gid == "90" ||
        gid == "91" ||
        gid == "92" ||
        gid == "93"
      ) {
        obj.lose = key == "RSPF" || key == "RQSPF" ? clo : "";
        fangAnUtils.CodeDescOdds(key, code, "jczq", obj);
        return obj;
      } else if (
        gid == "71" ||
        gid == "94" ||
        gid == "95" ||
        gid == "96" ||
        gid == "97"
      ) {
        obj.lose = key == "RFSF" ? clo : "";
        obj.zlose = key == "DXF" ? `(${zclose})` : "";
        fangAnUtils.CodeDescOdds(key, code, "jclq", obj);
        return obj;
      } else if (gid == "84") {
        obj.lose = clo;
        fangAnUtils.CodeDescOdds_BJDC(key, code, "sfgg", obj);
        return obj;
      } else if (
        gid == "85" ||
        gid == "86" ||
        gid == "87" ||
        gid == "88" ||
        gid == "89"
      ) {
        obj.lose = key == "SPF" ? clo : "";
        fangAnUtils.CodeDescOdds_BJDC(key, code, "bjdc", obj);
        return obj;
      }
    }
  }
  ,
  /**
   * 将解析后的 竞彩足球 篮球 赔率和玩法 放入对象
   * @param {String} key  玩法 SPF|RQSPF
   * @param {String} code  赔率和玩法类型 3_1.25
   * @param {String} lt  彩种 jclq||jczq||sfgg
   * @param {String} obj  Object
   */
  CodeDescOdds(key, code, lt, obj) {
    let {lot, CType} = fangAnUtils.Ccode__lotType(key);
    obj.lotType = lot;
    obj[obj.lotType] = [];
    for (let i = 0; i < code.length; i++) {
      const {type, odds} = fangAnUtils.CcodeOddsSplit(code[i]);
      let desc = betConfig[lt][CType].desc
        ? betConfig[lt][CType].desc[type]
        : type;
      if (key == "DXF" || key == "SFC") {
        let obj = {desc: desc, type: type, key: key};
        desc = fangAnUtils.DXFAndSFClotReasult(obj);
      }
      obj[obj.lotType].push({
        desc: desc,
        odds: odds
      });
    }
  }
  ,
  /**
   * 将解析后的 北京单场 胜负过关 赔率和玩法 放入对象
   * @param {String} key  玩法 SPF|RQSPF
   * @param {String} code 玩法 3,1|3
   * @param {String} lt  彩种 sfgg || bjdc
   * @param {String} obj  Object
   */
  CodeDescOdds_BJDC(key, code, lt, obj) {
    let {lot, CType} = fangAnUtils.Ccode__lotType(key);
    if (CType == 'spf') {
      lot = '让球'
    }
    let arrCode = code[0].split(",");
    let desc = [];
    if (lt == "sfgg") {
      obj.lotType = `${lot}过关`;
    } else {
      obj.lotType = lot;
    }
    obj[obj.lotType] = [];
    for (let i = 0; i < arrCode.length; i++) {
      const {type} = fangAnUtils.CcodeOddsSplit(arrCode[i]);
      desc.push(
        CType != "bqc"
          ? betConfig[lt][CType].desc ? betConfig[lt][CType].desc[type] : type
          : betConfig[lt][CType].descPl[type]
      );
    }
    obj[obj.lotType].push({
      desc: desc
    });
  }
  ,
  /**
   * 转换玩法类型名称
   * @param {String} value 玩法
   */
  Ccode__lotType(value) {
    switch (value) {
      // 竞彩足球
      case "SPF":
        return {
          lot: `胜平负`,
          CType: `spf`
        };
        break;
      case "RSPF":
      case "RQSPF":
        return {
          lot: `让球`,
          CType: `rq`
        };
        break;
      case "BF":
      case "CBF":
        return {
          lot: `比分`,
          CType: `bf`
        };
        break;
      case "JQS":
      case "ZJQ":
        return {
          lot: `进球数`,
          CType: `jq`
        };
        break;
      case "BQC":
        return {
          lot: `半全场`,
          CType: `bqc`
        };
        break;
      // 竞彩篮球
      case "SF":
        return {
          lot: `胜负`,
          CType: `sf`
        };
        break;
      case "DXF":
        return {
          lot: `大小分`,
          CType: `dxf`
        };
        break;
      case "RFSF":
        return {
          lot: `让分`,
          CType: `rf`
        };
        break;
      case "SFC":
        return {
          lot: `胜分差`,
          CType: `sfc`
        };
        break;
      // 北京单场
      case "SXP":
        return {
          lot: `上下单双`,
          CType: `sxds`
        };
        break;
    }
  }
  ,
  /**
   * 第三次拆分 将玩法类型和赔率拆分
   * @param {String} code 赔率和所选的玩法类型 3_1.25
   */
  CcodeOddsSplit(code) {
    let oddsArr = code.split("_");
    let type = oddsArr[0];
    let odds = oddsArr[1];
    return {
      type: type,
      odds: odds
    };
  }
  ,
  /**
   * 转换胜分差和大小分的 玩法类型名称
   * @param {Object} obj
   */
  DXFAndSFClotReasult(obj) {
    const {desc, type, key} = obj;
    switch (key) {
      case "DXF":
        return desc == "大于" ? "大分" : "小分";
      case "SFC":
        return Number(type) > 6 ? `客胜${desc}` : `主胜${desc}`;
    }
  }
  ,
  /**
   * 彩果解析
   * @param {Object} score {hs:1,gs:2,hhs:1,hgs:1}
   * @param {Object} value
   * @param {String} type
   */
  lotResult(score = {}, value = {}, type) {
    if (score.hs == "") return;
    let {hs, gs, hhs, hgs} = score;
    let {close, zclose, code} = value;
    (hs = Number(hs)),
      (gs = Number(gs)),
      (hhs = Number(hhs)),
      (hgs = Number(hgs));
    let closeHs = close ? Number(hs) + Number(close) : hs; // 让球数
    let Gtotal = Number(hs) + Number(gs);
    switch (type) {
      // 竞彩足球
      case "SPF":
        return fangAnUtils.LotResultJudge(hs, gs, type);
        break;
      case "RSPF":
      case "RQSPF":
        return fangAnUtils.LotResultJudge(closeHs, gs, type);
        break;
      case "BJDCBF":
      case "BF":
      case "CBF":
        return `${hs}:${gs}`;
        break;
      case "BJDCZJQ":
      case "JQS":
      case "ZJQ":
        return Gtotal;
        break;
      case "BJDCBQC":
      case "BQC":
        let hDes = fangAnUtils.LotResultJudge(hs, gs, type);
        let hhDes = fangAnUtils.LotResultJudge(hhs, hgs, type);
        return `${hDes}-${hhDes}`;
        break;
      // 竞彩篮球
      case "SF":
        return fangAnUtils.LotResultJudge(hs, gs, type);
        break;
      case "RFSF":
        return fangAnUtils.LotResultJudge(closeHs, gs, type);
        break;
      case "DXF":
        return fangAnUtils.LotResultJudge(Gtotal, zclose, type);
        break;
      case "SFC":
        return `${fangAnUtils.LotResultJudge(hs, gs, type)}${fangAnUtils.SFCGradeInterval(
          hs - gs
        )}`;
        break;
      // 胜负过关
      case "SFGGSF":
        return fangAnUtils.LotResultJudge(closeHs, gs, type);
        break;
      // 北京单场
      case "BJDCSXDS":
        return fangAnUtils.LotResultJudge(hs, gs, type);
        break;
      case "BJDCRQSPF":
        return fangAnUtils.LotResultJudge(closeHs, gs, type);
        break;
    }
    return;
  }
  ,
  /**
   * 彩果判断
   * @param {String} hs 主队比分
   * @param {String} gs 客队比分
   */
  LotResultJudge(hs, gs, type) {
    let total = hs + gs;
    if (
      type == "BQC" ||
      type == "BJDCBQC"
    ) {
      if (hs > gs) {
        return "胜";
      } else if (hs == gs) {
        return "平";
      } else {
        return "负";
      }
    } else if (
      type == "SPF" ||
      type == "SFGGSF" ||
      type == "SF" ||
      type == "SFC"
    ) {
      if (hs > gs) {
        return "主胜";
      } else if (hs == gs) {
        return "平";
      } else if (hs < gs) {
        return "客胜";
      }
    } else if (type == "DXF") {
      if (hs > gs) {
        return "大分";
      } else if (hs < gs) {
        return "小分";
      }
    } else if (type == "BJDCSXDS") {
      if (total >= 3) {
        if (total % 2 == 0) {
          return "上双";
        } else {
          return "上单";
        }
      } else if (total < 3) {
        if (total % 2 == 0) {
          return "下双";
        } else {
          return "下单";
        }
      }
    } else if (type == "BJDCRQSPF" || type == "RQSPF" || type == "RFSF") {
      if (hs > gs) {
        return "让主胜";
      } else if (hs == gs) {
        return "让平";
      } else {
        return "让客胜";
      }
    }
  }
  ,
  /**
   * 竞彩篮球 胜分差分数区间判断
   * @param {String} g
   */
  SFCGradeInterval(g) {
    const grade = Math.abs(g);
    if (grade >= 1 && grade <= 5) {
      return "1-5";
    } else if (grade >= 6 && grade <= 10) {
      return "6-10";
    } else if (grade >= 11 && grade <= 15) {
      return "11-15";
    } else if (grade >= 16 && grade <= 20) {
      return "16-20";
    } else if (grade >= 21 && grade <= 25) {
      return "21-25";
    } else {
      return "26+";
    }
  }
  ,
  /**
   * 北京单场 胜负过关 gid判断
   */
  BJDCAndSFGGgid(gid) {
    switch (gid) {
      case "84":
        return "SFGGSF";
        break;
      case "85":
        return "BJDCRQSPF";
        break;
      case "86":
        return "BJDCBF";
        break;
      case "87":
        return "BJDCBQC";
        break;
      case "88":
        return "BJDCSXDS";
        break;
      case "89":
        return "BJDCZJQ";
        break;
    }
  }
  ,
  /**
   * 替换 串关方式
   * @param {String} gg
   */
  replaceGG(gg) {
    if (gg) {
      return gg.replace(/\*/g, "串");
    }
    return;
  }
  ,
  /**
   * 判断是否为一场制胜
   * @param {String} source
   */
  AwinnerState(source) {
    if (source && source == 15) {
      return true; // 一场制胜
    }
    return false;
  }
  ,
  /**
   * 判断是否开奖
   */
  hasResult(Jindunode, Jindupercent) {
    if ((Jindunode == 2 && Jindupercent == 100) || Jindunode > 2) {
      return true;
    } else {
      return false;
    }
  }
  ,
  /**
   * 判断是否出票
   * @param {String} Jindunode
   * @param {String} Jindupercent
   */
  hasTicket(Jindunode, Jindupercent) {
    if ((Jindunode == 1 && Jindupercent == 100) || Jindunode > 1) {
      return true;
    } else {
      return false;
    }
  }
  ,
  /**
   * 参数：彩种id，投注内容
   * @param lotid
   * @param ccodes
   *
   */
  showCode(lotid, ccodes) {
    let result = {}
    let html = [];
    let codes = ccodes.split(";");
    for (let i = 0, l = codes.length; i < l; i++) {
      let tmpCode = codes[i].split(":");
      let pm = tmpCode[1];
      let cm = tmpCode[2];
      if (lotid === "01" || lotid === "50") {//双色球，大乐透
        let params = fangAnUtils.matchopencode(lotid, pm, cm, tmpCode[0])
        if (params.zj && !result.zj) {
          result.zj = params.zj
        }
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        html.push(params);
      } else if (lotid === "54" || lotid === "55" || lotid === "59" || lotid === "55" || lotid === "03" || lotid === "53" || lotid === "56" || lotid === "57") {
        let params = {}
        params.wf = fangAnUtils.getplayname(lotid, pm, cm)
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        if (tmpCode[0].indexOf('$') != '-1') {
          let str = tmpCode[0].replace(/\$/g, ',),');
          let arr = str.split(',')
          arr.unshift(`(`);
          params.red = arr;
        } else {
          if ((lotid === '03' || lotid === '53') && pm == '1' && cm == '1') {
            let arr = tmpCode[0].split(',').join(',|').split(',')
            arr = _.map(arr, item => {
              return (
                item.split('').join(' ')
              )
            })
            params.red = arr.toString().split(/,|\s/g)
          } else if ((lotid === '55' || lotid === '59') && (pm === '09' || pm === '10' || pm === '08')) {
            let arr = tmpCode[0].split('|').join(',|,').split(',');
            params.red = arr
          } else {
            params.red = tmpCode[0].split(',')
          }
        }
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        html.push(params)
      } else if (lotid == "07" || lotid == "51" || lotid == "52") {//表示七星彩（51）   七乐彩  排列五
        let params = {}
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        params.wf = '普通投注'
        params.red = tmpCode[0].split(',');
        html.push(params);
      } else if (lotid == "04") {//重庆时时彩
        let params = {};
        let tc = tmpCode[0].split(",");
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        params.wf = fangAnUtils.getplayname(lotid, pm, cm);
        if (parseInt(pm, 10) == 6) {
          let strArr = tmpCode[0].replace(/2/g, "大").replace(/1/g, "小").replace(/5/g, "单").replace(/4/g, "双")
          params.red = strArr.split(",");
        } else if (pm === '4' || pm === '3' || pm === '1' || pm === '12') { // 二星直选 三星直选 五星直选 五星通选
          let arr = tmpCode[0].replace(/\,/g, '|').split('')
          params.red = arr;
        } else {
          params.red = tc;
        }
        html.push(params);
      } else if (lotid == "20") {//新时时彩(江西)
        let params = {};
        let tc = tmpCode[0].split(",");
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        params.wf = fangAnUtils.getplayname(lotid, pm, cm);
        if (parseInt(pm, 10) == 11) {
          let strArr = tmpCode[0].replace(/2/g, "大").replace(/1/g, "小").replace(/5/g, "单").replace(/4/g, "双")
          params.red = strArr.split(",");
        } else {
          params.red = tc;
        }
        html.push(params);
      } else if (lotid == "05" || lotid == "06" || lotid == "08" || lotid == "09" || lotid == "10") {//吉林快三，安徽快三，福彩快三(内蒙)，江苏快三，新快三
        let params = {};
        params.wf = fangAnUtils.getplayname(lotid, pm, cm);
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        if (pm == 2) {//（快三）三同号通选在方案详情页面显示号码
          params.red = '111,222,333,444,555,666'.split(',');
        } else if (pm == 5) {
          params.red = '123,234,345,456'.split(',');
        } else if (pm == '7') {
          var cod = tmpCode[0].split("|");
          if (cod.length == 2) {
            var tn = cod[0].split(",");
            var tnstr = "";
            if (tn.length > 0) {
              for (var j = 0; j < tn.length; j++) {
                tnstr += tn[j] + "" + tn[j] + ",";
              }
              let red = tnstr + "|," + cod[1]
              params.red = red.split(',');
            }
          }
        } else {
          params.red = tmpCode[0].split(',')
        }
        html.push(params);
      }

      //以下为原5.9188解析逻辑
      else if (lotid == "58") {//快乐扑克3
        var tmp = tmpCode[0];
        switch (pm) {
          case "01":
          case "02":
          case "03":
          case "04":
          case "05":
          case "06":
            tmp = tmp.replace('11', 'J').replace('12', 'Q').replace('13', 'K').replace('01', 'A').replace('02', '2').replace('03', '3').replace('04', '4').replace('05', '5').replace('06', '6').replace('07', '7').replace('08', '8').replace('09', '9');
            break;
          case "07":
          case "08"://同花、顺单选
            tmp = tmp.replace('01', '黑桃单选').replace('02', '红桃单选').replace('03', '梅花单选').replace('04', '方片单选');
          case "09"://顺子单选
            tmp = tmp.replace('01', 'A23').replace('02', '234').replace('03', '345').replace('04', '456').replace('05', '567')
              .replace('06', '678').replace('07', '789').replace('08', '8910').replace('09', '910J').replace('10', '10JQ')
              .replace('11', 'JQK').replace('12', 'QKA');
            break;
          case "10"://豹子单选
            tmp = tmp.replace('01', 'AAA').replace('02', '222').replace('03', '333').replace('04', '444').replace('05', '555')
              .replace('06', '666').replace('07', '777').replace('08', '888').replace('09', '999').replace('10', '101010')
              .replace('11', 'JJJ').replace('12', 'QQQ').replace('13', 'KKK');
            break;
          case "11"://对子单选
            tmp = tmp.replace('01', 'AA').replace('02', '22').replace('03', '33').replace('04', '44').replace('05', '55')
              .replace('06', '66').replace('07', '77').replace('08', '88').replace('09', '99').replace('10', '1010')
              .replace('11', 'JJ').replace('12', 'QQ').replace('13', 'KK');
            break;
          case "12":
            tmp = "同花包选";
            break;
          case "13":
            tmp = "同花顺包选";
            break;
          case "14":
            tmp = "顺子包选";
            break;
          case "15":
            tmp = "豹子包选";
            break;
          case "16":
            tmp = "对子包选";
            break;
        }
        if (tmp.indexOf('$') != '-1') {
          var arr = tmp.split('$');
          tmp = ' 胆:' + arr[0] + ' 拖:' + arr[1];
        }
        html += '[' + fangAnUtils.getplayname(lotid, pm, cm) + ']&nbsp;' + tmp + '<br>';
      } else {
        let params = {};
        params.wf = fangAnUtils.getplayname(lotid, pm, cm);
        params.zhushu = fangAnUtils.computeZhuShu(lotid, tmpCode[0], pm, cm)
        params.red = tmpCode[0].split(',');
        html.push(params);
      }
    }
    result.html = html
    return result;
  }
  ,
  matchopencode(lotid, pm, cm, cd) {//专门为双色球大乐透服务的
    let red = [];
    let blue = [];
    let html = {};
    let wf = fangAnUtils.getplayname(lotid, pm, cm, 0);

    if (lotid == "50") {
      let cdstr = cd.split("|");
      let qq = cdstr[0];
      let hq = cdstr[1];
      if (qq.indexOf("$") != -1) {
        let str = '( ' + qq.split("$")[0].replace(/,/g, " ") + ' ) ' + qq.split("$")[1].replace(/,/g, " ");
        red = str.split(/\s/g)
      } else {
        red = qq.split(',');
      }
      if (hq.indexOf("$") != -1) {
        let str = '( ' + hq.split("$")[0].replace(/,/g, " ") + ' ) ' + hq.split("$")[1].replace(/,/g, " ");
        blue = str.split(/\s/g)
      } else {
        blue = hq.split(',');
      }
    } else {
      let hq = cd.split("|")[0];
      let lq = cd.split("|")[1];
      if (cd.indexOf("$") != -1) {
        let dt = hq.split("$");
        let str = '( ' + dt[0].replace(/,/g, " ") + ' ) ' + dt[1].replace(/,/g, " ");
        red = str.split(/\s/g)
        blue = lq.split(',');
      } else {
        red = hq.split(',');
        blue = lq.split(',');
      }
    }
    if (wf != "") {
      html.zj = ''
      if (pm == 2) {
        html.zj = '(追加投注)'
      }
      html.red = red;
      html.blue = blue;
      html.wf = wf
    }
    return html;
  }
  ,
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
  },
  /**
   * 计算方案详情注数
   * @param lotId 彩种id
   * @param ball  方案内容
   * @param playId  玩法
   * @param cm      胆 拖
   * @returns {number}
   */
  computeZhuShu(lotId, ball, playId, cm) {
    lotId = parseInt(lotId, 10);
    playId = parseInt(playId, 10);
    cm = parseInt(cm, 10);
    let zhushu = 0;
    let ballArr = []
    let redBall = '';
    let blueBall = '';
    let len = ''
    switch (lotId) {
      case 1:
        //双色球
        ballArr = ball.split('|');
        redBall = ballArr[0]
        blueBall = ballArr[1].split(',')
        if (redBall.indexOf('$') !== -1) {
          //胆拖
          redBall = redBall.split('$')
          let dan = redBall[0].split(',')
          let tuo = redBall[1].split(',')
          zhushu = fangAnUtils.math.C(tuo.length, betConfig.FAXQ.ssq.red - dan.length,) * blueBall.length
        } else {
          redBall = redBall.split(',')
          zhushu = fangAnUtils.math.C(redBall.length, betConfig.FAXQ.ssq.red) * blueBall.length
        }
        break;
      case 50:
        //大乐透
        ballArr = ball.split('|');
        redBall = ballArr[0]
        blueBall = ballArr[1]
        let redZhushu = ''
        let blueZhushu = ''
        if (redBall.indexOf('$') !== -1) {
          //红球胆拖
          redBall = redBall.split('$')
          let dan = redBall[0].split(',')
          let tuo = redBall[1].split(',')
          redZhushu = fangAnUtils.math.C(tuo.length, betConfig.FAXQ.dlt.red - dan.length,)
        } else {
          redBall = redBall.split(',')
          redZhushu = fangAnUtils.math.C(redBall.length, betConfig.FAXQ.dlt.red)
          console.log(redZhushu)
        }
        if (blueBall.indexOf('$') !== -1) {
          //蓝球胆拖
          blueBall = blueBall.split('$')
          let dan = blueBall[0].split(',')
          let tuo = blueBall[1].split(',')
          blueZhushu = fangAnUtils.math.C(tuo.length, betConfig.FAXQ.dlt.blue - dan.length,)
        } else {
          blueBall = blueBall.split(',')
          blueZhushu = fangAnUtils.math.C(blueBall.length, betConfig.FAXQ.dlt.blue)
        }
        zhushu = redZhushu * blueZhushu
        break;
      case 3:
      case 53:
        //福彩3d 排列3
        ballArr = ball.split(',');
        switch (cm) {
          case 1:
            zhushu = 1;
            if (playId == "1") {
              //直选，组三单式，组六单式
              _.map(ballArr, item => {
                zhushu *= item.length
              })
            }
            break;
          case 2:
          case 3:
            if (playId == "2") {
              //组三复式
              len = ballArr.length
              zhushu = fangAnUtils.math.C(len, 2) * 2
            } else if (playId == "3") {
              //组六复式
              len = ballArr.length
              zhushu = fangAnUtils.math.C(len, 3)
            }
            break;
          case 5:
          case 4:
            if (playId == "1") {
              //直选和值
              _.map(ballArr, item => {
                zhushu += betConfig.FAXQ.pl3.hz[item]
              })
            } else if (playId == "2") {
              //s = "组三和值";
            } else if (playId == "3") {
              //s = "组六和值";
            }
            break;
        }
        break;
      case 7:
        //七乐彩
        ballArr = ball.split(',');
        len = ballArr.length
        zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.qlc.red)
        break
      case 51:
        // 七星彩
        ballArr = ball.split(',');
        len = ballArr.length
        console.log(len)
        zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.qxc.red)
        break
      case 52:
        //排列5
        ballArr = ball.split(',');
        len = ballArr.length
        zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.pl5.red)
        break
      case 55:
      case 59:
        // 粤11选5 新11选5
        switch (playId) {
          case 10:
          case 9:
            ballArr = ball.split('|');
            zhushu = 1;
            _.map(ballArr, item => {
              zhushu *= item.split(',').length
            })
            break;
          default:
            ballArr = ball.split(',');
            len = ballArr.length;
            zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.x11x5[playId]);
            break;
        }
        break;
      case 4:
        // 时时彩
        ballArr = ball.split(',');
        switch (cm) {
          case 4:
            if (playId == '7') {
              len = ballArr.length
              _.map(ballArr, item => {
                zhushu += betConfig.FAXQ.ssc.hz[item]
              })
            }
            break;
          case 3:
            if (playId == '8') {
              len = ballArr.length
              zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.ssc[playId]) * 2
            } else {
              len = ballArr.length;
              zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.ssc[playId])
            }
            break;
          case 1:
            if (playId == '5') {
              len = ballArr.length
              zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.ssc[playId])
            } else {
              len = ballArr.length
              zhushu = 1;
              _.map(ballArr, item => {
                zhushu *= item.split('').length
              })
            }
            break;
          default:
            len = ballArr.length
            zhushu = fangAnUtils.math.C(len, betConfig.FAXQ.ssc[playId])
            break;
        }
        break;
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
        //吉林快三  ，安徽快三  ，福彩快三(内蒙)，江苏快三，新快三
        if (playId == 2) {//（快三）三同号通选在方案详情页面显示号码
          zhushu = 1;
        } else if (playId == 5) {
          zhushu = 1;
        } else if (playId == 7) {
          ballArr = ball.split('|');
          zhushu = 1;
          _.map(ballArr, item => {
            zhushu *= item.split(',').length;
          })
        } else {
          ballArr = ball.split(',');
          zhushu = ballArr.length;
        }
        break;
    }
    return zhushu
  }
  ,
  /**
   * @description 获取投注玩法名
   * @param {Str} lotid 彩种id
   * @param {Str} playid 玩法
   * @param {Str} cm 胆  拖
   * @param {} castdef
   */
  getplayname(lotid, playid, cm, castdef) {
    let s = ""; //玩法名
    lotid = parseInt(lotid, 10);
    playid = parseInt(playid, 10);
    castdef = parseInt(castdef, 10);
    cm = parseInt(cm, 10);
    switch (lotid) {
      case 1:
        switch (cm) {
          case 1:
            s = "普通投注";
            break;
          case 5:
            s = "胆拖投注";
            break;
        }
        break;
      case 50:
        switch (cm) {
          case 1:
            s = "普通投注";
            break;
          case 5:
            s = "胆拖投注";
            break;
        }
        break;
        break;
      case 85:
        s = "让球胜平负";
        break;
      case 86:
        s = "比分";
        break;
      case 87:
        s = "半全场";
        break;
      case 88:
        s = "上下单双";
        break;
      case 89:
        s = "总进球数";
        break;
      case 90:
        s = "让球胜平负";
        break;
      case 91:
        s = "比分";
        break;
      case 92:
        s = "半全场";
        break;
      case 93:
        s = "总进球数";
        break;
      case 72:
        s = "胜平负";
        break;
      case 4:
        switch (playid) {
          case 1:
            s = "五星直选";
            break;
          case 3:
            s = "三星直线";
            break;
          case 4:
            s = "二星直选";
            break;
          case 5:
            s = "一星直选";
            break;
          case 6:
            s = "大小单双";
            break;
          case 7:
            s = "二星组选和值";
            break;
          case 8:
            s = "三星组三";
            break;
          case 9:
            s = "三星组六";
            break;
          case 12:
            s = "五星通选";
            break;
          case 13:
            s = "五星复选";
            break;
          case 15:
            s = "三星复选";
            break;
          case 16:
            s = "两星复选";
            break;
        }
        break;
      case 6:
      case 8:
      case 9:
      case 10:
      case 5:
        switch (playid) {
          case 1:
            s = "和值";
            break;
          case 2:
            s = "三同号通选";
            break;
          case 3:
            s = "三同号单选";
            break;
          case 4:
            if (castdef == 5) {
              s = "三不同号胆拖";
            } else {
              s = "三不同号";
            }
            break;
          case 5:
            s = "三连号通选";
            break;
          case 6:
            s = "二同号复选";
            break;
          case 7:
            s = "二同号单选";
            break;
          case 8:
            if (castdef == 5) {
              s = "二不同号胆拖";
            } else {
              s = "二不同号";
            }
            break;
        }
        break;
      case 20:
        switch (playid) {
          case 1:
            s = "一星直选";
            break;
          case 2:
            s = "二星直选";
            break;
          case 3:
            s = "三星直选";
            break;
          case 4:
            s = "四星直选";
            break;
          case 5:
            s = "五星直选";
            break;
          case 6:
            s = "二星组合";
            break;
          case 7:
            s = "三星组合";
            break;
          case 8:
            s = "四星组合";
            break;
          case 9:
            s = "五星组合";
            break;
          case 10:
            if (castdef == "1") {
              s = "二星组选单式";
            } else {
              s = "二星组选包号";
            }
            break;
          case 11:
            s = "大小单双";
            break;
          case 12:
            s = "五星通选";
            break;
          case 13:
            s = "任选一";
            break;
          case 14:
            s = "任选二";
            break;
          case 15:
            if (castdef == "1") {
              s = "三星组三单式";
            } else {
              s = "三星组三包号";
            }
            break;
          case 16:
            if (castdef == "1") {
              s = "三星组六单式";
            } else {
              s = "三星组六包号";
            }
            break;
        }
        break;
      case 3:
      case 53://castdef---playid
        switch (cm) {
          case 1:
            if (playid == "1") {
              s = "直选";
            } else if (playid == "2") {
              s = "组三单式";
            } else if (playid == "3") {
              s = "组六单式";
            }
            break;
          case 2:
          case 3:
            if (playid == "2") {
              s = "组三复式";
            } else if (playid == "3") {
              s = "组六复式";
            }
            break;
          case 5:
          case 4:
            if (playid == "1") {
              s = "直选和值";
            } else if (playid == "2") {
              s = "组三和值";
            } else if (playid == "3") {
              s = "组六和值";
            }
            break;
        }
        break;
      case 59:
      case 54:
      case 55:
      case 56:
        switch (playid) {
          case 1:
            s = "前一直选";
            break;
          case 2:
            s = "任选二";
            break;
          case 3:
            s = "任选三";
            break;
          case 4:
            s = "任选四";
            break;
          case 5:
            s = "任选五";
            break;
          case 6:
            s = "任选六";
            break;
          case 7:
            s = "任选七";
            break;
          case 8:
            s = "任选八";
            break;
          case 9:
            s = "前二直选";
            break;
          case 10:
            s = "前三直选";
            break;
          case 11:
            s = "前二组选";
            break;
          case 12:
            s = "前三组选";
            break;
        }
        break;
      case 57:
        switch (playid) {
          case 1:
            s = "前一直选";
            break;
          case 2:
            s = "任选二";
            break;
          case 3:
            s = "任选三";
            break;
          case 4:
            s = "任选四";
            break;
          case 5:
            s = "任选五";
            break;
          case 6:
            s = "任选六";
            break;
          case 7:
            s = "任选七";
            break;
          case 8:
            s = "任选八";
            break;
          case 9:
            s = "前二直选";
            break;
          case 10:
            s = "前三直选";
            break;
          case 11:
            s = "前二组选";
            break;
          case 12:
            s = "前三组选";
            break;
        }
        break;
      case 58:
        switch (playid) {
          case 1:
            s = "任选一";
            break;
          case 2:
            if (castdef == 5) {
              s = "任选二胆拖";
            } else {
              s = "任选二";
            }
            break;
          case 3:
            if (castdef == 5) {
              s = "任选三胆拖";
            } else {
              s = "任选三";
            }
            break;
          case 4:
            if (castdef == 5) {
              s = "任选四胆拖";
            } else {
              s = "任选四";
            }
            break;
          case 5:
            if (castdef == 5) {
              s = "任选五胆拖";
            } else {
              s = "任选五";
            }
            break;
          case 6:
            if (castdef == 5) {
              s = "任选六胆拖";
            } else {
              s = "任选六";
            }
            break;
          case 7:
          case 12:
            s = "同花";
            break;
          case 8:
          case 13:
            s = "同花顺";
            break;
          case 9:
          case 14:
            s = "顺子";
            break;
          case 10:
          case 15:
            s = "豹子";
            break;
          case 11:
          case 16:
            s = "对子";
            break;
        }
        break;
    }
    return s;
  }
  ,
  /**
   * 分享按钮 状态 暂时不显示神单相关按钮
   * @param {*} hasResult
   * @param {*} shareGod  分享神单标志  0普通  1分享神单  2神单跟买 3 方案已截止，不能跟买或分享
   */
  shareBtnState(hasResult, shareGod) {
    return {
      desc: "",
      ShareState: false
    };
    if (hasResult) {
      if (shareGod == 1) {
        //return { desc: "查看神单详情", ShareState: true, url:'https://5.9188.com/sdjc/buy.html'};
      } else {
        //return { desc: "", ShareState: false };
      }
    } else {
      if (shareGod == 3) {
        //return { desc: "", ShareState: false };
      } else if (shareGod == 2) {
        //return { desc: "继续跟买", ShareState: true, url:''};
      } else if (shareGod == 1) {
        //return { desc: "查看神单详情", ShareState: true, url:''};
      } else if (shareGod == 0) {
        //return { desc: "分享神单", ShareState: true, url:''};
      }
    }
  }
  ,
  /**********************方案详情************************************/
}

export default fangAnUtils
