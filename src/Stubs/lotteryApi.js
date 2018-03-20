import apiUtils from './apiUtils'
import axios from 'axios';
import {Toast} from 'antd-mobile'

//首页
//今日预测
export const Forecast = params => {
  return axios.get(
    `${apiUtils.base}/trade/forecast.go`,
    {params: params, responseType: 'document'}
  ).then(
    res => apiUtils.XML2jsobj(res.data.documentElement)
  )
};
//公告列表
export const appgonggaolist = () => {
  return apiUtils.commonGet('/news/appgonggao/appgonggaolist.xml')
};
// 用户中心
export const UserIndexAPI = (type='') => {
  return apiUtils.commonGet('/user/mlotteryNew.go',type)
}
// 个人中心
export const personal_center_info = params => {
  return axios.get(
    `${apiUtils.base}/user/personal_center_info.go`,
    {params: params, responseType: 'document'}
  ).then(
    res => apiUtils.XML2jsobj(res.data.documentElement)
  )
}
//首页彩种接口
export const lotteryHompage = params => {
  return axios({
    url: `${apiUtils.base}/user/lottery_homepage.go`,
    method: 'post',
    data: params,
    responseType: 'document',
    transformRequest: [function (data) {
      // 将POST 的数据以Formdata提交
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(res => apiUtils.XML2jsobj(res.data.documentElement))
};
/**
 * 查询彩种最近一期开奖结果
 * @param lotId 彩种ID
 * @returns {Promise.<TResult>}
 */
export const queryAwardResult = lotId => {
  return axios({
    url: `${apiUtils.base}/data/app/lottery_results.xml`,
    responseType: 'document',
  }).then(res => {
    let data = apiUtils.XML2jsobj(res.data.documentElement);
    let row = data.row;
    let result = {}
    if (row) {
      row.forEach(function (item, index) {
        if (item.gid === lotId) {
          result = item
        }
      })
    }
    return result;
  })
}
/**
 * 发现下发配置文件
 *@ /user/new_discover.go
 */
export const newDiscover = type => {
  return apiUtils.commonGet('/user/new_discover.go',type)
}
/**
 * 分析预测
 * @returns {*|Promise.<TResult>}
 */
export const forecastList = () => {
  return apiUtils.commonPost('/trade/forecast.go', {name: 'yuce'})
}
/**
 * 热点彩讯
 * @returns {*|Promise.<TResult>}
 */
export const hotNewList = params => {
  return apiUtils.commonPost('/trade/apphotnews.go', params)
}
/**
 * 竞彩足球数据列表
 * @returns {*|Promise.<TResult>}
 */
export const jczqList = () => {
  return apiUtils.jsonGet('/qtjsbf/jc/lotteryresult/jcresult.json')
}


/**
 * 胜负彩数据列表
 * @returns {*|Promise.<TResult>}
 */
export const sfcResulut = (qc) => {
  return apiUtils.jsonGet(`/qtjsbf/zc/lotteryresult/${qc}/sfcresult.json`)
}
/**
 * 任九数据列表
 * @returns {*|Promise.<TResult>}
 */
export const RJResulut = (qc) => {
  return apiUtils.jsonGet(`/qtjsbf/zc/lotteryresult/${qc}/rjresult.json`)
}

/* 开奖结果首页列表接口 */
export const LotteryResultListAPI = () => {
  return apiUtils.jsonGet(`/data/app/lottery_results2.json?rn=${Math.random()}`)
}
/**
 * 北京单场数据列表
 * @returns {*|Promise.<TResult>}
 */
export const bjdcList = (pn) => {
  return apiUtils.jsonGet(`/qtjsbf/bd/lotteryresult/bdresult_${pn}.json`)
}

/**
 * 竞彩篮球数据列表
 * @returns {*}
 */
export const jclqList = () => {
  return apiUtils.jsonGet('/lqzlk/data/mobile/lotteryresult/lcresult.json')
}

/**
 * 数字彩和高频彩列表
 * @returns {*|Promise.<TResult>}
 */
export const awardList = (gid, pn) => {
  return apiUtils.jsonGet(`/data/app/awardlist/award_list_${gid}_${pn}.json`)
}

/** 数字彩详情
 * @returns {*|Promise.<TResult>}
 */
export const NumLotteryDetail = (gid, pid) => {
  return apiUtils.jsonGet(`/data/guoguan/${gid}/${pid}/${pid}.json?_=${Math.random()}`)
}

/**
 * 预测各彩种文章列表
 * @param gid
 * @param pn
 * @returns {*|Promise.<TResult>}
 */
export const forecastDetail = (gid, pn) => {
  let params = {
    gid: gid,
    pn: pn
  }
  return apiUtils.commonPost('/trade/forecast.go', params)
}

/**
* 竞彩即时比分
* @returns {*|Promise.<TResult>}
*/
export const jsbf = (cid,type) => {
  return apiUtils.commonGet('/qtjsbf/jc/openrounddata/unfinish.xml?' + cid,type)
}
/**
 * 竞彩即时赔率
 * @returns {*|Promise.<TResult>}
 */
export const jcodds = (cid,type) => {
  return apiUtils.commonGet('/qtjsbf/jc/openrounddata/jcodds.xml?' + cid,type)
}

/**
 * 竞彩篮球 足球 胜负过关 北京单场方案详情接口
 * @param {String} hid 方案号
 * @param {String} gid 彩种id
 */
export const lotPlanDetail = (hid, gid)=> {
  const params = {
    gid: gid,
    hid: hid,
    state: 1,
    fflag: 0,
    mtype: 4
  }
  return apiUtils.commonPost('/trade/qview.go' , params)
}

/**
 * 任选九 胜负彩 方案详情接口
 * @param {String} hid 方案号
 * @param {String} gid 彩种id
 */
export const lotPlanDetail_R9SFC = (hid, gid)=> {
  const params = {
    gid: gid,
    hid: hid,
    state: 1,
    mtype: 4
  }
  return apiUtils.commonPost('/trade/queryZview.go' , params)
}

/**
 * 数字彩方案详情接口
 * @param {String} hid 方案号
 * @param {String} gid 彩种id
 */
export const szcPlanDetail = (hid, gid)=> {
  const params = {
    hid: hid,
    gid: gid,
    state: 1,
  }
  return apiUtils.commonPost('/trade/pinfo.go' , params)
}

/**
 * 出票明细接口
 * @param hid
 * @param gid
 * @returns {*|Promise.<TResult>}
 */
export const cpmxTicket = (hid, gid)=> {
  const params ={
    hid: hid,
    gid: gid,
    mtype: 4
  }
  return apiUtils.commonPost('/trade/ai.go', params)
}


/**
 * 追号详情接口
 * @param tid 追号
 * @param gid 彩种
 * @param pn 页数
 * @returns {*|Promise.<TResult>}
 */
export const ZhuiHaoXq = (tid, gid, flag, pn)=> {
  const params ={
    tid: tid,
    gid: gid,
    flag: flag,
    ps: 10,
    pn: pn
  };
  return apiUtils.commonPost('/user/queryrecord.go', params);
}


/**
 * 停止追号接口
 * @param tid 追号
 * @param gid 彩种
 * @param pn 页数
 * @returns {*|Promise.<TResult>}
 */
export const stopZH = (gid,zid)=> {
  const params ={
    gid: gid,
    zid: zid,
  };
  return apiUtils.commonPost('/trade/zcancel.go', params);
}
/**
 * 数字彩走势图结果
 * @param gid 彩种id
 * @param pid 查询期次 默认30
 * @returns {*|Promise.<TResult>}
 */

export const zst = (gid,pid = 30)=> {
  return apiUtils.jsonGet(`/data/app/zst/${gid}/${pid}.json`);
}
