import * as React from "react";
import ArrowDownward from '@material-ui/icons/MoreHoriz' 
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
  Typography,
} from "@material-ui/core"; 
import PdfCard from "./PdfCard";
import Parser from 'html-react-parser';
import './DocumentCard.css'

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ExpandMoreIcon() {
  return <Icon>add_circle</Icon>;
}

export default function DocumentCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const createAccodion = (n) => {
    let ad = [];
    for (let i = 0; i <props.suggestions.length; i++) {
        
      ad.push(
        <Accordion
          expanded={expanded === "panel" + (i+1)}
          onChange={handleChange("panel" + (i+1))}
          className = 'dc_wrapper'
        >
          <AccordionSummary
            expandIcon={expanded=== 'panel'+(i+1)?<></>:<ArrowDownward />}
            aria-controls="panel1bh-content"
            id={"panel" + (i+1) + "bh-header"}
          >
            {/* <Typography sx={{ width: '33%', flexShrink: 0 }}>
            General settings
          </Typography> */}
            <Typography component='span' sx={{ color: "text.secondary" }}>
              <span>{props.suggestions[i].headers.substr(0,60)}  </span>  
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Typography>
             {Parser(props.suggestions[i].headers)}
            </Typography>  */}
            <PdfCard
                      openPdfModal={props.openPdfModal}
                      pdfData={'asdsa'}
                      file_path = {props.suggestions[i].data}
                      filetype = 'data'
                    ></PdfCard>
          </AccordionDetails>
        </Accordion>
      );
    }

    return ad;
  };

  return (
    <div>
      {createAccodion(5)}
    </div>
  );
}
