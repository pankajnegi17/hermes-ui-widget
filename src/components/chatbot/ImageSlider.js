import React, { Component } from 'react';
import bg from '../../images/Slide7.jpg';
import bg2 from '../../images/Slide8.jpg';
import bg3 from '../../images/Slide9.jpg';
import bg4 from '../../images/Slide10.jpg';

export class ImageSlider extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             imagePath:bg,
             clickCount:0
        }

        this.onImageClick=this.onImageClick.bind(this);
    }

    componentDidMount(){
        //console.log("Slider Mounted... ")
        this.setState({clickCount:1})
    }

    shouldComponentUpdate(p,s){

       // this.onImageClick()
        //console.log("Should Slider Update... ")
        return true;
    }
     
    onImageClick(image){
         
        this.setState({clickCount:this.state.clickCount+1});

     

       switch(this.state.clickCount){

        case 0:{
            this.setState({imagePath:bg});
            break;
           }

           case 1:{
            this.setState({imagePath:bg2});
            break;
           }
              
            case 2:{
            this.setState({imagePath:bg3});
            break; 
            }
            case 3:{
                this.setState({imagePath:bg4});
                break; 
                }                 
             default:{
                 this.setState({clickCount:1});
                 this.setState({imagePath:bg})
                 break;
             } 
       }
    }

    render() {
 
        return (
            <div className="image-slider-wrapper">
               <img className="slider-image" onClick={()=>this.onImageClick(bg)} src={this.state.imagePath}></img>
            </div>
        )
    }
}

export default ImageSlider
