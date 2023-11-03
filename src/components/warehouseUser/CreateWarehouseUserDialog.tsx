import { NewWarehouseUser } from '@/utils/types'
import React, { useState } from 'react'
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
import { Eye, EyeOff, X } from 'lucide-react'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { Label } from '@/components/ui/label'

const CreateWarehouseUserDialog = ({ functionToExecuteAfterAddingWarehouseUser, toggleButton }: { functionToExecuteAfterAddingWarehouseUser: Function, toggleButton?: React.ReactElement }) => {
    const [newWarehouseUserData, setNewWarehouseUserData] = useState<NewWarehouseUser>({ user_id: 0, name: "", email: "", username: "", password: "", isBlocked: false })
    const [creatingNewWarehouseUser, setCreatingNewWarehouseUser] = useState(false)
    const [createNewWarehouseUserDialogState, setCreateNewWarehouseUserDialogState] = useState(false)
    const [error, setError] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)

    const createNewWarehouseUser = (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingNewWarehouseUser(true)
        setError("")

        ProtectedAxios.post("/api/admin/createWarehouseUser", newWarehouseUserData)
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterAddingWarehouseUser(res.data.new_user_data)

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    setNewWarehouseUserData({ user_id: 0, name: "", email: "", username: "", password: "", isBlocked: false })
                    setCreateNewWarehouseUserDialogState(false)
                    setCreatingNewWarehouseUser(false)
                }
            })
            .catch((error: any) => {
                setCreatingNewWarehouseUser(false)
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
            <Dialog open={createNewWarehouseUserDialogState} onOpenChange={setCreateNewWarehouseUserDialogState}>
                <DialogTrigger>
                    {toggleButton
                        ? toggleButton
                        : <Button>Create New</Button>
                    }
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Warehouse User</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new warehouse user
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createNewWarehouseUser}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={newWarehouseUserData.name} onChange={e => { setError(""); setNewWarehouseUserData({ ...newWarehouseUserData, name: e.target.value }) }} />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input required type='email' id="email" className="col-span-3" value={newWarehouseUserData.email} onChange={e => { setError(""); setNewWarehouseUserData({ ...newWarehouseUserData, email: e.target.value }) }} />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input required type='text' id="username" className="col-span-3" value={newWarehouseUserData.username} onChange={e => { setError(""); setNewWarehouseUserData({ ...newWarehouseUserData, username: e.target.value }) }} />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <div className='relative col-span-3'>
                                    <Input required type={viewingPassword ? 'text' : 'password'} className='pr-10' id="password" value={newWarehouseUserData.password} onChange={e => { setError(""); setNewWarehouseUserData({ ...newWarehouseUserData, password: e.target.value }) }} />
                                    <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingPassword(prev => !prev)}>
                                        {viewingPassword
                                            ? <Eye className='w-5' />
                                            : <EyeOff className='w-5' />
                                        }
                                    </Button>
                                </div>
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
                            <Button type='submit' className='gap-2' disabled={creatingNewWarehouseUser}>
                                Create
                                {creatingNewWarehouseUser
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

export default CreateWarehouseUserDialog