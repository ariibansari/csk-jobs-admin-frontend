import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { History, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CgSpinner } from "react-icons/cg"
import { useContext, useEffect, useState } from "react"
import ProtectedAxios from "@/api/protectedAxios"
import { UserContext } from "@/context/UserProvider"
import { format } from "date-fns"
import { Link, useLocation } from "react-router-dom"

type Message = {
    message: string,
}
type Chat = {
    chat_id: number,
    created_at: string,
    Messages: Message[]
}

const ChatHistorySheet = () => {
    const { user } = useContext(UserContext)
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    let { pathname } = useLocation()

    useEffect(() => {
        fetchChatHistory()
    }, [])
    const fetchChatHistory = () => {
        setLoading(true)
        ProtectedAxios.post("/api/user/chat/history", { user_id: user.user_id })
            .then(res => {
                setChats(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err);
                setLoading(false)
                alert("Could not get your chat history at the moment")
            })
    }

    return (
        <Sheet>
            <SheetTrigger><Button variant="outline"><History className="w-5" /></Button></SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                    {loading
                        ?
                        <div className="min-h-[60dvh] flex items-center justify-center">
                            <CgSpinner className="w-7 h-7 animate-spin" />
                        </div>

                        :
                        <div>
                            {chats.length === 0
                                ? <p className="text-sm py-10">You don't have any chats yets</p>

                                :
                                <div className="flex flex-col gap-2 max-h-[90dvh] overflow-y-scroll small-scrollbar px-2 pb-3 pt-2">
                                    {chats.map((chat, i) => (
                                        <Link to={`/chat/${chat.chat_id}`} reloadDocument key={i} className={`min-h-10 rounded-md px-3 py-2 hover:bg-slate-400 dark:hover:bg-muted cursor-pointer ${pathname === `/chat/${chat.chat_id}` && "bg-slate-400 dark:bg-muted"}`}>
                                            <div className="flex items-center justify-between gap-2">
                                                <div><MessageCircle className="w-5" /></div>
                                                <p className="text-sm">{chat.Messages[0].message.substring(0, 30)}{chat.Messages[0].message.length > 30 && "...."}</p>
                                            </div>
                                            <p className="text-xs text-right">{pathname} - {format(new Date(chat.created_at), "p dd/MM/yyyy")}</p>
                                        </Link>
                                    ))}
                                </div>
                            }
                        </div>
                    }
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}

export default ChatHistorySheet