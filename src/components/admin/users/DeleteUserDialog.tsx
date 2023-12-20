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
import { User } from '@/utils/types'
import { toast } from '@/components/ui/use-toast'
import { AlertTriangle } from 'lucide-react'
import { SubscriptionDetails } from '@/hooks/useSubscriptionDetails'
import OfflinePlanBadge from '@/components/ui/offlinePlanBadge'

const DeleteUserDialog = ({ selectedUser, functionToExecuteAfterDeletingUser, toggleButton, dialogState, dialogStateSetter }: { selectedUser: User, functionToExecuteAfterDeletingUser: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const [selectedUserData, setSelectedUserData] = useState<User>(selectedUser)
    const [deletingUser, setDeletingUser] = useState(false)

    const [loadingSubscriptionDetails, setLoadingSubscriptionDetails] = useState(false)
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null)


    useEffect(() => {
        if (dialogState) {
            setSelectedUserData(selectedUser)
            fetchSubscriptionDetails()
        }
    }, [selectedUser])

    const fetchSubscriptionDetails = () => {
        setLoadingSubscriptionDetails(true)
        ProtectedAxios.get(`/api/subscription/subscribedPlanDetails/${selectedUser.user_id}`)
            .then(res => {
                setSubscriptionDetails(res.data)
                setLoadingSubscriptionDetails(false)
            })
            .catch(err => {
                console.log(err);
                setLoadingSubscriptionDetails(false)
                if (err.response.status === 500) {
                    alert(err.response.data.error)
                }
            })
    }

    const deleteUser = () => {
        setDeletingUser(true)

        ProtectedAxios.post("/api/admin/deleteUser", { email: selectedUser.email })
            .then(res => {
                if (res.data) {
                    functionToExecuteAfterDeletingUser(res.data.deleted_user_id)

                    dialogStateSetter(false)
                    setDeletingUser(false)
                }
            })
            .catch((error: any) => {
                setDeletingUser(false)

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
                    {loadingSubscriptionDetails
                        ?
                        <div className='w-[100%] flex items-center justify-center my-10'>
                            <CgSpinner className="animate-spin text-3xl" />
                        </div>

                        :
                        subscriptionDetails
                            ?
                            // Have an admin-created subscription access
                            subscriptionDetails.offline_plan_access
                                ?
                                <div>
                                    <div>
                                        <p>Are you sure you want to delete this user?</p>
                                        <DialogDescription>
                                            <p>Name: {selectedUserData.name}</p>
                                            <p>Email: {selectedUserData.email}</p>
                                            <p className='mt-4 flex items-center gap-2'>Plan: {subscriptionDetails.plan} <OfflinePlanBadge /></p>
                                        </DialogDescription>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={deleteUser} variant="destructive" className='gap-2' disabled={deletingUser}>
                                            Yes, Delete
                                            {deletingUser
                                                &&
                                                <CgSpinner className="animate-spin text-xl" />
                                            }
                                        </Button>
                                    </DialogFooter>
                                </div>

                                :
                                // Have an actual subscription
                                <div>
                                    <div>
                                        <AlertTriangle className='text-yellow-500'/>
                                        <p className='my-2'>This user can't be deleted as they have an active subscription</p>
                                        <DialogDescription>
                                            <p>Name: {selectedUserData.name}</p>
                                            <p>Email: {selectedUserData.email}</p>
                                            <p className='my-4 flex items-center gap-2'>Plan: {subscriptionDetails.plan}</p>
                                        </DialogDescription>
                                    </div>
                                </div>
                            :
                            // Have no active subscription
                            <div>
                                <div>
                                    <p>Are you sure you want to delete this user?</p>
                                    <DialogDescription>
                                        <p>Name: {selectedUserData.name}</p>
                                        <p>Email: {selectedUserData.email}</p>
                                        <p className='text-red-500 mt-2'>No Plans selected</p>
                                    </DialogDescription>
                                </div>
                                <DialogFooter>
                                    <Button onClick={deleteUser} variant="destructive" className='gap-2' disabled={deletingUser}>
                                        Yes, Delete
                                        {deletingUser
                                            &&
                                            <CgSpinner className="animate-spin text-xl" />
                                        }
                                    </Button>
                                </DialogFooter>
                            </div>

                    }
                </DialogContent>
            </Dialog >
        </>
    )
}

export default DeleteUserDialog