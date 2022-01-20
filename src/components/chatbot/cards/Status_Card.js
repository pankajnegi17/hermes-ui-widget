import React, { Component } from "react";
import Divider from '@material-ui/core/Divider';
import Parser from 'html-react-parser';

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";
export default class StatusCard extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

  createCardItems(items){ 
    let cardItems = []
  for (const item in items) {
    cardItems.push(  (<><Typography  color="textSecondary" gutterBottom>
    {item}: <b>{Parser(items[item])}</b>
    </Typography>  <Divider /></>) ) 
}
return cardItems;
  }
  
  render() {
    
    const statuscard = this.props.statuscard
   
    return (
        <Card  style={{'boxShadow': 'none'}}>
      <CardContent> 
      {this.createCardItems(statuscard)}
      </CardContent>
      {/* <CardActions>
      </CardActions> */}
    </Card>
 
 
    );
  }
}
