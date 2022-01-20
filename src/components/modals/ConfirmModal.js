import { Button } from '@material-ui/core'
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import './ConfirmModal.css'

export default function ConfirmModal(props) {

 //Subscribing to selected redux states
  const confirmModal = useSelector(state=>state.confirmModal)
  const dispatch = useDispatch()
  
  const [lazyLoading, setlazyLoading] = useState(false)

  const onConfirm = ()=>{
    setlazyLoading(true)
    props.onConfirm()
  }

  return (
    <>
    <div className='confirmModalWrapper'>
     <div className='confirmModalContent'> <p><b>Log out from Hermes?</b></p>
      <Button disabled={lazyLoading} onClick={onConfirm} color="secondary">Log Out</Button>
      <Button disabled={lazyLoading} onClick={props.onMinimize} color="primary">minimize</Button>
      <Button disabled={lazyLoading} onClick={props.onCancle} color="primary">cancle</Button>      
      </div>
      {lazyLoading && (<><div className='confirmLazyWrapper'><div class="ConfirmModalLoads"></div></div></>)}
    </div>
    </>
  )
}
