import React,{Component} from 'react';
import HyperModal from 'react-hyper-modal';
import { connect } from "react-redux";
import {
    close_modal,
    open_modal
  } from "../../store/actions/modalStatusAction";
  import './ModalOne.css'; 
  import EnhancedTable from '../chatbot/TableSorted'
  import ImageSlider from '../chatbot/ImageSlider'

class ModalFullScreen extends Component{
    constructor(props){
        super(props); 
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this); 
    }

    
    
    openModal(){
        this.props.open_modal()
    }  
    closeModal(){
        this.props.close_modal()
    } 

    render(){
       
        return ( 
 <HyperModal
            isOpen={this.props.isOpened}
            requestClose={this.closeModal}
            // unmountOnClose= {true}
          >
            {this.props.modalType =="iframe" &&
            <iframe ref="ref_modal_src" className="modal-wrapper" src={this.props.modalUrl} frameBorder="0" allowFullScreen></iframe>
            }

            {this.props.modalType == "dataList" && <EnhancedTable />}

            {this.props.modalType == "image" && <ImageSlider />}           
</HyperModal>            
        )
    } 
}


const mapDispatchToProps = dispatch => {
    return {
        close_modal: () => { 
        dispatch(close_modal);        
      },
     open_modal: () => {
        dispatch(open_modal);
        //    setTimeOut(() =>   dispatch(update_botTyping_to_true) , 3000)
      } 
    };
  };
  
  const mapStateToProps = state => {
    return {
      isOpened: state.modalStatus.isOpened,       
      modalUrl: state.modalStatus.modal_url,
     modalType: state.modalStatus.modal_type
    };
  };
export default connect(mapStateToProps, mapDispatchToProps)(ModalFullScreen);