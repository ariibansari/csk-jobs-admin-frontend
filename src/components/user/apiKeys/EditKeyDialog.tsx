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
import { Input } from '@/components/ui/input'
import { CgSpinner } from 'react-icons/cg'
import { X } from 'lucide-react'
import ProtectedAxios from '@/api/protectedAxios'
import { Label } from '@/components/ui/label'
import { ApiKey } from '@/utils/types'
import { toast } from '@/components/ui/use-toast'


const EditKeyDialog = ({ selectedKey, functionToExecuteAfterUpdatingKey, toggleButton, dialogState, dialogStateSetter }: { selectedKey: ApiKey, functionToExecuteAfterUpdatingKey: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedKeyData, setSelectedKeyData] = useState<ApiKey>(selectedKey)

    const [updatingKey, setUpdatingKey] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (dialogState) {
            setSelectedKeyData(selectedKey)
        }

    }, [selectedKey])

    const updateKey = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setUpdatingKey(true)

        ProtectedAxios.post("/api/user/apiKey/update", { api_key_id: selectedKey.api_key_id, api_key_name: selectedKey.api_key_name })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterUpdatingKey({ api_key_id: selectedKey.api_key_id, api_key_name: selectedKeyData.api_key_name })

                    toast({
                        variant: "success",
                        title: "API Key updated"
                    })

                    dialogStateSetter(false)
                    setUpdatingKey(false)

                }
            })
            .catch((error: any) => {
                setUpdatingKey(false)
                if (error.response?.status === 409 && error.response?.data.error) {
                    setError(error.response?.data.error)
                    return
                }

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
                        <DialogTitle>Edit API Key</DialogTitle>
                        <DialogDescription>
                            Update the details and click on save button to update the API Key
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateKey}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2 items-start">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={selectedKeyData.api_key_name} onChange={e => { setError(""); setSelectedKeyData({ ...selectedKeyData, api_key_name: e.target.value }) }} />
                            </div>

                            {error.length > 0
                                &&
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className='col-span-4 mt-1 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                                        {error}
                                        <Button className='p-0 h-auto hover:bg-transparent absolute right-3 top-3' variant="ghost" onClick={() => setError("")}><X className='w-3' /></Button>
                                    </span>
                                </div>
                            }
                        </div>

                        <DialogFooter>
                            <Button type='submit' className='gap-2' disabled={updatingKey}>
                                Save
                                {updatingKey
                                    &&
                                    <CgSpinner className="animate-spin text-xl" />
                                }
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditKeyDialog