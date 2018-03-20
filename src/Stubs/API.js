// 会员积分api
export {
  AppVerify,
  queryGo,
  banner_h5,
  queryVipUserInfo,
  queryVipPointInfo,
  experienceDetail,
  pointsDetail,
  clickToSign,
  clickToGetPoints,
  godsDetail,
  godsGet,
  GetPointExclist,
  toUserJFMall,
  getCjCntEveryDay,
  JfenCJ,
} from './hyjfAPI'

// 彩种相关api
export {
  Forecast,
  appgonggaolist,
  UserIndexAPI,
  personal_center_info,
  lotteryHompage,
  queryAwardResult,
  newDiscover,
  forecastList,
  hotNewList,
  jczqList,
  bjdcList,
  jclqList,
  sfcResulut,
  LotteryResultListAPI,
  RJResulut,
  awardList,
  NumLotteryDetail,
  forecastDetail,
  jsbf,
  jcodds,
  lotPlanDetail,
  lotPlanDetail_R9SFC,
  szcPlanDetail,
  cpmxTicket,
  ZhuiHaoXq,
  stopZH,
  zst
} from './lotteryApi'

// 红包相关api
export {
  getMyRed,
  exchangeRed,
  redUseDetail
} from './redPackApi'

// 用户相关api
export {
  checkBindInfo,
  checkUserLogin,
  userBasicInfo,
  sendSMS,
  verifySms,
  mobRegister,
  loginout,
  checkUserExist,
  userRegister,
  userLogin,
  fogetPwd,
  setNewPwd,
  checkSetPassword,
  queryAccount,
  getUserCardList,
  bankCardLimitInfo,
  unBindbankCard,
  getBuyList,
  bindPhone,
  bindPhoneCheck,
  changeMobileCheck,
  changePassword,
  bindIdCard,
  queryUserDefaultPwd
} from './userApi'

// 支付相关api
export {
  recharge,
  checkBankBin,
  sftRechargeConfirm,
  getCardList,
  queryOrderStatus,
  getRechargeList,
  ldysRechargeConfirm,
  jdzfRechargeConfirm,
  rechargeRoute,
  rechargeRouteSingle,
  checkCardNo,
  getUserCardListNew
} from './payApi'

// 提款 API
export {
  BankOpenAPI,
  BankCardBind,
  BankCardInformation,
  CheckBankCardAPI,
  DrawMoneyAPI,
  checkDrawMoneyValidity
} from './drawingAPI'

// 投注api

export {
  jczqSellList,
  lotteryControl,
  preparePay,
  jcast,
  yczsMatch,
  yczsCast,
  jclqSellList,
  SF2R9,
  pcast,
  sfggSellList,
  bjdcSellList,
  szcHistory,
  zcast
}from './betApi'

//其他
export {
  authorizeToCL
} from './otherApi'
