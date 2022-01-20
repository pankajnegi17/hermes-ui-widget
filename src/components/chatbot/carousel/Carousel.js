import React, { Component } from "react";
import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./carousel.css";
import Base64Downloader from 'react-base64-downloader'; 
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'

class StaticCarousel extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render(){ 

        // let allImages = this.props.images.map(image=>{
        //     return (
        //         <div>
        //         <img src={image} />
        //         {/* <p className="legend">
        //         sdfsfsdfs
        //         </p> */}
        //         </div>
        //     )
        // })
        return ( 
          <div className="modal-image-wrapper"> 
       <div className="pos-top-right"><Base64Downloader  base64={this.props.images} downloadName= 'IMG_Hermes_Chat'>
          <Button variant="contained" color="primary">
 Download
</Button>
</Base64Downloader>
           </div>   
              <img className="modal-image" src={this.props.images} />
 
          </div>
            
          

          
        )
    }
}


const mapStateToProps = (state)=>{
return {
    images: state.modalStatus.images
}
}

const mapDispatchersToProps = (dispatcher)=>{
    return{

    }
}
export default connect(mapStateToProps,mapDispatchersToProps)(StaticCarousel);