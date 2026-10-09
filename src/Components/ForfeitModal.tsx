import React from 'react'
import './Modal.css'

interface ForfeitProps {
    ForfeitModalState: string
    confirmForfeit: () => void
    forfeitModal: (state: string) => void
}

const ForfeitModal = ({ForfeitModalState, confirmForfeit, forfeitModal}:ForfeitProps) => {
  return (
    <>
      <div className = {ForfeitModalState}>
        <div className={"Modal"}>
          <p>Are you sure you would like to forfeit this round?</p>
          <p>Forfeiting will cost 65 points.</p>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={confirmForfeit}>Yes, take the points.</button>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>forfeitModal("disappear")}>Don't touch my 65!</button>
        </div>
      </div>
    </>
  )
}

export default ForfeitModal