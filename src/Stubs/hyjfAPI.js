import apiUtils from './apiUtils'
import axios from 'axios';



/* app 校验登录 */
export const AppVerify = (fn) => {
  var allcookies = document.cookie;
  if (allcookies.indexOf('TOKEN') != '-1') {
    allcookies = allcookies.split('&');
    var token = '', appid = '';
    allcookies.map(function (val, index) {
      if (val.indexOf('TOKEN=') >= 0) {
        token = val.split('TOKEN=')[1];
      }
      if (val.indexOf('APPID=') >= 0) {
        appid = val.split('APPID=')[1];
      }
    });
    /*Toast.info('token='+token+'&appid='+appid, 10);
    console.log('token='+token+'&appid='+appid);*/
    return axios({
      url: `${apiUtils.base}/user/swaplogin.go`,
      method: 'post',
      data: {
        logintype: '1',
        accesstoken: token,
        appid: appid
      },
      transformRequest: [function (data) {
        // 将POST 的数据以Formdata提交
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }).then(res => {
      queryGo('').then(d => {
        console.log(d, 'APIJifen12');
        if (d != '0' || d != 0) {
          try {
            AppJiek.appLogin();
          } catch (e) {
            console.log(e);
          }
        }
        if (typeof fn == 'function') {
          fn();
        }
      }).catch(err => {
        Toast.info('网络异常请刷新重试', 1)
      })
    })
      .catch(err => {
        console.log(err);
      })
  } else {
    AppJiek.appLogin();
  }
}
/* 校验code值 */
export const queryGo = (params) => {
  return axios.get(
    `${apiUtils.base}/user/query.go?flag=2`,
    {params: params}
  ).then(res => apiUtils.code(res.data));
}
/* H5首页banner */
export const banner_h5 = params => {
  return axios.get(`${apiUtils.base}/trade/banner_h5.go`, {params: params, responseType: 'document'}).then(
    res => apiUtils.XML2jsobj(res.data.documentElement)
  )
};
//会员中心-查询会员中心信息
export const queryVipUserInfo = params => {
  return axios.get(
    `${apiUtils.base}/user/queryVipUserInfo.go`,
    {params: params}
  ).then(res => res.data);
};
//积分中心-查询积分中心
export const queryVipPointInfo = params => {
  return axios.get(
    `${apiUtils.base}/user/queryVipPointInfo.go`,
    {params: params}
  ).then(res => res.data);
};
//会员中心-经验明细
export const experienceDetail = params => {
  return axios({
    url: `${apiUtils.base}/user/experienceDetail.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分中心-积分明细
export const pointsDetail = params => {
  return axios({
    url: `${apiUtils.base}/user/pointsDetail.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分中心-签到
export const clickToSign = params => {
  return axios({
    url: `${apiUtils.base}/user/clickToSign.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分中心-领取积分
export const clickToGetPoints = params => {
  return axios({
    url: `${apiUtils.base}/user/clickToGetPoints.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分商城-物品详情
export const godsDetail = params => {
  return axios({
    url: `${apiUtils.base}/user/getExGoodsDeatail.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分商城-积分兑换红包
export const godsGet = params => {
  return axios({
    url: `${apiUtils.base}/user/exJfMallGoods.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分商城-积分兑换明细
export const GetPointExclist = params => {
  return axios({
    url: `${apiUtils.base}/user/queryUserJfExDetail.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
/* 积分中心-积分商城 */
export const toUserJFMall = params => {
  return axios.get(
    `${apiUtils.base}/user/toUserJFMall.go`,
    {params: params}
  ).then(res => res.data);
};

//积分抽奖-获取用户每日抽奖剩余次数
export const getCjCntEveryDay = params => {
  return axios({
    url: `${apiUtils.base}/user/getCjCntEveryDay.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
//积分抽奖-积分抽奖接口
export const JfenCJ = params => {
  return axios({
    url: `${apiUtils.base}/user/JfenCJ.go`,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => res.data);
};
