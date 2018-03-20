import jczq from "../Img/caizhongIcon/jjz@3x.png";
import jclq from "../Img/caizhongIcon/jjlq@3x.png";
import sfgg from "../Img/caizhongIcon/ssgg@3x.png";
import sfc from "../Img/caizhongIcon/sfc@3x.png";
import zqdg from "../Img/caizhongIcon/zqdg@3x.png";
import lqdg from "../Img/caizhongIcon/lqdg@3x.png";
import bjdc from "../Img/caizhongIcon/dcjcz@3x.png";
import r9 from "../Img/caizhongIcon/rx9@3x.png";

import dlt from "../Img/caizhongIcon/dlt@3x.png";
import qlc from "../Img/caizhongIcon/7lc@3x.png";
import qxc from "../Img/caizhongIcon/qqx@3x.png";
import p3 from "../Img/caizhongIcon/p3@3x.png";
import fc3d from "../Img/caizhongIcon/3d@3x.png";
import p5 from "../Img/caizhongIcon/pl5@3x.png";
import ssq from "../Img/caizhongIcon/ssq@3x.png";
import ssc from "../Img/caizhongIcon/ssc@3x.png";

import hb11x5 from "../Img/caizhongIcon/hb11@3x.png";
import gd11x5 from "../Img/caizhongIcon/hb11@3x.png";
import k3 from "../Img/caizhongIcon/k3@3x.png";
import ahk3 from "../Img/caizhongIcon/k3@3x.png";
import xk3 from "../Img/caizhongIcon/k3@3x.png";

import x3d from "../Img/caizhongIcon/3d@3x.png";
import x11x5 from "../Img/caizhongIcon/hb11@3x.png";
import x11ydj from "../Img/caizhongIcon/hb11@3x.png";


/**
 * Created by pc on 2017/9/28.
 */

let CP = {
  /**
   * @description 根据彩种id 获取信息
   * @param {number} n 彩种id 不可空
   * @param {number} m 为空默认0( 0-彩种名 1-彩种位置 2-彩种对应合买里面的索引)
   * @example CP.lot(1,1);return ssq
   * @return {str} 返回需要的信息
   */
  lot: function (n, m){
    m = m || '0';
    n = parseInt(n);
    var lot = {
      '1': ['双色球', 'ssq', '6'],
      '3': ['福彩3D', '3d', '7'],
      '4': ['时时彩', 'ssc', ''],
      '5': ['新快3', 'k3', ''],
      '6': ['快3', 'ahk3', ''],
      '7': ['七乐彩', 'qlc', '8'],
      '8': ['福彩快3', 'nmk3', ''],
      '9': ['江苏快3', 'k3', ''],
      '10':['新快3', 'xk3', ''],
      '20':['新时时彩', 'jxssc', ''],
      '50':['大乐透', 'dlt', '9'],
      '51':['七星彩', 'qxc', '10'],
      '52':['排列五', 'p5', '12'],
      '53':['排列三', 'p3', '11'],
      '54':['11选5', '11x5', ''],
      '55':['粤11选5', 'gd11x5', ''],
      '56':['11运夺金', '11ydj', ''],
      '57':['上海11选5', 'sh11x5', ''],
      '58':['快乐扑克3', 'pk3', ''],
      '59':['新11选5', 'hb11x5', ''],
      '80':['胜负彩', 'sfc', '3'],
      '81':['任选九', 'r9', '4'],
      '82':['进球彩', 'jq', ''],
      '83':['半全场', 'bq', ''],
      '84':['单场-胜负过关', 'sfgg', '5'],
      '85':['单场-胜平负', 'bjdc', '5'],
      '86':['单场-比分', 'bjdc', '5'],
      '87':['单场-半全场', 'bjdc', '5'],
      '88':['单场-上下单双', 'bjdc', '5'],
      '89':['单场-总进球', 'bjdc', '5'],
      '90':['竞彩-让球', 'jczq', '1'],
      '91':['竞彩-比分', 'jczq', '1'],
      '92':['竞彩-半全场', 'jczq', '1'],
      '93':['竞彩-总进球', 'jczq', '1'],
      '70':['竞彩-混投', 'jczq', '1'],
      '72':['竞彩-胜平负', 'jczq', '1'],
      '94':['篮彩-胜负', 'jclq', '2'],
      '95':['篮彩-让分', 'jclq', '2'],
      '96':['篮彩-胜分差', 'jclq', '2'],
      '97':['篮彩-大小分', 'jclq', '2'],
      '98':['欧洲杯-猜冠军', 'cgj', '2'],
      '99':['欧洲杯-猜冠亚军', 'gyj', '2'],
      '71':['篮彩-混投', 'jclq', '2']
    };
    return lot[n][m];
  }
}

