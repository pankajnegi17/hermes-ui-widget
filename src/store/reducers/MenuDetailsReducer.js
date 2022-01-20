const MenuDetailsReducer = (state ={},{type,payload}) => { 
    switch(type){
        case "SELECT_DESIGNATION_NAME_ACTION":
            return Object.assign({},state,{selectedDesignation:payload}) 
        
            case "SELECT_DESIGNATION_STATUS_ACTION":
                return Object.assign({},state,{isDesignationSelected:payload})
        default:
        return state;
    } 
}

export default MenuDetailsReducer;