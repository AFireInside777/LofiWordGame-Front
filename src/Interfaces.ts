import {v4 as uuidv4} from 'uuid'
import type { AuthUser } from './api'

export interface GameObject{
    datecreated: string,
    forfeitallowed: boolean,
    gametype: string,
    hintallowed: boolean,
    numofrounds: number,
    status: string,
    timer: number,
    userid1?: string | null,
    userid2?: string,
    username1: string | null
    username2?: string,
}

export interface QuitGame extends GameObject{
    quit: boolean
}

export const CreateGameObj = (timerChoice: number) =>{//Later, add parameters here that come from the users
    let newGame: GameObject = {
        datecreated: new Date().toISOString(),
        forfeitallowed: true,
        gametype: "Today's Word Selection",
        numofrounds: 4,
        hintallowed: true,
        status: "pending",
        timer: timerChoice*60,
        username1: null,
        userid1: null
    }
    return newGame
}

export interface hint{
    hintCSS: string[],
    hint: string[]
}

export interface guess{
    CSSGuessArray: string[],
    AlphabetCSS: string[]
}

export interface roundinfo{
    "score": number,
    "solved": boolean,
    "remainingTime": number,
    "forfeit": boolean,
    "guess": string[],
    guessResponse: guess,
    "hintresponse": hint,
    "rounds"?: RoundObject[],
    "quit": boolean,
    "message": string
}

export interface roundComms{
    "gameid": string,
    "roundids": string[],
    "roundCounter": number,
    "roundinfo": roundinfo
}

export interface gameReturnObj {
    Message: string,
    roundComms: roundComms
}


export interface RoundObject {
    round_number: number,
    hintsused: string[],
    correctword: string[],
    numofguesses: number,
    remainingTime: number,
    solved: boolean,
    endingScore: number,
    startingScore: number,
    forfeit: boolean
}

export type GameEnterResponse = {
    "Message": string,
    "roundComms": roundComms
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
  returnToTitle: () => void
  roundCounter: number
  roundComms: roundComms
  gameObj: GameObject
  changeRound: () => void
  user: AuthUser
}


export interface userReady {
    player: "Ready" | "Not Ready"
}

export var keyboardLetters: Record<string, string> = {
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
