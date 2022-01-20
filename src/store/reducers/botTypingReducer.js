import {BOT_TYPING_ACTION} from '../actions/botTypingAction';

const botTypingReducer = (state ={},{type,payload}) => { 
    switch(type){
        case BOT_TYPING_ACTION:
            return Object.assign({},state,{isTyping:payload})
        default:
        return state;
    } 
}

export default botTypingReducer;