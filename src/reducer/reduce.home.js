import {DATATYPE} from '../action/action.home'
import commonConfig from '../config/commonConfig'
import TianTianJXH5Img from '../Img/banner/tiantianjingxuanH5.png'
/* 首页banner */
export const HomeBannerReduce = (state = [{
  id: "TTJX",
  link: commonConfig.domain + "activity/ttjx/index.html?from=app",
  src: TianTianJXH5Img,
  title: "天天精选"
}], action) => {
  if (action.type === DATATYPE.homeBanner) {
    state = action.state
  }
  return state
}

export const HomeMoreReduce = (state = '1', action) => {
  if (action.type === DATATYPE.homeMore) {
    state = action.state
  }
  return state
}
