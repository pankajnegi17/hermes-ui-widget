import React, { Component } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
} from "@material-ui/core";
import styles from './MenuCard.module.css'; 

export default class MenuCard extends Component {
  render() {
    let buttons = this.props.buttons.map((e) => (
      <CardActions alignItems="center"> <Button alignItems="center" onClick={e.callback} size="large" color="primary" 
      className={styles.full_width}
      >
        {e.text}
      </Button></CardActions>
    ));
    return (
      <Card>
        <CardActionArea className={styles.menu_wrapper}> 
          <CardContent>
            {/* <Typography gutterBottom variant="h5" component="h2">
            Lizard
          </Typography> */}
            <Typography variant="body2" color="textSecondary" component="p"  className={styles.center}>
              {this.props.cardHeader}
            </Typography>
          </CardContent>
        </CardActionArea>
       {buttons}
      </Card>
    );
  }
}
