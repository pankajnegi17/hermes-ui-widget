import React from 'react'; 
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile'; 
import PdfViewer from './PdfViewer';
import {connect} from 'react-redux'
import './imageGallery.css'

export class ImageGallery extends React.Component {

constructor(props) {
  super(props)

  this.state = { }
}

componentDidMount(){
  //Api call to get thumbnail
  //se img src with response data
}


  render(){
 
    return (
    <React.Fragment>
              <GridList className={this.props.photos.length == 1? "msg_gallary_wrapper msg_gallary_wrapper_1" : "msg_gallary_wrapper msg_gallary_wrapper_3"} cellHeight={100}  cols={this.props.photos.length == 1 ?1:2}>
          {this.props.photos && this.props.photos.map((tile) => (
            <GridListTile className="msg_gallary_item" key={tile.img} cols={tile.cols || 1}>
              <img className="gallaryItem" onClick={()=>this.props.openImageOnModal(tile.file_path)} src={tile.img} alt={tile.title} />
            </GridListTile>         
          ))}
      {this.props.file  &&
         <GridListTile key={this.props.file} cols={1}>
           <PdfViewer className="fileItems" base64data={this.props.file.replace("data:application/pdf;base64,","")}></PdfViewer> 
         {/* <embed src={tile.file.replace("data:application/pdf;base64,","")} className={classes.gallaryItem} type="application/pdf"></embed> */}
        </GridListTile>       
          }
        </GridList>
    </React.Fragment>

    );
  }
 
}

const mapDispatchToProps = dispatch => {
return{
    open_modal_for_images: (images) => {
      dispatch({type:"MODAL_IMAGE_DATA_ACTION",payload:images})
    dispatch({type:"MODAL_TYPE_ACTION", payload:"image"}) 
    dispatch({type:"MODAL_STATUS_ACTION",payload:true});   
  },
}
}

const mapStateToProps = state => {
  return { 
    isModalOpen: state.modalStatus.isOpened, 
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ImageGallery) 