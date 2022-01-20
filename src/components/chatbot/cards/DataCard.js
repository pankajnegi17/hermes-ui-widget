import React, { Component } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";
export default class DataCard extends Component {
  render() {
    
    const datacard = this.props.datacard
   
    return (

        <Card  >
      <CardContent>
        <Typography  color="textSecondary" variant="button" gutterBottom>
        STATUS: {datacard["Status"]}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
        Amount Approved: {datacard["Amount Approved"]}
        </Typography> 
        <Typography variant="body2" component="p">
    {datacard.remarks}
          <br /> 
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
 
 
    );
  }
}
