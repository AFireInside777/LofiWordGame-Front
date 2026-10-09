import React from 'react'
import './Modal.css'
import type { RoundObject } from '../Interfaces.ts';
import { useState } from 'react'
import { useEffect } from 'react'
import type { userReady } from '../Interfaces'

interface ModalProps {
  roundsData: Array<RoundObject>;
  modalstate: string
  gamequit: boolean  // This tells TypeScript that roundData is required
  closeModal: (indicator: string) => void
  readyStat: userReady
  returnToTitle: () => void
  roundCounter: number
}

type modalContentType = "roundStats" | "finalRound" | "gameStats" | "Ready"

const Modal = ({roundsData, roundCounter, modalstate, closeModal, readyStat, gamequit, returnToTitle}: ModalProps) => {

  const [showGameStats, openGameStats] = useState<Boolean>(false)
  var contentType: modalContentType = "roundStats"
  var currentRound: RoundObject = roundsData[roundCounter]
  

  function modalContentchange(){
    console.log("Function was triggered.")
    openGameStats(true)
  }

  if (showGameStats || gamequit){
    contentType = "gameStats"
  } else if (currentRound.round_number == roundsData.length){
    contentType = "finalRound"
  } else if (readyStat.player === "Not Ready"){
    contentType = "Ready"
  } 

  const renderContent = () =>{
    switch (contentType){
      case "roundStats":
        return (
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{currentRound.message}</div>
            <div>Round: {currentRound.round_number}</div>
            <div>Correctword: {currentRound.correctword}</div>
            <div>Number of Guesses: {currentRound.numofguesses}</div>
            <div>Hints Used: {currentRound.hintused.length}</div>
            <div>Current Game Score: {currentRound.score}</div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>closeModal("round")}>{"Ready for the next round?"}</button>
          </>
        )

      case "finalRound":
        return(
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{currentRound.message}</div>
            <div>Round: {currentRound.round_number}</div>
            <div>Correctword: {currentRound.correctword}</div>
            <div>Number of Guesses: {currentRound.numofguesses}</div>
            <div>Hints Used: {currentRound.hintused.length}</div>
            <div >Current Game Score: {currentRound.score}</div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>[closeModal("endgame"),modalContentchange()]}>{"End Game"}</button>
          </>
        )

      case "gameStats":
        return(
          <>
            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>The game is finished ✅</div>
            <div>Here are your stats:</div>
            <div>Starting Game Score: 300</div>
            <div className = "modalGameInfo">
              <div>{currentRound.username}</div>
              <div>Round 1</div>
              <div>Round 2</div>
              <div>Round 3</div>
              <div>Round 4</div>{/*Display goes horizontal (UserName - Round 1 - Round 2) */}

              <div>Word: </div>
              <div>{roundsData[0].correctword}</div>
              <div>{roundsData[1].correctword}</div>
              <div>{roundsData[2].correctword}</div>
              <div>{roundsData[3].correctword}</div>

              <div>Guesses</div>
              <div>{roundsData[0].numofguesses}</div>
              <div>{roundsData[1].numofguesses}</div>
              <div>{roundsData[2].numofguesses}</div>
              <div>{roundsData[3].numofguesses}</div>

              <div>Hints Used</div>
              <div>{roundsData[0].hintused.length}</div>
              <div>{roundsData[1].hintused.length}</div>
              <div>{roundsData[2].hintused.length}</div>
              <div>{roundsData[3].hintused.length}</div>

              <div>Solved?</div>
              <div>Yes</div>{/*Puts "Yes" or "No" in roundobjects*/}
              <div>No</div>
              <div>Yes</div>
              <div>Yes</div>

              <div>Points</div>
              <div>{roundsData[0].score - 300}</div>
              <div>{roundsData[1].score - 300}</div>
              <div>{roundsData[2].score - 300}</div>
              <div>{roundsData[3].score - 300}</div>
      
              <div>Score</div>
              <div>{roundsData[0].score}</div>
              <div>{roundsData[1].score}</div>
              <div>{roundsData[2].score}</div>
              <div>{roundsData[3].score}</div>

            </div>
            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>returnToTitle()}>{"Return to Title Screen"}</button>
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