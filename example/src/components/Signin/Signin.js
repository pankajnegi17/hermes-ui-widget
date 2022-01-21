import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { UPDATE_USER_DETAILS } from "../../redux/actions/userdetailActions";
import { ADD_CONNECTION } from "../../redux/actions/appConnectionActions";
import socketIOClient from "socket.io-client";
import { app_server_url } from "../../config";
import SigninAvatar from '../../static/images/hermes.50a63da2.jpg'

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.darkSecondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://botaiml.com/">
        BOTAIML Pvt Ltd.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn(props) {
  const dispatcher = useDispatch();
  const [userDetails, setUserDetails] = React.useState({
    username: '',
    fName: '',
    lName: '',
    email: '',
    password: ''
  });
  
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })
 const [errors, setErrors]  = React.useState({});


 const handleChange = e => {
   const { name, value } = e.target
   setValues({
         ...values,
         [name]: value
   })

   return { handleChange, values };
  }

  React.useEffect(() => {
      validate(values);
  }, [values]);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log(values);
    console.log(Object.keys(errors).length);
    
    if(Object.keys(errors).length === 0)
    {
      console.log('setting userDetails');
      setUserDetails({
        username: data.get("email"),
        email: data.get("email"),
        password: data.get("password"),
        fName: "First Name",
        lName: "Last Name",
      });
    }
    return { handleSubmit, values, errors }; 
}

 function validate(values) {
      //Email errors
       const errors = {};
       if (!values.email) {
           errors.email = 'Email is required'
       } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) 
           {
           errors.email = 'Invalid email address';
       }
       //Password Errors
       if(!values.password ){
         errors.password = 'Password is required'
       } else if( values.password.length < 6) {
           errors.password = 'Password needs to be 6 characters or more'
       }
        setErrors(errors);
     }
  
  React.useEffect(() => {
    //effect
    console.log(userDetails);

    if (userDetails.email && userDetails.password) {

      let result = dispatcher({
        type: UPDATE_USER_DETAILS,
        payload: userDetails,
      });

      if (result.type === UPDATE_USER_DETAILS) {
        let userWS = socketIOClient.connect(app_server_url, {
          secure: true,
        });
        dispatcher({ type: ADD_CONNECTION, payload: userWS });
      }
    }
  }, [userDetails]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "transparent" }}>
            {/* <LockOutlinedIcon /> */}
            <img src={SigninAvatar} width="100%"/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to Hermes as Agent
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              color="warning"
              // className='form-input'
              value={values.email}
              onChange={handleChange}
                          
            />
              {errors.email && <span style={{ color: 'orangered'}}>{errors.email}</span>}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              color="warning"
              value={values.password}
              onChange={handleChange}
            
            />
            {errors.password && <span style={{ color: 'orangered'}}>{errors.password}</span>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
              sx={{ mt: 3, mb: 2 }}
              
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}