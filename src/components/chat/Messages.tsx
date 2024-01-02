import ProtectedAxios from '@/api/protectedAxios'
import { UserContext } from '@/context/UserProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Response from './Response'
import NewMessage from './NewMessage'
type Media = {
    media_name: string
}
type Message = {
    message_id: number,
    chat_id: number,
    message: string,
    created_at: string,
    created_by: number,
    media: Media[]
}
const Messages = ({ chat_id }: { chat_id: number }) => {
    const { user } = useContext(UserContext)
    const [loadingMessages, setLoadingMessages] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        getMessages()
    }, [])

    const getMessages = () => {
        setLoadingMessages(true)
        ProtectedAxios.post("/api/user/chat/messages", { chat_id, user_id: user.user_id })
            .then(res => {
                setMessages(res.data)
                setLoadingMessages(false)
            })
            .catch(error => {
                console.log(error);
                setLoadingMessages(false)
                alert("Could not get messages at the moment")
                navigate("/")
            })
    }

    const addMessage = (msg: Message) => {
        setMessages(prev => { return [...prev, msg] })
    }

    return (
        <div className='flex flex-col justify-between min-h-[72dvh] gap-14'>
            <div className='flex flex-col gap-14 container'>
                {messages.map((msg, i) => (
                    <div className='flex flex-col gap-6'>
                        <div className='flex gap-3' key={i}>
                            <span className='w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 uppercase'>{user.email.substring(0, 1)}</span>
                            <p className='mt-2'>{msg.message}</p>
                        </div>

                        {msg.media
                            &&
                            msg.media.length > 0
                            &&
                            <div className='flex gap-2 flex-wrap'>
                                {msg.media.map((media, i) => (
                                    <div title={media.media_name} className="w-30 border rounded-md px-4 py-2" key={i} >
                                        <div className="flex items-center justify-between">
                                            <p className="uppercase">{media.media_name.split(".")[media.media_name.split(".").length - 1]}</p>
                                        </div>
                                        <p className="text-sm">{media.media_name.substring(0, 20)}{media.media_name.length > 20 && "..."}</p>
                                    </div>
                                ))}
                            </div>
                        }
                        <Response message_id={msg.message_id} />
                    </div>
                ))}
            </div>

            <NewMessage chat_id={chat_id} addMessage={addMessage} />
        </div>
    )
}

export default Messages