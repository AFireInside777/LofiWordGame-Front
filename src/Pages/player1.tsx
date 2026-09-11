import { useState } from 'react'
import { useRef } from 'react' 
import { useEffect } from 'react' 
import Modal from '../Components/Modal'
import type { RoundObject } from '../Interfaces';
import type { scoreChart } from '../Interfaces';
import type { Player1Props } from '../Interfaces';
import type { hintCount } from '../Interfaces';

function Player1({ roundData, updateGameObj, gameLength, sGR, currentScores }: Player1Props) {

  const currentScoreChart: scoreChart = {
    'incorrect': 5,
    'hintused': 10,
    'forfeit': 30,
    'solvedintime': -15,
    'firsttwoguesses': -20
  }

  const createCSSgrid = () =>{
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

  var keyboardLetters: Record<string, string> = {
    "A": "alphabetletters",
    "B": "alphabetletters",
    "C": "alphabetletters",
    "D": "alphabetletters",
    "E": "alphabetletters",
    "F": "alphabetletters",
    "G": "alphabetletters",
    "H": "alphabetletters",
    "I": "alphabetletters",
    "J": "alphabetletters",
    "K": "alphabetletters",
    "L": "alphabetletters",
    "M": "alphabetletters",
    "N": "alphabetletters",
    "O": "alphabetletters",
    "P": "alphabetletters",
    "Q": "alphabetletters",
    "R": "alphabetletters",
    "S": "alphabetletters",
    "T": "alphabetletters",
    "U": "alphabetletters",
    "V": "alphabetletters",
    "W": "alphabetletters",
    "X": "alphabetletters",
    "Y": "alphabetletters",
    "Z": "alphabetletters",
    "←": "alphabetletters wide",
    "⤶": "alphabetletters wide"
  }

  var hintCounter = useRef<hintCount>({
    guessedLetters : [],
    indexRemain: [0, 1, 2, 3, 4, 5]
  })

  const [CSSType, setCSStype] = useState<string[][]>(createCSSgrid())
  const [letterArray, setLetter] = useState<string[][]>([[],[],[],[],[],[]])
  const [arraycounter, addcount] = useState<number>(0)
  const [CSSObject, setCSS] = useState<Record<string, string>>(keyboardLetters) //I forgot what this is for. Oh! For changing the colors of the visible alphabet.
  const [message, setMessage] = useState<string>("")
  const [RoundData, setRoundData] = useState<RoundObject>(roundData)
  const [ModalState, changeModalState] = useState<string>("modal-overlay-closed")
  const [currentRScores, updateScores] = useState<Array<number>>(currentScores)

  var correctword: (string)[] = [...RoundData.correctword] //Example correct word

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

  function scoreAdjust(scoreref: keyof typeof currentScoreChart){
    let count: number = RoundData.round_number - 1
    updateScores(prev =>{
      var newScores: Array<number> = []
      newScores = [...prev]
      // newScores = newScores.map(n => n - currentScoreChart[scoreref])
      for(let x = count; x < newScores.length; x++){
        newScores[x] = newScores[x] - currentScoreChart[scoreref]
      }
      return newScores
    })
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

    // for (let g = 0; g < choice.length; g++){
    //   letterrows.push(<div className={CSSObject[choice[g]]}>{choice[g]}</div>)
    // } //If you want to change these to buttons, change the div and then get rid of the input in the display. Also, have the buttons put the letters in the array in "const putLetter".
    // return letterrows

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
      setRoundData(prevObject => ({
        ...prevObject,
        message: `${prevObject.username}, you've lost this round 😩`
      }))
      setTimeout(() => {openModal()}, 600)
    } else {
      if (arraycounter < letterArray.length-1){
        addcount(arraycounter+1) 
      }
    }
  }

  const enterGuess = (e: string) => {
    if (e == "⤶"){
      
      var CSSguessArray: (string)[] = ['null', 'null', 'null', 'null', 'null', 'null']
      var currentguess = [...letterArray[arraycounter]]
      var alphabetCSS: string[] = []

      for (let i = 0; i<correctword.length; i++){
        for (let g = 0; g<letterArray[arraycounter].length; g++){
          if (currentguess[i] == correctword[g] && i == g){
            // console.log(hintCounter)
            CSSguessArray[i] = "lettercontainer green"
            alphabetCSS.push("alphabetletters green")
            hintCounter.current.guessedLetters.push(correctword[g])
            correctword[g] = "7"
            currentguess[i] = '6'
            const index = hintCounter.current.indexRemain.indexOf(g);
            hintCounter.current.indexRemain.splice(index, 1)
            continue

          } else if (currentguess[i] == correctword[g] && i != g){
            CSSguessArray[i] = "lettercontainer yellow"
            alphabetCSS.push("alphabetletters yellow")
            correctword[g] = "7"
            currentguess[i] = '6'
            continue
          }
        }
        if (CSSguessArray[i] == 'null'){
          CSSguessArray[i] = 'lettercontainer red'
          alphabetCSS.push("alphabetletters transparent")

        }
      }

      setCSStype(prevArray => {
        var oldArray = [...prevArray]
        oldArray[arraycounter] = CSSguessArray //Sets new CSS for current guess letters
        return oldArray
      })
      
      const alphabetCSSclearance = () =>{
        //Makes sure that new CSS colors for the letters in the bottom alphabet are not changed again if they have colors already
        const alphabetCSSobj: Record<string, string> = {}

        for (x = alphabetCSS.length-1; x >= 0; x--){
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

      //This moves it on to the next guess in the round
      //Put function here that checks if arraycounter is 6.
      //Put function for discovering if the guess is right and then putting the Modal here.
      //We look at CSSGuessArray. If it's all green, trigger Modal.

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

        //Right here, push the wrong guess into guessAttempts in RoundData
        setRoundData(prevObject => ({
          ...prevObject,
          guessAttempts: [...prevObject.guessAttempts, letterArray[arraycounter]],
          numofguesses: prevObject.numofguesses + 1
        }))
        //////////////////////////////////
        scoreAdjust("incorrect")
        checkLoss(letterArray)
      } else {
        setRoundData(prevObject => ({///////Triggers the Modal when you've won
          ...prevObject,
          message: prevObject.username + " ,you've won this round! 🤩",
          solved: true
        }))
        if (arraycounter <= 1){
          scoreAdjust('firsttwoguesses') //Gives you extra points if you solve the puzzle in first two guesses
        }
        setTimeout(() => {openModal()}, 600);
      }

    }
  }


  function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const giveHint = () => {

    var NewCSS: string[] = []

    if (hintCounter.current.guessedLetters.length > 3){
      setMessage("Hint can't be used after four correct letters are shown.")
      setTimeout(() => setMessage(""), 2500)
    } else if (arraycounter > 4){
      setMessage("Hint can't be used on last guess.")
      setTimeout(() => setMessage(""), 2500)
    } else {
      var randomIndex: number = getRandomElement(hintCounter.current.indexRemain)
      var randomIndexIndex: number = hintCounter.current.indexRemain.indexOf(randomIndex)

      for (let t = 0; t < correctword.length; t++){
        if (t == randomIndex){
          setLetter(prevArray =>{
            const oldArray = [...prevArray]
            oldArray[arraycounter] = [...oldArray[arraycounter], correctword[randomIndex]]
            return oldArray
          })
          NewCSS.push("lettercontainer purple")
        } else {
          setLetter(prevArray =>{
            const oldArray = [...prevArray]
            oldArray[arraycounter] = [...oldArray[arraycounter], "#"]
            return oldArray
          })}
          NewCSS.push("lettercontainer")
        }

      setCSStype(prevArray => {
        var oldArray = [...prevArray]
        oldArray[arraycounter] = NewCSS //CSS for letters in entered guess
        return oldArray
      })

      hintCounter.current.indexRemain.splice(randomIndexIndex,1)
      hintCounter.current.guessedLetters.push(correctword[randomIndex])

      var newCSS: string[] = []
      
      for (var x = 0; x < 6; x++){
        newCSS.push("lettercontainer current") 
      }
      setCSStype(prevArray => {
        var oldArray = [...prevArray]
        oldArray[arraycounter+1] = newCSS //CSS for circles in next guess line
        return oldArray
      })

      setCSS(prev =>({
        ...prev,
        [correctword[randomIndex]]: "alphabetletters purple" //Change this
      }))

      setRoundData(prevObject => ({
        ...prevObject,
        hintused: [...prevObject.hintused, correctword[randomIndex]]
      }))

      scoreAdjust("hintused")
    
      addcount(arraycounter+1)
    }
  }

  useEffect (() => {

    setRoundData(roundData);
  }, [roundData])

  function openModal(){
    changeModalState("modal-overlay-closed open")
  } 

  const closeModal = () =>{
    changeModalState("modal-overlay-closed")
    setTimeout(() => {
      updateGameObj(RoundData, currentRScores);
    }, 1000)
    
  }

  return (
    <>
      
      <div className="guesscontainer">
        {guessBoxes(6)}
        
      </div>
      <div className="messagebox">{message}</div>

      {/* <input
        style={{border: "1px solid white"}}
        ref={hiddenInputRef}
        type="text"
        defaultValue={inputl}
        onChange={putLetter}
        onKeyDown={handleKeyDown}
        maxLength={4}
      /> */}
      
      <div className="alphabet">
        <div className="alphabetrows">{guessLetters(1)}</div>
        <div className="alphabetrows">{guessLetters(2)}</div>
        <div className="alphabetrows">{guessLetters(3)}</div>
      </div>

       <div className="player-scores"> {/*Fix this so that it shows line for only one person in one player, and will show two lines for two players*/}
        <div>Game Info</div>
        <div className="">Round 1</div>
        <div>Round 2</div>{/*For the letters, make them glow neon*/}
        <div>Round 3</div>
        <div>Round 4</div>
        <div>{RoundData.username}</div>{/*Username will go here */}
        <div>{currentRScores[0]}</div> {/* These will become states for their CSS, we'll insert them from TitleScreen.*/}
        <div>{currentRScores[1]}</div>
        <div>{currentRScores[2]}</div>
        <div>{currentRScores[3]}</div>
        {/* <div>Player 2</div>
        <div>Score</div>
        <div>Score</div>
        <div>Score</div>
        <div>Score</div>  A function will generate this in a two-player screen. Or just have a separate file for Player 2*/}
      </div>
      <div className = "buttonContainer">
        <button onClick={giveHint}>Hint</button>
        <button onClick={openModal}>Forfeit Turn</button>
        <button>Resign Game</button>
      </div>

      <Modal roundData = {RoundData} modalstate = {ModalState} closeModal = {closeModal} gameLength = {gameLength} sGR = {sGR}/>
      </>
  )
}

export default Player1
