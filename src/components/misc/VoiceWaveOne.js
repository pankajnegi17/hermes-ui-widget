import React, { Component } from "react";
import "./VoiceWaveOne.css";

export default class VoiceWaveOne extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  createTowers(n){
      let towers = []
      for(let i=0;i<parseInt(n);i++){
          towers.push((  <div class="bar"></div> ))
      }
      return towers
  }

  render() {
    return (
      <>
        <div id="bars">{this.createTowers(this.props.towers)}</div>
      </>
    );
  }
}
