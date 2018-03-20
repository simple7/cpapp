import {DATATYPE} from '../action/action.homenav'

/* 路由状态 */
export const HomeNavReduce = (state = 'home', action) => {
  switch (action.type) {
    case DATATYPE.homeNav:
      return action.text
    default:
      return state
  }
}

/* 路由跳转状态 */
export const HomeNavState = (state = '', action) => {
  switch (action.type) {
    case DATATYPE.homeNavState:
      return action.text
    default:
      return state
  }
}
