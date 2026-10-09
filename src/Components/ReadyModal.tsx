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
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={ReadyFunc}>Ready?</button>
        </div>
      </div>
    </>
  )
}

export default ReadyModal