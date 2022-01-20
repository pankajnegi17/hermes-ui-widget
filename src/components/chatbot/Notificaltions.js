import React, { Component } from "react";
import get_Picture from "../../helpers/user_profile_servies";
import noti_styles from './NotificationsTab.module.css'
import { connect } from "react-redux";

export class Notifications extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       
    } 
  }
 



  
  render() {
    console.warn(this.props.fresh_notifications)
    
      if(this.props.all_notifications.length == 0){
        return (<><h1>You do not have any Notification!</h1></>)
      }
      let notifications_items = this.props.all_notifications.map(notification=>{
          return ( <div className={noti_styles.notifiitem} onClick={()=>this.props.onNotificationItemClicked(notification)}>
          <img className={noti_styles.notifiitem_img} src={get_Picture(notification.from)} alt="img" />
          <div className={noti_styles.noti_content}>
          <h4 className={noti_styles.notifiitem_heading}><b>{notification.fname}</b> Send <b> {notification.count}</b> new messages</h4>
            {/* <p className={noti_styles.notifiitem_paragraph}>{messageText}</p>  */}
          </div>
        </div>)
      })
      return ( <>
      {notifications_items}
      </> );
  }
}

const mapStateToProps = (state) => {
    return { 
      logInStatus: state.logInStatus,
      conversationData: state.conversationData, 
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
        set_group_name: (name)=>{
            dispatch({type:'GROUP_NAME_ACTION', payload:name})
          },
          set_group_type: (type)=>{
            dispatch({type:'GROUP_TYPE_ACTION', payload:type})
          }
    }}
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications);
 

