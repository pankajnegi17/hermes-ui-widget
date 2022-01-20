import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import AccountCircle from "@material-ui/icons/AccountCircle";

import Button from "@material-ui/core/Button";

import Icon from "@material-ui/core/Icon";
import axios from "axios";
import { chatbot_api_host } from "../../config"; 

const useStyles = makeStyles((theme) => ({
  root: {    
    marginTop: '50px',
    
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  formWrapper: {
    textAlign: 'center',
  },
}));

function sendFeedback(message){
 return new Promise((resolve, reject)=>{ 
  axios.post(chatbot_api_host+"/feedback", message)
  .then(res=>resolve(res))
  .catch(err=>reject(err))
 }); 
}
 
export default function FeedbackForm(props) {

  const [message, setmessage] = useState("Write feedback")
  const [recipient, setrecipient] = useState("")
  const [status, setstatus] = useState(0)
  const classes = useStyles();

  const onFormSubmit=  (e, message, recipient)=>{
    e.preventDefault()
    //Should be fetched from redux store LoginStatus
    alert(props.logInStatus.username)
    sendFeedback({message, recipient, from:props.logInStatus.username}).then(res=>setstatus(1)).catch(err=>setstatus(2)) 
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div className={classes.formWrapper}>
        <FormControl className={classes.margin}>
          <TextField
            error={false}
            id="outlined-error-helper-text"
            label="Error"
            defaultValue="Hi there!"
            value={message}
            onInput={(e)=>{setmessage(e.target.value)}}
            helperText="This message will be send annomymously."
            variant="outlined"
          />

          <InputLabel htmlFor="input-with-icon-adornment">
           Start typing recipient name.
          </InputLabel>
          <Input
            id="input-with-icon-adornment"
            value={recipient}
            onInput={(e)=>setrecipient(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={(e)=>onFormSubmit(e, message, recipient)}
            className={classes.button}
            endIcon={<Icon>send</Icon>}
          >
            Send
          </Button>
        </FormControl>

       {status==1 && (<p>Feedback Sent Successfully!</p>)}
       {status==2 && (<p color="red">Couldn't send feedback!</p>)}
      </div>
    </form>
  );
}
