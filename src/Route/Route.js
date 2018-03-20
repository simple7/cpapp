/* 红包 */
import redPach from './redPackage.childRoutes'
/* 登录 */
import {registerTel, registerUser, forgetPassword, protocol} from './login.childRoutes'
/* 充值 */
import {bankCard, bankAdd, rechageConfirm, creditInfo, result, cardManage,cardManageIndex} from './recharge.childRoutes'
/* common公共方法 */
import utils from '../common/utils'
/* 提款 */
import DrawList from './draw.childRoutes'
/* 开奖结果 */
import resultList from './lotteryResults.childRoutes'
/* 账户安全 */
import Account_Route from './AccountSafe.childRoutes'
/* 消息公告 */
import NoticeList from './notice.childRouters'
/* 分析与预测 */
import ForecastList from './forecast.childRouters'
/* 方案详情 */
import PlanDetail from './PlanDetail.childRoutes'

import LotteryBet from './LotteryBetting.childRoutes'

import AppJie from '../common/AppApi'

//首页
const index = {
  path: 'index',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  childRoutes: [],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/HomeConent/index.js').default)
    })
  }
};

// 更多
const more = {
  path: 'more',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/HomeConent/more').default)
    })
  }
};

//比赛
const match = {
  path: 'match',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  childRoutes: [],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Match/match.js').default)
    })
  }
}
//发现
const find = {
  path: 'find',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  childRoutes: [],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/find.js').default)
    })
  }
}
//开奖结果
const lotteryResults = {
  path: 'lotteryResults',
  onEnter: () => {
    document.title='开奖结果'
  },
  childRoutes: [...resultList],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/lotteryResults.js').default)
    })
  }
}
//我的
const my = {
  path: 'my',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  childRoutes: [
    {
      path: 'accountDetails',
      onEnter: async (nextState, replace, next) => {
        document.title='账户明细'
        await utils.checkUserInfor(nextState, replace, next);
      },
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('../Components/My/My_AccountDetails.js').default)
        })
      }
    }
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/My/MyIndex.js').default)
    })
  }
}

//个人中心
const myCenter = {
  path: 'myCenter',
  onEnter: async (nextState, replace, next) => {
    document.title='个人中心'
    await utils.checkUserInfor(nextState, replace, next);
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/My/My_Center.js').default)
    })
  }
}
//注册登录
const login = {
  path: 'login',
  onEnter: () => {
    document.title='注册登录'
  },
  childRoutes: [registerTel, registerUser, forgetPassword, protocol],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Login/login.js').default)
    })
  }
}
// 登录首页
const loginIndex = {
  path: 'loginIndex',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Login/index.js').default)
    })
  }
}
// 天天推球
const tttq = {
  path: 'tttq',
  onEnter: () => {
    document.title='天天推球'
  },
  childRoutes: [],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../common/lotteryPop.js').default)
    })
  }
}
// 我的红包
const redpack = {
  path: 'redpack',
  childRoutes: [...redPach],
  onEnter: async (nextState, replace, next) => {
    document.title='我的红包'
    await utils.checkUserInfor(nextState, replace, next);
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/RedPackage/RedIndex').default)
    })
  }
}
/*充值*/
const recharge = {
  path: 'recharge',
  onEnter: async (nextState, replace, next) => {
    console.log('123123');
    document.title='充值'
    await utils.checkUserInfor(nextState, replace, next);
  },
  childRoutes: [bankCard, bankAdd, rechageConfirm, creditInfo, result, cardManage,cardManageIndex],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Recharge/RechargeIndex.js').default)
    })
  }
}
/*提款*/
const drawing = {
  path: 'drawing',
  onEnter: async (nextState, replace, next) => {
    document.title='提款'
    await utils.checkUserInfor(nextState, replace, next);
  },
  childRoutes: [
    ...DrawList
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/drawingIndex.js').default)
    })
  }
}
/*我的购彩*/
const buyLotteryList = {
  path: 'buyList',
  onEnter: async (nextState, replace, next) => {
    document.title='我的购彩'
    await utils.checkUserInfor(nextState, replace, next);
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/My/My_BuyLottery.js').default)
    })
  }
}
// 公用外链路由
const linkPage = {
  path: 'linkPage',
  onEnter: () => {

  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/CommonComts/LinkPage.js').default)
    })
  }
}
// 消息公告
const notice = {
  path: 'noticeList',
  onEnter: () => {
    document.title='消息公告'
  },
  childRoutes: [
    ...NoticeList,
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/notice/Notice.js').default)
    })
  }
}
// 账户安全
const accountSafe = {
  path: 'accountSafe',
  onEnter: async (nextState, replace, next) => {
    document.title='账户安全'
    await utils.checkUserInfor(nextState, replace, next);
  },
  childRoutes: [
    ...Account_Route
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/AccountIndex.js').default)
    })
  }
}

