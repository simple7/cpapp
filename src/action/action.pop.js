export const poptype = {
  StatePop: 'statepop'
}

export function Popaction(state){
  return{
    type: poptype.StatePop,
    state
  }
}
