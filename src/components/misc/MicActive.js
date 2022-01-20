import Mic from '@material-ui/icons/Mic'
import React, { Component } from 'react'
import './MicActive.css'
export default class MicActive extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (   <> 
{/* <button id="speech" class="speechbutton">
  <Mic></Mic> */}
  <div class="pulse-ring"></div>
{/* </button> */}
 
  
            </>
        )
    }
}
