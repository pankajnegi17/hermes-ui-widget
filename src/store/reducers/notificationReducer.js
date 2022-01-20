const notificationReducer = (state ={},{type,payload}) => { 
    switch(type){ 
        case "NOTIFICATION_LENGTH_ACTION": {             
            return Object.assign({},state,{length:payload})
        }          
        default:
        return state;
    } 
}

export default notificationReducer;