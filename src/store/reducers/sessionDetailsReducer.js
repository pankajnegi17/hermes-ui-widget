
const sessionDetailsReducer = (state ={},{type,payload}) => {  
    switch(type){
        case "SESSION_DETAIL_ACTION":
            return Object.assign({},state,{session_id:payload})
             
        default:
        return state;
    } 
  }
  
  export default sessionDetailsReducer;