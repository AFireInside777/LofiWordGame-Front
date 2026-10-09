import React from 'react'
import './Modal.css'
import {useState} from 'react'

interface TitleModalProps {
  switchModal: (command: string) => void
  modalstate: string
  changeGameObject: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const TitleModal = ({modalstate, switchModal, changeGameObject}: TitleModalProps) => {

  const [message, setMessage] = useState<string>("Test")

  return (
    <>
      <div className = {modalstate}>
        <div className={"Modal"}>

        <div className={"username"}>
          <label htmlFor="uname">Username: 
            <input style={{backgroundColor:"white"}}type="text" id="uname" name="uname"></input>
          </label>
          <div className={"usernamebuttons"}>
            <button style={{width:"43%"}}>Enter Name</button>
            <button style={{width:"57%"}}>Auto Gen Name</button>
          </div>
          <p style={{margin : "0px"}}>{message}</p>
        </div>
 

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
          

          <button style={{borderRadius: "2vw", marginBottom: "2px", marginTop: "1vh", width: "98%", fontFamily:"Roboto-Light"}} onClick={()=>switchModal("close")}>Ready!</button>{/*Function to go to Single Player*/}
          <button style={{borderRadius: "2vw", marginBottom: "1vh",  width: "98%", fontFamily:"Roboto-Light"}} onClick={()=>switchModal("close")}>Not this mode.</button>
        </div>
      </div>
    </>
  )
}

export default TitleModal