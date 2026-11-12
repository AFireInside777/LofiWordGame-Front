import React from 'react'
import './Modal.css'
import {useState} from 'react'
import { useEffect } from 'react'

interface TitleModalProps {
  switchModal: (command: string) => void
  modalstate: string
  changeGameObject: (event: React.ChangeEvent<HTMLSelectElement>) => void
  username: string | null
  changeUsername: (username: string) => string
  gotoGame: ()=>void
  changeGameType: (switchword: string) => void
}

const TitleModal = ({modalstate, switchModal, changeGameObject, username, changeUsername, gotoGame, changeGameType}: TitleModalProps) => {

  const [message, setMessage] = useState<string>("Username length max = 11")
  const [newusername, setUsername] = useState<string>("")
  console.log(newusername)


  function usernameSwitch(username: string | null){
    switch(username){
        case "":
            return (
              <>
                <label htmlFor="uname">Username :
                  <input 
                    style={{backgroundColor:"white", borderRadius: "2vw"}}
                    type="text" 
                    id="uname" 
                    name="uname" 
                    value = {newusername}
                    onChange ={(e) => setUsername(e.target.value)}>
                  </input>
                </label>
                <div className={"usernamebuttons"}>
                  <button 
                    style={{width:"100%", borderRadius: "2vw"}} 
                    onClick={()=>{
                      const result: string = changeUsername(newusername)
                      setMessage(result)
                      }}>
                    Enter Name
                  </button>
                  <button style={{width:"100%", borderRadius: "2vw"}}>Auto Generate Name</button>
                  <button style={{width:"100%", borderRadius: "2vw"}}>Sign In</button>
                </div>
                <p style={{margin : "0px", marginBottom: "2vh"}}>{message}</p>
              </>
            )
        
        default:
            return (
              <>
                <p style={{margin : "0px", marginBottom: "2vh"}}>Username: {username}</p>
              </>
            )

    }
  }

  useEffect(() => {console.log(message)}, [message])

  return (
    <>
      <div className = {modalstate}>
        <div className={"Modal"}>

        
        {usernameSwitch(username)}
 

          <label htmlFor="hint" style={{marginBottom: "2vh"}}>Hint Allowed? 
            <select onChange={changeGameObject} name='hint' id="hint" style={{fontFamily:"Roboto-Light"}}>
              <option value="HYes">Yes</option>
              <option value="HNo">No</option>
            </select>
          </label>
          

          <label htmlFor="forfeit" style={{marginBottom: "2vh"}}>Forfeit Allowed?
            <select onChange={changeGameObject} name='forfeit' id="forfeit" style={{fontFamily:"Roboto-Light"}}>
              <option value="FYes">Yes</option>
              <option value="FNo">No</option>
            </select>
          </label>

          <label htmlFor="timer" style={{marginBottom: "2vh"}}>Timer Allowed?
            <select onChange={changeGameObject} name='timer' id="timer" style={{fontFamily:"Roboto-Light"}} defaultValue="10">
              <option value="0">0</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </label>

          <label htmlFor="timer" style={{marginBottom: "2vh"}}>How Many Rounds?
            <select onChange={changeGameObject} name='timer' id="timer" style={{fontFamily:"Roboto-Light"}} defaultValue="r4">
              <option value="r1">1</option>
              <option value="r2">2</option>
              <option value="r3">3</option>
              <option value="r4">4</option>
            </select>
          </label>
          

          <button style={{borderRadius: "2vw", marginBottom: "2px", marginTop: "1vh", width: "98%", fontFamily:"Roboto-Light"}} onClick={()=>gotoGame()}>Ready!</button>{/*Function to go to Single Player*/}
          <button style={{borderRadius: "2vw", marginBottom: "1vh",  width: "98%", fontFamily:"Roboto-Light"}} onClick={()=>{
            switchModal("close")
            changeGameType("todays")
          }}>Not this mode.</button>
        </div>
      </div>
    </>
  )
}

export default TitleModal