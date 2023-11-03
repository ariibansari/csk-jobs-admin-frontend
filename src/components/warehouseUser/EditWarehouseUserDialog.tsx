import { NewWarehouseUser } from '@/utils/types'
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
import { Eye, EyeOff, X } from 'lucide-react'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'
import { Label } from '@/components/ui/label'

const EditWarehouseUserDialog = ({ selectedWarehouseUser, functionToExecuteAfterUpdatingWarehouseUser, toggleButton, dialogState, dialogStateSetter }: { selectedWarehouseUser: NewWarehouseUser, functionToExecuteAfterUpdatingWarehouseUser: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedWarehouseUserData, setSelectedWarehouseUserData] = useState<NewWarehouseUser>(selectedWarehouseUser)
    const [updatingWarehouseUser, setUpdatingWarehouseUser] = useState(false)
    const [error, setError] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)

    useEffect(() => {
        setSelectedWarehouseUserData(selectedWarehouseUser)
    }, [selectedWarehouseUser])

    const updateWarehouseUser = (e: React.FormEvent) => {
        e.preventDefault()
        setUpdatingWarehouseUser(true)
        setError("")

        ProtectedAxios.post("/api/admin/updateWarehouseUser", selectedWarehouseUserData)
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterUpdatingWarehouseUser(res.data.updated_user_data)

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    dialogStateSetter(false)
                    setUpdatingWarehouseUser(false)

                }
            })
            .catch((error: any) => {
                setUpdatingWarehouseUser(false)
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
                        <DialogTitle>Edit Warehouse User</DialogTitle>
                        <DialogDescription>
                            Update the details and click on save button to update the user
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateWarehouseUser}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input required type='text' id="name" className="col-span-3" value={selectedWarehouseUserData.name} onChange={e => { setError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, name: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input required type='email' id="email" className="col-span-3" value={selectedWarehouseUserData.email} onChange={e => { setError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, email: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <div className='relative col-span-3'>
                                    <Input type={viewingPassword ? 'text' : 'password'} placeholder='set new password' className='pr-10' id="password" value={selectedWarehouseUserData.password} onChange={e => { setError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, password: e.target.value }) }} />
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
                            <Button type='submit' className='gap-2' disabled={updatingWarehouseUser}>
                                Update
                                {updatingWarehouseUser
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

export default EditWarehouseUserDialog