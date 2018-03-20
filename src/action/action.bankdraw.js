/**
 * Created by Administrator on 2017/10/25.
 * liuheng
 */
export const bankDrawtype = {
  bankName: 'bankName',
  bankRegion: 'bankRegion',
  bankCardNum: 'bankCardNum',
  bankCardInformation: 'bankCardInformation'
}

/* 绑定的银行卡名称 */
export function setbankName(text){
  return{
    type: bankDrawtype.bankName,
    text
  }
}

/* 绑定的银行卡开户城市 */
export function setpickerValue(text){
  return{
    type: bankDrawtype.bankRegion,
    text
  }
}

/* 绑定的银行卡卡号 */
export function setbandcardNum(num){
  return{
    type: bankDrawtype.bankCardNum,
    num
  }
}

/* 银行卡信息 */
export function setbankCardInformation(data){
  return{
    type: bankDrawtype.bankCardInformation,
    data
  }
}
