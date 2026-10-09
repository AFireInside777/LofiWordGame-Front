export type Timer = {
    seconds: number,
    runStatus: boolean
}

export type Action = 
{
    type: "Tick"
} |
{
    type: "Stop"
} |
{
    type: "Start"
}

export function TimerReducer(timer: Timer, action: Action): Timer{
    switch(action.type){
        case("Start"):
            return {...timer, runStatus: true}
        case("Tick"):
            return {...timer, seconds: Math.max(0, timer.seconds - 1)}
        case("Stop"):
            return {...timer, runStatus: false}
        default:
            return timer
    }
}

export const timerFormat = (timer: number) =>{
    const minutes = Math.floor(timer / 60)
    const seconds = timer % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}