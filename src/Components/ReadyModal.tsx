import React from 'react'
import './Modal.css'

interface ReadyModalProps {
  ReadyFunc: () => void
  modalstate: string
}

const ReadyModal = ({ReadyFunc, modalstate}: ReadyModalProps) => {
  return (
    <>
      <div className = {modalstate}>
        <div className={"Modal"}>
          <p>Timed Game</p>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>ReadyFunc()}>Ready?</button>
            {/*New round is loaded in a separate function, after it switches to player1. When it's here, that is when the Modal for "Ready?" shows. Comes from API Call and Promise*/}
        </div>
      </div>
    </>
  )
}

export default ReadyModal