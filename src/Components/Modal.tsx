import React from 'react'
import './Modal.css'
import type { RoundObject } from '../Interfaces.ts';
import { useState } from 'react'
import { useEffect } from 'react'

interface ModalProps {
  roundData: RoundObject;
  modalstate: string  // This tells TypeScript that roundData is required
  closeModal: () => void
  gameLength: number
  sGR: () => RoundObject[]
}

type modalContentType = "roundStats" | "finalRound" | "gameStats"

const Modal = ({ roundData , modalstate, closeModal, gameLength, sGR}: ModalProps) => {

  const [showGameStats, openGameStats] = useState<Boolean>(false)
  var contentType: modalContentType = "roundStats"

  var roundArray = sGR()

  function modalContentchange(){
    console.log("Function was triggered.")
    openGameStats(true)
  }

  if (showGameStats){
    contentType = "gameStats"
  } else if (roundData.round_number == gameLength){
    contentType = "finalRound"
  }

  const renderContent = () =>{
    switch (contentType){
      case "roundStats":
        return (
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{roundData.message}</div>
            <div>Round: {roundData.round_number}</div>
            <div>Correctword: {roundData.correctword}</div>
            <div>Number of Guesses: {roundData.numofguesses}</div>
            <div>Hints Used: {roundData.hintused.length}</div>
            <div >Current Game Score: {roundData.score}</div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={closeModal}>{"Ready for the next round?"}</button>
          </>
        )

      case "finalRound":
        return(
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{roundData.message}</div>
            <div>Round: {roundData.round_number}</div>
            <div>Correctword: {roundData.correctword}</div>
            <div>Number of Guesses: {roundData.numofguesses}</div>
            <div>Hints Used: {roundData.hintused.length}</div>
            <div >Current Game Score: {roundData.score}</div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={modalContentchange}>{"End Game"}</button>
          </>
        )
      
      case "gameStats":
        return(
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>The game is finished ✅</div>
            <div>Here are your stats:</div>
            <div>Starting Game Score: 300</div>
            <div className = "modalGameInfo">
              <div>{roundData.username}</div>
              <div>Round 1</div>
              <div>Round 2</div>
              <div>Round 3</div>
              <div>Round 4</div>{/*Display goes horizontal (UserName - Round 1 - Round 2) */}

              <div>Word: </div>
              <div>{roundArray[0].correctword}</div>
              <div>{roundArray[1].correctword}</div>
              <div>{roundArray[2].correctword}</div>
              <div>{roundArray[3].correctword}</div>

              <div>Guesses</div>
              <div>{roundArray[0].numofguesses}</div>
              <div>{roundArray[1].numofguesses}</div>
              <div>{roundArray[2].numofguesses}</div>
              <div>{roundArray[3].numofguesses}</div>

              <div>Hints Used</div>
              <div>{roundArray[0].hintused.length}</div>
              <div>{roundArray[1].hintused.length}</div>
              <div>{roundArray[2].hintused.length}</div>
              <div>{roundArray[3].hintused.length}</div>

              <div>Solved?</div>
              <div>Yes</div>{/*Puts "Yes" or "No" in roundobjects*/}
              <div>No</div>
              <div>Yes</div>
              <div>Yes</div>

              <div>Points</div>
              <div>{roundArray[0].score - 300}</div>
              <div>{roundArray[1].score - 300}</div>
              <div>{roundArray[2].score - 300}</div>
              <div>{roundArray[3].score - 300}</div>
      
              <div>Score</div>
              <div>{roundArray[0].score}</div>
              <div>{roundArray[1].score}</div>
              <div>{roundArray[2].score}</div>
              <div>{roundArray[3].score}</div>

            </div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={closeModal}>{"Return to Title Screen"}</button>
          </>
        )
    }
  }

  return (
    <>
      <div className = {modalstate}>
        <div className={"Modal"}>
          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default Modal