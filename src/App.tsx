import { useState } from 'react'
import { useRef } from 'react' 
import { useEffect } from 'react' 

import './App.css'

function App() {

  const createCSSgrid = () =>{
    var CSSgrid: string[][] = []
    for (var r = 0; r < 6; r++){
      var rowCSSgrid = []
      for (var t = 0; t < 6; t++){
        if (r == 0){
          rowCSSgrid.push("lettercontainer")
        } else {
          rowCSSgrid.push("lettercontainer transparent")
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
  }

  interface hintCount {
    guessedLetters : string[];
    indexRemain : number[]
  }

  var hintCounter = useRef<hintCount>({
    guessedLetters : [],
    indexRemain: [0, 1, 2, 3, 4, 5]
  })

  const [CSSType, setCSStype] = useState<string[][]>(createCSSgrid())
  const [letterArray, setLetter] = useState<string[][]>([[],[],[],[],[],[]])
  const [arraycounter, addcount] = useState<number>(0)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const [CSSObject, setCSS] = useState<Record<string, string>>(keyboardLetters) //I forgot what this is for. Oh! For changing the colors of the visible alphabet.
  const [message, setMessage] = useState<string>("")

  var inputl:string = ""
  var correctword: (string)[] = ["B","A","N","A","N","A"] //Example correct word

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
        <div className="wordcontainer" key={idcounter2.toString()} onClick={handleBoxClick}>{lettersBoxes(6, i)}</div>
      )
      idcounter2++
    }
    return rowArray2
  }


  const guessLetters = (rowNum: number) => {
    let firstrow: string = "QWERTYUIOP"
    let secondrow: string = "ASDFGHJKL"
    let thirdrow: string = "ZXCVBNM"
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
      letterrows.push(<div className={CSSObject[choice[g]]}>{choice[g]}</div>)
    } //If you want to change these to buttons, change the div and then get rid of the input in the display. Also, have the buttons put the letters in the array in "const putLetter".
    return letterrows
  }


  const putLetter = (letter: React.ChangeEvent<HTMLInputElement>) => {
    if (letterArray[arraycounter].length == 6){
      
    }else{
      var nletter = letter.target.value.toUpperCase();
      
      setLetter(prevArray =>{
        const oldArray = [...prevArray]
        oldArray[arraycounter] = [...oldArray[arraycounter], nletter]
        return oldArray
      })}

    letter.target.value = ''
  }


  const handleBoxClick = () => {
    if (hiddenInputRef.current){
      hiddenInputRef.current.focus()
    }
  }


  const removeLetter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Backspace" || e.key == "Delete"){
      console.log(e.key)
      setLetter(prevArray =>{
        var oldArray = [...prevArray]
        oldArray[arraycounter] = oldArray[arraycounter].slice(0, -1)
        return oldArray
      })
    }
  }


  const enterGuess = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Return" || e.key == "Enter"){
      
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
            // console.log(index)
            hintCounter.current.indexRemain.splice(index, 1)
            // console.log(hintCounter)
            continue
          } else if (currentguess[i] == correctword[g] && i != g){
            CSSguessArray[i] = "lettercontainer yellow"
            alphabetCSS.push("alphabetletters yellow")
            correctword[i] = "7"
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

      var newCSS: string[] = []
      
      for (var x = 0; x < 6; x++){
        newCSS.push("lettercontainer current") //Puts new CSS for guess boxes in an array
      }

      setCSStype(prevArray => {
        var oldArray = [...prevArray]
        oldArray[arraycounter+1] = newCSS //Puts new CSS Array in bigger CSS Array for guess boxes
        return oldArray
      })

      setCSS(prev =>({
        ...prev,
        [letterArray[arraycounter][0]]: alphabetCSS[0],
        [letterArray[arraycounter][1]]: alphabetCSS[1],
        [letterArray[arraycounter][2]]: alphabetCSS[2],
        [letterArray[arraycounter][3]]: alphabetCSS[3],
        [letterArray[arraycounter][4]]: alphabetCSS[4],
        [letterArray[arraycounter][5]]: alphabetCSS[5],
      }))
      
      addcount(arraycounter+1)

    }
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    removeLetter(e)
    enterGuess(e)
  }

  function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

  const giveHint = () => {

    var NewCSS: string[] = []

    if (hintCounter.current.guessedLetters.length > 3){
      setMessage("Hint can't be used after four correctly guessed letters.")
      setTimeout(() => setMessage(""), 2500)
    } else if (arraycounter > 4){
      setMessage("Hint can't be used on last guess.")
      setTimeout(() => setMessage(""), 2500)
    } else {
      var randomIndex: number = getRandomElement(hintCounter.current.indexRemain)

      console.log(randomIndex)

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
        [correctword[randomIndex]]: "alphabetletters purple"
      }))
    
      addcount(arraycounter+1)
    }
  }

  useEffect (() => {
   
  }, [letterArray])

  return (
    <>
      
      <div className="guesscontainer" onClick={handleBoxClick}>
        {guessBoxes(6)}
        <div className="messagebox">{message}</div>
      </div>

      <input
        style={{border: "1px solid white"}}
        ref={hiddenInputRef}
        type="text"
        defaultValue={inputl}
        onChange={putLetter}
        onKeyDown={handleKeyDown}
        maxLength={4}
      />
      
      <div className="alphabet">
        <div className="alphabetrows">{guessLetters(1)}</div>
        <div className="alphabetrows">{guessLetters(2)}</div>
        <div className="alphabetrows">{guessLetters(3)}</div>
      </div>

      <div className="player-scores">
        <div>Game Info</div>
        <div>Player 1</div>
        <div>Player 2</div>
        <div>Game 1</div>
        <div>Score</div>
        <div>Score</div>
        <div>Game 2</div>
        <div>Score</div>
        <div>Score</div>
        <div>Game 2</div>
        <div>Score</div>
        <div>Score</div>
      </div>

      <button onClick={giveHint}>Hint</button>
      <button>Forfeit Turn</button>
      <button>Resign Game</button>
      </>
  )
}

export default App
