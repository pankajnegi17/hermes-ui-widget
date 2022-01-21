import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IncomingRequests from "../incoming-requests/IncomingRequest";
import style from "./splitBar.module.css";
import {} from "@pankajnegi17/hermes-ui-widget"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider",flex: "0 1 auto" }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Live" {...a11yProps(0)} />
          <Tab label="Call" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {value == 0 && (
        <>
          <Box
            className={style.splitBarIncoming}
          >
            <IncomingRequests></IncomingRequests>
          </Box>
          <Box
            className={style.splitBarKS}
          >
            {/* <LiveChat></LiveChat> */}
           <HermesBot></HermesBot>
          </Box>
        </>
      )}

      {value == 1 && <p>Videeo call is going on..</p>}
    </Box>
  );
}
