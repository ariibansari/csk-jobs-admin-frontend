import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CgSpinner } from 'react-icons/cg'
import ProtectedAxios from '@/api/protectedAxios'
import { ApiKey } from '@/utils/types'
import { toast } from '@/components/ui/use-toast'

const DeleteKeyDialog = ({ selectedKey, functionToExecuteAfterDeletingKey, toggleButton, dialogState, dialogStateSetter }: { selectedKey: ApiKey, functionToExecuteAfterDeletingKey: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedKeyData, setSelectedKeyData] = useState<ApiKey>(selectedKey)
    const [deletingKey, setDeletingKey] = useState(false)

    useEffect(() => {
        if (dialogState) {
            setSelectedKeyData(selectedKey)
        }
    }, [selectedKey])

    const deleteApiKey = () => {
        setDeletingKey(true)

        ProtectedAxios.post("/api/user/apiKey/delete", { api_key_id: selectedKey.api_key_id })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterDeletingKey(res.data.deleted_key_id)
                    
                    dialogStateSetter(false)
                    setDeletingKey(false)
                }
            })
            .catch((error: any) => {
                setDeletingKey(false)

                if (error.response?.data?.error) {
                    toast({
                        variant: "destructive",
                        title: error.response.data.error,
                    })
                    return
                }

                toast({
                    variant: "destructive",
                    title: error.message,
                })
            })
    }


    return (
        <>
            <Dialog open={dialogState} onOpenChange={dialogStateSetter}>
                {toggleButton
                    &&
                    <DialogTrigger>
                        {toggleButton}
                    </DialogTrigger>
                }
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    <div>
                        <div>
                            <p>Are you sure you want to delete this API Key?</p>
                            <DialogDescription>
                                <p>Name: {selectedKeyData.api_key_name}</p>
                                <p>Email: {selectedKeyData.api_key}</p>
                            </DialogDescription>
                        </div>
                        <DialogFooter>
                            <Button onClick={deleteApiKey} variant="destructive" className='gap-2' disabled={deletingKey}>
                                Yes, Delete
                                {deletingKey
                                    &&
                                    <CgSpinner className="animate-spin text-xl" />
                                }
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default DeleteKeyDialog