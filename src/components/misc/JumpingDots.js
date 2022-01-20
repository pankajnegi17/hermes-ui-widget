import React from "react";
import "./JumpingDots.css";

export default function JumpingDots(props) {
  const createDots = (n) => {
      let dots = []
      for(let i=0;i<n;i++){
          dots.push((<span class="dot"></span>))
      }
    return dots;
  };
  return (
    <>
      <div id="wave">{createDots(parseInt(props.noOfDots))}</div>
    </>
  );
}
