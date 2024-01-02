import ProtectedAxios from "@/api/protectedAxios"
import Messages from "@/components/chat/Messages"
import { UserContext } from "@/context/UserProvider"
import AuthenticatedUsersLayout from "@/pages/layouts/AuthenticatedUsersLayout"
import { useContext, useEffect, useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { useNavigate, useParams } from "react-router-dom"

const Chat = () => {
    const { user } = useContext(UserContext)
    const { chat_id } = useParams()
    const [validatingChat, setValidatingChat] = useState(true)
    const [isChatValid, setIsChatValid] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        validateChat()
    }, [])

    const validateChat = () => {
        ProtectedAxios.post("/api/user/validate-chat", { chat_id, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    setValidatingChat(false)
                    setIsChatValid(true)
                }
            })
            .catch(error => {
                console.log(error);
                setValidatingChat(false)
                setIsChatValid(false)
            })
    }

    return (
        chat_id
        &&
        <AuthenticatedUsersLayout>
            {validatingChat
                ?
                <div className="flex items-center justify-center w-full h-[70dvh]"><CgSpinner className="animate-spin w-8 h-8" /></div>

                :
                !isChatValid
                    ? <div className="flex items-center justify-center w-full h-[70dvh]"><p className="text-destructive">Chat not found</p></div>

                    :
                    <div>
                        <Messages chat_id={parseInt(chat_id)} />
                    </div>
            }
        </AuthenticatedUsersLayout>

    )
}

export default Chat