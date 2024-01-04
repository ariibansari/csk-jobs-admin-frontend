import ProtectedAxios from "@/api/protectedAxios"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { CgSpinner } from "react-icons/cg"

const ToggleDocumentUploadInChats = () => {
    const [checked, setChecked] = useState(false)
    const [fetchingDocumentUploadInChatStatus, setFetchingDocumentUploadInChatStatus] = useState(true)
    const [updatingDocumentUploadInChatStatus, setUpdatingDocumentUploadInChatStatus] = useState(false)

    useEffect(() => {
        fetchDocumentUploadInChatStatus()
    }, [])

    const fetchDocumentUploadInChatStatus = () => {
        setFetchingDocumentUploadInChatStatus(true)
        ProtectedAxios.get("/api/user/appPreferences/getDocumentUploadInChatStatus")
            .then((res) => {
                setChecked(res.data.document_upload_status)
                setFetchingDocumentUploadInChatStatus(false)
            })
            .catch((err) => {
                console.log(err);
                setFetchingDocumentUploadInChatStatus(false)
                alert("Error fetching the document uplaod in chat status")
            })
    }

    const updateDocumentUploadInChatStatus = (status: boolean) => {
        setUpdatingDocumentUploadInChatStatus(true)
        ProtectedAxios.post("/api/admin/appPreferences/updateDocumentUploadInChatStatus", { status })
            .then((res) => {
                if (res.data) {
                    setChecked(status)
                    setUpdatingDocumentUploadInChatStatus(false)
                }
            })
            .catch((err) => {
                console.log(err);
                setUpdatingDocumentUploadInChatStatus(false)
                alert("Error updating the document uplaod in chat status")
            })
    }

    return (
        <div className="flex items-center gap-4">
            {fetchingDocumentUploadInChatStatus
                ?
                <div className="flex items-center space-x-2">
                    <Skeleton className="w-14 h-7 rounded-full" />
                    <Skeleton className="w-[20rem] h-3 rounded-full" />
                </div>

                :
                <div className="flex items-center space-x-2">
                    <Switch id="allow-document-upload" disabled={updatingDocumentUploadInChatStatus} checked={checked} onCheckedChange={e => updateDocumentUploadInChatStatus(e)} />
                    <Label htmlFor="allow-document-upload" className={`${!checked && "text-gray-500"}`}>Allow document upload in chat</Label>
                </div>
            }
            {updatingDocumentUploadInChatStatus
                &&
                <div className="">
                    <CgSpinner className="w-6 h-6 animate-spin" />
                </div>
            }
        </div>
    )
}

export default ToggleDocumentUploadInChats