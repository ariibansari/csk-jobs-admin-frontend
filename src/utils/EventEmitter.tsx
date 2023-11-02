import { useContext } from 'react'
import { Event, EventContext } from '@/context/EventProvider'

const EventEmitter = ({ eventName, payload, emitOnClick, emitButtonText, emitButtonClasses }: Event & { emitOnClick: boolean, emitButtonText: string, emitButtonClasses: string }) => {
    const { setEvent } = useContext(EventContext)

    const emitEvent = () => {
        setEvent({ eventName, payload })
    }

    return (
        <>
            {emitOnClick
                &&
                <span onClick={() => emitEvent()} className={emitButtonClasses}>{emitButtonText}</span>
            }
        </>
    )
}

export default EventEmitter