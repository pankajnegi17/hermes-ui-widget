import React,{Component} from 'react'; 
import {connect} from 'react-redux';
import {update_botStatus_inactive,update_botStatus_active} from '../../store/actions/botStatusAction'
import Draggable from 'react-draggable'; // The default
import {DraggableCore} from 'react-draggable'; // <DraggableCore>
import './minimizedChabot.css'
import chat_icon from '../../images/Bot-Academy-logo-head-1920.png' 
import styles from './MinimizedChatbot.module.css'
class MinimizedChatbot extends Component{

 render(){
    let isDragging = false;
        return (          
            <Draggable   
            bounds= 'parent'
            handle=".chatIcon"
            // onMouseUp={   this.props.update_botStatus_active()}   
            onDrag={() => { isDragging=true}}
            onStop={() => { 
              if(!isDragging){
                this.props.update_botStatus_active();
              }
              isDragging=false;                   
              //console.log("On drag stop")
            }} 
            > 
            {/* <div className= { !this.props.isOpened ? 'minchatwindow active'  :'minchatwindow ' }> */}
            <div         
            div className= { !this.props.isOpened ? 'minimizedChatWrapper active'  :'minimizedChatWrapper' }  >
               {this.props.notifications && this.props.notifications.length > 0 && (<div class="TopCloseButton mini-notification" tabindex="0"><i class="material-icons dp48">add_alert</i>{this.props.notifications.length}</div>)}
            <img draggable="false" src={chat_icon} className="chatIcon"></img>
            </div>    
            {/* </div> */}
            </Draggable>     
        )
    }
}


const mapDispatchToProps = dispatch =>{
    return{ 
        update_botStatus_active:()=>{dispatch(update_botStatus_active)}
    }
  }
  
  const mapStateToProps = state =>{
      return{
        isOpened:state.botStatus.isOpened,
        talk_to_what: state.talk_to_what.name,
        notifications: state.notifications
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(MinimizedChatbot) ;
 