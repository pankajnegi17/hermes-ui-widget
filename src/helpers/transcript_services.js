let transcript = ""

function generateTranscriptrecord(message, BODYTYPE){
    switch(BODYTYPE){
        case "STRING":{
            return message 
        }

        default:{
            return "You got some response from BOT"
        }
    }
}

export const addTranscript = (message, speaks="me", BODYTYPE="STRING")=>{

if(speaks == 'me'){
    transcript += `[YOU  ${new Date()}]\n ${message}\n`
}
else if(speaks == 'bot'){
    transcript += `[HERMES  ${new Date()}]\n ${generateTranscriptrecord(message, BODYTYPE)} \n`
}
}

export const deleteTranscript = ()=>{transcript = ""}

export const getTranscript = ()=>transcript