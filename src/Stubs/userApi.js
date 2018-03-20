import apiUtils from './apiUtils'
import axios from 'axios';
import {Toast} from 'antd-mobile'

/**
 * 查询用户绑定信息
 * @returns {Promise.<TResult>}
 */
export const checkBindInfo = () => {
  return apiUtils.commonGet('/user/queryIdBankBinding.go');
}
/**
 * 查询用户登录状态
 * @returns {Promise.<TResult>}
 */
export const checkUserLogin = () => {
  return apiUtils.commonGet('/user/mchklogin.go', 'noLoad')
}
/**
 * 查询用户基本信息
 * @returns {Promise.<TResult>}
 */
export const userBasicInfo = () => {
  return apiUtils.commonGet('/user/getuserbasicinfo.go', 'noLoad')
}
/**
 * 发送手机验证码
 * @param params
 * @returns {Promise.<TResult>}
 */
export const sendSMS = params => {
  return apiUtils.commonPost('/user/sendSmsH5.go', params)
}
/**
 * 绑定手机号发送短信验证码
 * @param params
 * @returns {Promise.<TResult>}
 */
export const bindPhone = params => {
  return apiUtils.commonPost('/user/userbind.go', params)
}
/**
 * 绑定手机号验证码提交
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const bindPhoneCheck = params => {
  return apiUtils.commonPost('/user/userbindyz.go', params)
}
/**
 * 更换手机号检测
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const changeMobileCheck = params => {
  return apiUtils.commonPost('/user/changeMobileCheck.go', params)
}
/**
 * 修改密码
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const changePassword = params => {
  return apiUtils.commonPost('/user/modify.go', params)
}

/**
 * 绑定身份证
 * @param params
 * @returns {*|Promise.<TResult>}
 */
export const bindIdCard = params => {
  return apiUtils.commonPost('/user/modify.go', params)
}


/**
 * 验证短信验证码
 * @param phone
 * @param code
 * @returns {Promise.<TResult>}
 */
export const verifySms = (phone, code, tid) => {
  let params = {
    mobileNo: phone,
    yzm: code,
    tid: tid
  }
  return apiUtils.commonPost('/user/verifySms.go', params)
}
/**
 * 手机号注册
 * @param params
 * @returns {Promise.<TResult>}
 */
export const mobRegister = params => {
  return apiUtils.commonPost('/user/mobregister.go', params)
}
/**
 * /user/loginout.go
 * @param 退出登录
 * @returns {*}
 */
export const loginout = () => {
  return apiUtils.commonGet('/user/loginout.go')
}
/**
 * 检测用户名是否存在
 * @param params 用户名
 * @returns {Promise.<TResult>}
 */
export const checkUserExist = params => {
  return apiUtils.commonPost('/user/checkUserNick.go', params)
}

/**
 * 用户名注册
 * @param params 注册参数
 * @returns {Promise.<TResult>}
 */
export const userRegister = params => {
  return apiUtils.commonPost('/user/userRegister.go', params)
}
/**
 * 用户登录
 * @param params
 * @returns {Promise.<TResult>}
 */
export const userLogin = params => {
  return apiUtils.commonPost('/user/login.go', params)
}
/**
 * 忘记密码-校验用户名和手机号是否存在
 * @param params
 * @returns {Promise.<TResult>}
 */
export const fogetPwd = params => {
  return apiUtils.commonPost('/user/forgetpwd.go', params)
}
/**
 * 设置新密码
 * @param params
 * @returns {Promise.<TResult>}
 */
export const setNewPwd = params => {
  return apiUtils.commonPost('/user/setNewPwd.go', params)
}
/**
 * 检测是否设置密码
 * @param uid
 * @returns {Promise.<TResult>}
 */
export const checkSetPassword = params => {
  return apiUtils.commonPost('/user/query_zcsh_pwd_flag.go', params)
}


export const getUserCardList = (params, loadType = '') => {
  return apiUtils.commonPost('/user/get_umpay_card_list.go', params, loadType)
}

/*
 * 账户明细-账户明细列表带有分页
 * pn:1
 * ps:10
 * flag:13 明细类型
 * source:3021
 * @param params
 * @returns {Promise.<TResult>}
 */
export const queryAccount = params => {
  return apiUtils.commonPost('/user/queryAccount.go', params)
}
/*
 *银行卡限额信息
 * @param
 * bankCode--银行编码
 * cardtype--银行卡类型
 */
export const bankCardLimitInfo = params => {
  return apiUtils.commonPost('/user/bankCardLimitInfo.go', params)
}

/*
 *删除绑定卡信息
 * @param
 * banckCode-- 支付协议号
 * bankid-- 支付网关编号
 */
export const unBindbankCard = params => {
  return apiUtils.commonPost('/user/delete_recharge_card_info.go', params)
}


/* 购彩记录
 * @params {Object}
 * */
export const getBuyList = params => {
  return apiUtils.commonPost('/user/queryLotteryDetail.go', params)
}

/* 查询用户密码状态 */
export const queryUserDefaultPwd = ()=> {
  return apiUtils.commonPost('/user/queryUserDefaultPwd.go')
}
