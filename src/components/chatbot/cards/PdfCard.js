import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import pdfImage from '../../../images/pdf.jpg'
import axios from 'axios/index'
import {chatbot_api_host} from '../../../config'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});


const getFile = async (file_path, filetype ='url')=>{
  let linkSource = ""
if(filetype == 'url'){ 
  let response = await axios.post(chatbot_api_host+"/getFile", {file_path:file_path})   
  linkSource = `data:application/pdf;base64,${response.data}`;
}

else{
  linkSource = `data:application/pdf;base64,${file_path}`;
}
  const downloadLink = document.createElement("a");
  const fileName = "File"+Date.now()+".pdf";
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
    
}

export default function PdfCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={pdfImage}
          title="Contemplative Reptile"
        />
        <CardContent>
          {/* <Typography gutterBottom variant="h5" component="h2">
            Lizard
          </Typography> */}
          {/* <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography> */}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={()=>props.openPdfModal(props.file_path, props.filetype)} size="small" color="primary">
          Open
        </Button>

        <Button onClick={()=>getFile(props.file_path, props.filetype)} size="small" color="primary">
        Download  
        </Button>
      </CardActions>
    </Card>
  );
}