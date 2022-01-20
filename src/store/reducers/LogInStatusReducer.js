
const LogInStatusReducer = (state ={},{type,payload}) => { 
      //console.log("PAyload: "+payload)
    switch(type){
        case "LOGIN_SUCCESS_ACTION":
            return Object.assign({},state,{firstName:payload.firstName,lastName:payload.lastName,isLogIn:true,userType:payload.userType,username:payload.username, token:payload.token})
        case "LOGOUT_ACTION":
            return Object.assign({},state,{firstName:"",lastName:"",isLogIn:false,userType:"",username:"", token:""})
             
        default:
        return state;
    } 
}

export default LogInStatusReducer;