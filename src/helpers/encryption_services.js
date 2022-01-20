export const jsonToBase64 = (data)=>{ 
    return  btoa(JSON.stringify(data))
}

export const base64ToJason = (bstring)=>{
   return JSON.parse(atob(bstring))
}