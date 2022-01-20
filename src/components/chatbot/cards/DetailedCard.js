import * as React from "react";
// import ArrowDownward from '@material-ui/icons/MoreHoriz' 
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import ArrowUpward from '@material-ui/icons/ArrowUpward'
import { 
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Icon,
  Typography,
} from "@material-ui/core"; 

import PdfCard from "./PdfCard";
import Parser from 'html-react-parser';
import './DocumentCard.css'
import { generateTextMessageData } from "../../../helpers/message_factory";

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ExpandMoreIcon() {
  return <Icon>add_circle</Icon>;
}

export default function DetailedCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel, suggestion) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

    // props.onDocSuggestionSelect(suggestion)
  };

  const createAccodion = () => {
      
      
    let ad = [];
    for (let i = 0; i <props.suggestions.length; i++) {
        
      ad.push(
        <Accordion
          expanded={expanded === "panel" + (i+1)}
          onChange={handleChange("panel" + (i+1), props.suggestions[i])}
          className = 'dc_wrapper'
        >
          <AccordionSummary
            // expandIcon={expanded=== 'panel'+(i+1)?<ArrowUpward/>:<ArrowDownward />}
            expandIcon={<ArrowDownward />}
            aria-controls="panel1bh-content"
            id={"panel" + (i+1) + "bh-header"}
          >
            <Typography  sx={{ width: '100%', flexShrink: 0 }}>
            {props.suggestions[i].main_title}
          </Typography>
       
          </AccordionSummary>
          <AccordionDetails>
              <Typography  sx={{width: '100%', flexShrink: 0}}>
              <p ><b>{props.suggestions[i].title} </b></p>
        <p> {Parser(props.suggestions[i].value)}</p>
        <a href={props.suggestions[i].url} target="_blank">Click here for more detail.</a>
                  
              </Typography>

  
          {/* <Typography variant="subtitle1" component='span' sx={{width: '100%', flexShrink: 0}}>
              <span>{props.suggestions[i].title}  </span>  
            </Typography>
            <Typography  sx={{width: '100%' , flexShrink: 0}}>
             {Parser(props.suggestions[i].value)}
            </Typography>  */}
            {/* <PdfCard
                      openPdfModal={props.openPdfModal}
                      pdfData={'asdsa'}
                      file_path = {props.suggestions[i].data}
                      filetype = 'data'
                    ></PdfCard> */}
          </AccordionDetails>
        </Accordion>
      );
    }

    return ad;
  };

  return (
    <div>
      {createAccodion()}
    </div>
  );
}
