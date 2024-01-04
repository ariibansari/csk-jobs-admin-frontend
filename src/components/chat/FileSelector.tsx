import { Files } from "@/utils/types"
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { FaFileCsv, FaFileExcel, FaFilePdf, FaRegFileExcel } from "react-icons/fa6"
import { LuImagePlus } from "react-icons/lu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FilePlus2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import ProtectedAxios from "@/api/protectedAxios"
import { Skeleton } from "../ui/skeleton"
import { UserContext } from "@/context/UserProvider"

const FileSelector = ({ files, setFiles, loading }: { files: Files[], setFiles: Dispatch<SetStateAction<Files[]>>, loading?: boolean }) => {
    const { user } = useContext(UserContext)
    const [fileUploadDrawer, setFileUploadDrawer] = useState(false)

    const [loadingFileUploadStatus, setLoadingFileUploadStatus] = useState(true)
    const [fileUploadStatus, setFileUploadStatus] = useState(false)


    useEffect(() => {
        getFileUploadStatus()
    }, [])
    const getFileUploadStatus = () => {
        setLoadingFileUploadStatus(true)
        ProtectedAxios.get("/api/user/appPreferences/getDocumentUploadInChatStatus")
            .then((res) => {
                setFileUploadStatus(res.data.document_upload_status)
                setLoadingFileUploadStatus(false)
            })
            .catch((err) => {
                console.log(err);
                setLoadingFileUploadStatus(false)
                alert("Error fetching the document uplaod in chat status")
            })
    }


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
        },
        {
            name: "excel",
            icon: <FaRegFileExcel className={fileIconClasses} />,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    ]

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
    return (
        <>
            {
                loadingFileUploadStatus
                    ? <Skeleton className="w-24 h-8 my-4" />

                    :
                    (fileUploadStatus || user.role === "ADMIN")
                    &&
                    <DropdownMenu open={fileUploadDrawer} onOpenChange={setFileUploadDrawer}>
                        <DropdownMenuTrigger disabled={loading} asChild className="focus-visible:outline-0 focus-visible:ring-0">
                            <Button variant="ghost" size="sm" className="gap-2 text-gray-800 dark:text-gray-300 py-3 my-2">
                                <FilePlus2 className="w-5" /> Add File
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-16 px-2 py-4 rounded-full">
                            <DropdownMenuGroup className="flex flex-col gap-3">
                                {fileTypes.map((fileType, i) => (
                                    <div className="relative z-10">
                                        <Input type="file" key={i} accept={fileType.type} onChange={e => handleFileSelect(e, fileType.type)} className="flex relative z-10 items-center gap-2 rounded-full w-10 h-10 border opacity-0 cursor-pointer" />
                                        <span className="rounded-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-0 w-10 h-10 flex items-center justify-center">
                                            {fileType.icon}
                                        </span>
                                    </div>
                                ))}
                            </DropdownMenuGroup >
                        </DropdownMenuContent>
                    </DropdownMenu>
            }
        </>
    )
}

export default FileSelector