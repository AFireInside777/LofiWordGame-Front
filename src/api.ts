import type { GameObject, gameReturnObj, roundComms, RoundObject } from './Interfaces';


const API_BASE = 'http://localhost:5000'
type httpMethod = "GET"|"POST"|"PUT"|"DELETE"

export type AuthUser = {
    userid: string
    username: string
    loggedIn: boolean
}

export type MeResponse ={
    loggedIn: boolean
    userid?: string
    username?:string
}

export type enterGameResponse = {
    "Message": string
}

async function request<T>(method: httpMethod, path: string, body?: unknown): Promise<T>{
    const options: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    if (body !== undefined){
        options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE}${path}`, options)
    const data = await response.json().catch(() => null)

    if(!response.ok){
        const message = 
        (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string')
            ? data.error
            : `Request failed with status ${response.status}`
        const error = new Error(message)
        ;(error as any).details = data // Attach the Marshmallow errors here
    throw error
    }
    return data as T 
}

export const api = {
    get: <T>(path: string) => 
        request<T>('GET', path),

    post: <T>(path: string, body?: unknown) => 
        request<T>('POST', path, body),

    put: <T>(path:string, body?: unknown) => 
        request<T>("PUT", path, body),

    delete: <T>(path: string) => 
        request<T>("DELETE", path)
}
/////////////////////////////////

/////////////////////////////////////

export const authApi = {
    me: ()=> api.get<MeResponse>('/api/auth/me'),
    login: (username: string, password: string) =>
        api.post<{message: string; userid: string; username: string}>('/api/auth/login', {username, password}),
    register: (username: string, email: string, password: string) => api.post<{message: string; userid: string; username: string}>('/api/auth/register', {username, email, password}),
    logout: () => api.post<{message: string}>('/api/auth/logout', {}),
    enterGame: (gameobj: GameObject) => {
        return api.post<gameReturnObj>('/api/games/enter', gameobj)
    },
    rounds: (gameid: string)=>{return api.get<RoundObject[]>(`/api/round/sendrounds/${gameid}`)},
    round: (roundid: string)=>{return api.get<RoundObject>(`/api/round/sendround/${roundid}`)},
    guess: (roundComms: roundComms)=>{
        return api.post<roundComms>('/api/round/guess', roundComms)
    },
    game_complete: (roundComms: roundComms)=>{
        return api.post<roundComms>('/api/round/complete', roundComms)
    },
    quit_game: (roundComms: roundComms)=>{
        return api.put<{Message: string}>('api/game/quit', roundComms)
    },
    hint: (roundComms: roundComms)=>{
        return api.put<roundComms>('/api/round/hint', roundComms)
    }
}

