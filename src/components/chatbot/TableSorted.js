import React from 'react';
import MaterialTable from 'material-table';
import { render } from 'react-dom';
import { connect } from "react-redux";

export  class MaterialTableDemo extends React.Component{

  constructor(props){
    super(props);
    this.state ={  }
  }
 
  render(){  
     return (
    <MaterialTable
      title="Data Snapshot"
      columns={this.props.columns}
      data={this.props.data} 
      options={{
        exportButton: true,
        exportAllData: true
      }}
    />
  );
  } 
}



// const mapDispatchToProps = dispatch => {
//   return {
//     update_botStatus_inactive: () => {
//       dispatch(update_botStatus_inactive);
//     },
//     update_botTyping_to_true: () => {
//       dispatch(update_botTyping_to_true);
//       //    setTimeOut(() =>   dispatch(update_botTyping_to_true) , 3000)
//     },
//     update_botTyping_to_false: () => {
//       dispatch(update_botTyping_to_false);
//       // this.props.setTimeOut(() =>   dispatch(update_botTyping_to_false) , 3000)
//     },

//     bot_message_added: () => {
//       dispatch(bot_message_added);
//     },
//     set_talk_to_what:talk_to => { 
//       dispatch({ type: "TALK_TO_WHAT_ACTION", payload: talk_to });
//     }
//   };
// };

const mapStateToProps = state => {
  return {
    columns: state.tableListData.columns,
    data: state.tableListData.data,  
  };
};

export default connect(mapStateToProps)(MaterialTableDemo);