import React, { useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
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
import {
  validateAccountNo,
  validateOtp,
} from "../../../services/bankapi_services";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "white",
    padding: "5px",
    boxShadow: "2px 2px 9px 1px #8e8272",
    marginTop: "2px",
    borderRadius: "0px 26px 26px",
  },
  formHeading: {
    borderRadius: "10px",
    background: "#433c3326 !important",
    padding: "5px 14px",
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
    color: " #433c33 !important",
    border: "1px solid rgba(63, 81, 181, 0.5)",
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
  AccountFormWrapper: {
    paddingTop: "15px !important",
  },
  underlineBlue: {
    textDecoration: 'underline',
    color: 'blue',
    cursor:'pointer'
  },
  bottomAlign:{
    alignSelf: 'flex-end'
  },
  green:{
    color:'green'
  }
}));

const useStylesUnderLine = makeStyles({
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
});

export default function AccountBalanceForm(props) {
  const leaveFormData = useSelector((state) => state.leaveFormData);  
  const dispatch = useDispatch();
 

  //States for Account Form
  const [accountNo, setaccountNo] = useState("");
  const [Otp, setOtp] = useState("");
  const [formCompleted, setformCompleted] = useState(false);
  const [OtpCount, setOtpCount] = useState(0);

  /**
   * 0 = Empty
   * 1 = Non empty
   * 2 = verifyed
   * 3 = not verifyed
   */
  const [accountNoStatus, setaccountNoStatus] = useState(0);
  const [OtpStatus, setOtpStatus] = useState(0);

  const message = useSelector((state) => state.leaveFormData.leavepurpose);
  const fromDate = useSelector((state) => state.leaveFormData.fromdate);
  const toDate = useSelector((state) => state.leaveFormData.todate);
  const leaveType = useSelector((state) => state.leaveFormData.leavetype);
  const noOfDays = useSelector((state) => state.leaveFormData.noofdays);

  const isModalOpen = useSelector((state) => state.modalStatus.isOpened);

  const setmessage = (days) => {
    dispatch({ type: "LEAVE_FORM_LEAVEPURPOSE", payload: days });
  };
  const setfromDate = (days) => {
    dispatch({ type: "LEAVE_FORM_FROMDATE", payload: days });
  };
  const settoDate = (days) => {
    dispatch({ type: "LEAVE_FORM_TODATE", payload: days });
  };
  const setleaveType = (days) => {
    dispatch({ type: "LEAVE_FORM_LEAVETYPE", payload: days });
  };
  const setnoOfDays = (days) => {
    dispatch({ type: "LEAVE_FORM_NOOFDAYS", payload: days });
  };

  const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${
      date.getMonth() <= 8 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getDate()}`;
  };

  const parseDate = (date) => {
    return Date.parse(date);
  };

  // const [message, setmessage] = useState(props.formData.leavepurpose == "" ? props.userQuery : props.formData.leavepurpose);
  // const [fromDate, setfromDate] = useState(props.formData.fromdate == "" ? today():props.formData.fromdate );
  // const [toDate, settoDate] = useState(props.formData.todate == ""? props.formData.fromdate?props.formData.fromdate: today():props.formData.todate);
  // const [leaveType, setleaveType] = useState(props.formData.leavetype == "" ? "casual leave" : props.formData.leavetype);
  // const [noOfDays, setnoOfDays] = useState(props.formData.noofdays == "" ? 0 : props.formData.noofdays);

  const [formError, setformError] = useState(false);
  const [status, setstatus] = useState(5);

  const [isMessageValid, setisMessageValid] = useState(true);
  const [isFromDateValid, setIsFromDateValid] = useState(true);
  const [isToDateValid, setIsToDateValid] = useState(true);
  const [isNoOfDaysValid, setIsNoOfDaysValid] = useState(true);
  const [isLeaveTypeValid, setIsLeaveTypeValid] = useState(true);

  const classes = useStyles();
  const classesUnderline = useStylesUnderLine();

  const resetState = () => {
    setmessage("");
    setfromDate("");
    settoDate("");
    setleaveType("");
    setnoOfDays("");
    setformError("false");
  };

  const checkErrors = () => {
    let isError = false;
    if (message.length < 7) {
      setisMessageValid(false);
      isError = true;
    } else setisMessageValid(true);

    if (fromDate == "" || parseDate(fromDate) < parseDate(today())) {
      setIsFromDateValid(false);
      isError = true;
    } else setIsFromDateValid(true);

    if (toDate == "" || parseDate(toDate) <= parseDate(fromDate)) {
      setIsToDateValid(false);
      isError = true;
    } else setIsToDateValid(true);
    if (noOfDays == "" || noOfDays < 0) {
      setIsNoOfDaysValid(false);
      isError = true;
    } else setIsNoOfDaysValid(true);
    if (leaveType == "") {
      setIsLeaveTypeValid(false);
      isError = true;
    } else setIsLeaveTypeValid(true);

    return isError;
  };

  const handleMessageChange = (text) => {
    setmessage(text);
  };

  const handleFromDateChange = (date) => {
    let td = today();
    console.log(date);
    console.log(td == date);
    setfromDate(date);
  };

  const handleToDateChange = (date) => {
    settoDate(date);
  };

  const handleLeaveTypeChange = (leave) => {
    setleaveType(leave);
  };

  const handleNoOfDaysChange = (days) => {
    setnoOfDays(days);
  };

  const _onAccountNoChange = (e) => {
    setaccountNo(e.target.value);
  };

  const _onOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const onAccountNumberSubmit = () => {

    validateAccountNo(accountNo)
      .then((res) => { 
        
        if (res.Response == "SMS Sent") {
          setaccountNoStatus(2);
          setOtpCount(OtpCount + 1);
        } else setaccountNoStatus(3);
      })
      .catch((err) => {
        
        
        setaccountNoStatus(3);
      });
  };

  const resendOtp = () => {
    validateAccountNo(accountNo)
      .then((res) => {
        if ( res.Response=="SMS Sent") {
          setaccountNoStatus(2);
          setOtpCount(OtpCount + 1);
        } else setaccountNoStatus(3);
      })
      .catch((err) => {
        
        setaccountNoStatus(3);
      });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    validateOtp(Otp, accountNo)
      .then(function (res) {
        if(res.Response == "Valid OTP") {
          setOtpStatus(2);
          setformCompleted(true);
          setstatus(1);
          props.createTextMessage(`Your account balance is ${res.Acc_Balance}`);
          props.generateSpeech("This is your account balance")
          resetState();
          dispatch(close_modal);
        }
        else {
          setOtpStatus(3);
        } 
      })
      .catch((err) => setstatus(2));

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

  const createLeaveForm = () => {
    return (
      <>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        {/* <Typography component="h6" variant="subtitle2" className={classes.formHeading}>
          Account Balance Form
        </Typography> */}
        {/*        
     {  !isModalOpen && (<Typography component="button" variant="button" onClick={()=>props.open_modal('leaveForm')} >
          Zoom
        </Typography>)} */}
        <div classname={classes.AccountFormWrapper}>
          <Grid container outlined spacing="1">
            <Grid item xs={8}>
              <TextField
                style={{ textDecoration: "none" }}
                error={accountNoStatus == "3"}
                id="standard-error-helper-text"
                defaultValue="Hello World"
                helperText={
                  accountNoStatus != "3" ? "" : "Invalid Account Number"
                }
                variant="standard"
                placeholder="Account Number"
                onChange={(e) => _onAccountNoChange(e)}
                disabled={accountNoStatus == 2}
                value={accountNo}
                pattern="^[a-zA-Z0-9]+$"
              />
            </Grid>
            <Grid item xs={4} className={classes.bottomAlign}>
              {accountNoStatus == 2 ? 
              (<span className={classes.green} variant={accountNoStatus == 2 ? "outlined" : "contained"} color="success"  size="small">OTP Sent &#10003;</span>) 
              :
               ( <Button
                variant={accountNoStatus == 2 ? "outlined" : "contained"}
                size="small" 
                onClick={(e) => onAccountNumberSubmit(e)}  
                disabled={accountNo.length < 10 || accountNoStatus == 2}              
              >
                {accountNoStatus == 2 ? "OTP Sent" : "Send OTP"}
              </Button>)}               
            </Grid>
          </Grid>
          <Grid container spacing="1">
            <Grid item xs={6}>
              <TextField
                style={{ textDecoration: "none" }}
                error={OtpStatus == "3"}
                id="standard-error-helper-text"
                defaultValue="Hello World"
                helperText={OtpStatus != "3" ? "" : "Invalid OTP"}
                variant="standard"
                placeholder={accountNoStatus == "2" ? "OTP" : "OTP"}
                onChange={(e) => _onOtpChange(e)}
                disabled={accountNoStatus != 2 || OtpStatus == "2"}
                value={Otp}
                pattern="^[a-zA-Z0-9]+$"
                type="password"
                
              />
              {/* <input
                placeholder={accountNoStatus == '2' ? "OTP": "Verify Acc No First." }
                value={Otp}
                onChange={(e) => _onOtpChange(e)}
                disabled = {accountNoStatus != 2}
              ></input> */}
            </Grid>
            <Grid className={classes.bottomAlign} item xs={6}>
            {!(OtpStatus == "2" || accountNoStatus != "2") &&  ( <><span
                variant="contained"
                size="small"
                className={classes.underlineBlue}
                disabled={OtpStatus == "2" || accountNoStatus != "2"}
                onClick={(e) => resendOtp(e)}
              >
                resend OTP
              </span></> )}
            </Grid>
          </Grid>
          
          <Button
            disabled={formCompleted || Otp.length < 3}
            variant="contained"
            color="primary"
            className={classes.submit}
            type="submit"
            onClick={(e) => onFormSubmit(e)}
            endIcon={ Otp.length >= 3 && <Icon>send</Icon>}
            variant="outlined"
            align="right"
          >
            {Otp.length < 3 ? "Enter Details Above" : "Check Balance"}
          </Button>

         {/* {accountNoStatus == 2 && <span >SMS Sent</span>} */}
        </div>
      </>
    );
  };

  return (
    <>
      {true && (
        <Container
          component="main"
          style={
            ({ display: status == "1" ? "none" : "block" },
            { padding: isModalOpen ? "0" : "" })
          }
        >
          <CssBaseline />
          <div
            className={classes.paper}
            style={{ boxShadow: isModalOpen ? "none" : "" }}
          >
            {true && createLeaveForm()}
            {status == 0 && (
              <Typography
                component="h6"
                variant="subtitle1"
                color="primary"
                align="center"
              >
                {" "}
                <SyncIcon color="primary" /> {"Submiting Leave Request...!"}
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
                <ErrorIcon color="error" /> {"Couldn't submit"}
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
                {"Please provide Valid details"}
              </Typography>
            )}
          </div>
        </Container>
      )}
    </>
  );
}
