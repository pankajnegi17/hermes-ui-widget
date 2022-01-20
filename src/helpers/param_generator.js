export const generate_nlp_response_param=(user_query, message_uuid, session_id, firstName, lastName, token, username)=>{
    return {
     MESSAGE: {
       QUERY: user_query,
       QUERY_UUID: message_uuid,
       SESSION_ID: session_id,
       USER_NAME: (firstName + lastName).toLowerCase().trim(),
       USER_ID: username
       
     },
     TOKEN: token,
     USERID: username
   }
 }