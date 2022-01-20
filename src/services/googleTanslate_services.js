import axios from "axios";
import { chatbot_api_host } from "../config";

export const getTranslation =async (text, language= 'en')=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let response =  await axios.get(chatbot_api_host+`/translate?target=${language}&text=${text}`);
            resolve (response.data.translatedText)
        }
        catch(error){
            resolve(text)
        }
        
    })  
}


export const getTranslitration =async (text, language= 'en')=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let response =  await axios.get(chatbot_api_host+`/translitration?target=${language}&text=${text}`);
            resolve (response.data.translatedText)
        }
        catch(error){
            resolve(text)
        }
        
    })  
}

export const getHermesTranslation = async (text, language ='en')=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let response =  await axios.get(chatbot_api_host+`/hermesTranslation?target=${language}&text=${text}`);
            resolve (response.data)
        }
        catch(error){
            resolve(text)
        }
        
    })  
}