import React from 'react'
import TitleScreen from './TitleScreen.tsx'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Player1 from './player1'
import type { RoundObject } from '../Interfaces';
import type { GameObject } from '../Interfaces';
import {CreateGameObj} from '../Interfaces';
import { useState } from 'react'
import { useEffect } from 'react'
import type { scoreChart } from '../Interfaces';
import { useImmer } from "use-immer"

const App = () => {

  let navigate = useNavigate()

  function getScores(){
    var scoreArray: Array<number> = []
    currentGameObj.roundobjects.forEach((gameObj) =>
      scoreArray.push(gameObj.score))
    return scoreArray
  }

  const [currentGameObj, changeGameObj] = useImmer<GameObject> (CreateGameObj())
  // const [currentRounds, changeRound] = useState<RoundObject[]> ([...currentGameObj.roundobjects])
  const [roundCounter, nextRound] = useState<number>(0)////<----currentGameObj.roundobjects.length


  const updateGameObj = (gameObj: GameObject) =>{
    changeGameObj(gameObj)
      // ...prev,//prev is the copy of the state object that you can work with
      // roundobjects: prev.roundobjects.map((round, index) =>{//Maps through currentGameObj.roundobjects
      // //"round" is the actual object in each array
      // //"index" is the index of the object in the array
      //  const updatedRound = index === roundCounter ? rounddata : round
      //  return {...updatedRound, score: scoreArray[index]}})
      //   //If "index" (number) is equal to roundCounter (number), make that object in the array "rounddata"
      //   //Otherwise, make it "round"
      
    

    nextRound(prev => {//Here, we can put code for when the game is over.
      if (prev+1 !== currentGameObj.roundobjects.length){
        return prev + 1
      }
      return prev
    })
  }

  const sendGameRounds = () =>{
    return currentGameObj.roundobjects
  }

  function quitGame(){
    
    changeGameObj(draft => {
      let draftObjs = draft.roundobjects
      draft.resign = true
      draft.username1score = 0
      
      for (let x = roundCounter; x < draftObjs.length; x++){
        draftObjs[x].score = 0
        draftObjs[x].forfeit = true
        draftObjs[x].remainingTime = 0
        draftObjs[x].message = "Player Resigned"
      }
    })
    //Change page to TitleScreen
  }

  function returnToTitle(){
    navigate("/")
  }

  const changeGameObject = (event: React.ChangeEvent<HTMLSelectElement>) => { //Change GameObj from TitleModal.tsx
    console.log(event.target.value)
    switch(event.target.value){
      case "HNo":
        changeGameObj(prev => ({
          ...prev,
          hintallowed: false
        }))
        break

      case "HYes":
        changeGameObj(prev => ({
          ...prev,
          hintallowed: true
        }))
        break

      case "FNo":
        changeGameObj(prev => ({
          ...prev,
          forfeit: false
        }))
        break

      case "0":
      case "10":
      case "15":
      case "20":
        changeGameObj(prev => ({
          ...prev,
          timer: Number(event.target.value)
        }))
    }
  }

  useEffect(() => {console.log(currentGameObj)}, [currentGameObj])

  return (
      <Routes>
        <Route path="/" element={<TitleScreen changeGameObject={changeGameObject}/>} />
        <Route path="singleplayer" element={
          <Player1 
            key={roundCounter} 
            roundCounter = {roundCounter}
            roundData={currentGameObj.roundobjects[roundCounter]} 
            updateGameObj = {updateGameObj} 
            gameLength = {currentGameObj.roundobjects.length} currentScores = {getScores()} 
            sGR = {sendGameRounds}
            qg = {quitGame}
            returnToTitle = {returnToTitle}
            gameObj = {currentGameObj}/>} 
          />
          {/* The "key" here makes the component unmount and remount whenever changed.
          So it changes when roundCounter changes, which means it's going to the next round
          The mounts clear everything and reset the states
          Other pages have to go here, have to get the page managing package */}
      </Routes>
  )
}

export default App