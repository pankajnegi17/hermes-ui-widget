

const confirmModalReducer = (state = {}, { type, payload }) => {
    switch (type) {

    case 'UPDATE_COMFIRM_MODAL': 
       return  Object.assign({},state,{isOpned:payload}) 
    default:
        return state
    }
}

export default confirmModalReducer;