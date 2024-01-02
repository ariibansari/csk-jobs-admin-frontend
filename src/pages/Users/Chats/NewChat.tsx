import { ChangeEvent, useContext, useState } from "react"
import AuthenticatedUsersLayout from "../../layouts/AuthenticatedUsersLayout"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FilePlus2, Send, X } from "lucide-react"
import ProtectedAxios from "@/api/protectedAxios"
import { useNavigate } from "react-router-dom"
import { CgSpinner } from "react-icons/cg"
import { UserContext } from "@/context/UserProvider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaFilePdf, FaFileCsv } from "react-icons/fa6";
import { LuImagePlus } from "react-icons/lu";
import { Input } from "@/components/ui/input"
import { Files } from "@/utils/types"
import FileSelector from "@/components/chat/FileSelector"


const NewChat = () => {
    const { user } = useContext(UserContext)
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [files, setFiles] = useState<Files[]>([])
    const [fileUploadDrawer, setFileUploadDrawer] = useState(false)

    const fileIconClasses = "w-6 h-6"
    const fileTypes = [
        {
            name: "img",
            icon: <LuImagePlus className={fileIconClasses} />,
            type: ".jpg .png .webp .heic"
        },
        {
            name: "pdf",
            icon: <FaFilePdf className={fileIconClasses} />,
            type: "application/pdf"
        },
        {
            name: "csv",
            icon: <FaFileCsv className={fileIconClasses} />,
            type: "text/csv"
        }
    ]


    const handleSubmit = () => {
        if (text) {
            setLoading(true)

            const formData = new FormData();
            formData.append("text", text);
            formData.append("user_id", user.user_id.toString());

            // Append each file to the formData
            files.forEach((file) => {
                formData.append("files", file.file);
            });

            ProtectedAxios.post("/api/user/new-chat", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(res => {
                    if (res.data) {
                        navigate(`/chat/${res.data.chat_id}`)
                        setLoading(false)
                    }
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false)
                    alert("Could not create chat at the moment")
                })
        }
    }

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files
        if (file) {
            if (file[0].type !== type) {
                alert("Invalid file")
                return
            }

            else {
                setFiles(prev => { return [...prev, { id: new Date().getTime(), type, file: file[0] }] })
            }

        }

        e.target.value = ""
        setFileUploadDrawer(false)
    }

    const removeFile = (id: number) => {
        setFiles(prev => {
            const filterd = prev.filter(file => file.id !== id)
            return filterd
        })
    }

    return (
        <AuthenticatedUsersLayout>
            <div className='my-7 flex flex-col justify-between h-[66dvh] container'>
                <h1 className='text-2xl font-semibold mb-3'>Start New Chat</h1>
                <div className="">
                    <div className="flex mb-3 gap-2 flex-wrap">
                        {files.map((file, i) => (
                            <div title={file.file.name} className="w-30 border rounded-md px-4 py-2" key={i} >
                                <div className="flex items-center justify-between">
                                    <p className="uppercase">{file.file.name.split(".")[file.file.name.split(".").length - 1]}</p>
                                    <Button disabled={loading} title="remove" variant="ghost" size="sm" className="px-1" onClick={() => removeFile(file.id)}><X className="w-4" /></Button>
                                </div>
                                <p className="text-sm">{file.file.name.substring(0, 20)}{file.file.name.length > 20 && "..."}</p>
                            </div>
                        ))}
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Chat with AI"
                            className="resize-none pr-14 max-h-[10rem]"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onInput={e => {
                                e.currentTarget.style.height = "5px"
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
                            }}
                            disabled={loading}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleSubmit()} className="absolute bottom-2 right-6">
                            {loading
                                ?
                                <CgSpinner className="animate-spin w-5 h-5" />
                                :
                                <Send className="w-5" />
                            }
                        </Button>
                    </div>
                    <FileSelector files={files} setFiles={setFiles} loading={loading} />
                </div>
            </div>
        </AuthenticatedUsersLayout>
    )
}

export default NewChat