import {MODAL_STATUS_ACTION,MODAL_URL_ACTION} from '../actions/modalStatusAction';

const modalStatusReducer = (state ={},{type,payload}) => { 
    switch(type){
        case MODAL_STATUS_ACTION:
            return Object.assign({},state,{isOpened:payload})

        case "MODAL_URL_ACTION": {
             
            return Object.assign({},state,{modal_url:payload})
        }          
        
        case "MODAL_TYPE_ACTION":{
            return Object.assign({},state,{modal_type:payload})
        }
        case "MODAL_CICK_ACTION":{
            return Object.assign({},state,{clickCount:payload})
        }

        case "MODAL_IMAGE_DATA_ACTION":{
            return Object.assign({},state,{images:payload})
        }
        default:
        return state;
    } 
}

export default modalStatusReducer;