export const MODAL_STATUS_ACTION = 'MODAL_STATUS_ACTION';
export const MODAL_URL_ACTION ="MODAL_URL_ACTION";

export const close_modal = {type:MODAL_STATUS_ACTION,payload:false};

export const open_modal = {type:MODAL_STATUS_ACTION,payload:true}; 

export const set_modal_url = (src) => async dispatch => {
    dispatch({ type:MODAL_STATUS_ACTION,payload:src});
}
 