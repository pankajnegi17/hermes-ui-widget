import React from "react";
import { render } from "react-dom";
// import '../style.css';
import SelectSearch from "react-select-search";
import get_Picture from "../../helpers/user_profile_servies";

export default class ListEmployees extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.renderFriend = this.renderFriend.bind(this);
  }

  state = {
    disabled: false,
    friends: [],
  };

  clear = () => {
    this.setState({
      font: "",
      country: "",
      friends: [],
    });
  };

  disable = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  renderFriend(props, option, snapshot, className) {
    //     <button {...this.props} className={className} type="button">
    //     <span><img alt="" style={imgStyle} width="32" height="32" src={option.photo} /><span>{option.name}</span></span>
    // </button>   
    return (
<li
        class="collection-item avatar"
        onClick={option.username == "bot@hermes"? ()=>{this.props.set_talk_to_what("bot"); return;}: () => {  
          // this.props.set_partner_details(option.name);
          return this.props.talkToSomeOne(option);
        }}
      >

        
        {/* <i class="material-icons dp48  circle list-avatar-color">
  account_circle
</i> */}

        <img
          class="material-icons dp48  circle list-avatar-color"
          src={get_Picture(option.username)}
        ></img>
        <div class="user-list-wrapper">
          <span class="title">{option.name}</span>
          <p>{option.username}</p>
        </div>
      </li>
    );
  }

  
  componentDidMount() { 
    //Setting DP

    let friends = [];
    this.props.listItems.map((item) => {
      friends.push({
        name: item.fname,
        lname:item.lname,
        value: item.fname,
        username: item.username,
        photo: "https://randomuser.me/api/portraits/women/22.jpg",
      });
    });

    this.setState({ friendsList: friends });
  }

  updateFriends = (value) => {
    return this.setState({ friends: value });
  };

  render() {
    const text = this.state.disabled ? "Enable" : "Disable"; 
    return (
      <React.Fragment>
        {/* <i class="material-icons dp48 back-button-employee-list" onClick={()=>this.props._onEmployeeListBackButton(false)}>art_track</i> */}
        <ul className="collection no-border overflow-scroll">
          <SelectSearch
            multiple
            className="select-search-box select-search-box--friends select-search-box--multiple"
            value={this.state.friends}
            onChange={this.updateFriends}
            options={this.state.friendsList}
            placeholder="Search friends"
            renderOption={this.renderFriend}
            disabled={this.state.disabled}
            search
          />
        </ul>
      </React.Fragment>
    );
  }
}
