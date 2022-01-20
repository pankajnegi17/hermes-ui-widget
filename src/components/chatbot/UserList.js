import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText'; 
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import userData from '../../data/userData.json'
import get_Picture from "../../helpers/user_profile_servies";

export default class UserList extends Component {



    render() {
        const users = userData.users.map(user =>  <ListItem onClick = {()=> this.props.on_userSelect(user)}>          
            <ListItemAvatar>
              <Avatar>
                <img src={get_Picture(user.username)} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.firstName+" "+user.lastName}
              secondary={user.username}
            />
          </ListItem>)
        return  <List>
       {users}
      </List>
    }
}





 