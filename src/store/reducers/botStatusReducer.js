import {BOT_STATUS_ACTION} from '../actions/botStatusAction';

const botStatusReducer = (state ={},{type,payload}) => {  
    switch(type){
        case BOT_STATUS_ACTION:
            return Object.assign({},state,{isOpened:payload})
        default:
        return state;
    } 
}

export default botStatusReducer;