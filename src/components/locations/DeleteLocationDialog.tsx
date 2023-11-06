import { Location } from '@/utils/types'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
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
import { UserContext } from '@/context/UserProvider'
import ProtectedAxios from '@/api/protectedAxios'
import { toast } from '../ui/use-toast'

const DeleteLocationDialog = ({ location, functionToExecuteAfterDeletingLocation, toggleButton, dialogState, dialogStateSetter }: { location: Location, functionToExecuteAfterDeletingLocation: Function, toggleButton?: React.ReactElement, dialogState: boolean, dialogStateSetter: Dispatch<SetStateAction<boolean>> }) => {
    const { user } = useContext(UserContext)
    const [selectedLocationData, setSelectedLocationData] = useState<Location>(location)
    const [deletingLocation, setDeletingLocation] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedLocationData(location)
    }, [location])

    const deleteLocation = () => {
        setDeletingLocation(true)

        ProtectedAxios.post("/api/admin/location/delete", { user_id: user.user_id, location_id: selectedLocationData.location_id })
            .then(res => {
                if (res.data) {
                    setDeletingLocation(false)
                    dialogStateSetter(false)
                    functionToExecuteAfterDeletingLocation(res.data)
                    setSelectedLocationData({ location: "", created_by: user.user_id })
                }
            })
            .catch((error: any) => {
                setDeletingLocation(false)
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
                        <DialogTitle>Delete Location</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this item?</p>
                        <DialogDescription>
                            <p>{selectedLocationData.location}</p>
                        </DialogDescription>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => deleteLocation()} variant="destructive" className='gap-2' disabled={deletingLocation}>
                            Yes, Delete
                            {deletingLocation
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

export default DeleteLocationDialog