export const DATATYPE = {
  kjResult: 'kjResult'
}

export function KjAction(state){
  return{
    type: DATATYPE.kjResult,
    text:state
  }
}
