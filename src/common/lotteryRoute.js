import ssq from "../Img/caizhongIcon/ssq@3x.png";
import jjzq from "../Img/caizhongIcon/jjz@3x.png";
import dlt from "../Img/caizhongIcon/dlt@3x.png";
import hb11x5 from "../Img/caizhongIcon/hb11@3x.png";
import y11x5 from "../Img/caizhongIcon/y11x5.png";
import sand from "../Img/caizhongIcon/3d@3x.png";
import dcjcz from "../Img/caizhongIcon/dcjcz@3x.png";
import jjlq from "../Img/caizhongIcon/jjlq@3x.png";
import sfc from "../Img/caizhongIcon/sfc@3x.png";
import r9 from "../Img/caizhongIcon/rx9@3x.png";
import sfgg from "../Img/caizhongIcon/ssgg@3x.png";
import xk3 from "../Img/caizhongIcon/k3@3x.png";
import qlc from "../Img/caizhongIcon/7lc@3x.png";
import qxc from "../Img/caizhongIcon/qqx@3x.png";
import pl5 from "../Img/caizhongIcon/pl5@3x.png";
import pl3 from "../Img/caizhongIcon/p3@3x.png";
import ssc from "../Img/caizhongIcon/ssc@3x.png";
/* 首页彩种配置
 * 数组对象中字段->
 * evid  简称
 * gid  彩种ID
 * lotteryName  彩种名称
 * desc  描述
 * src  路由地址
 * imgUrl  Icon图片地址
 * */
export const IndexlotteryRouter = [
  {
    evid: "ssq",
    gid: "01",
    pools: "奖池:6亿6271万",
    lotteryName: "双色球",
    desc: "",
    src: "",
    route: "/ssqBet",
    imgUrl: ssq
  },
  {
    evid: "jczq",
    gid: "70",
    remainMatch: "106场比赛在售",
    lotteryName: "竞彩足球",
    desc: "",
    src: "",
    route: "/jczqBet?active=1",
    imgUrl: jjzq
  },
  {
    evid: "dlt",
    gid: "50",
    pools: "奖池:40亿8825万",
    lotteryName: "大乐透",
    desc: "",
    src: "",
    route: "/dltBet",
    imgUrl: dlt
  },
  {
    evid: "hub11x5",
    gid: "59",
    lotteryName: "新11选5",
    desc: "",
    src: "",
    route: "/x11x5Bet?active=1",
    imgUrl: hb11x5
  },
  {
    evid: "3d",
    gid: "03",
    lotteryName: "福彩3D",
    desc: "",
    src: "",
    route: "/fc3dBet?active=1",
    imgUrl: sand
  },
  {
    evid: "gd11x5",
    gid: "55",
    lotteryName: "粤11选5",
    desc: "",
    src: "",
    route: "/y11x5Bet?active=1",
    imgUrl: y11x5
  },
  {
    evid: "bjdc",
    gid: "85",
    lotteryName: "北京单场",
    desc: "",
    src: "",
    route: "/bjdcBet?active=1",
    imgUrl: dcjcz
  },
  {
    evid: "jclq",
    gid: "71",
    lotteryName: "竞彩篮球",
    desc: "",
    src: "",
    route: "/jclqBet?active=1",
    imgUrl: jjlq
  }
];

/* 更多彩种配置 */
export const MoreLotteryRouter = [
  {
    evid: "SSQ",
    gid: "01",
    pools: "奖池:6亿6271万",
    lotteryName: "双色球",
    desc: "",
    src: "",
    route: "/ssqBet",
    imgUrl: ssq
  },
  {
    evid: "jczq",
    gid: "70",
    remainMatch: "106场比赛在售",
    lotteryName: "竞彩足球",
    desc: "",
    src: "",
    route: "/jczqBet?active=1",
    imgUrl: jjzq
  },
  {
    evid: "dlt",
    gid: "50",
    pools: "奖池:40亿8825万",
    lotteryName: "大乐透",
    desc: "",
    src: "",
    route: "/jczqBet",
    imgUrl: dlt
  },
  {
    evid: "hub11x5",
    gid: "59",
    lotteryName: "新11选5",
    desc: "",
    src: "",
    route: "/x11x5Bet?active=1",
    imgUrl: hb11x5
  },
  {
    evid: "3d",
    gid: "03",
    lotteryName: "福彩3D",
    desc: "",
    src: "",
    route: "/fc3dBet?active=1",
    imgUrl: sand
  },
  {
    evid: "gd11x5",
    gid: "55",
    lotteryName: "粤11选5",
    desc: "",
    src: "",
    route: "/y11x5Bet?active=1",
    imgUrl: y11x5
  },
  {
    evid: "bjdc",
    gid: "85",
    lotteryName: "北京单场",
    desc: "",
    src: "",
    route: "/bjdcBet?active=1",
    imgUrl: dcjcz
  },
  {
    evid: "jclq",
    gid: "71",
    lotteryName: "竞彩篮球",
    desc: "",
    src: "",
    route: "/jclqBet?active=1",
    imgUrl: jjlq
  },
  {
    evid: "sfc",
    gid: "80",
    lotteryName: "胜负彩",
    desc: "",
    src: "",
    route: "/sfcBet",
    imgUrl: sfc
  },
  {
    evid: "r9",
    gid: "81",
    lotteryName: "任选九",
    desc: "",
    src: "",
    route: "/r9Bet",
    imgUrl: r9
  },
  {
    evid: "sfgg",
    gid: "84",
    lotteryName: "胜负过关",
    desc: "",
    src: "",
    route: "/sfggBet",
    imgUrl: sfgg
  },
  /*{
    evid: "sfgg",
    gid: "84",
    lotteryName: "新快三",
    desc: "",
    src: "",
    route: "/xk3Bet?active=1",
    imgUrl: xk3
  },*/
  {
    evid: "qlc",
    gid: "07",
    lotteryName: "七乐彩",
    desc: "",
    src: "",
    route: "/qlcBet",
    imgUrl: qlc
  },
  {
    evid: "qxc",
    gid: "51",
    lotteryName: "七星彩",
    desc: "",
    src: "",
    route: "/qxcBet",
    imgUrl: qxc
  },
  {
    evid: "pl5",
    gid: "52",
    lotteryName: "排列五",
    desc: "",
    src: "",
    route: "/pl5Bet",
    imgUrl: pl5
  },
  {
    evid: "pl3",
    gid: "53",
    lotteryName: "排列三",
    desc: "",
    src: "",
    route: "/pl3Bet?active=1",
    imgUrl: pl3
  },
  {
    evid: "ssc",
    gid: "04",
    lotteryName: "时时彩",
    desc: "",
    src: "",
    route: "/sscBet?active=1",
    imgUrl: ssc
  }
];
