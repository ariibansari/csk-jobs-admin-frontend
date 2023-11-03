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
import { CgSpinner } from 'react-icons/cg'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'

const DeleteWarehouseUserDialog = ({ selectedWarehouseUser, functionToExecuteAfterDeletingWarehouseUser, toggleButton, dialogState, dialogStateSetter }: { selectedWarehouseUser: NewWarehouseUser, functionToExecuteAfterDeletingWarehouseUser: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedWarehouseUserData, setSelectedWarehouseUserData] = useState<NewWarehouseUser>(selectedWarehouseUser)
    const [deletingWarehouseUser, setDeletingWarehouseUser] = useState(false)

    useEffect(() => {
        setSelectedWarehouseUserData(selectedWarehouseUser)
    }, [selectedWarehouseUser])


    const deleteWarehouseUser = () => {
        setDeletingWarehouseUser(true)

        ProtectedAxios.post("/api/admin/deleteWarehouseUser", { username: selectedWarehouseUserData.username })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterDeletingWarehouseUser(res.data.deleted_user_id)

                    dialogStateSetter(false)
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
        </>
    )
}

export default DeleteWarehouseUserDialog