import apiUtils from './apiUtils'
import axios from 'axios';

// 用户充值
export const recharge = params => {
  return apiUtils.commonPost('/user/addmoney.go', params)
}
// 卡bin校验
export const checkBankBin = params => {
  return apiUtils.commonPost('/user/check_bankcard_bin.go', params, 'noLoad')
}

// 盛付通充值确认

export const sftRechargeConfirm = params => {
  return apiUtils.commonPost('/user/sft_app_pay_agreePayment.go', params)
}
// 联动优势充值确认
export const ldysRechargeConfirm = params => {
  return apiUtils.commonPost('/user/addmoney_ldys_add_agreePayment.go', params)
}
// 京东支付充值确认
export const jdzfRechargeConfirm = params => {
  return apiUtils.commonPost('/user/jdpay_fast_agreeConsume.go', params)
}
// 供可选择银行卡列表（新）
export const getCardList = (loadType='') => {
  return apiUtils.commonPost('/user/recharge_bankcard_list.go',{},loadType)
}
// 查询订单状态
export const queryOrderStatus = params => {
  return apiUtils.commonPost('/user/queryOrderStatus.go', params)
}
// 查询充值列表
export const getRechargeList = () => {
  return apiUtils.commonPost('/user/get_recharge_list_H5.go', {},'noLoad')
}
// 供可选择银行卡列表（旧）
export const getSupportList = (verifycode = '0') => {
  return apiUtils.commonPost('/user/select_support_card_list.go', {verifycode: verifycode})
}

// 全渠道充值路由
export const rechargeRoute = (addMoney)=>{
  return apiUtils.commonPost('/user/rechargeRouteNew.go', {addmoney: addMoney})
}

// 单银行卡充值路由
export const rechargeRouteSingle = params=>{
  return apiUtils.commonPost('/user/rechargeRouteSingleCard.go', params)
}
// 检查绑定银行卡
export const checkCardNo = params=>{
  return apiUtils.commonPost('/user/checkCardNo.go', params)
}
// 检查绑定银行卡
export const getUserCardListNew =()=>{
  return apiUtils.commonPost('/user/user_recharge_card_list.go')
}

