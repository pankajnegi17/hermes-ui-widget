export let socket1;

export const sendMessage = (message)=>{ 
    socket1.emit('message', {text:message, room:'room1'})
}

export const sendPrivateMessage = (message )=>{    
    socket1.emit('privateMessage', message)
}


export const sendNewPrivateMessage = (message )=>{    
    socket1.emit('newPrivateMessage', message)
}

export const sendUserStatus = (user_id, status)=>{
    socket1.emit('userstatus', {value:status,user_id:user_id})
}

export const joinRoom = (group_id)=>{ 
    socket1.emit('joinRoom', {group_id})
} 

export const initializeHandlers = (socket, user_id = '')=>{
    //Message Handler
    socket1 = socket
    sendUserStatus(user_id, true)
    // connectToRooms(user_id)
    socket1.on('message', data=> console.warn(data));

    //Various activity handlers (Added to new Group, Group name changes etc.)
    socket1.on('activity', data=>console.warn(data))

    socket1.on('connection', ()=>{
        socket1.emit('crateSelfRoom', {socketId:socket1.id, username:user_id})
    })
}


const connectToRooms = user_id=>{
    socket1.emit('connectRooms', {user_id:user_id})
}

export const sendQuery = ({to, payload}) => {
    socket1.emit('query', {to, payload})
}

export const askHumanHelp = ({username, transcript, activeSocketId})=>{
    socket1.emit('human_help', {username, transcript, activeSocketId})
}


 


