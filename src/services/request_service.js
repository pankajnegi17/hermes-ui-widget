export const req_body_nlp_response_api=(user_query, message_uuid, session_id, firstName, lastName, token, username)=>{
   return {
    MESSAGE: {
      QUERY: user_query,
      QUERY_UUID: message_uuid,
      SESSION_ID: session_id,
      USER_NAME: firstName + lastName,
      USER_ID:"3304",
    },
    TOKEN: token,
    USERID: username
  }
}

