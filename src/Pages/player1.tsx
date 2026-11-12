import { useState, useEffect, useReducer } from 'react'
import Modal from '../Components/Modal'
import ReadyModal from '../Components/ReadyModal'
import ForfeitModal from '../Components/ForfeitModal'
import QuitModal from '../Components/QuitModal'
import EndgameModal from '../Components/EndgameModal'
import { useImmer } from "use-immer"
import { TimerReducer, timerFormat} from '../Components/Timer';
import type { GameObject, roundComms,  Player1Props, userReady, RoundObject} from '../Interfaces';
import {keyboardLetters} from '../Interfaces';
import {authApi} from '../api'

//Send numofrounds from Gameobject into Player1
function Player1({ returnToTitle, gameObj, roundCounter, roundComms, changeRound, user }: Player1Props) {


  const [CSSType, setCSStype] = useState<string[][]>(createCSSgrid())//CSS for the Guess boxes
  const [letterArray, setLetter] = useState<string[][]>([[],[],[],[],[],[]]) //Where the guesses are stored
  const [arraycounter, addcount] = useState<number>(0)
  const [CSSObject, setCSS] = useState<Record<string, string>>(keyboardLetters) //I forgot what this is for. Oh! For changing the colors of the visible alphabet on the keyboard
  const [message, setMessage] = useState<string>("")//"Hint not available", etc.
  const [gameData, gameDataUpdate] = useImmer<GameObject>(gameObj)
  const [roundComm, updateComms] = useImmer<roundComms>(roundComms)
  const [finishedRound, getFinishedRound] = useState<RoundObject | null>(null)
  const [finishedRounds, getFinishedRounds] = useState<RoundObject[] | null>(null)  
  const [secondsTimer, dispatch] = useReducer(TimerReducer, { seconds: gameObj.timer, runStatus: false });
  const [ready, setReady] = useState<userReady>({player: "Not Ready"})
  
  const [ModalState, changeModalState] = useState<string>("modal-overlay-closed")
  const [EndModalState, changeEndState] = useState<string>("modal-overlay-closed")
  const [ReadyModalState, changeModalState2] = useState<string>("modal-overlay-closed")
  const [ForfeitModalState, changeForfeit] = useState<string>("modal-overlay-closed")
  const [QuitModalState, changeQuit] = useState<string>("modal-overlay-closed")

  /////////////////////////////////////////////////
  //THIS IS FOR CHANGING THE MODAL WHEN THE ROUND OR GAME IS FINISHED

//////////////////////////////////////////////
  var scoreCSS: (string)[] = ["", "", "", ""]

  const calcScoreCSS = () =>{
    scoreCSS[roundCounter] = "roundhighlighter"
  }
  calcScoreCSS()
//////////////////////////////////////////////

  let buttonDisabled: (boolean)[] = [false,  false]
  let buttonMessage: (string)[] = ["Hint", "Forfeit Turn"]

    const disableButtons = () => {
    if (gameData.hintallowed == false){
      buttonDisabled[0] = true
      buttonMessage[0] = "Hint Disabled"
    }

    if (gameData.forfeitallowed == false){
      buttonDisabled[1] = true
      buttonMessage[1] = "Forfeit Disabled"
    }
  }

  disableButtons()


  function createCSSgrid () {
    var CSSgrid: string[][] = []
    for (var r = 0; r < 6; r++){
      var rowCSSgrid = []
      for (var t = 0; t < 6; t++){
        if (r == 0){
          rowCSSgrid.push("lettercontainer")
        } else {
          rowCSSgrid.push("lettercontainer transparent") //The circles in the screen holding the letters
        } 
      }
      CSSgrid.push(rowCSSgrid)
    }
    return CSSgrid
  }

  ////////////////SCORES////////////////////////////////////////
  var roundnumsandscore: Record<string, Array<null | number | string>> = {
    one: [null, null, null, null],
    two: [null, null, null, null]//DISPLAY IN JSX
  }

  function rnumberscore(roundnumsandscore: Record<string, Array<null | number | string>>, roundnum: number){
    
    for (let x = 1; x <= 4; x++){//This function can stay, make sure gameObj sends numofrounds
      if (x <= roundnum){
        roundnumsandscore.one[x-1] = x//SCORE WILL COME FROM ARRAY INSTEAD
        roundnumsandscore.two[x-1] = roundComm.roundinfo.score//SCORE WILL COME FROM ARRAY INSTEAD, index will be x
      } else {
        roundnumsandscore.one[x-1] = ""
        roundnumsandscore.two[x-1] = ""
      }
    }
    return roundnumsandscore
    
  }

  roundnumsandscore = rnumberscore(roundnumsandscore, gameObj.numofrounds)

  function startTimer () {
    dispatch({type : "Start"}) 
  }

  function stopTimer (){
    dispatch({type : "Stop"}) 
  }

  type roundSignal = "round" | "rounds"

  const retrieveRound = async (signal: roundSignal)=> {
    if (signal == "round"){
      let current: number = roundCounter
      let roundData: RoundObject = await authApi.round(roundComm.roundids[current])
  
      getFinishedRound(roundData)
    } else if (signal == "rounds"){
      let roundsData: RoundObject[] = await authApi.rounds(roundComm.gameid)
      getFinishedRounds(roundsData)
    }
  }

  function endOfRound(){
    let endNumber: number = roundComm.roundids.length - roundCounter
    if(endNumber < 2){
      retrieveRound("rounds")
    }else{
      retrieveRound("round")
    }
  }

  useEffect(() => {
    // If finishedRound arrives, open the standard modal
    if (finishedRound) {
      setTimeout(() => { openModal() }, 600)
    }
  }, [finishedRound])

  useEffect(() => {
    // If finishedRounds arrives (for the end of game), open the EndModal
    if (finishedRounds) {
      setTimeout(() => { EndModal("open") }, 600)
    }
  }, [finishedRounds])

  function checkReady(){
    if (ready.player == "Not Ready" 
      && roundComm.roundinfo.remainingTime > 0 //just roundComm.remainingTime
      && ReadyModalState == "modal-overlay-closed"){
      ReadyModal2()
    }
  }

  checkReady()

  function getReady(){
    setReady({player:"Ready"})
    changeModalState2("modal-overlay-closed")
    startTimer()
  }

  function forfeitModal(state: string){
    switch (state){
      case "appear":
        changeForfeit("modal-overlay-closed open")
        break
      case "disappear":
        changeForfeit("modal-overlay-closed")
    }
  }

  function quitModal(state: string){
    switch (state){
      case "appear":
        changeQuit("modal-overlay-closed open")
        break
      case "disappear":
        changeQuit("modal-overlay-closed")
    }
  }

  const quitSign = async () => {
    let response = await authApi.quit_game(roundComm)//Just send gameid
    if (response.Message == "Quit Game entered successfully"){
      let roundsData: RoundObject[] = await authApi.rounds(roundComm.gameid)
      getFinishedRounds(roundsData)
      if (finishedRounds){
        changeEndState("modal-overlay-closed open")
      }
    }
  }
  
  async function YesForfeit(){///For button in Forfeit Modal. User confirms they want to forfeit this rurn
    stopTimer()
    updateComms(draft => {
      draft.roundinfo.forfeit = true
      draft.roundinfo.remainingTime = secondsTimer.seconds
      draft.roundinfo.message = "You've forfeited this round 😔"
      //////////////////USE IMMER HERE MAKE SURE SCORE FROM GAME OBJECT SHOWS BELOW
    })
    //send roundComms to back end, roundsengine, round_complete()
    let newRoundComms = await authApi.game_complete(roundComm)
    updateComms(newRoundComms)
    forfeitModal("disappear")
    endOfRound()
  }


  const lettersBoxes = (number: number, arraynum: number) => {
    var rowArray = []
    var idCounter: number = 0
    for (var i = 0; i < number; i++){
      rowArray.push(
        <div className={CSSType[arraynum][i]} key={idCounter.toString()}>{letterArray[arraynum][i]}</div>
      )
      idCounter++
    }
    return rowArray
  }

  const guessBoxes = (number: number) => {
    var rowArray2 = []
    var idcounter2 = 0

    for (var i = 0; i < number; i++){
      rowArray2.push(
        <div className="wordcontainer" key={idcounter2.toString()}>{lettersBoxes(6, i)}</div>
      )
      idcounter2++
    }
    return rowArray2
  }

  const guessLetters = (rowNum: number) => {//Alphabet that shows available letters
    let firstrow: string = "QWERTYUIOP"
    let secondrow: string = "ASDFGHJKL"
    let thirdrow: string = "←ZXCVBNM⤶"
    let letterrows = []
    let choice: string

    if (rowNum == 1){
      choice = firstrow
    } else if (rowNum == 2) {
      choice = secondrow
    } else {
      choice = thirdrow
    }

    for (let g = 0; g < choice.length; g++){
      if (choice[g] == "←"){
        letterrows.push(<button 
          type="button" 
          onClick={() => removeLetter(choice[g])} 
          className={CSSObject[choice[g]]}>{choice[g]}</button>)
      }else if(choice[g] == "⤶"){
        letterrows.push(<button 
          type="button" 
          onClick={() => enterGuess(choice[g])} 
          className={CSSObject[choice[g]]}>{choice[g]}</button>)
      }else{
      letterrows.push(<button 
        type="button" 
        onClick={() => putLetter(choice[g])} 
        className={CSSObject[choice[g]]}>{choice[g]}</button>)
      } 
 
    }
    return letterrows
  }


  const putLetter = (letter: string) => {
    if (letterArray[arraycounter].length == 6){
      
    }else{
      var nletter = letter.toUpperCase();
      
      setLetter(prevArray =>{
        const oldArray = [...prevArray]
        oldArray[arraycounter] = [...oldArray[arraycounter], nletter]
        return oldArray
      })}
  }

  const removeLetter = (e: string) => {
    if (e == "←"){
      setLetter(prevArray =>{
        var oldArray = [...prevArray]
        oldArray[arraycounter] = oldArray[arraycounter].slice(0, -1)
        return oldArray
      })
    }
  }

  const checkLoss = (lastarray: string[][]) => {
    if (lastarray[5].length > 0){

      updateComms(draft => {
        
        draft.roundinfo.remainingTime = secondsTimer.seconds
        draft.roundinfo.message = `You've lost this round 😩`
        draft.roundinfo.solved = false
      })
      //send to complete round
      endOfRound()
    } else {
      if (arraycounter < letterArray.length-1){
        addcount(arraycounter+1) 
      }//Add function to send RoundOBj to back, update round
    }
  }


  const enterGuess = async (e: string) => {
    if (e == "⤶"){
  
      let CSSguessArray: string[] = []
      let alphabetCSS: string[] = []
      //send to enter guess on back end, get back arrays
      //put em down below
      updateComms(draft =>{
        draft.roundinfo.guess = [...letterArray[arraycounter]]
      })

      let fakeComms: roundComms = {
        ...roundComm,
        roundinfo: {
          ...roundComm.roundinfo,
          guess: [...letterArray[arraycounter]]//
        }
      }
     
      let guessResponse: roundComms = await authApi.guess(fakeComms)
      
      updateComms(guessResponse)
      
      CSSguessArray = [...guessResponse.roundinfo.guessResponse.CSSGuessArray]
      alphabetCSS = [...guessResponse.roundinfo.guessResponse.AlphabetCSS]

      setCSStype(prevArray => {
        var oldArray = [...prevArray]
        oldArray[arraycounter] = CSSguessArray //Sets new CSS for current guess letters
        return oldArray
      })
      
      const alphabetCSSclearance = () =>{
        //Makes sure that new CSS colors for the letters in the bottom alphabet are not changed again if they have colors already
        const alphabetCSSobj: Record<string, string> = {}

        for (let x = alphabetCSS.length-1; x >= 0; x--){
          let currentLetter = letterArray[arraycounter][x] // "C"
          let currentColor = CSSObject[currentLetter] //"alphabetletters yellow"
          let newColor = alphabetCSS[x]

          if (currentColor !== "alphabetletters green" &&
            currentColor !== "alphabetletters red" &&
            currentColor !== "alphabetletters purple" &&
            currentColor !== "alphabetletters yellow" &&
            currentColor !== "alphabetletters transparent"){
              alphabetCSSobj[currentLetter] = newColor
          }
        }
        return alphabetCSSobj //An object cannot have multiple keys with different values. So, when you put in a key that's already there, but that key has a different value, the old value will be replaced.
        //"N": "alphabetletters green"
        //"N": "alphabetletters red"
        //"N" will just be red.
      }
      
      setCSS(prev => ({
        ...prev,
        ...alphabetCSSclearance()
      }))


      let rightanswercounter: number = 0//Determines if player got the right/correct answer or not
      for (let x = 0; x < CSSguessArray.length; x++){
        if(CSSguessArray[x] == "lettercontainer green"){
          rightanswercounter += 1
        }
      }
      //////////////////////////////////
      if (rightanswercounter !== 6){
        var newCSS: string[] = []
      
        for (var x = 0; x < 6; x++){
          newCSS.push("lettercontainer current") //Puts new CSS for guess boxes in an array
        }

        setCSStype(prevArray => {
          var oldArray = [...prevArray]
          oldArray[arraycounter+1] = newCSS //Puts new CSS Array in bigger CSS Array for guess boxes
          return oldArray
        })


        //////////////////////////////////
        checkLoss(letterArray)//
      } else {
        stopTimer ()
        updateComms(draft => {
          draft.roundinfo.solved = true
          draft.roundinfo.message = "You've won this round! 🤩"
          draft.roundinfo.remainingTime = secondsTimer.seconds
          //change score on back end and return it
          //Send roundComms to round_complete route
          //get roundComm back, get score
        })
        
        endOfRound()
      }
    }
  }

  const giveHint = async () => {
    var newCSS: string[] = []
    let newRoundComms = await authApi.hint(roundComm)
    if (newRoundComms){
      if(newRoundComms.roundinfo.message.length > 2){
        setMessage(newRoundComms.roundinfo.message)
      } else {
        setLetter(prevArray =>{
          const oldArray = [...prevArray]
          oldArray[arraycounter] = [...newRoundComms.roundinfo.hintresponse.hint]
          return oldArray
        })

        newCSS = [...newRoundComms.roundinfo.hintresponse.hintCSS]
        
        setCSStype(prevArray => {
          var oldArray = [...prevArray]
          oldArray[arraycounter+1] = newCSS //CSS for circles in next guess line
          return oldArray
        })
        
        for (let g = 0; g < newRoundComms.roundinfo.hintresponse.hint.length; g++){
          if(newRoundComms.roundinfo.hintresponse.hint[g] != "#"){ //Get letter in hint and assign CSS to keyboard
            setCSS(prev =>({
              ...prev,
              [newRoundComms.roundinfo.hintresponse.hint[g]]: "alphabetletters purple" //Change this
            }))
          }
        }
        addcount(arraycounter+1)
      }
    }
  }


  function openModal(){
    changeModalState("modal-overlay-closed open")
  }

  function ReadyModal2(){
    changeModalState2("modal-overlay-closed open")
  } 

  type triggerWord = "open" | "close"

  function EndModal(trigger: triggerWord){
    switch(trigger){
      case "open":
        changeEndState("modal-overlay-closed open")
        break

      case "close":
        changeEndState("modal-overlay-closed")//The way the game functions, this will never be called. But I'll put it there anyway.
    }
  }

  function closeModal (indicator: string) {
    switch (indicator){
      case "round":
        changeModalState("modal-overlay-closed")
        setTimeout(() => {
          changeRound();
        }, 1000)
        break
      case "endgame":
        changeRound ();
    }
  }

  useEffect(() => {
    if (!secondsTimer.runStatus) return
    const id = setInterval(() => dispatch({ type: 'Tick' }), 1000)
    return () => clearInterval(id)
  }, [secondsTimer.runStatus])

  return (
    <>
      
      <div className="guesscontainer">
        {guessBoxes(6)}
        
      </div>
      <div className="messagebox">
        <div className='messageComponents'></div>
        <div className='messageComponents'>{message}</div>
        <div className='messageComponents'>{timerFormat(secondsTimer.seconds)}</div>
      </div> 
      
      <div className = "buttonContainer">
        <button style={{ "borderColor":"purple"}} onClick={giveHint} disabled={buttonDisabled[0]}>{buttonMessage[0]}</button>
        <button style={{ "borderColor":"orange"}} onClick={()=>forfeitModal("appear")} disabled={buttonDisabled[1]}>{buttonMessage[1]}</button>
        <button style={{ "borderColor":"red"}} onClick={()=>quitModal("appear")}>Quit Game</button> {/*Just put openModal here for now*/}
      </div>

       <div className="player-scores"> {/*Fix this so that it shows line for only one person in one player, and will show two lines for two players*/}
        <div>Game Round</div>
        <div className={scoreCSS[0]}>{roundnumsandscore.one[0]}</div>
        <div className={scoreCSS[1]}>{roundnumsandscore.one[1]}</div>{/*For the letters, make them glow neon*/}
        <div className={scoreCSS[2]}>{roundnumsandscore.one[2]}</div>
        <div className={scoreCSS[3]}>{roundnumsandscore.one[3]}</div>
       
        <div>{gameData.username1}</div>{/*Username will go here */}
        <div>{roundnumsandscore.two[0]}</div> {/* These will become states for their CSS, we'll insert them from TitleScreen.*/}
        <div>{roundnumsandscore.two[1]}</div>
        <div>{roundnumsandscore.two[2]}</div>
        <div>{roundnumsandscore.two[3]}</div>
        
      </div>
      

      <div className="alphabet">
        <div className="alphabetrows">{guessLetters(1)}</div>
        <div className="alphabetrows">{guessLetters(2)}</div>
        <div className="alphabetrows">{guessLetters(3)}</div>
      </div>

      <Modal 
        modalstate = {ModalState} 
        closeModal = {closeModal} 
        user = {user}
        round = {finishedRound ? finishedRound : null}
      />

      <EndgameModal
        modalstate = {EndModalState}
        finishedRounds = {finishedRounds}
        user = {user}
        returnToTitle = {returnToTitle}
      />

      <ReadyModal 
        ReadyFunc = {getReady}
        modalstate = {ReadyModalState} 
      />

      <ForfeitModal
        ForfeitModalState = {ForfeitModalState}
        confirmForfeit = {YesForfeit}
        forfeitModal = {forfeitModal}
      />

      <QuitModal
        QuitModalState = {QuitModalState}
        quitModal = {quitModal}
        quitSign = {quitSign}
        openModal = {openModal}
      />



    </>

      

      
  )
}

export default Player1