// 预测与分析
const forecast = {
  path: 'forecast',
  onEnter: () => {
    document.title='预测与分析'
  },
  childRoutes: [
    ...ForecastList
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/forecast/Forecast.js').default)
    })
  }
}

// 方案详情
const plandetail = {
  path: 'plandetail',
  onEnter: async (nextState, replace, next) => {
    document.title='方案详情'
    await utils.checkUserInfor(nextState, replace, next);
  },
  childRoutes: [
    ...PlanDetail
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/PlanDetail/DetailIndex.js').default)
    })
  }
}

//大乐透 追加 方案详情
const dltPlandetail = {
  path: 'dltPlandetail',
  onEnter: () => {
    document.title='追号详情'
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/PlanDetail/zhxq/index.js').default)
    })
  }
}
// 竞彩足球投注
const jczqBet = {
  path: 'jczqBet',
  onEnter: () => {
    document.title='竞彩足球'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/jczq/index.js').default)
    })
  }
}
// 竞彩篮球投注
const jclqBet = {
  path: 'jclqBet',
  onEnter: () => {
    document.title='竞彩篮球'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/jclq/index.js').default)
    })
  }
}
// 北京单场投注
const bjdcBet = {
  path: 'bjdcBet',
  onEnter: () => {
    document.title='北京单场'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/bjdc/index.js').default)
    })
  }
}
// 胜负彩投注
const sfc = {
  path: 'sfcBet',
  onEnter: () => {
    document.title='胜负彩'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/sfc/index.js').default)
    })
  }
}
// 任选9投注
const r9 = {
  path: 'r9Bet',
  onEnter: () => {
    document.title='任选9'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/r9/index.js').default)
    })
  }
}
// 胜负过关投注
const sfgg = {
  path: 'sfggBet',
  onEnter: () => {
    document.title='胜负过关'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/sfgg/index.js').default)
    })
  }
}
// 双色球投注
const ssq = {
  path: 'ssqBet',
  onEnter: () => {
    document.title='双色球'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/ssq/index.js').default)
    })
  }
}
// 大乐透投注
const dlt = {
  path: 'dltBet',
  onEnter: () => {
    document.title='大乐透'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/dlt/index.js').default)
    })
  }
}
// 快三系列 新快3投注
const xk3 = {
  path: 'xk3Bet',
  onEnter: () => {
    document.title='新快3'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/xk3/index.js').default)
    })
  }
}
// 福彩3D系列
const fc3D = {
  path: 'fc3dBet',
  onEnter: () => {
    document.title='福彩3D'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/fc3D/index.js').default)
    })
  }
}
// 排列三系列
const pl3 = {
  path: 'pl3Bet',
  onEnter: () => {
    document.title='排列三'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/fc3D/index.js').default)
    })
  }
}
//七星彩
const qxc = {
  path: 'qxcBet',
  onEnter: () => {
    document.title='七星彩'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/qxc/index.js').default)
    })
  }
}
//七乐彩
const qlc = {
  path: 'qlcBet',
  onEnter: () => {
    document.title='七乐彩'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/qlc/index.js').default)
    })
  }
}
/*排列五*/
const pl5 = {
  path: 'pl5Bet',
  onEnter: () => {
    document.title='排列五'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/pl5/index.js').default)
    })
  }
}
/*新11选5系列*/
const x11x5 = {
  path: 'x11x5Bet',
  onEnter: () => {
    document.title='新11选5'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/x11x5/index.js').default)
    })
  }
}
/*粤11选5系列*/
const y11x5 = {
  path: 'y11x5Bet',
  onEnter: () => {
    document.title='粤11选5'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/x11x5/index.js').default)
    })
  }
}
/*时时彩*/
const ssc = {
  path: 'sscBet',
  onEnter: () => {
    document.title='时时彩'
  },
  childRoutes: [
    ...LotteryBet
  ],
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/ssc/index.js').default)
    })
  }
}
/*玩法说明*/
const wanfa = {
  path: "wanfa",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/wanFa/index.js").default);
    });
  }
};

/*联合登录*/
const loginRelated = {
  path: "loginRelated",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/loginRelated/index.js").default);
    });
  }
};

// 路由配置
const RouteConfig = {
  path: '/',
  onEnter: () => {
    document.title='9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  },
  component: require('../Components/App'),
  indexRoute: {component: require('../Components/HomeConent/index.js').default},
  childRoutes: [
    index,
    more,
    match,
    find,
    my,
    tttq,
    login,
    redpack,
    lotteryResults,
    recharge,
    drawing,
    buyLotteryList,
    loginIndex,
    linkPage,
    notice,
    accountSafe,
    forecast,
    myCenter,
    jczqBet,
    jclqBet,
    bjdcBet,
    sfc,
    r9,
    sfgg,
    ssq,
    dlt,
    plandetail,
    xk3,
    fc3D,
    pl3,
    qxc,
    qlc,
    pl5,
    x11x5,
    y11x5,
    ssc,
    dltPlandetail,
    wanfa,
    loginRelated
  ]
}
export default RouteConfig;
