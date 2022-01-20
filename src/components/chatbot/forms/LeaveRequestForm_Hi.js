import React, { useState } from "react"; 
import { connect, useSelector, useDispatch  } from "react-redux";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField"; 
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container"; 
import Icon from "@material-ui/core/Icon"; 
import SyncIcon from "@material-ui/icons/Sync";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning"; 
import MenuItem from "@material-ui/core/MenuItem"; 
import { generateLeaveRequest } from "../../../services/other_services";
import Grid from "@material-ui/core/Grid"; 
import { close_modal } from "../../../store/actions/modalStatusAction";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "white",
    padding: "5px",
    boxShadow: '2px 2px 9px 1px #8e8272',
    marginTop: '2px',
    borderRadius: '0px 26px 26px',
  },
  formHeading:{
    borderRadius: '10px',
    background: '#433c3326 !important',
    padding: '5px 14px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color:' #433c33 !important',
    border: '1px solid rgba(63, 81, 181, 0.5)',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 100,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  halfWidth: {
    width: "50% !important", 
  }, 

}));
 
const useStylesUnderLine = makeStyles({
  underline: {
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  }
});

export default function LeaveRequestForm_Hi(props) {
  const leaveFormData = useSelector(state => state.leaveFormData);
  const dispatch = useDispatch()

  const message = useSelector(state=>state.leaveFormData.leavepurpose);
  const fromDate = useSelector(state=>state.leaveFormData.fromdate);
  const toDate = useSelector(state=>state.leaveFormData.todate);
  const leaveType = useSelector(state=>state.leaveFormData.leavetype);
  const noOfDays = useSelector(state=>state.leaveFormData.noofdays);

  const isModalOpen =useSelector(state=>state.modalStatus.isOpened)  

  const setmessage = (days)=>{dispatch({type:'LEAVE_FORM_LEAVEPURPOSE', payload:days})}
  const setfromDate = (days)=>{dispatch({type:'LEAVE_FORM_FROMDATE', payload:days})}
  const settoDate = (days)=>{dispatch({type:'LEAVE_FORM_TODATE', payload:days})}
  const setleaveType = (days)=>{dispatch({type:'LEAVE_FORM_LEAVETYPE', payload:days})}
  const setnoOfDays = (days)=>{dispatch({type:'LEAVE_FORM_NOOFDAYS', payload:days})}

  const today = ()=>{
    const date = new Date()
    return `${date.getFullYear()}-${date.getMonth()<=8 ? `0${date.getMonth()+1}` : date.getMonth()+1}-${date.getDate()}`
  }
  
  const parseDate = (date)=>{ 
    return Date.parse(date)
  }

  // const [message, setmessage] = useState(props.formData.leavepurpose == "" ? props.userQuery : props.formData.leavepurpose);
  // const [fromDate, setfromDate] = useState(props.formData.fromdate == "" ? today():props.formData.fromdate );
  // const [toDate, settoDate] = useState(props.formData.todate == ""? props.formData.fromdate?props.formData.fromdate: today():props.formData.todate);
  // const [leaveType, setleaveType] = useState(props.formData.leavetype == "" ? "casual leave" : props.formData.leavetype);
  // const [noOfDays, setnoOfDays] = useState(props.formData.noofdays == "" ? 0 : props.formData.noofdays);

  const [formError, setformError] = useState(false)
  const [status, setstatus] = useState(5);
 
  const [isMessageValid, setisMessageValid] = useState(true)
  const [isFromDateValid, setIsFromDateValid] = useState(true)
  const [isToDateValid, setIsToDateValid] = useState(true)
  const [isNoOfDaysValid, setIsNoOfDaysValid] = useState(true)
  const [isLeaveTypeValid, setIsLeaveTypeValid] = useState(true)

  const classes = useStyles();
  const classesUnderline= useStylesUnderLine()
 
  const resetState = () => {
    setmessage("");
    setfromDate("");
    settoDate("");
    setleaveType("")
    setnoOfDays("")
    setformError("false"); 
  };

  const checkErrors=( )=>{ 
    
    let isError  = false
    if(message.length<7){
      setisMessageValid(false)
      isError = true
    }
    else  setisMessageValid(true)

    if(fromDate == "" || parseDate(fromDate) < parseDate(today())){ 
      setIsFromDateValid(false);
      isError =true
    }
    else   setIsFromDateValid(true);

    if(toDate == "" || parseDate(toDate) <= parseDate(fromDate)){ 
      setIsToDateValid(false);
      isError = true
    }
    else   setIsToDateValid(true);
    if(noOfDays == "" || noOfDays < 0){ 
      setIsNoOfDaysValid(false);
      isError = true
    }
    else setIsNoOfDaysValid(true);
    if(leaveType == ""){ 
      setIsLeaveTypeValid(false)
      isError =true
    }    
    else setIsLeaveTypeValid(true)    
  
    return isError;    
  }

  const handleMessageChange = (text)=>{
    setmessage(text)
  }

  const handleFromDateChange = (date)=>{ 
    let td = today()
    console.log(date)
    console.log(td == date)
    setfromDate(date)
  }

  const handleToDateChange = (date) =>{
    settoDate(date)
  }

  const handleLeaveTypeChange = (leave)=>{
    setleaveType(leave)
  }

  const handleNoOfDaysChange = (days)=>{
    setnoOfDays(days)
  }

  const onFormSubmit = (e) => {
    
    e.preventDefault();
    setstatus(0);
    let isFormHasError= checkErrors()
    console.log(isFormHasError)
    if(!isFormHasError){
      
      generateLeaveRequest({ fromDate, toDate, noOfDays, message, leaveType }, props.userData)
      .then(function (res) {   
        setstatus(1);
        setTimeout(() => {
          props.generateSpeech('फॉर्म सफलतापूर्वक जमा कर दिया गया है')
          props.createTextMessage('फॉर्म सफलतापूर्वक जमा कर दिया गया है');
         
        }, 1000);
       
        setTimeout(() => {
          props.createMessage(res.MESSAGE.RESULT[0], res.MESSAGE.INTENT_FLAG);
        }, 2000);        
        resetState();
        dispatch(close_modal) 
      })
      .catch((err) => setstatus(2));
    }
    else{
      setstatus(3)
    }



    // if(isValidEmail(recipient)){
    //     sendFeedback({message, recipient, from:props.logInStatus.username})
    //     .then(res=>{setstatus(1);resetState()})
    //     .catch(err=>setstatus(2))
    // }
    // else{
    //     setstatus(3)
    // }

    //Call to create messsage of parent ti create a status card
  };

  const createLeaveForm = ()=> {
    return (

      <>
          {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h6" variant="subtitle2" className={classes.formHeading}>
        अवकाश अनुरोध प्रपत्र
        </Typography>
       
     {  !isModalOpen && (<Typography component="button" variant="button" onClick={()=>props.open_modal('leaveForm')} >
     ज़ूम
        </Typography>)}
      
        <form className={classes.form} noValidate> 
      <Grid container spacing={2}>
        <Grid item xs={6}> 
          {/* <Input
                label="From Date"
                name="From Date"
                margin="normal"
                id="outlined-from-date"
                type="date"
                variant="outlined" 
                value={fromDate}
                onInput={(e) => handleFromDateChange(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }} 
                error = {!isFromDateValid} 
                InputProps={{inputProps: { min: "13-09-2021", max: "17-09-2021"} }}
          /> */}
          <TextField
            label="तिथि से"
            name="From Date"
            margin="normal"
            id="outlined-from-date"
            type="date"
            variant="outlined" 
            value={fromDate}
            onInput={(e) => handleFromDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.halfWidth} 
            error = {!isFromDateValid} 
            InputProps={{inputProps: { min: "2021-09-13", max: "2022-12-31"} }}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          {/* <Input
            label="To Date"
            name="To Date"
            margin="normal"
            id="outlined-to-date"
            type="date"
            variant="outlined" 
            value={toDate}
            onInput={(e) => handleToDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }} 
            error = {!isToDateValid}
          ></Input> */}
            <TextField
            label="तारीख तक"
            name="To Date"
            margin="normal"
            id="outlined-from-date"
            type="date"
            variant="outlined" 
            value={toDate}
            onInput={(e) => handleToDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.halfWidth} 
            error = {!isToDateValid}
            InputProps={{inputProps: { min: "2021-09-13", max: "2022-12-31"} }}
          ></TextField>
        </Grid>
      </Grid>

      <TextField
        id="outlined-multiline-static"
        variant="outlined"
        margin="normal"
        label="छुट्टी का कारण"
        multiline
        fullWidth
        rows={4}
        inputProps={{ maxLength: 100 }}
        placeholder="यहाँ छुट्टी का कारण लिखें! [न्यूनतम 8 और अधिकतम 100 वर्ण]"
        value={message}
        onInput={(e) => {
          handleMessageChange(e.target.value);
        }}
        InputLabelProps={{
          shrink: true,
        }}        
        error = {!isMessageValid}       
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            id="standard-number"
            variant="outlined"
            margin="normal"
            label="दिनों की संख्या"
            type="number"
            value={noOfDays}
            onInput={(e) => handleNoOfDaysChange(e.target.value)}
            placeholder="दिनों की संख्या"
            disableUnderline
            InputLabelProps={{
              shrink: true,
            }}
            className={classes.halfWidth}
            error = {!isNoOfDaysValid}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="outlined-select-currency"
            select
            margin="normal"
            label="छुट्टी का प्रकार"
            value={leaveType}
            onChange={(e) => handleLeaveTypeChange(e.target.value)} 
            variant="outlined"
            className={classes.halfWidth}
            InputLabelProps={{
              shrink: true,
            }}
            disableUnderline
            error = {!isLeaveTypeValid}
          > 
          



            <MenuItem value={"casual leave"}>आकस्मिक अवकाश</MenuItem>
            <MenuItem value={"medical leave"}>चिकित्सा अवकाश</MenuItem>
            <MenuItem value={"privileged leave"}>विशेषाधिकार अवकाश</MenuItem> 
            <MenuItem value={"maternity leave"}>मातृत्व अवकाश</MenuItem> 
          </TextField>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        type="submit"
        onClick={(e) => onFormSubmit(e)}
        endIcon={<Icon>send</Icon>}
        disabled={formError}
        variant="outlined"
        align="right" 
      >
        प्रस्तुत
      </Button> 
    </form>

      </>
    
   
)
  }  

  return  (<>
  {(    <Container component="main"  style={{display: status=='1'? 'none': 'block'}, {padding: isModalOpen?'0': ""}}>
      <CssBaseline />
      <div className={classes.paper} style={{boxShadow: isModalOpen? 'none': ""}}> 
        {status != 1 && createLeaveForm()}
        {status == 0 && (
          <Typography
            component="h6"
            variant="subtitle1"
            color="primary"
            align="center"
          >
            {" "}
            <SyncIcon color="primary" /> {"छुट्टी का अनुरोध सबमिट किया जा रहा है...!"}
          </Typography>
        )}
        {status == 2 && (
          <Typography
            component="h6"
            variant="subtitle1"
            color="error"
            align="center"
          >
            {" "}
            <ErrorIcon color="error" /> {"सबमिट नहीं किया जा सका"}
          </Typography>
        )}
        {status == 3 && (
          <Typography
            component="h6"
            variant="subtitle1"
            style={{ color: "#d98900" }}
            align="center"
          >
            {" "}
            <WarningIcon style={{ color: "#d98900" }} />{" "}
            {"कृपया मान्य विवरण प्रदान करें"}
          </Typography>
        )}
      </div> 
    </Container>)}
  </>)
  
}
