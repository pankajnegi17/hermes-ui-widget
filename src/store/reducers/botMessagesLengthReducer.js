import {BOT_MESSAGES_LENGTH_ACTION} from '../actions/botMessagesLengthAction'; 

const botMessagesLengthReducer = (state ={},{type,payload}) => {   
    switch(type){
        case BOT_MESSAGES_LENGTH_ACTION:
            return Object.assign({},state,{length:   state.length+ 1});

        // case BOT_TYPING_ACTION:{
        //     //console.log("After Increament: "+state.length + 1);
        //     return Object.assign({},state,{length:   state.length+ 1})
        // }
         
        default:
        return state;
    } 
}

export default botMessagesLengthReducer;