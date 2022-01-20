const conversationDataReducer = (state ={},{type,payload}) => { 

    switch(type){

        case "CONVERSATION_ID_ACTION":
            return Object.assign({},state,{conversation_id:payload})

        case "GROUP_ID_ACTION":
            return Object.assign({},state,{group_id:payload})

            
        case "FROM_PARTICIPANT_ID_ACTION":
        return Object.assign({},state,{from_participant_id:payload})


        case "TO_PARTICIPANT_ID_ACTION":
        return Object.assign({},state,{to_participant_id:payload})
        
        case "GROUP_TYPE_ACTION":
        return Object.assign({},state,{group_type:payload})


        case "GROUP_NAME_ACTION":
        return Object.assign({},state,{group_name:payload})
        
        default:
        return state;
    } 
}

export default conversationDataReducer;