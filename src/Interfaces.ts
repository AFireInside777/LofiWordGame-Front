import {v4 as uuidv4} from 'uuid'

export interface GameObject{
    gameid: string,
    datecreated: Date,
    gametype: string,
    startingScore: number,
    numofrounds: number,
    hintallowed: boolean,
    forfeitallowed: boolean,
    timer: number,
    userid1?: string,
    userid2?: string,
    username1: string,
    username2?: string,
    username1score: number,
    username2score?: number,
    resign?: Boolean,
    roundobjects: RoundObject[]
}


export interface RoundObject{
    round_number: number,
    correctword: string[],
    numofguesses: number,
    hintused: string[],
    remainingTime: number,
    solved: Boolean,
    score: number
    roundid: string,
    datecreated: Date,
    gameid: string,
    username: string,
    guessAttempts: string[][],
    message: string,
    forfeit: Boolean
}

export interface scoreChart{
    incorrect: number,
    hintused: number,
    forfeit: number,
    solvedintime: number,
    firsttwoguesses: number,
}

export interface hintCount {
    guessedLetters : string[];
    indexRemain : number[]
  }

export interface Player1Props {
  roundData: RoundObject;
  updateGameObj: (gameObj: GameObject) => void  // This tells TypeScript that roundData is required
  gameLength: number
  sGR: () => RoundObject[]
  currentScores: Array<number>
  qg: () => void
  returnToTitle: () => void
  gameObj: GameObject
  roundCounter: number
}

export const CreateRoundObjs = (gameid: string, username: string) =>{

    let wordArray: RoundObject[] = []

    let exampleWords = [
        ["B","A","N","A","N","A"],
        ["S","T","R","I","N","G"],
        ["N","U","M","B","E","R"],
        ["C",'O','O','K','I','E']
    ]

    let score: number = 300

    for (let g = 0; g < exampleWords.length; g++){


        let round: RoundObject = {
            round_number: g+1,
            correctword: exampleWords[g],
            numofguesses: 0,
            hintused: [],
            remainingTime: 0,
            solved: false,
            score: score,
            roundid: uuidv4(),
            datecreated: new Date(),
            gameid: gameid,
            username: username,
            guessAttempts: [],
            message: "",
            forfeit: false
        }
        wordArray.push(round)
    }
    return wordArray
}


export const CreateGameObj = () =>{//Later, add parameters here that come from the users

    const gameid = uuidv4()
    const username1 = 'ExampleUser'

    let newGame: GameObject = {
        gameid: gameid,
        datecreated: new Date(),
        gametype: "Single",
        startingScore: 300,
        numofrounds: 4,
        hintallowed: true,
        timer: 0,
        username1: username1,
        username1score: 300,
        resign: true,
        forfeitallowed: true,
        roundobjects: CreateRoundObjs(gameid, username1)
    }
    return newGame
}

export interface userReady {
    player: "Ready" | "Not Ready"
}