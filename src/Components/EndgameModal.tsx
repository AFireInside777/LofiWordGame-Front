import React from 'react'
import './Modal.css'
import { useState, useEffect } from 'react'
import type { RoundObject, roundComms} from '../Interfaces.ts';
import {type AuthUser} from '../api'

interface EndGameProps {
    finishedRounds: RoundObject[] | null
    modalstate: string
    user: AuthUser
    returnToTitle:  ()=>void
}
type modalContentType = "finalRound" | "gameStats" 

const EndgameModal = ({modalstate, user, returnToTitle, finishedRounds}: EndGameProps) => {

    const [contentType, switchContent] = useState<modalContentType>("finalRound")

    const getGameStats = () =>{
        switchContent("gameStats")
    }

    const contentPack = () =>{
        switch(contentType){
            case "finalRound":
                if (finishedRounds){
                    let finalRound: number = finishedRounds.length - 1
                    return (
                        <>
                            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>{user.username}, here are the final round stats!</div>
                            <div>Round: {finishedRounds[finalRound].round_number}</div>
                            <div>Correctword: {finishedRounds[finalRound].correctword}</div>
                            <div>Number of Guesses: {finishedRounds[finalRound].numofguesses}</div>
                            <div>Hints Used: {finishedRounds[finalRound].hintsused.length}</div>
                            <div >Current Game Score: {finishedRounds[finalRound].endingScore}</div>
                            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>[getGameStats()]}>{"End Game"}</button>
                        </>
                    )
                }
                break

            case "gameStats":
                if(finishedRounds){
                    return(
                        <>
                            <div style={{backgroundColor: "black", color: "white", borderRadius: "2vw", marginTop: "1vh", marginBottom: "1vh"}}>The game is finished ✅</div>
                            <div>Here are your stats:</div>
                            <div>Starting Game Score: 300</div>
                            <div className = "modalGameInfo">
                                <div>{user.username}</div>
                                <div>Round 1</div>
                                <div>Round 2</div>
                                <div>Round 3</div>
                                <div>Round 4</div>{/*Display goes horizontal (UserName - Round 1 - Round 2) */}
                                {/*Make these into functions that return the exact amount of divs for each round */}

                                <div>Word:</div>
                                <div>{finishedRounds[0].correctword}</div>
                                <div>{finishedRounds[1].correctword}</div>
                                <div>{finishedRounds[2].correctword}</div>
                                <div>{finishedRounds[3].correctword}</div>

                                <div>Guesses</div>
                                <div>{finishedRounds[0].numofguesses}</div>
                                <div>{finishedRounds[1].numofguesses}</div>
                                <div>{finishedRounds[2].numofguesses}</div>
                                <div>{finishedRounds[3].numofguesses}</div>

                                <div>Hints Used</div>
                                <div>{finishedRounds[0].hintsused.length}</div>
                                <div>{finishedRounds[1].hintsused.length}</div>
                                <div>{finishedRounds[2].hintsused.length}</div>
                                <div>{finishedRounds[3].hintsused.length}</div>

                                <div>Solved?</div>
                                <div>{finishedRounds[0].solved}</div>{/*Puts "Yes" or "No" in roundobjects*/}
                                <div>{finishedRounds[1].solved}</div>
                                <div>{finishedRounds[2].solved}</div>
                                <div>{finishedRounds[3].solved}</div>

                                <div>Points</div>
                                <div>{finishedRounds[0].startingScore - finishedRounds[0].endingScore}</div>
                                <div>{finishedRounds[1].startingScore - finishedRounds[1].endingScore}</div>
                                <div>{finishedRounds[2].startingScore - finishedRounds[2].endingScore}</div>
                                <div>{finishedRounds[3].startingScore - finishedRounds[3].endingScore}</div>
                        
                                <div>Score</div>
                                <div>{finishedRounds[0].endingScore}</div>
                                <div>{finishedRounds[1].endingScore}</div>
                                <div>{finishedRounds[2].endingScore}</div>
                                <div>{finishedRounds[3].endingScore}</div>

                            </div>
                            <button style={{borderRadius: "2vw", marginBottom: "1vh", marginTop: "1vh", width: "98%"}} onClick={()=>returnToTitle()}>{"Return to Title Screen"}</button>
                        </>
                        )
                }
        }
    }

    return (
    <div className={modalstate}>
      <div className={"Modal"}>
        {contentPack()}
      </div>
    </div>
    )
          
}

export default EndgameModal