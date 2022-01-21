import { Container } from "@mui/material";
import React, { useEffect } from "react";
import Layout from "../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  INCOMING_REQUEST_ADD,
  INCOMING_REQUEST_DELETE,
} from "../../redux/actions/incomingRequestActions";
import SignIn from "../Signin/Signin";
import { setSocketObject } from "../../services/handOffServices";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const themeLight = createTheme({
  palette: {
    primary: {
      main: "#433c33"
    },
    secondary: {
      main: "#ffcc80"
    },
    background: {
      default: "#e4f0e2",
    },
    text: {
      primary: "#00000",
    },
    overrides: {
      MuiButton: {
        raisedPrimary: {
          color: '#433c33',
        },
      },
    }
  },
});

const themeDark = createTheme({
  palette: {
    background: {
      default: "#222222",
    },
    text: {
      primary: "#ffffff",
    },
  },
});
export default function App() {
  const [light, setLight] = React.useState(true);
  //Redux Subscription
  const appConnection = useSelector((state) => state.appConnection);
  const userDetails = useSelector((state) => state.userDetails);
  const isSignedIn = useSelector((state) => state.userDetails.username);
  console.log(userDetails);
  console.log(appConnection);

  const dispatcher = useDispatch();

  useEffect(() => {
    console.log(appConnection);
    if (appConnection.socket != null) {
      //Initializing socket in services
      setSocketObject(appConnection.socket);
      appConnection.socket.emit("join-activeOperators");
      appConnection.socket.on("human_help", ({ data, clientSocketId }) => {
        dispatcher({
          type: INCOMING_REQUEST_ADD,
          payload: { data, clientSocketId },
        });
      });
    }
  }, [appConnection]);

  return (
    <ThemeProvider theme={light ? themeLight : themeDark}>
      <CssBaseline />
      {
        <>
          <Container sx={{ height: "96vh", paddingTop: "1rem" }}>
            {isSignedIn ? (
              appConnection.socket != null ? 
                <Layout />
                : (
                <div>loading</div>
              )
            ) : (
              <SignIn />
            )}
          </Container>
        </>
      }
    </ThemeProvider>
  );
}
