import React, { useState } from 'react'
import './Modal.css'
import { authApi, type AuthUser } from '../api'

interface SignUpModalProps {
    modalstate: string
    closeModal: () => void
    setUser: (user: AuthUser) => void
}

const SignUpModal =({modalstate, closeModal, setUser}: SignUpModalProps) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login')
      const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()//prevents the browser from going to a new page when form data is submitted.
        setError('')
        setSubmitting(true)
        try{
            const data = mode === 'login'
                ? await authApi.login(username, password)
                : await authApi.register(username, email, password)

            setUser({ userid: data.userid, username: data.username })

            setUsername('')
            setEmail('')
            setPassword('')

            closeModal()
        } catch (err) {
            setError(err instanceof Error ? err.message: "Something went wrong.")
        } finally {
            setSubmitting(false)
        }
    }

    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login')
        setError('')
    }

        return (
        <div className={modalstate}>
        <div className="Modal">
            <form onSubmit={handleSubmit} className="auth-form">
            <h2>{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>

            <label className="auth-field">
                <span>Username</span>
                <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                />
            </label>

            {mode === 'signup' && (
                <label className="auth-field">
                <span>Email</span>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                </label>
            )}

            <label className="auth-field">
                <span>Password</span>
                <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="auth-submit"
            >
                {submitting
                ? 'Please wait…'
                : mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>

            <button
                type="button"
                onClick={switchMode}
                className="auth-toggle"
            >
                {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </button>

            <button
                type="button"
                onClick={closeModal}
                className="auth-cancel"
            >
                Cancel
            </button>
            </form>
        </div>
        </div>
    )
}

export default SignUpModal