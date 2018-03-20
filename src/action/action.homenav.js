export const DATATYPE = {
  homeNav: 'homeNav',
  homeNavState: 'homeNavState',
}

export function HomeNav(state){
  return{
    type: DATATYPE.homeNav,
    text:state
  }
}

export function HomeNavState(state){
  return{
    type: DATATYPE.homeNavState,
    text:state
  }
}
