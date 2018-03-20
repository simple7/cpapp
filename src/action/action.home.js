export const DATATYPE = {
  homeBanner: 'homeBanner',
  homeMore: 'homeMore'
}

export function HomeBannerAction(state){
  return{
    type: DATATYPE.homeBanner,
    state:state
  }
}

export function HomeMoreAction(state){
  return{
    type: DATATYPE.homeMore,
    state:state
  }
}
