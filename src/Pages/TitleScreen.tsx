import React from 'react'
import TitleModal from '../Components/TitleModal'
import SignUpModal from '../Components/SignUpModal'
import { authApi, type AuthUser } from '../api'
import { useState } from 'react'

type TitleProps = {
    changeGameObject: (event: React.ChangeEvent<HTMLSelectElement>) => void
    username: string | null
    changeUsername: (username: string) => string
    gotoGame: ()=> void
    changeGameType: (switchword: string) => void
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
}

function TitleScreen ({changeGameObject, username, changeUsername, gotoGame, changeGameType, user, setUser}: TitleProps) {

    const [TitleModalState, changeTitleModal] = useState<string>("modal-overlay-closed")
    const [authModalState, changeAuthModal] = useState<string>("modal-overlay-closed")
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

    function openAuthModal() {
        changeAuthModal("modal-overlay-closed open")
    }

    function closeAuthModal() {
        changeAuthModal("modal-overlay-closed")
    }

    async function handleLogout() {
        try {
            await authApi.logout()
        } catch (err) {
            console.error('Logout failed:', err)
        }
        setUser(null)
    }



    return (
        <>
            <h1>A WAR OF WORDS</h1>

            {user === null || user.loggedIn === false? (
                <button onClick={openAuthModal}>Log In / Sign Up</button>
            ) : (
                <>
                    <p>Logged in as {user.username}</p>
                    <button onClick={handleLogout}>Log Out</button>
                </>
            )}

            <button>{user && user.loggedIn ? "Today's Word Selections (Ranked)" : "Log In to Play Ranked Games"}</button>
            <button onClick={() => {
                gotoGame()
                // switchModal("open")
                // changeGameType("practice")
            }}>Practice</button>
            <button>{multiPmessage}</button>
            <button>Options</button>

            <TitleModal
                modalstate={TitleModalState}
                switchModal={switchModal}
                changeGameObject={changeGameObject}
                changeGameType={changeGameType}
                username={username}
                changeUsername={changeUsername}
                gotoGame={gotoGame}
            />

            <SignUpModal
                modalstate={authModalState}
                closeModal={closeAuthModal}
                setUser={setUser}
            />
        </>
    )
}

export default TitleScreen