import React from 'react'
import TitleScreen from './TitleScreen.tsx'
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Player1 from './player1'
import Loading from './Loading.tsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { useImmer } from "use-immer"
import type { GameObject, QuitGame, roundComms  } from '../Interfaces';
import {CreateGameObj} from '../Interfaces';
import {authApi, type AuthUser} from '../api'
import type { } from '../Interfaces'

const App = () => {

  let navigate = useNavigate()


  const [currentGameObj, changeGameObj] = useImmer<GameObject>(CreateGameObj(10))
  const [roundCommsObj, changeComms] = useImmer<roundComms | null>(null)
  const [roundCounter, nextRound] = useState<number>(0)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState<boolean>(false)

  function changeRound (){
    nextRound(prev => prev+1)
  }

  function returnToTitle(){
    navigate("/")
  }

  const changeGameObject = (event: React.ChangeEvent<HTMLSelectElement>) => { //Change GameObj from TitleModal.tsx
    console.log(event.target.value)
    switch(event.target.value){
      case "HNo":
        changeGameObj(draft => {
          draft.hintallowed = false
        })
        break

      case "HYes":
        changeGameObj(draft => {
          draft.hintallowed = true
        })
        break

      case "FNo":
        changeGameObj(draft => {
    
          draft.forfeitallowed = false
        })
        break

      case "0":
      case "5":
      case "10":
        changeGameObj(draft => {
          draft.timer = Number(event.target.value)*60
        })
        break

      case "r1":
      case "r2":
      case "r3":
      case "r4":
        const newstring: string = event.target.value.slice(1)
        console.log(newstring)
        changeGameObj(draft => {
          draft.numofrounds = Number(newstring)
        })
        break
    }

  }

  const changeUsername = (username: string | null) => {
    changeGameObj(draft => {//////HERE, PUT CODE FOR CHECKING IF USERNAME IS USED OR 
      draft.username1 = username
    })
    return "Username accepted"
  }

  const changeGameType = (switchword: string) => {
    switch (switchword){
      case "practice":
        changeGameObj(draft =>  {
            draft.gametype = "Practice SinglePlayer"
        })
        break

      case "todays":
        changeGameObj(draft => {
          draft.gametype = "Today's Word Selections"
        })
        
    }
  }

  async function gotoGame(){
    let response = await authApi.enterGame(currentGameObj)
    //Put TITLEMODAL BACK FOR PEOPLE TO CUSTOMIZE GAME
    if (response.Message == 'Game and Rounds entered successfully'){
      let roundComms: roundComms = response.roundComms
      changeComms(roundComms)
      navigate("singleplayer")
    }

    
  }
  //After gameObject is sent, we get confirmation
  ///We use this to navigate to playscreen
  //Button linked to Modal and Today's Word Selection button

  //FUNCTION THAT GETS SIGNAL FROM PLAYER1 TO CHANGE KEY
  //PUT FUNCTION HERE, NOT IN PLAYER1.TSX

  useEffect(() => {
    const checkAuth = async () => {//CHECKS BROWSER IF THERE IS A USER
      try {
        const data = await authApi.me()
        console.log(data)
        if (data.userid && data.username){
          setUser({userid: data.userid, username: data.username, loggedIn: data.loggedIn})
          let username: string = data.username//Has to be typed as a string
          let userid: string = data.userid
          changeGameObj(draft => {
            draft.username1 = username
            draft.userid1 = userid
          })
        } 
      } catch (err) {
        console.error("Auth check failed: ", err)
        setUser(null)
      } finally {
        setAuthChecked(true)
      }
    }
      checkAuth()
  }, [])


  return (
      <Routes>
        <Route path="/" element={<TitleScreen 
            changeGameObject={changeGameObject}
            username = {currentGameObj.username1}
            changeUsername = {changeUsername}
            gotoGame = {gotoGame}
            changeGameType = {changeGameType}
            user={user}
            setUser={setUser}/>}
        />
        <Route path="singleplayer" element={
          roundCommsObj && user
          ?  <Player1 
                key={roundCounter} 
                roundCounter = {roundCounter}
                gameObj = {currentGameObj}
                user = {user}
                changeRound = {changeRound}
                returnToTitle = {returnToTitle}
                roundComms = {roundCommsObj}
              /> : <Loading/>} 
          />
          {/* The "key" here makes the component unmount and remount whenever changed.
          So it changes when roundCounter changes, which means it's going to the next round
          The mounts clear everything and reset the states
          Other pages have to go here, have to get the page managing package */}
      </Routes>
  )
}

export default App