export const Match = (state = {dataList:[],statge:'',odds:[]}, action) => {
  switch (action.type) {
    case 'jishi':
      return action.state
    default:
      return state
  }
}
