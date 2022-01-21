import { 
        Box, Container, Grid, Typography, Card, Button,
        CardContent, CardHeader, Divider, TextField,
        Avatar
        } from '@mui/material';
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { VIEW_USER_DETAILS } from '../../redux/actions/userdetailActions'


const states = [
    {
      value: 'karnataka',
      label: 'Karnataka'
    },
    {
      value: 'tamilnadu',
      label: 'Tamil Nadu'
    },
    {
      value: 'kerala',
      label: 'Kerala'
    }
  ];
  
  const cities = [
    {
      value: 'banahatti',
      label: 'Banahatti'
    },
    {
      value: 'bengaluru',
      label: 'Bengaluru'
    },
    {
      value: 'dharwad',
      label: 'Dharwad'
    }
  ];
  
  const countries = [
    {
      value: 'india',
      label: 'India'
    },
    {
      value: 'germany',
      label: 'Germany'
    },
    {
      value: 'israel',
      label: 'Israel'
    }
  ];

export const Profile = (props) => {
    const theme = createTheme();
    const dispatcher = useDispatch();

    const [values, setValues] = useState({
        avatar: './static/media/hermes.50a63da2.jpg',
        firstName: 'Kavita',
        lastName: 'Kumar',
        email: 'kavita@hermes.com',
        phone: '',
        city: 'Banahatti',
        pin: '587311',
        state: 'Karnataka',
        country: 'India'
      });
    
      const handleChange = (event) => {
        setValues({
          ...values,
          [event.target.name]: event.target.value
        });
      };
      
    const handleClose = (e) => {
        e.preventDefault() 
        if (true) {
        let result = dispatcher({
            type: VIEW_USER_DETAILS,
            payload: {viewProfile: false},
        });
        }
    }
    return (
        <>
            <Card
            component="main"
            sx={{
                flexGrow: 1,
                py: 4,
                bgcolor: '#fffff5',
                margin: 1,
            }}
            >
                <Container maxWidth="lg">
                    <Grid
                    container
                    spacing={3}
                    alignItems='center'
                    >
                        <Grid
                            item
                            lg={4}
                            md={4}
                            xs={12}
                        >
                        <>
                            <Card {...props} sx={{ boxShadow: 'none', backgroundColor: 'transparent'}}>
                            <CardContent>
                                <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                >
                                <Avatar
                                    src={values.avatar}
                                    sx={{
                                    height: 100,
                                    mt: 2,
                                    mb: 2,
                                    width: 100
                                    }}
                                />
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                >
                                    {`${values.firstname} ${values.lastname}`}
                                </Typography>
                                </Box>
                            </CardContent>
                            <Box
                                sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 2
                                }}
                            >
                                <Button
                                color="warning"
                                fullWidth
                                variant="outlined"
                                >
                                Upload picture
                                </Button>
                            </Box>
                            </Card>
                        </>
                        </Grid>
                        <Grid
                            item
                            lg={8}
                            md={8}
                            xs={12}
                        >
                            <form
                            autoComplete="off"
                            noValidate
                            {...props}
                            >
                            <Card sx={{ boxShadow: 'none', backgroundColor: 'transparent'}}>
                                <div style={{ display: 'flex'}}>
                                    <CardHeader
                                        subheader="Update Account Profile"
                                        title="Profile"
                                        sx={{ flex: '1 1 auto' }}
                                    >
                                    </CardHeader>
                                    <IconButton
                                        size="medium"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={(e => handleClose(e))}
                                        color="inherit"
                                        sx={{ flex: '0 0 auto', justifyContent: 'end', height: '100%' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                            <CardContent>
                                <Grid
                                container
                                spacing={3}
                                >
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    helperText="Please specify the first name"
                                    label="First name"
                                    name="firstName"
                                    onChange={handleChange}
                                    required
                                    value={values.firstName}
                                    variant="outlined"
                                    color="warning"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Last name"
                                    name="lastName"
                                    onChange={handleChange}
                                    required
                                    value={values.lastName}
                                    variant="outlined"
                                    color="warning"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    onChange={handleChange}
                                    required
                                    value={values.email}
                                    variant="outlined"
                                    color="warning"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    onChange={handleChange}
                                    value={values.phone}
                                    variant="outlined"
                                    color="warning"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Select City"
                                    name="city"
                                    onChange={handleChange}
                                    required
                                    select
                                    SelectProps={{ native: true }}
                                    value={values.city}
                                    variant="outlined"
                                    color="warning"
                                    >
                                    {cities.map((option) => (
                                        <option
                                        key={option.value}
                                        value={option.value}
                                        >
                                        {option.label}
                                        </option>
                                    ))}
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Pin Code"
                                    name="pin"
                                    onChange={handleChange}
                                    value={values.pin}
                                    variant="outlined"
                                    color="warning"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Select State"
                                    name="state"
                                    onChange={handleChange}
                                    required
                                    select
                                    SelectProps={{ native: true }}
                                    value={values.state}
                                    variant="outlined"
                                    color="warning"
                                    >
                                    {states.map((option) => (
                                        <option
                                        key={option.value}
                                        value={option.value}
                                        >
                                        {option.label}
                                        </option>
                                    ))}
                                    </TextField>
                                </Grid>
                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                >
                                    <TextField
                                    fullWidth
                                    label="Select Country"
                                    name="country"
                                    onChange={handleChange}
                                    required
                                    select
                                    SelectProps={{ native: true }}
                                    value={values.country}
                                    variant="outlined"
                                    color="warning"
                                    >
                                    {countries.map((option) => (
                                        <option
                                        key={option.value}
                                        value={option.value}
                                        >
                                        {option.label}
                                        </option>
                                    ))}
                                    </TextField>
                                </Grid>
                                </Grid>
                            </CardContent>
                            {/* <Divider /> */}
                            <Box
                                sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 2
                                }}
                            >
                                <Button
                                color="warning"
                                variant="contained"
                                >
                                Save details
                                </Button>
                            </Box>
                            </Card>
                            </form>
                    </Grid>
                    </Grid>
                </Container>
            </Card>
        </>
        );
    }
