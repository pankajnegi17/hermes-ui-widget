

const ListModalStatusReducer = (state ={},{type,payload}) => { 
     
    switch(type){
        case "LIST_MODAL_STATUS":
            return Object.assign({},state,{opened:payload})         
        default:
        return state;
    } 
}

export default ListModalStatusReducer;