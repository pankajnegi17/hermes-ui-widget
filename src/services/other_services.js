import axios from "axios/index";
import {  
  chatbot_api_host 
} from "../config";
import { getTranscript, deleteTranscript } from "../helpers/transcript_services";

/**API for getting Workflo */
export function get_WorkflowResponse(query, username, workflow_id, QUERY_UUID){
return new Promise((resolve, reject)=>{
    axios.post(chatbot_api_host+'/workflow',
    {MESSAGE:{QUERY_UUID:"asdadadad324242sadsad",QUERY:query, USERNAME:username, SESSION_ID:this.state.workflow_id}})
    .then(response=>{      
        resolve(response)
    })
    .catch(err=>{reject(err)})  
})
}


export function get_doc(query){
  return new Promise((resolve, reject)=>{
    axios.post(chatbot_api_host+"/doc_intent", {query: query})
    .then(response=>{
      resolve(response)
    })
    .catch(err=>{reject(err)})
  })
}

export function generateLeaveRequest(formData, userData){
  return new Promise((resolve, reject)=>{
    axios.post(chatbot_api_host+"/leave_request", {formData, userData})
    .then(response=>{ resolve(response.data)})
    .catch(err=>{reject(err)})
  })
}


export async function sendTranscript(){
  return new Promise((resolve, reject)=>{
    console.log({session: sessionStorage.getItem("session"), transcript: getTranscript()})
    axios.post(chatbot_api_host+"/sendTranscript", {session: sessionStorage.getItem("session"), transcript: getTranscript()})
    .then(response=>{
      deleteTranscript()
      resolve(response);
    
    })
    .catch(err=>reject(err))
  })
}

export async function sendUserRating(ratingData){
  return new Promise((resolve, reject)=>{
    axios.post(chatbot_api_host+"/sendUserRating", ratingData)
    .then(res=>{resolve()})
    .catch(err=>{reject()})
  })
}

