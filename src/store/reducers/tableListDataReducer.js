const tableListDataReducer = (state ={},{type,payload}) => { 
    switch(type){
        case "TABLE_DATA_ACTION":
            return Object.assign({},state,{columns:payload.columns,data:payload.data})
        default:
        return state;
    } 
}

export default tableListDataReducer;