import React, { Component } from "react"; 
import { connect } from "react-redux";
import axios from "axios/index";
import {chatbot_api_host} from '../../config.js'

export class AgentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      designations: [],
    };
 
    this.fetchDesignationsList = this.fetchDesignationsList.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
  }

 

  async fetchDesignationsList() {
    await axios
      .get(chatbot_api_host+'/getDesignationListByTeamID?team="BOTAIML"')
      .then(
        function (response) {
           
          this.setState({ designations: response.data });
        }.bind(this)
      );
  }

  componentDidMount() {
    //this.fetchDesignationsList();
  }

  async fetchEmployees(designation) {
    await axios
      .get(
        'http://localhost:5000/getEmployeesListByDesignation?designation='+designation
      )
      .then((response) => {
        this.props.toggleDesignation(true, response.data);
      })
      .catch((err) => {});
  }
  render() {
    let designationList = this.state.designations.map((item,i) => (
      <li key={i} class="collection-item list-item-transparent">
        <div
          className="menu_text_wrapper"
          onClick={() => this.fetchEmployees(item.designation)}
        >
          {item.designation}
          <a href="#!" class="secondary-content">
            <i class="material-icons">send</i>
          </a>
        </div>
      </li>
    ));

    return (
      <ul class="collection with-header open-menu-inner-wrapper overflow-scroll">
        <li class="collection-header list-header-transparent">
          <h4>Live Agents</h4>
        </li>
        {designationList}
      </ul>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    set_talk_to_what: (talk_to) => {
      dispatch({ type: "TALK_TO_WHAT_ACTION", payload: talk_to });
    },
    set_conversation_id: (id) => {
      dispatch({ type: "CONVERSATION_ID_ACTION", payload: id });
    },
    set_group_id: (id) => {
      dispatch({ type: "GROUP_ID_ACTION", payload: id });
    },
    set_to_participantID: (id) => {
      dispatch({ type: "TO_PARTICIPANT_ID_ACTION", payload: id });
    },
    set_from_participantID: (id) => {
      dispatch({ type: "FROM_PARTICIPANT_ID_ACTION", payload: id });
    },
  };
};

const mapStateToProps = (state) => {
  return {
    talk_to_what: state.talk_to_what.name,
    logInData: state.logInStatus,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AgentList);
