import './Modal.css'
import type { RoundObject, roundComms} from '../Interfaces.ts';
import {type AuthUser} from '../api.ts'
import { useState, useEffect } from 'react'


interface ModalProps {

  modalstate: string
  closeModal: (indicator: string) => void
  user: AuthUser
  round: RoundObject | null
}

const Modal = ({round, closeModal, user, modalstate}: ModalProps) => {

  useEffect(()=>{}, [round])

  const returnContent = () => {
    if(round){
      return (
        <>
          <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{user.username}, here are this round's stats!</div>
          <div>Round: {round.round_number}</div>
          <div>Correctword: {round.correctword}</div>
          <div>Number of Guesses: {round.numofguesses}</div>
          <div>Hints Used: {round.hintsused != null ? round.hintsused.length : 0}</div>
          <div>Current Game Score: {round.endingScore}</div>
          <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>closeModal("round")}>{"Ready for the next round?"}</button>
        </>
      )
    }else{
      return (
        <>
          <div>Loading...</div>
        </>
      )
    }
  }

  return (
    <div className={modalstate}>
      <div className={"Modal"}>
        {returnContent()}
      </div>
    </div>
  )

}
     


export default Modal