
const leaveFormDataReducer = (state ={},{type,payload}) => { 
    //console.log("PAyload: "+payload)
  switch(type){
      case "LEAVE_FORM_DATA_INITIALIZATION":
          return Object.assign({}, payload)
      case "LEAVE_FORM_EMPNO":
          return Object.assign({},{...state, empno :payload}); 
      case "LEAVE_FORM_EMPNAME":
          return Object.assign({},{...state, empname:payload}) 
      case "LEAVE_FORM_APPLICATION_DATE":
          return Object.assign({},{...state, 'application date':payload}) 
      case "LEAVE_FORM_FROMDATE":
          return Object.assign({},{...state, fromdate:payload})            
      case "LEAVE_FORM_TODATE":
          return Object.assign({},{...state, todate:payload}) 
      case "LEAVE_FORM_LEAVETYPE":
          return Object.assign({},{...state, leavetype:payload}) 
      case "LEAVE_FORM_LEAVEPURPOSE":
          return Object.assign({},{...state, leavepurpose:payload}) 
      case "LEAVE_FORM_NOOFDAYS":
          return Object.assign({},{...state, noofdays:payload})                       
      default:
      return state;
  }  }
export default leaveFormDataReducer;