import apiUtils from './apiUtils'

/**
 * 竞彩足球对阵列表
 * @param cid 随机数
 * @returns {*|Promise.<TResult>}
 */
export const jczqSellList = cid => {
  return apiUtils.commonGet('/data/app/jczq/new_jczq_hh.xml?' + cid)
}

/**
 * 竞彩篮球对阵列表
 * @param cid
 * @returns {*|Promise.<TResult>}
 */
export const jclqSellList = cid => {
  return apiUtils.commonGet('/data/app/jclq/full_jclq_hh.xml?' + cid)
}
/**
 * 获取彩种投注倍数
 * @param rid
 * @returns {*|Promise.<TResult>}
 */
export const lotteryControl = (rid) => {
  return apiUtils.commonGet('/news/ad/lottery_controller_' + rid + '.xml', 'noLoad')
}
/**
 * 查询用户余额及可用红包
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const preparePay = params => {
  return apiUtils.commonPost('/user/prepare4Pay.go', params)
}
/**
 * 竞技彩投注接口
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const jcast = params => {
  return apiUtils.commonPost('/trade/jcast.go', params)
}
/**
 *  一场制胜匹配场次
 * @param codes 自选场次 170215002,170215003
 * @returns {*|Promise.<TResult>}
 */
export const yczsMatch = codes => {
  return apiUtils.commonPost('/trade/jczq/select_match_dz.go', {codes: codes})
}
/**
 * 一场制胜投注
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const yczsCast = params => {
  return apiUtils.commonPost('/trade/jczq/project_yczs_cast.go', params)
}
/**
 * 胜负彩、任九对阵列表
 * @param pid
 * @returns {*|Promise.<TResult>}
 * @constructor
 */
export const SF2R9 = pid => {
  let params = {}
  if(pid){
    params.pid = pid
  }
  return apiUtils.commonPost('/trade/queryZucai.go', params)
}
/**
 * 数字彩投注接口
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const pcast = params => {
  return apiUtils.commonPost('/trade/pcast.go', params)
}

/**
 * 数字彩追号投注接口
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const zcast = params => {
  return apiUtils.commonPost('/trade/zcast.go', params)
}

/**
 * 胜负过关对阵列表
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const sfggSellList = () => {
  return apiUtils.commonGet('/data/app/bd/sfgg.xml?'+Math.random())
}
/**
 * 北京单场对阵列表
 * @returns {*|Promise.<TResult>}
 */
export const bjdcSellList = () => {
  return apiUtils.commonGet('/data/app/bd/new_bd.xml?'+Math.random())
}

/**
 * 数字彩投注历史开奖
 * @returns {*|Promise.<TResult>}
 */
export const szcHistory = gid => {
  return apiUtils.commonGet('/data/phot/'+gid+'/qc.xml?'+Math.random(),'noLoad')
}
