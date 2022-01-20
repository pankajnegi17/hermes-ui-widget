
const ZoomModalodalStatusReducer = (state ={},{type,payload}) => { 
    switch(type){
        case "ZOOM_MODAL_STATUS_ACTION":
            return Object.assign({},state,{isOpened:payload})

        case "ZOOM_MODAL_URL_ACTION": {
            
             
            return Object.assign({},state,{modal_url:payload})
        }          
         
       
        default:
        return state;
    } 
}

export default ZoomModalodalStatusReducer;