import React, { useState, useEffect, useContext } from 'react'
import AuthenticatedUsersLayout from './layouts/AuthenticatedUsersLayout'
import { WarehouseUser, warehouseUsersColumns } from '@/components/warehouse-users-manager/warehouseUsersColumns'
import { WarehouseUserDataTable } from '@/components/warehouse-users-manager/WarehouseUsersDataTable'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '@/components/ui/use-toast'
import { NewWarehouseUser } from '@/utils/types'
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
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, X } from 'lucide-react'
import { CgSpinner } from 'react-icons/cg'
import { EventContext } from '@/context/EventProvider'


const WarehouseUsersManager = () => {
    const { event } = useContext(EventContext)

    const [warehouseUsers, setWarehouseUsers] = useState<WarehouseUser[]>([])
    const [newWarehouseUserData, setNewWarehouseUserData] = useState<NewWarehouseUser>({ user_id: "", name: "", email: "", username: "", password: "", isBlocked: false })
    const [creatingNewWarehouseUser, setCreatingNewWarehouseUser] = useState(false)
    const [createNewWarehouseUserDialogState, setCreateNewWarehouseUserDialogState] = useState(false)
    const [error, setError] = useState("")
    const [viewingPassword, setViewingPassword] = useState(false)

    const [selectedWarehouseUserData, setSelectedWarehouseUserData] = useState<NewWarehouseUser>({ user_id: "", name: "", username: "", email: "", password: "", isBlocked: false })
    const [editWarehouseUserDialogState, setEditWarehouseUserDialogState] = useState(false)
    const [updatingWarehouseUser, setUpdatingWarehouseUser] = useState(false)
    const [updatingUserError, setUpdatingUserError] = useState("")

    const [deleteWarehouseUserDialogState, setDeleteWarehouseUserDialogState] = useState(false)
    const [deletingWarehouseUser, setDeletingWarehouseUser] = useState(false)

    const getAllWarehouseUsers = () => {
        ProtectedAxios.get("/api/admin/allWarehouseUsers")
            .then(res => {
                if (res.data) {
                    setWarehouseUsers(res.data)
                }
            })
            .catch((error: any) => {
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

    useEffect(() => {
        getAllWarehouseUsers()
    }, [])

    const createNewWarehouseUser = (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingNewWarehouseUser(true)
        setError("")

        ProtectedAxios.post("/api/admin/createWarehouseUser", newWarehouseUserData)
            .then(res => {
                if (res.data) {
                    setWarehouseUsers(prev => {
                        let updatedData = [...prev]
                        updatedData.unshift(res.data.new_user_data)
                        return updatedData
                    })

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    setNewWarehouseUserData({ user_id: "", name: "", email: "", username: "", password: "", isBlocked: false })
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


    useEffect(() => {
        if (event.eventName === "EDIT_WAREHOUSE_USER") {
            const data: any = event.payload
            setSelectedWarehouseUserData({ user_id: data.user_id, name: data.name, email: data.email, username: data.username, password: "", isBlocked: data.isBlocked })
            setEditWarehouseUserDialogState(true)
        }
    }, [event])

    const updateWarehouseUser = (e: React.FormEvent) => {
        e.preventDefault()
        setUpdatingWarehouseUser(true)
        setUpdatingUserError("")

        ProtectedAxios.post("/api/admin/updateWarehouseUser", selectedWarehouseUserData)
            .then(res => {
                if (res.data) {
                    setWarehouseUsers(prev => {
                        let updatedUsers = [...prev]
                        let indexOfSelectedUser = updatedUsers.findIndex(user => user.username === selectedWarehouseUserData.username)
                        updatedUsers[indexOfSelectedUser] = { user_id: selectedWarehouseUserData.user_id, name: selectedWarehouseUserData.name, username: selectedWarehouseUserData.username, email: selectedWarehouseUserData.email, isBlocked: selectedWarehouseUserData.isBlocked }
                        return updatedUsers
                    })

                    toast({
                        variant: "success",
                        title: res.data.message
                    })

                    setEditWarehouseUserDialogState(false)
                    setUpdatingWarehouseUser(false)

                }
            })
            .catch((error: any) => {
                setUpdatingWarehouseUser(false)
                if (error.response?.status === 409 && error.response?.data.error) {
                    setUpdatingUserError(error.response?.data.error)
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


    useEffect(() => {
        if (event.eventName === "DELETE_WAREHOUSE_USER") {
            const data: any = event.payload
            setSelectedWarehouseUserData({ user_id: data.user_id, name: data.name, email: data.email, username: data.username, password: "", isBlocked: data.isBlocked })
            setDeleteWarehouseUserDialogState(true)
        }
    }, [event])
    const deleteWarehouseUser = () => {
        setDeletingWarehouseUser(true)

        ProtectedAxios.post("/api/admin/deleteWarehouseUser", { username: selectedWarehouseUserData.username })
            .then(res => {
                if (res.data) {
                    setWarehouseUsers(prev => {
                        let updatedUsers = prev.filter(user => user.username !== selectedWarehouseUserData.username)
                        return updatedUsers
                    })

                    setDeleteWarehouseUserDialogState(false)
                    setDeletingWarehouseUser(false)
                }
            })
            .catch((error: any) => {
                setDeletingWarehouseUser(false)

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
        <AuthenticatedUsersLayout>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-medium'>Manage Warehouse Users</h1>

                {/* CREATE NEW USER DIALOG */}
                <Dialog open={createNewWarehouseUserDialogState} onOpenChange={setCreateNewWarehouseUserDialogState}>
                    <DialogTrigger asChild><Button>Create New</Button></DialogTrigger>
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
            </div>
            <WarehouseUserDataTable columns={warehouseUsersColumns} data={warehouseUsers} />


            {/* UPDATE USER DIALOG */}
            <Dialog open={editWarehouseUserDialogState} onOpenChange={setEditWarehouseUserDialogState}>
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
                                <Input required type='text' id="name" className="col-span-3" value={selectedWarehouseUserData.name} onChange={e => { setUpdatingUserError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, name: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input required type='email' id="email" className="col-span-3" value={selectedWarehouseUserData.email} onChange={e => { setUpdatingUserError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, email: e.target.value }) }} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <div className='relative col-span-3'>
                                    <Input type={viewingPassword ? 'text' : 'password'} placeholder='set new password' className='pr-10' id="password" value={selectedWarehouseUserData.password} onChange={e => { setUpdatingUserError(""); setSelectedWarehouseUserData({ ...selectedWarehouseUserData, password: e.target.value }) }} />
                                    <Button type="button" variant="ghost" className='absolute right-2 top-[50%] translate-y-[-50%] p-1 hover:bg-transparent' onClick={() => setViewingPassword(prev => !prev)}>
                                        {viewingPassword
                                            ? <Eye className='w-5' />
                                            : <EyeOff className='w-5' />
                                        }
                                    </Button>
                                </div>
                            </div>
                            {updatingUserError.length > 0
                                &&
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <span className='col-span-4 mt-1 text-sm px-4 pr-8 py-3 destructive group border-destructive bg-destructive text-destructive-foreground rounded-md relative'>
                                        {updatingUserError}
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


            {/* DELETE USER MODAL */}
            <Dialog open={deleteWarehouseUserDialogState} onOpenChange={setDeleteWarehouseUserDialogState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Warehouse User</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this user?</p>
                        <DialogDescription>
                            <p>Name: {selectedWarehouseUserData.name}</p>
                            <p>Usermame: {selectedWarehouseUserData.username}</p>
                            <p>Email: {selectedWarehouseUserData.email}</p>
                        </DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={deleteWarehouseUser} variant="destructive" className='gap-2' disabled={deletingWarehouseUser}>
                            Yes, Delete
                            {deletingWarehouseUser
                                &&
                                <CgSpinner className="animate-spin text-xl" />
                            }
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>


        </AuthenticatedUsersLayout>
    )
}

export default WarehouseUsersManager