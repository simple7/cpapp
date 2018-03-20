const commonConfig = {
  //本地开发用   项目主路径
  // location: 'http://10.0.30.18:8888/',
  // activity项目主路径
  activity: 'https://5.9188.com/activity/hyjf/',
  appversion: '1.1.1',
  //调用5.9188项目静态资源路径
  domain: 'https://5.9188.com/',
  //调用mobile.9188库路径
  mobileDomain: 'https://mobile.9188.com',
  // 渠道source
  source: {
    default: '3002',
    alipay: '3033', //支付宝生活号渠道
    chelun: '3083'  // 车轮渠道
  },
  // 第三方登录JSSDK
  JSSDKUrl: {
    'chelun': 'http://h5.chelun.com/2017/authorization/js/index.bundle.js'
  },
  switchFlag: {
    //缺省状态
    '0': {
      headFlag: '', //有头部
      homePop: '',  //首页有头部广告弹框
      homeLogo: '',  //首页有头部logo
    },
    //无头部 9188客户端可用
    '1': {
      headFlag: '1',
      homePop: '',
      homeLogo: '',
    },
    //有头部 无其他两个
    '2': {
      headFlag: '',
      homePop: '1',
      homeLogo: '1',
    },
    //有头部 有广告框  无logo
    '3': {
      headFlag: '',
      homePop: '',
      homeLogo: '1',
    },
    //有头部 无广告框 有logo
    '4': {
      headFlag: '',
      homePop: '1',
      homeLogo: '',
    },
    //无头部 无广告框 有logo
    '5': {
      headFlag: '1',
      homePop: '1',
      homeLogo: '',
    },
    // 无头部 有广告框 无logo
    '6': {
      headFlag: '1',
      homePop: '',
      homeLogo: '1',
    },
    // 无头部 无广告框 无logo
    '7': {
      headFlag: '1',
      homePop: '1',
      homeLogo: '1',
    }
  },
  AnimateDuration: 80,  //摇一摇时间间隔
}
export default commonConfig
