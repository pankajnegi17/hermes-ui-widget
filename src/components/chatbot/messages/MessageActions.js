import React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export default function MessageActions(props) {
    return (
    <>
    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
     {   props.actions.map(action=>{
            return (<Button size="small"  onClick={action.onClick}>{action.value}</Button>)
        })}
        
     </ButtonGroup>
    </>    
    )
}
