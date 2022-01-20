import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { sendUserRating } from '../../services/other_services';

const labels = {
  0.5: 'unsatisfied',
  1: 'unsatisfied',
  1.5: 'Poor',
  2: 'Poor',
  2.5: 'Ok',
  3: 'Ok',
  3.5: 'Good',
  4: 'Good',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
  ratingLabel:{
    fontSize:'8px',
    marginLeft: '10px'
  }
});

export default function HermesRating(props) {
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [isRated, setIsRated] = React.useState(false)
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating 
        name={"rating-"+Date.now()}
        value={value}
        precision={0.5}
        title={isRated? 'Rating can\'t be edited' : 'Rate the Response'}
        onChange={(event, newValue) => {           
          setValue(newValue);
          setIsRated(true)
          sendUserRating({query:props.query, response:props.message.text, rating:newValue})
          console.log(`Query: ${props.query}
                        Username: ${props.message.logInData.username}
                        Response: ${props.message.text}
                        Rating: ${newValue}`)
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        disabled={isRated}
      />
      {value !== null && <span className={classes.ratingLabel}>{labels[hover !== -1 ? hover : value]}</span>}
    </div>
  );
}
