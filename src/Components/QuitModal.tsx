import React from 'react'
import './Modal.css'

interface QuitProps {
    QuitModalState: string
    qg: () => void
    quitModal: (state: string) => void
    quitSign: ()=>void //for other Modal
    openModal: ()=>void
}

const QuitModal = ({QuitModalState, qg, quitModal, quitSign, openModal}: QuitProps) => {
  return (
    <>
      <div className = {QuitModalState}>
        <div className={"Modal"}>
          <p>Are you sure you would like to quit the game?</p>
          <p>Quitting will forfeit all points earned.</p>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>[qg(), quitModal("disappear"), quitSign(), openModal()]}>Yes, I'll return another time.</button>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>quitModal("disappear")}>No, I clicked this by mistake.</button>
        </div>
      </div>
    </>
  )
}

export default QuitModal