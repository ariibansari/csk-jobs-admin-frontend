import ProtectedAxios from '@/api/protectedAxios'
import FileSelector from '@/components/chat/FileSelector'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserContext } from '@/context/UserProvider'
import { Files } from '@/utils/types'
import { Delete, DeleteIcon, Trash, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Media = {
    media_id: number,
    media_type: string,
    media_content: string,
    media_name: string,
    uploaded_at: string,
    uploaded_by: number,
}

const AdminMedia = () => {
    const { user } = useContext(UserContext)

    const [selectedFiles, setSelectedFiles] = useState<Files[]>([])
    const [uploadedMedia, setUploadedMedia] = useState<Media[]>([])

    const [uploadingSelectedFiles, setUploadingSelectedFiles] = useState(false)

    const [loadingFiles, setLoadingFiles] = useState(true)

    const [deletingFile, setDeletingFile] = useState(false)
    const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false)

    const [selectedFile, setSelectedFile] = useState<Media>()

    useEffect(() => {
        fetchAdminDocuments()
    }, [])

    const fetchAdminDocuments = () => {
        setLoadingFiles(true)
        ProtectedAxios.get("/api/admin/media/all")
            .then((res) => {
                setUploadedMedia(res.data.media)
                setLoadingFiles(false)
            })
            .catch((err) => {
                console.log(err);
                setLoadingFiles(false)
                alert(err.response.data.error)
            })
    }

    const removeSelectedFile = (id: number) => {
        setSelectedFiles(prev => {
            const filterd = prev.filter(file => file.id !== id)
            return filterd
        })
    }

    const uploadSelectedFiles = () => {
        setUploadingSelectedFiles(true)

        const formData = new FormData();
        formData.append("user_id", user.user_id.toString());

        // Append each file to the formData
        selectedFiles.forEach((file) => {
            formData.append("files", file.file);
        });

        ProtectedAxios.post("/api/admin/media/upload", formData)
            .then((res) => {
                fetchAdminDocuments()
                setSelectedFiles([])
                setUploadingSelectedFiles(false)
            })
            .catch((err) => {
                console.log(err);
                setUploadingSelectedFiles(false)
                alert(err.response.data.error)
            })
    }

    const deleteUploadedMedia = () => {
        if (selectedFile) {
            setDeletingFile(true)
            ProtectedAxios.delete(`/api/admin/media/${selectedFile.media_id}`)
                .then((res) => {
                    fetchAdminDocuments()
                    setDeleteConfirmationDialog(false)
                    setDeletingFile(false)
                })
                .catch((err) => {
                    console.log(err);
                    setDeletingFile(false)
                    alert(err.response.data.error)
                })
        }
    }


    return (
        <>
            <div className='container mb-8'>
                <div className='flex items-center justify-between'>
                    <FileSelector files={selectedFiles} setFiles={setSelectedFiles} />
                    {selectedFiles.length > 0
                        &&
                        <Button
                            disabled={uploadingSelectedFiles}
                            onClick={() => uploadSelectedFiles()}
                            className='gap-2'
                        >
                            Upload All
                            {uploadingSelectedFiles
                                &&
                                <CgSpinner className="w-5 h-5 animate-spin" />
                            }
                        </Button>
                    }
                </div>
                <div>
                    <div className="flex mb-3 gap-2 flex-wrap">
                        {selectedFiles.map((file, i) => (
                            <div title={file.file.name} className="w-30 border rounded-md px-4 py-2" key={i} >
                                <div className="flex items-center justify-between">
                                    <p className="uppercase">{file.file.name.split(".")[file.file.name.split(".").length - 1]}</p>
                                    <Button disabled={uploadingSelectedFiles} title="remove" variant="ghost" size="sm" className="px-1" onClick={() => removeSelectedFile(file.id)}><X className="w-4" /></Button>
                                </div>
                                <p className="text-sm">{file.file.name.substring(0, 20)}{file.file.name.length > 20 && "..."}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='border-gray-300 dark:border-gray-900'/>
            </div>



            {loadingFiles
                ?
                <div className='flex flex-wrap gap-3'>
                    {[1, 2, 3].map((x, y) => (
                        <Skeleton key={y} className='w-[20rem] h-20' />
                    ))}
                </div>

                :
                <>
                    <div>
                        {uploadedMedia?.length === 0
                            ? <div><p className='text-destructive'>No documets uploaded yet</p></div>

                            :
                            <div className="flex mb-3 gap-2 flex-wrap">
                                {uploadedMedia.map((file, i) => (
                                    <div title={file.media_name} className="w-[20rem] border rounded-md px-4 py-2" key={i} >
                                        <div className="flex items-center justify-between">
                                            <p className="uppercase">{file.media_name.split(".")[file.media_name.split(".").length - 1]}</p>

                                            <Dialog open={deleteConfirmationDialog} onOpenChange={setDeleteConfirmationDialog}>
                                                <DialogTrigger><Button title="delete" variant="ghost" size="sm" className="px-1" onClick={() => setSelectedFile(file)}><Trash className="w-4" /></Button></DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Delete</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete this file?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <p>{selectedFile?.media_name}</p>

                                                    <DialogFooter>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={deleteUploadedMedia}
                                                            className='gap-3'
                                                            disabled={deletingFile}
                                                        >
                                                            Yes, Delete
                                                            {deletingFile
                                                                &&
                                                                <CgSpinner className="w-5 h-5 animate-spin" />
                                                            }
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <p className="text-sm">{file.media_name.substring(0, 30)}{file.media_name.length > 30 && "..."}</p>
                                    </div>
                                ))}


                            </div>
                        }
                    </div>
                </>
            }
        </>
    )
}

export default AdminMedia