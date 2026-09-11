import React from 'react'
import TitleScreen from './TitleScreen.tsx'
import Player1 from './player1'
import type { RoundObject } from '../Interfaces';
import type { GameObject } from '../Interfaces';
import {CreateGameObj} from '../Interfaces';
import { useState } from 'react'
import { useEffect } from 'react'
import type { scoreChart } from '../Interfaces';


const App = () => {

  function getScores(){
    var scoreArray: Array<number> = []
    currentGameObj.roundobjects.forEach((gameObj) => scoreArray.push(gameObj.score))
    return scoreArray
  }

  const [currentGameObj, changeGameObj] = useState<GameObject> (CreateGameObj())
  // const [currentRounds, changeRound] = useState<RoundObject[]> ([...currentGameObj.roundobjects])
  const [roundCounter, nextRound] = useState<number>(0)////<----currentGameObj.roundobjects.length

  //Function that collects round info from Player1, puts it in to GameObject
  //Changes the RoundObject
  const updateGameObj = (rounddata: RoundObject, scoreArray: Array<number>) =>{


    changeGameObj(prev => ({
      ...prev,//prev is the copy of the state object that you can work with
      roundobjects: prev.roundobjects.map((round, index) =>{//Maps through currentGameObj.roundobjects
      //"round" is the actual object in each array
      //"index" is the index of the object in the array
       const updatedRound = index === roundCounter ? rounddata : round
       return {...updatedRound, score: scoreArray[index]}})
        //If "index" (number) is equal to roundCounter (number), make that object in the array "rounddata"
        //Otherwise, make it "round"
    }))

    //put a function here for if they win

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

  useEffect(() => {console.log(currentGameObj)}, [currentGameObj])


  return (
    <Player1 key={roundCounter} roundData={currentGameObj.roundobjects[roundCounter]} updateGameObj = {updateGameObj} gameLength = {currentGameObj.roundobjects.length} currentScores = {getScores()} sGR = {sendGameRounds}/> 
    //The "key" here makes the component unmount and remount whenever changed.
    //So it changes when roundCounter changes, which means it's going to the next round
    //The mounts clear everything and reset the states
    
    //Other pages have to go here, have to get the page managing package
  )
}

export default App