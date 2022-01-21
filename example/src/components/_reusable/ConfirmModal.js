 
import { Button } from '@mui/material'
import React, {useState} from 'react' 
import style from './confirmModal.module.css'

export default function ConfirmModal(props) {

 //Subscribing to selected redux states
 //TODO
  
  const [lazyLoading, setlazyLoading] = useState(false)

  const onConfirm = ()=>{
    setlazyLoading(true)
    // props.onConfirm()
  }

  return (
    <>
    <div className={style.confirmModalWrapper}>
     <div className={style.confirmModalContent}> <p><b>Log out from Hermes?</b></p>
     <Button disabled={lazyLoading} onClick={()=>alert("Accept")} color="secondary">Accept</Button>
      <Button disabled={lazyLoading} onClick={()=>alert("Reject")} color="primary">Reject</Button>  
      </div>
      {lazyLoading && (<><div className={style.confirmLazyWrapper}><div className={style.ConfirmModalLoads}></div></div></>)}
    </div>
    </>
  )
}
