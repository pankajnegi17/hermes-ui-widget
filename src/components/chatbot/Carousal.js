import React, { Component } from 'react'; 
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
 
export default class MyCarousel extends Component {
    render() {
let imageItems = this.props.images.map(item=>{
    return (
        <div>
        <img src={item}/> 
    </div>
    )
})

        return (
            <Carousel>
              {imageItems}
            </Carousel>
        );
    }
}