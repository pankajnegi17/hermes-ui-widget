import React from 'react';
import './card-style.css';

const Card = (props) => {
  return (
    <div className="col s12 m8 offset-m2 offset-13"  >
    <div className="card-panel grey lighten-5 z-depth-1 margin-0">
        <div className="row valign-wrapper align-top">   
                <div className="col s2 ">
                               <a className="btn-floating btn-large waves-effect waves-light red">
                                 BOT</a>
                </div>
                <div className="col s10">
                    <span className="black-text">
                    <div style={{width:'100%', paddingRight:'30',width:'100%',maxWidth:260}}>
                      <div className="card">
                  <div className="card-image">
                    <img alt={props.payload.fields.header.stringValue} src={props.payload.fields.image.stringValue} />
                    <span className="card-title">{props.payload.fields.header.stringValue}</span>
                  </div>
                  <div className="card-content">
                    <p>{props.payload.fields.description.stringValue}</p>
                  </div>
                  <div className="card-action">
                    <a target="_blank" href={props.payload.fields.link.stringValue}>Open</a>
                  </div>
                  </div>
                  </div>
                    </span>
                </div>            
        </div>
    </div>
</div>


  )
 
}

export default Card;