/*
* 开奖结果首页 彩种 (类型: 数字彩 竞技彩 高频彩)
* {key: value}
* 彩种ID: [彩种ID, 描述名称，处于第几个类型, 开奖详情路由地址]
* */
export const lotteryIdDes = {
  /* 数字彩 */
  "01":['01', '双色球',1, "/lotteryResults/ssq"],
  "03":['03', '福彩3D',1, "/lotteryResults/fc3d"],
  "50":['50', '大乐透',1, "/lotteryResults/ssq"],
  "53":['53', '排列三',1, "/lotteryResults/fc3d"],
  "52":['52', '排列五',1, "/lotteryResults/fc3d"],
  "51":['51', '七星彩',1, "/lotteryResults/fc3d"],
  "07":['07', '七乐彩',1, "/lotteryResults/ssq"],
  /* 竞技彩 */
  "70":['70', '竞彩足球',2, "/lotteryResults/jczq"],
  "71":['71', '竞彩篮球',2, "/lotteryResults/jclq"],
  "80":['80', '胜负彩 ',2, "/lotteryResults/sfc"],
  "81":['81', '任选九',2, "/lotteryResults/sfc"],
  "85":['85', '足球单场',2, "/lotteryResults/zqdc"],
  "84":['84', '胜负过关',2, "/lotteryResults/sfgg"],
  /* 高频彩 */
  "56": ["56", "11运夺金", 3, "/lotteryResults/11x5"],
  "57": ["57", "沪11选5", 3, "/lotteryResults/11x5"],
  "54": ["54", "11选5", 3, "/lotteryResults/11x5"],
  "10": ["10", "新快3", 3, "/lotteryResults/k3"],
  "06": ["06", "快3", 3, "/lotteryResults/k3"],
  "09": ["09", "江苏快3", 3, "/lotteryResults/k3"],
  "08": ["08", "福彩快3", 3, "/lotteryResults/k3"],
  "04": ["04", "时时彩", 3, "/lotteryResults/11x5"],
  "59": ["59", "新11选5", 3, "/lotteryResults/11x5"],
  "55": ["55", "粤11选5", 3, "/lotteryResults/11x5"],
  "58": ["58", "快乐扑克", 3]
};

/**
 * 方案详情
 * {key: value}
 * 彩种ID:[玩法, 拼音缩写, 彩种名称, 方案详情地址, icon图片, 继续购彩地址]
 */
export const PlanNumber = {
  "01": ["", "ssq", "双色球","/plandetail/szc",ssq,'/ssqBet'],
  "03": ["", "3d", "福彩3D", "/plandetail/szc",fc3d,'/fc3dBet?active=1'],
  "04": ["", "ssc", "时时彩","/plandetail/szc",ssc,'/sscBet?active=1'],
  "05": ["", "k3", "吉林快3","/plandetail/szc",k3],
  "06": ["", "ahk3", "快3","/plandetail/szc",k3],
  "07": ["", "qlc", "七乐彩","/plandetail/szc",qlc,'/qlcBet'],
  "08": ["", "nmk3", "福彩快3","/plandetail/szc",k3],
  "09": ["", "k3", "江苏快3","/plandetail/szc",k3],
  "10": ["", "xk3", "新快3","/plandetail/szc",k3],
  "20": ["", "jxssc", "新时时彩","/plandetail/szc",ssc,'/sscBet?active=1'],
  "50": ["", "dlt", "大乐透","/plandetail/szc",dlt,'/dltBet'],
  "51": ["", "qxc", "七星彩","/plandetail/szc",qxc,'/qxcBet'],
  "52": ["", "p5", "排列五","/plandetail/szc",p5,'/pl5Bet'],
  "53": ["", "p3", "排列三","/plandetail/szc",p3,'/pl3Bet?active=1'],
  "54": ["", "11x5", "11选5","/plandetail/szc",hb11x5,'/x11x5Bet?active=1'],
  "55": ["", "gd11x5", "粤11选5","/plandetail/szc",gd11x5,'/y11x5Bet?active=1'],
  "56": ["", "11ydj", "11运夺金","/plandetail/szc",hb11x5],
  "57": ["", "sh11x5", "上海11选5","/plandetail/szc",hb11x5],
  "58": ["", "pk3", "快乐扑克3","/plandetail/szc",fc3d],
  "59": ["", "hb11x5", "新11选5","/plandetail/szc",hb11x5],
  "80": ["", "sfc", "胜负彩", "/plandetail/sfr9", sfc, '/sfcBet'],
  "81": ["", "r9", "任选九", "/plandetail/sfr9", r9, '/r9Bet'],
  "82": ["进球彩", "jq", "进球彩", ""],
  "83": ["半全场", "bq", "半全场"],
  "84": ["", "sfgg", "胜负过关", "/plandetail/bjdc", sfgg, '/sfggBet'],
  "85": ["", "bjdc", "单场竞猜", "/plandetail/bjdc", bjdc, '/bjdcBet?active=1'],
  "86": ["", "bjdc", "单场竞猜", "/plandetail/bjdc", bjdc, '/bjdcBet?active=1'],
  "87": ["", "bjdc", "单场竞猜", "/plandetail/bjdc", bjdc, '/bjdcBet?active=1'],
  "88": ["", "bjdc", "单场竞猜", "/plandetail/bjdc", bjdc, '/bjdcBet?active=1'],
  "89": ["", "bjdc", "单场竞猜", "/plandetail/bjdc", bjdc, '/bjdcBet?active=1'],
  "90": ["让球胜平负", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "91": ["比分", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "92": ["半全场", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "93": ["总进球", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "70": ["混合投注", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "72": ["胜平负", "jczq", "竞彩足球", "/plandetail/jczq", jczq, '/jczqBet?active=1'],
  "94": ["胜负", "jclq", "竞彩篮球", "/plandetail/jclq", jclq, '/jclqBet?active=1'],
  "95": ["让分胜负", "jclq", "竞彩篮球", "/plandetail/jclq", jclq, '/jclqBet?active=1'],
  "96": ["胜分差", "jclq", "竞彩篮球", "/plandetail/jclq", jclq, '/jclqBet?active=1'],
  "97": ["大小分", "jclq", "竞彩篮球", "/plandetail/jclq", jclq, '/jclqBet?active=1'],
  "98": ["欧洲杯-猜冠军", "cgj", "欧洲杯"],
  "99": ["欧洲杯-猜冠亚军", "gyj", "欧洲杯"],
  "71": ["混合投注", "jclq", "竞彩篮球", "/plandetail/jclq", jclq,  '/jclqBet?active=1']
};

export default CP;


