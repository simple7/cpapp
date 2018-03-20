/**
 * Created by Administrator on 2017/10/24.
 * creater liuheng
 */

import apiUtils from './apiUtils'

/* 开户银行列表 */
export const BankOpenAPI = params => {
  return apiUtils.commonGet('/news/ad/drow_money_bank.xml',params)
}

/* 绑定银行卡提交接口
* params > {bankCard:bankCard} aes加密
* aes加密 可在目录common中utils
* */
export const BankCardBind = params => {
  return apiUtils.commonPost('/user/new_id_bank_bind.go', params)
}

/* 银行卡信息
* */
export const BankCardInformation = params => {
  return apiUtils.commonGet('/user/newQueryIdBankBinding.go', params)
}

/* 银行卡校验
 * params > {cardno: cardno}
  * */
export const CheckBankCardAPI = params => {
  return apiUtils.commonPost('/user/check_bank_card.go', params)
}

/* 提款校验
* params > {tkMoney:	tkMoney(数字)提款金额, contents: contents(密码)} 密码MD5加密
* */
export const checkDrawMoneyValidity = params => {
  return apiUtils.commonPost("/user/checkDrawMoneyValidity.go", params);
}

/* 提款
* */
export const  DrawMoneyAPI = params => {
  return apiUtils.commonPost('/user/newdrawmoney.go', params)
}
