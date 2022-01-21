let socket = {}

//This setter should be called once socket get initialied or changed
export const setSocketObject = (socket)=>socket = socket; 

//Generic Event Emitter
export const emitEvent = (eventName,data) =>{
    socket.emit(eventName, data)
}

