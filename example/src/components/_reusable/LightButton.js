import React from 'react'
import style from './lightButton.module.css'

export default function LightButton(props) {
    return (
      <button className={style.lightButton} style={{color: props.color}}>{props.value}</button>
    )
}
