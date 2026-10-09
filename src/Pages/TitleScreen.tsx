import React from 'react'
import TitleModal from '../Components/TitleModal'
import type { RoundObject } from '../Interfaces';
import type { GameObject } from '../Interfaces';
import { useState } from 'react'

type TitleProps ={
    changeGameObject: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

function TitleScreen ({changeGameObject}: TitleProps) {

    const [TitleModalState, changeTitleModal] = useState<string>("modal-overlay-closed")
    var multiPmessage: string = "Multiplayer (Coming Soon!)"

    function switchModal(command: string){
        switch(command){
            case "open":
                changeTitleModal("modal-overlay-closed open")
                break
            case "close":
                changeTitleModal("modal-overlay-closed")
        }
    }

    return (
        <>
            <h1>A WAR OF WORDS</h1>
            <button>Log In/Sign In</button>
            <button>Today's Word Selections</button>
            <button onClick={()=>switchModal("open")}>Practice</button>
            <button>{multiPmessage}</button>
            <button>Options</button>

            <TitleModal
                modalstate = {TitleModalState}
                switchModal = {switchModal}
                changeGameObject = {changeGameObject}
            />
        </>
    )
}

export default TitleScreen