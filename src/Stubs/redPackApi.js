import apiUtils from './apiUtils'
import axios from 'axios';

/**
 * 查询我的红包
 * @param state 跳转查询接口  1：跳转查询可用红包  2：跳转查询过期红包  3：跳转查询待派发红包
 * @returns {Promise.<TResult>}
 */
export const getMyRed = (state) => {
  return axios({
    url: `${apiUtils.base}/user/queryMyRedPacket.go`,
    responseType: 'document',
    params: {
      state: state,
      ps: 100
    },
  }).then(res => {
    return apiUtils.XML2jsobj(res.data.documentElement)
  })
}
/**
 * 红包兑换
 * @param code 兑换码
 * @returns {Promise.<TResult>}
 */
export const exchangeRed = code => {
  return axios({
    url: `${apiUtils.base}/user/cardChongzhi.go`,
    responseType: 'document',
    params: {
      ccardid: code.substr(0, 12),
      ccardpwd: code.substr(12, 8)
    },
  }).then(res => {
    return apiUtils.XML2jsobj(res.data.documentElement)
  })
}

// 查询红包使用明细
export const redUseDetail = params => {
  return apiUtils.commonPost('/user/queryRedPacketDetail.go', params)
}
