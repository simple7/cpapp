/**
 * Created by Administrator on 2017/10/25.
 * liuheng
 */
/* 提款 Drawing */
import { bankDrawtype} from '../action/action.bankdraw'

/* 开户银行 */
export const BankName =(state = {},action)=> {
  switch(action.type){
    case bankDrawtype.bankName:
      return action.text
    default:
      return state
  }
}

/* 开户地区 */
export const BankRegion =(state = [],action)=> {
  switch(action.type){
    case bankDrawtype.bankRegion:
      return action.text
    default:
      return state
  }
}

/* 银行卡号 */
export const BankCardNum =(state = '',action)=> {
  switch(action.type){
    case bankDrawtype.bankCardNum:
      return action.num
    default:
      return state
  }
}

/* 银行卡信息 */
export const BankCardInformation =(state = {city: '***',
  prov: '***',
  card: '*****************',
  rname: '',
  bankname: '***',
  bankbranch: ''},action)=> {
  switch(action.type){
    case bankDrawtype.bankCardInformation:
      return action.data
    default:
      return state
  }
}
