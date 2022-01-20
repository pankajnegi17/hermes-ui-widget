import React from "react"; 
import {connect} from 'react-redux'
 

const onFormSubmitt =(e)=>{
    
    e.preventDefault();
  this.props.open_agent_chat_with_user_date(
    {firstName:"Monika",
     lastName:"Kumari",
     userType:"client",
     username:"monika@botaiml.com"})
}

const LogIn =  () => ( 
  <form  onSubmit={(e)=>onFormSubmitt(e)}>
    First  Name: <input name="fname"></input><br></br>
    Last  Name: <input name="lname"></input><br></br>
    Username: <input name="username"></input><br></br> 
  <button type="submit">Save</button>
  </form>

);


const mapStateToProps = (state)=>{
  return {
    
  }
}

const mapDispatcherToProps =(dispatch)=>{
  return {
    open_agent_chat_with_user_date: logInData =>{
      dispatch({type:"LOGIN_SUCCESS_ACTION",payload:logInData});
  }
  }
}
export default connect(mapStateToProps,mapDispatcherToProps)(LogIn);