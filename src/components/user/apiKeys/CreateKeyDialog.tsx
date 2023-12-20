import ProtectedAxios from '@/api/protectedAxios'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { UserContext } from '@/context/UserProvider'
import { ApiKey } from '@/utils/types'
import { X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'

const CreateKeyDialog = ({ functionToExecuteAfterAddingKey, toggleButton }: { functionToExecuteAfterAddingKey: Function, toggleButton?: React.ReactElement }) => {
    const { user } = useContext(UserContext)
    const [newKeyData, setNewKeyData] = useState<ApiKey>({ api_key_name: "", api_key: "", created_at: null })
    const [creatingNewKey, setCreatingNewKey] = useState(false)
    const [creatingNewKeyDialogState, setCreatingNewKeyDialogState] = useState(false)
    const [error, setError] = useState("")


    const createNewKey = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        setCreatingNewKey(true)
        ProtectedAxios.post("/api/user/apiKey/create", { ...newKeyData, user_id: user.user_id })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterAddingKey(res.data.new_user_data)

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    setNewKeyData({ api_key_name: "", api_key: "", created_at: null })
                    setCreatingNewKeyDialogState(false)
                    setCreatingNewKey(false)
                }
            })
            .catch((error: any) => {
                setCreatingNewKey(false)
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
            <Dialog open={creatingNewKeyDialogState} onOpenChange={setCreatingNewKeyDialogState}>
                <DialogTrigger>
                    {toggleButton
                        ? toggleButton
                        : <Button>Create New</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New API Key</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new API Key
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewKey}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2 items-start">
                                <Label htmlFor="name" className="text-right">
                                    Name <span className='text-destructive'>*</span>
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={newKeyData.api_key_name} onChange={e => { setError(""); setNewKeyData({ ...newKeyData, api_key_name: e.target.value }) }} />
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
                            <Button type='submit' className='gap-2 mt-3' disabled={creatingNewKey}>
                                Create
                                {creatingNewKey
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

export default CreateKeyDialog