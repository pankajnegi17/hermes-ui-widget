import * as React from 'react'; 
import { connect, useSelector, useDispatch  } from "react-redux";
import { Button, Icon, IconButton, Menu, MenuItem } from '@material-ui/core'; 
import { makeStyles } from "@material-ui/core/styles";
import GTranslateIcon from '@material-ui/icons/GTranslate';
import Radio from '@material-ui/core/Radio'; 
const styles = makeStyles((theme)=>({
    menuWrapper:{
    position: 'absolute',
    right: '70px', 
    }
}))

function toggleTraslitration (value){
  window.languageControl.makeTransliteratable(['chatbotInput']);
  if(!value){ 
              window.languageControl.disableTransliteration()}
  else{ window.languageControl.enableTransliteration()}
 
}

 
export default function LanguageSelection(props) { 

  const bot_language = useSelector(state => state.botType.language); 
  const dispatch = useDispatch()

  const changeLanguage = (lang)=>{ 
    if(lang == 'hi'){toggleTraslitration(true)}
    else toggleTraslitration(false)
    dispatch({type:'BOT_LANGUAGE_ACTION', payload:lang})
  }

  const classes = styles()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => { 
    setAnchorEl(null);
  };

  return (
    <div className={classes.menuWrapper}>
        <IconButton aria-label="delete"  
           id="demo-positioned-button"
           aria-controls="demo-positioned-menu"
           aria-haspopup="true"
           aria-expanded={open ? 'true' : undefined}
           onClick={handleClick}>            
           <GTranslateIcon></GTranslateIcon>
           {/* <Icon>add_circle</Icon> */}
        {/* <i class="material-icons dp48 ">add_circle_outline</i> */}
</IconButton>
      {/* <Button
        id="demo-positioned-button"
        aria-controls="demo-positioned-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
          <i class="material-icons dp48 ">add_circle_outline</i>
      </Button> */}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={()=>{changeLanguage('hi'); handleClose()}}> <Radio
        // checked={selectedValue === 'a'}
        checked = {bot_language == 'hi'}
        // onChange={handleChange}
        value="a"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'A' }}
      />Hindi</MenuItem>
        <MenuItem onClick={()=>{changeLanguage('en');handleClose()}}> <Radio
        checked={bot_language == 'en'}
         
        // onChange={handleChange}
        value="a"
        name="radio-button-demo"
        inputProps={{ 'aria-label': 'A' }}
      />Eng</MenuItem> 
      </Menu>
    </div>
  );
}
