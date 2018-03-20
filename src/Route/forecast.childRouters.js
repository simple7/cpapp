/**
 * Created by Administrator on 2017/11/15.
 */

/* 彩种分析预测 列表 */
const lotteryInfo = {
  path: 'lotteryInfo',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/forecast/ForecastList.js').default)
    })
  }
}

/* 彩种分析预测 内容 */
const lotteryInfo1 = {
  path:'artile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/CommonComts/LinkPage').default)
    })
  }
}

export default [lotteryInfo, lotteryInfo1]
