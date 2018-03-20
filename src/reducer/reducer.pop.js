import { poptype } from '../action/action.pop'

export var Popreduce =(state = false,action)=> {
    switch(action.type){
        case poptype.StatePop:
            return !action.state
        default:
            return state
    }
}