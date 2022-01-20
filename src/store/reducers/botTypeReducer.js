const botTypeReducer = (state ={},{type,payload}) => {  
    switch(type){
        case "BOT_LANGUAGE_ACTION":
            return Object.assign({},state,{language:payload})
        case "BOT_FORMAT_ACTION":
            return Object.assign({},state,{format:payload})
        default:
        return state;
    } 
}

export default botTypeReducer;