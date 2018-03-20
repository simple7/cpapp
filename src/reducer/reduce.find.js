import {DATATYPE} from '../action/action.find'

export const KjResult = (state = {
  red: ['00', '00', '00', '00', '00'],
  blue: [],
  pid: '双色球2010000期',
  flag:'1'
}, action) => {
  switch (action.type) {
    case DATATYPE.kjResult:
      return action.text
    default:
      return state
  }
}
