export const TALK_TO_WHAT_ACTION = 'TALK_TO_WHAT_ACTION'; 
 
export const talk_to_what_action = (src) => async dispatch => {
    dispatch({ type:"TALK_TO_WHAT_ACTION",payload:src});
}
 