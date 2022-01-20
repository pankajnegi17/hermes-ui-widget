
const talk_to_what_reducer = (state ={},{type,payload}) => { 
    switch(type){
        case "TALK_TO_WHAT_ACTION":
            return Object.assign({},state,{name:payload}) 
        default:
        return state;
    } 
}

export default talk_to_what_reducer;