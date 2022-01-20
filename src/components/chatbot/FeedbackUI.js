import React, {useState, useSelector} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField'; 
import Link from '@material-ui/core/Link'; 
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Input from "@material-ui/core/Input"; 
import InputAdornment from "@material-ui/core/InputAdornment"; 
import AccountCircle from "@material-ui/icons/AccountCircle"; 
import Icon from "@material-ui/core/Icon";
import axios from "axios";
import { chatbot_api_host } from "../../config";
import DoneIcon from '@material-ui/icons/Done';
import SyncIcon from '@material-ui/icons/Sync';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { sendPrivateMessage, socket1 } from '../../services/socketServices';
import uuid from "react-uuid";

function onFeedbackSend(message, to, origin){
  
  const message_record = {
    from: 'feedback@hermes.com',
    user_type: "human",
    Message_data: {
      type: "string",
      text: message,
    },    
    origin: origin,
    isFeedback:true
  }


  let chatMessage = JSON.stringify(message_record);
  var newData = new String();
  newData = chatMessage.toString().replace(/'/g, "").replace(/&/g, " and ");
   
 let chat_data =  {
    Message: JSON.parse(newData),
    message_id: uuid(),
    conversation_id: to.split('@')[0] + '-feedback',
    group_id:  to.split('@')[0] + '-feedback',
    from: 'feedback@hermes.com',
    fname: 'Feedback',
    lname: '',
    group_type: 'individual',
    group_name: 'Feedback',
    partnerMail: to,
    username:'feedback@hermes.com', 
    to:to
  } 

sendPrivateMessage(chat_data)
   
//this.setState({lazy_loading:{status:false, loading_message:""}})
// this.setState({ requestPending: false });  
// this.scrollToBottom();

}


function sendFeedback(message){
    return new Promise((resolve, reject)=>{ 
     axios.post(chatbot_api_host+"/feedback", message)
     .then(res=>resolve(res))
     .catch(err=>reject(err))
    }); 
    // socket1.emit('feedback', {message})
   }


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://botaiml.com/">
        BOTAIML
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function FeedbackUI(props) { 
  const [message, setmessage] = useState("")
  const [recipient, setrecipient] = useState("")
  const [status, setstatus] = useState(5)
  const classes = useStyles();
 

  const resetState = ()=>{ 
    setmessage("");
    setrecipient("") 
  }

  const onFormSubmit=  (e, message, recipient)=>{
    e.preventDefault() 
    setstatus(0)
    if(isValidEmail(recipient)){
      onFeedbackSend(message, recipient, props.logInStatus.username)
      setstatus(1); resetState()
      // socket1.emit('initFeedback', {message, recipient, from:props.logInStatus.username})
      // socket1.on('feedbackSent', (data)=>{setstatus(1); resetState()})
      // socket1.on('feedbackError', (error)=>{setstatus(2)})
        // sendFeedback({message, recipient, from:props.logInStatus.username})
        // .then(res=>{setstatus(1);resetState()})
        // .catch(err=>setstatus(2)) 
    }
    else{
        setstatus(3)
    }
  }


  const isValidEmail = (email)=>{ 
       return (email ==  "" || email.includes("@")) 
  }

  const isValidMessage =(message) =>{
       return message.length >= 4
  }



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h6" variant="subtitle2">
          Hermes PAT/PUSH
        </Typography>
        <form className={classes.form} noValidate>
 

        <TextField
          id="outlined-multiline-static"
          variant="outlined"
          margin="normal"
          label="Message"
          multiline
          fullWidth
          rows={4} 
          variant="outlined"
          inputProps={{ maxLength: 100}}
          placeholder="Write feedback here! [min 8 and max 100 char]"
          value={message}
          onInput={(e)=>{setmessage(e.target.value)}}
        />

          {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          /> */}


        {/* <InputLabel htmlFor="input-with-icon-adornment">
           Start typing recipient name.
          </InputLabel> */}
          <Input           
            label="Recipient"
            name = "Recipient"
            id="input-with-icon-adornment"
            fullWidth
            // value={recipient}
            // onInput={(e)=>setrecipient(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            }
            variant="outlined" 
            placeholder = "abc@xyz.xom"
            type="email"
            value={recipient}
            onInput={(e)=>setrecipient(e.target.value)}
            error = {status == 3? true:false}
            
          />
     
    
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            type="submit"
            onClick={(e)=>onFormSubmit(e, message, recipient)}
            endIcon={<Icon>send</Icon>}
            disabled = {message.length < 4 || !((recipient.includes("@")) || recipient.includes("."))}
          >
           Send
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form> 

       {status==0 && (<Typography component="h6" variant="subtitle1" color="primary" align="center"> <SyncIcon color="primary" /> {'Sending Feedback...!'}</Typography>)}
       {status==1 && (<Typography component="h6" variant="subtitle1" style={{ color:'#33d900' }} align="center"> <DoneIcon style={{color:'#33d900'}} /> {'Feedback Sent Successfully!'}</Typography>)}
       {status==2 && (<Typography component="h6" variant="subtitle1" color="error" align="center"> <ErrorIcon color="error"/> {'Couldn\'t send feedback!'}</Typography>)}
       {status==3 && (<Typography component="h6" variant="subtitle1" style={{color: '#d98900'}} align="center"> <WarningIcon style={{color: '#d98900'}} /> {'Please provide a valid email'}</Typography>)}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}